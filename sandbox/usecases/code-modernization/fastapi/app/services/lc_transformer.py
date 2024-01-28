import urllib.request
import os
import ssl

from langchain_core.messages import SystemMessage

from app.data.input_data import InputData
from fastapi import HTTPException


from langchain_openai import AzureChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain.globals import set_debug, set_verbose

from app.settings import settings


async def allow_self_signed_https(allowed):
    # bypass the server certificate verification on client side
    if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
        ssl._create_default_https_context = ssl._create_unverified_context


async def transform(input_data: InputData):
    # this line is needed if you use self-signed certificate in your scoring service.
    await allow_self_signed_https(True)

    try:
        set_debug(True)
        set_verbose(True)

        print("Input data:")
        print(input_data)
        chat_openai = AzureChatOpenAI(
            azure_deployment=settings.AZURE_OPENAI_MODEL,
            openai_api_version="2023-09-01-preview"
        )

        chat_template = ChatPromptTemplate.from_messages(
            [
                SystemMessage(
                    content=(
                        "You are a {{domain}} code modernization expert. "
                        "You take existing {{domain}} {{subdomain}} based code in {{existing_language}} and convert "
                        "it to {{desired_language}}."
                        "The user will send you legacy code and reply back working code in {{desired_language}} "
                    )
                ),
                HumanMessagePromptTemplate.from_template("{code}"),
            ]
        )

        metadata = input_data.payload.metadata
        chat_template.format_messages(
            code=input_data.payload.code,
            domain=metadata.domain,
            subdomain=metadata.subdomain,
            existing_language=metadata.existing_language,
            desired_language=metadata.desired_language
        )

        print("Chat template messages:")
        print(chat_template.messages)

        chain = (
                {"code": RunnablePassthrough()}
                | chat_template
                | chat_openai
                | StrOutputParser()
        )
        return chain.invoke(input=input_data.payload.code)
    except Exception as error:  # Catch all exceptions
        error_details = {
            "type": type(error).__name__,
            "message": str(error)
        }

        # Determine if the error has a specific status code or use a generic 500 server error
        status_code = getattr(error, 'code', 500) if hasattr(error, 'code') else 500

        # Log the error for server-side debugging
        print("An error occurred:", error_details)

        # Raise an HTTPException which will be sent back to the user
        raise HTTPException(status_code=status_code, detail=error_details)
