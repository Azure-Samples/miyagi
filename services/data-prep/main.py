import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncpraw
from azure.storage.blob.aio import BlobServiceClient
import os
import json
import asyncio


logging.getLogger("aiohttp").setLevel(logging.ERROR)


app = FastAPI()


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
        top_posts = subreddit.top("month", limit=5)

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
    await container_client._client.close()

    return {"detail": "Comments successfully fetched and stored in Azure Storage Files"}
