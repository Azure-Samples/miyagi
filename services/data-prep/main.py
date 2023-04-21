import os
import urllib

import pypdf
from azure.storage.blob import BlobServiceClient
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from praw import Reddit
from pydantic import BaseModel
from pydantic import BaseSettings


class Settings(BaseSettings):
    reddit_client_id: str = os.getenv("REDDIT_CLIENT_ID")
    reddit_client_secret: str = os.getenv("REDDIT_CLIENT_SECRET")
    reddit_user_agent: str = os.getenv("REDDIT_USER_AGENT")
    azure_connection_string: str = os.getenv("AZURE_CONNECTION_STRING")


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


reddit = Reddit(client_id=settings.reddit_client_id,
                client_secret=settings.reddit_client_secret,
                user_agent=settings.reddit_user_agent)

azure_connection_string = settings.azure_connection_string


class SubredditRequest(BaseModel):
    subreddit_name: str


@app.post("/collect_subreddit_posts")
async def collect_and_upload_subreddit_data(subreddit_request: SubredditRequest):
    subreddit = subreddit_request.subreddit_name
    posts = collect_reddit_posts(subreddit)

    with open("reddit_data.txt", "w") as file:
        for post in posts:
            file.write(post["title"] + "\n" + post["selftext"] + "\n\n")
    upload_file_to_azure("reddit-data", "reddit_data.txt", f"{subreddit}_reddit_data.txt")

    return {"status": "success"}


async def collect_reddit_posts(subreddit, num_posts=100):
    subreddit = reddit.subreddit(subreddit)
    posts = []

    for posts in subreddit.hot(limit=num_posts):
        data = {
            "title": posts.title,
            "selftext": posts.selftext
        }
        posts.append(data)

    return posts


def pdf_to_text(url, output_filename):
    urllib.request.urlretrieve(url, output_filename)

    with open(output_filename, "rb") as file:
        pdf_reader = pypdf.PdfFileReader(file)
        text = ""

        for page_num in range(pdf_reader.numPages):
            text += pdf_reader.getPage(page_num).extractText()

    return text


def upload_file_to_azure(container_name, file_path, blob_name):
    blob_service_client = BlobServiceClient.from_connection_string(azure_connection_string)
    container_client = blob_service_client.get_container_client(container_name)

    # Create a new container if it doesn't exist
    try:
        container_client.create_container()
    except:
        pass

    blob_client = container_client.get_blob_client(blob_name)
    with open(file_path, "rb") as data:
        blob_client.upload_blob(data, overwrite=True)



