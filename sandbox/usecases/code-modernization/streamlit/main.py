from dotenv import load_dotenv
import os
import streamlit as st
from langchain import OpenAI
from openai import AzureOpenAI
import json
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains.summarize import load_summarize_chain

load_dotenv()

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_ENDPOINT"), 
  api_key = os.getenv("AZURE_API_KEY"),  
  api_version="2023-12-01-preview"
)


# Example function
def get_current_weather(location, unit="fahrenheit"):
    """Get the current weather in a given location"""
    if "tokyo" in location.lower():
        return json.dumps({"location": "Tokyo", "temperature": "10", "unit": unit})
    elif "san francisco" in location.lower():
        return json.dumps({"location": "San Francisco", "temperature": "72", "unit": unit})
    elif "paris" in location.lower():
        return json.dumps({"location": "Paris", "temperature": "22", "unit": unit})
    else:
        return json.dumps({"location": location, "temperature": "unknown"})

def run_conversation():
    # Step 1: send the conversation and available functions to the model
    messages = [{"role": "user", "content": "What's the weather like in San Francisco, Tokyo, and Paris?"}]
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_current_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA",
                        },
                        "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                    },
                    "required": ["location"],
                },
            },
        }
    ]
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL"),
        messages=messages,
        tools=tools,
        tool_choice="auto",  # auto is default, but we'll be explicit
    )
    response_message = response.choices[0].message
    tool_calls = response_message.tool_calls
    # Step 2: check if the model wanted to call a function
    if tool_calls:
        # Step 3: call the function
        # Note: the JSON response may not always be valid; be sure to handle errors
        available_functions = {
            "get_current_weather": get_current_weather,
        }  # only one function in this example, but you can have multiple
        messages.append(response_message)  # extend conversation with assistant's reply
        # Step 4: send the info for each function call and function response to the model
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call.function.arguments)
            function_response = function_to_call(
                location=function_args.get("location"),
                unit=function_args.get("unit"),
            )
            messages.append(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": function_response,
                }
            )  # extend conversation with function response
        second_response = client.chat.completions.create(
            model="gpt4t",
            messages=messages,
        )  # get a new response from the model where it can see the function response
        return second_response
    
conversation = run_conversation()
print(conversation)

st.set_page_config(page_title="Code Conversion", page_icon=":twisted_rightwards_arrows:")
st.header("Modernize code with AI")

col1, col2 = st.columns(2)

with col1:
    st.markdown("This is a sample that shows basic code conversion \n\n This tool \
                will help you improve your email skills by converting your emails into a more professional format. This tool \
                ")

st.markdown("## Enter Your Email To Convert")

def get_api_key():
    input_text = st.text_input(label="Azure OpenAI API Key ",  placeholder="", key="openai_api_key_input")
    return input_text

openai_api_key = get_api_key()

col1, col2 = st.columns(2)
with col1:
    option_tone = st.selectbox(
        'Which tone would you like your email to have?',
        ('Formal', 'Informal'))
    
with col2:
    option_dialect = st.selectbox(
        'Which English Dialect would you like?',
        ('American', 'British'))

def get_text():
    input_text = st.text_area(label="Email Input", label_visibility='collapsed', placeholder="Your Email...", key="email_input")
    return input_text

email_input = get_text()

if len(email_input.split(" ")) > 700:
    st.write("Please enter a shorter email. The maximum length is 700 words.")
    st.stop()

def update_text_with_example():
    print ("in updated")
    st.session_state.email_input = "Sally I am starts work at yours monday from dave"

st.button("*See An Example*", type='secondary', help="Click to see an example of the email you will be converting.", on_click=update_text_with_example)

st.markdown("### Your Converted Email:")

if email_input:
    if not openai_api_key:
        st.warning('Please insert OpenAI API Key. Instructions [here](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)', icon="⚠️")
        st.stop()

    llm = load_LLM(openai_api_key=openai_api_key)

    st.write("test")

if conversation:
    st.write(conversation)