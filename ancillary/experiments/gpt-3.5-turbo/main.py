import os
import gradio as gr
import openai, config, subprocess
from pydantic import BaseSettings, BaseModel

WHISPER = "whisper-1"
GPT_TURBO = "gpt-3.5-turbo"


class Settings(BaseSettings):
    openai.api_key = os.getenv("OPENAI_API_KEY")


settings = Settings()


async def transcribe(audio_file):
    """
        Return chat transcript from gp3.5-turbo after transcribing audio using whisper-1.
        audio_file: audio file path
        If it fails, throws an exception.
    """

    global messages

    audio_file = open(audio_file, "rb")
    transcript = openai.Audio.transcribe(WHISPER, audio_file)

    messages.append({"role": "user", "content": transcript["text"]})

    response = openai.ChatCompletion.create(model=GPT_TURBO, messages=messages)

    system_message = response["choices"][0]["message"]
    messages.append(system_message)

    chat = ""
    for message in messages:
        if message['role'] != 'system':
            chat += message['role'] + ": " + message['content'] + "\n\n"

    return chat

ui = gr.Interface(fn=transcribe, inputs=gr.Audio(source="microphone", type="filepath"), outputs="text").launch()
ui.launch()



