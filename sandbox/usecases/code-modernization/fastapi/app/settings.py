# settings.py

import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Settings for the application.
    """
    app_name: str = "Code Converter Sample API"
    app_description: str = "Sample app to showcase code conversion with Azure OpenAI"
    app_version: str = "0.1.0"
    admin_email: str = "gok@microsoft.com"

    model_config = SettingsConfigDict(env_file="../.env")
    os.environ["AZURE_OPENAI_API_KEY"] = os.getenv("AZURE_OPENAI_API_KEY")
    os.environ["AZURE_OPENAI_ENDPOINT"] = os.getenv("AZURE_OPENAI_ENDPOINT")
    os.environ["AZURE_OPENAI_MODEL"] = os.getenv("AZURE_OPENAI_MODEL")
    AZURE_OPENAI_MODEL: str

    os.environ["AZURE_COGNITIVE_SEARCH_SERVICE_NAME"] = os.getenv("AZURE_COGNITIVE_SEARCH_SERVICE_NAME")
    os.environ["AZURE_COGNITIVE_SEARCH_INDEX_NAME"] = os.getenv("AZURE_COGNITIVE_SEARCH_INDEX_NAME")
    os.environ["AZURE_COGNITIVE_SEARCH_API_KEY"] = os.getenv("AZURE_COGNITIVE_SEARCH_API_KEY")


settings = Settings()
