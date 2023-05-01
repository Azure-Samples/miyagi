import logging
import openai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, BaseSettings
import asyncpraw
from azure.storage.blob.aio import BlobServiceClient
import os
import json
from qdrant_client.http import models
from qdrant_client.http.models import Batch
from typing import List

from qdrant_client import QdrantClient

COLLECTION_NAME = "miyagi-customer-profiles"
EMBEDDING_MODEL = "gk-ada-002"
EMBEDDING_MODEL_DIMENSION = 1536


class Settings(BaseSettings):
    openai.api_type = "azure"
    openai.api_base = os.getenv("OPENAI_API_BASE")
    openai.api_version = "2022-12-01"
    openai.api_key = os.getenv("OPENAI_API_KEY")

    # to connect to local Qdrant instance
    client = QdrantClient(":memory:")
    # to connect to remote Qdrant instance in docker
    # client = QdrantClient(host="localhost", port=6333)
    client.recreate_collection(
        collection_name=("%s" % COLLECTION_NAME),
        vectors_config=models.VectorParams(size=EMBEDDING_MODEL_DIMENSION, distance=models.Distance.COSINE),
    )


settings = Settings()

logging.getLogger("aiohttp").setLevel(logging.ERROR)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def pong():
    return {"status": "Ok"}


@app.get("/", include_in_schema=False)
async def docs_redirect():
    return RedirectResponse(url='/redoc')


class SubredditInput(BaseModel):
    subreddit: str


async def get_blob_container():
    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    container_name = os.getenv("AZURE_STORAGE_CONTAINER_NAME")
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)
    return container_client


async def fetch_post_comments(post):
    post_comments = await post.comments()
    comments_data = []

    async for comment in post_comments:
        if isinstance(comment, asyncpraw.models.Comment):
            comments_data.append(comment.body)

    return comments_data


@app.post("/fetch_comments")
async def fetch_comments(subreddit_input: SubredditInput):
    async with asyncpraw.Reddit(
            client_id=os.getenv("REDDIT_CLIENT_ID"),
            client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
            user_agent=os.getenv("REDDIT_USER_AGENT"),
    ) as reddit:
        subreddit = await reddit.subreddit(subreddit_input.subreddit)
        top_posts = subreddit.top("month", limit=1)

        comments_data = []

        async for post in top_posts:
            post_comments_data = await fetch_post_comments(post)
            comments_data.extend(post_comments_data)

    if not comments_data:
        raise HTTPException(status_code=404, detail="No comments found")

    container_client = await get_blob_container()
    blob_name = f"{subreddit_input.subreddit}_comments.json"
    blob_client = container_client.get_blob_client(blob_name)

    comments_json = json.dumps(comments_data, ensure_ascii=False).encode("utf-8")
    await blob_client.upload_blob(comments_json, overwrite=True)

    # Close the BlobServiceClient
    await container_client.client.close()

    return {"detail": "Comments successfully fetched and stored in Azure Storage Files"}


async def get_comments_from_storage(subreddit: str):
    container_client = await get_blob_container()
    blob_name = f"{subreddit}_comments.json"
    blob_client = container_client.get_blob_client(blob_name)
    if await blob_client.exists():
        response = await blob_client.download_blob()
        comments_data = json.loads(await response.content_as_text())
        return comments_data
    return None


async def get_openai_embeddings(user_profile: str):
    embeddings = openai.Embedding.create(deployment_id=EMBEDDING_MODEL,
                                         input=user_profile)
    print(f'GPT output: {embeddings}')
    return embeddings


async def store_comments_in_qdrant(comments: List[str]):
    embeddings = []
    # Due to Internal AOAI Rate limits, only fetching 5 comments
    comments = comments[:5]
    # TODO: Remove ^ after AOAI rate limits are removed
    for comment in comments:
        gpt_output = await get_openai_embeddings(comment)
        embeddings.append(gpt_output["data"][0]["embedding"])
    settings.client.upsert(collection_name=COLLECTION_NAME,
                           points=Batch(
                               ids=list(range(1, len(embeddings) + 1)),
                               vectors=embeddings
                           ))
    return {"detail": "Comments successfully stored in Qdrant vector store"}


@app.post("/store_comments_in_qdrant")
async def store_comments_in_qdrant_endpoint(subreddit_input: SubredditInput):
    comments = await get_comments_from_storage(subreddit_input.subreddit)
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found in storage")
    return await store_comments_in_qdrant(comments)


@app.post("/fetch_and_store_comments")
async def fetch_and_store_comments(subreddit_input: SubredditInput):
    fetch_result = await fetch_comments(subreddit_input)
    store_result = await store_comments_in_qdrant_endpoint(subreddit_input)
    return {"fetch_result": fetch_result, "store_result": store_result}
