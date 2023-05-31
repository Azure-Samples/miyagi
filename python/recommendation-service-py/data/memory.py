from typing import List

import openai
from qdrant_client.http.models import Batch

from settings import settings, Settings

COLLECTION_NAME = settings.memory_collection_name
EMBEDDING_MODEL = settings.memory_embedding_model
EMBEDDING_MODEL_DIMENSION = settings.memory_embedding_dimension


async def get_openai_embeddings(user_profile: str):
    embeddings = openai.Embedding.create(engine=EMBEDDING_MODEL,
                                         input=user_profile)
    print(f'GPT output: {embeddings}')
    return embeddings


async def store_comments_as_embeddings(comments: List[str]):
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
