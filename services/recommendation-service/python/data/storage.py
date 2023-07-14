import os
import json
from azure.storage.blob.aio import BlobServiceClient

from settings import settings


async def get_blob_container():
    connection_string = settings.blob_connection_string
    container_name = settings.blob_container_name
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)
    return container_client


async def store_comments_to_azure(subreddit: str, comments: list):
    container_client = await get_blob_container()
    blob_name = f"{subreddit}_comments.json"
    blob_client = container_client.get_blob_client(blob_name)

    comments_json = json.dumps(comments, ensure_ascii=False).encode("utf-8")
    await blob_client.upload_blob(comments_json, overwrite=True)

    # Close the BlobServiceClient
    await container_client.close()


async def get_comments_from_storage(subreddit: str):
    container_client = await get_blob_container()
    blob_name = f"{subreddit}_comments.json"
    blob_client = container_client.get_blob_client(blob_name)
    if await blob_client.exists():
        response = await blob_client.download_blob()
        comments_data = json.loads(await response.content_as_text())
        return comments_data
    return None
