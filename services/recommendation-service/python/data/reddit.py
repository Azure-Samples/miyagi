# reddit/memory.py

import os
import asyncpraw
from typing import List

from settings import settings


async def fetch_post_comments(post) -> List[str]:
    post_comments = await post.comments()
    comments_data = []

    async for comment in post_comments:
        if isinstance(comment, asyncpraw.reddit.Comment):
            comments_data.append(comment.body)

    return comments_data


async def fetch_comments(subreddit: str) -> List[str]:
    async with asyncpraw.Reddit(
            client_id=settings.reddit_client_id,
            client_secret=settings.reddit_client_secret,
            user_agent=settings.reddit_user_agent,
    ) as reddit:
        subreddit = await reddit.subreddit(subreddit)
        top_posts = subreddit.top("month", limit=1)

        comments_data = []

        async for post in top_posts:
            post_comments_data = await fetch_post_comments(post)
            comments_data.extend(post_comments_data)

        if not comments_data:
            raise Exception("No comments found")

        return comments_data
