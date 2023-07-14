# routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from data.memory import store_comments_as_embeddings
from data.reddit import fetch_comments
from data.storage import store_comments_to_azure, get_comments_from_storage

router = APIRouter()


class SubredditInput(BaseModel):
    subreddit: str


@router.post("/fetch_comments")
async def fetch_comments_route(subreddit_input: SubredditInput):
    try:
        comments_data = await fetch_comments(subreddit_input.subreddit)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    try:
        await store_comments_to_azure(subreddit_input.subreddit, comments_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"detail": "Comments successfully fetched and stored in Azure BLOB"}


@router.post("/store_comments_in_qdrant")
async def store_comments_in_qdrant_route(subreddit_input: SubredditInput):
    comments = await get_comments_from_storage(subreddit_input.subreddit)
    if not comments:
        raise HTTPException(status_code=404, detail="No comments found in storage")
    return await store_comments_as_embeddings(comments)


@router.post("/fetch_and_store_comments")
async def fetch_and_store_comments(subreddit_input: SubredditInput):
    fetch_result = await fetch_comments_route(subreddit_input)
    store_result = await store_comments_in_qdrant_route(subreddit_input)
    return {"fetch_result": fetch_result, "store_result": store_result}
