# memory.py

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from routes.main import router
from settings import Settings

logging.getLogger("aiohttp").setLevel(logging.ERROR)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def pong():
    return {"status": "Ok"}


@app.get("/", include_in_schema=False)
async def docs_redirect():
    return RedirectResponse(url='/redoc')
