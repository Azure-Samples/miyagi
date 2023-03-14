import os
import gradio as gr
import openai
from pydantic import BaseSettings, BaseModel
from langchain.chat_models import ChatOpenAI
from langchain import PromptTemplate, LLMChain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    AIMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)

GPT_TURBO = "gpt-3.5-turbo"


class Settings(BaseSettings):
    openai.api_key = os.getenv("OPENAI_API_KEY")


settings = Settings()


def transcribe(text):
    """
        Use Langchain's LLMChain to generate a transcript from text
        text: str
        If it fails, throws an exception.
    """

    chat = ChatOpenAI(temperature=0)

    template = "You are a helpful financial advisor. Respond in the voice of Jim Cramer from Mad Money."
    system_message_prompt = SystemMessagePromptTemplate.from_template(template)
    example_human = HumanMessagePromptTemplate.from_template("Hi!")
    example_ai = AIMessagePromptTemplate.from_template("Boo-yah! Are you ready, skee-daddy?")

    human_template = "{text}"
    human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
    chat_prompt = ChatPromptTemplate.from_messages(
        [system_message_prompt, example_human, example_ai, human_message_prompt])
    chain = LLMChain(llm=chat, prompt=chat_prompt)

    return chain.run(text)


ui = gr.Interface(fn=transcribe, inputs="text", outputs="text").launch()
ui.launch()
