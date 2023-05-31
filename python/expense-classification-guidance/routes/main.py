# routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from data.memory import store_comments_as_embeddings
from data.reddit import fetch_comments
from data.storage import store_comments_to_azure, get_comments_from_storage

router = APIRouter()


class SubredditInput(BaseModel):
    subreddit: str


@router.post("/classify")
async def fetch_comments_route(subreddit_input: SubredditInput):
    try:
        comments_data = await fetch_comments(subreddit_input.subreddit)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    try:
        await store_comments_to_azure(subreddit_input.subreddit, comments_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"detail": "Comments successfully fetched and stored in Azure Storage Files"}


