# settings.py

import os
from pydantic import BaseSettings
from qdrant_client import QdrantClient
from qdrant_client.http import models


class Settings(BaseSettings):
    memory_collection_name = os.getenv("EMBEDDING_COLLECTION_NAME")
    memory_embedding_model = os.getenv("OPENAI_EMBEDDING_MODEL")
    memory_embedding_dimension = 1536

    openai_api_type = "storage"
    openai_api_version = "2022-12-01"
    openai_api_base = os.getenv("OPENAI_API_BASE")
    openai_api_key = os.getenv("OPENAI_API_KEY")

    blob_connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    blob_container_name = os.getenv("AZURE_STORAGE_CONTAINER_NAME")

    reddit_client_id = os.getenv("REDDIT_CLIENT_ID")
    reddit_client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    reddit_user_agent = os.getenv("REDDIT_USER_AGENT")

    # to connect to local Qdrant instance
    client = QdrantClient(":memory:")
    # to connect to remote Qdrant instance in docker
    # client = QdrantClient(host="localhost", port=6333)
    client.recreate_collection(
        collection_name=("%s" % memory_collection_name),
        vectors_config=models.VectorParams(size=memory_embedding_dimension, distance=models.Distance.COSINE),
    )


settings = Settings()
