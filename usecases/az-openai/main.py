import os
import openai
from importlib import reload
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseSettings, BaseModel


class Settings(BaseSettings):
    openai.api_type = "azure"
    openai.api_base = os.getenv("OPENAI_API_BASE")
    openai.api_version = "2022-06-01-preview"
    openai.api_key = os.getenv("OPENAI_API_KEY")


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


# Health endpoint
@app.get("/health")
async def pong():
    return {"status": "Ok"}


# Redirect home to docs
@app.get("/")
async def docs_redirect():
    return RedirectResponse(url='/docs')


# Generate stock recommendations
@app.post("/generate/stock-recommendations")
async def generate_stock_recommendations(req: Request):
    # log prompt
    req_info = await req.json()
    print(req_info)
    prompt = req_info["prompt"]
    seed_words = req_info["seed_words"]
    if not prompt or not seed_words:
        print("No prompt provided")
        return {"error": "No prompt provided"}
    else:
        composed_prompt = f'Prompt:{prompt}\nSeed words:{seed_words}'
        print(f'Prompt: {composed_prompt}')
        gpt_output = ask_davinci_2(composed_prompt)
        return {"output": gpt_output}


def ask_davinci_2(prompt: str):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        temperature=0.8,
        max_tokens=60,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None
    )
    print(f'GPT output: {response}')
    return response.choices[0].text


