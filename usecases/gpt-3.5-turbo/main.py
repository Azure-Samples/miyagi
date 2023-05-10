import os
import gradio as gr
import openai
from pydantic import BaseSettings

WHISPER = "whisper-1"
GPT_TURBO = "gpt-3.5-turbo"


class Settings(BaseSettings):
    openai.api_key = os.getenv("OPENAI_API_KEY")


user_preferences = {
    "follows": "Jim Cramer",
    "age": 50,
    "gender": "male"
}
settings = Settings()
messages = [{"role": "system",
             "content": f'You are a financial advisor. ' +
                        f'For someone who is {user_preferences["age"]}' +
                        f' and {user_preferences["gender"]},' +
                        f' in the voice of {user_preferences["follows"]}, respond.'
                        f' Keep it to 50 words or less.'}]


def transcribe(audio_file):
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


print(gr.__version__)
ui = gr.Interface(fn=transcribe, inputs=gr.Audio(source="microphone", type="filepath"), outputs="text").launch()
ui.launch()
