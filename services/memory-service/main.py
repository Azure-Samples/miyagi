import os
import openai
from qdrant_client import QdrantClient
from qdrant_client.http import models
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseSettings
from pydantic import BaseModel
from qdrant_client.http.models import Batch

COLLECTION_NAME = "miyagi-customer-profiles"
EMBEDDING_MODEL = "gk-ada-002"


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
        vectors_config=models.VectorParams(size=100, distance=models.Distance.COSINE),
    )


settings = Settings()
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class User(BaseModel):
    firstName: str
    lastName: str
    age: int | None = None
    userId: int
    financialProfile: object | None = None
    aspirations: object | None = None


@app.get("/health")
async def pong():
    return {"status": "Ok"}


@app.get("/", include_in_schema=False)
async def docs_redirect():
    return RedirectResponse(url='/redoc')


@app.post("/user")
async def persist_user_profile_embeddings(user: User):
    user_profile = user.json()
    if not user_profile:
        print("No user profile provided")
        return {"error": "No user profile provided"}
    else:
        print(f'User Profile: {user_profile}')
        gpt_output = await get_openai_embeddings(user_profile)
        settings.client.upsert(collection_name=COLLECTION_NAME,
                               points=Batch(
                                   ids=[1],
                                   vectors=[gpt_output["data"][0]["embedding"]]
                               ))
        return {"output": gpt_output}


async def get_openai_embeddings(user_profile: str):
    embeddings = openai.Embedding.create(deployment_id=EMBEDDING_MODEL,
                                         input=user_profile)
    print(f'GPT output: {embeddings}')
    return embeddings


async def persist_embeddings_to_qdrant(embeddings: str):
    settings.client.add_documents(collection_name=COLLECTION_NAME,
                                  documents=[{"id": 1, "embedding": embeddings}])
    return True
