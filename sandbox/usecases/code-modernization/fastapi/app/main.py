# memory.py

import logging
from functools import lru_cache
from typing import Annotated

import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.routes.main import router
from app.settings import Settings

logging.getLogger("aiohttp").setLevel(logging.INFO)


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()


app = FastAPI(title=settings.app_name, description=settings.app_description, version=settings.app_version)

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
async def ping():
    return {"status": "Ok"}


@app.get("/info")
async def info(info_settings: Annotated[Settings, Depends(get_settings)]):
    return {
        "app_name": info_settings.app_name,
        "app_description": info_settings.app_description,
        "app_version": info_settings.app_version,
        "admin_email": info_settings.admin_email
    }


@app.get("/", include_in_schema=False)
async def docs_redirect():
    return RedirectResponse(url='/redoc')


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8004)
