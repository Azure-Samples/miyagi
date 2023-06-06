# settings.py

import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    # memory_collection_name = os.getenv("EMBEDDING_COLLECTION_NAME")
    # memory_embedding_model = os.getenv("OPENAI_EMBEDDING_MODEL")
    # memory_embedding_dimension = 1536

    openai_api_type = "storage"
    openai_api_version = "2022-12-01"
    openai_api_base = os.getenv("OPENAI_API_BASE")
    openai_api_key = os.getenv("OPENAI_API_KEY")

    pf_url = os.getenv("PF_URL")
    pf_api_key = os.getenv("PF_API_KEY")


settings = Settings()
