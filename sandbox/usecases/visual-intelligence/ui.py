import streamlit as st
from openai import AzureOpenAI
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
import os
import base64

# Load the environment variables
load_dotenv()

# Load the environment variables
api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment_name = os.getenv("DEPLOYMENT_NAME")
api_version = '2024-03-01-preview'
vision_endpoint = os.getenv("VISION_ENDPOINT")
vision_key = os.getenv("VISION_KEY")

# Initialize the Azure OpenAI client
client = AzureOpenAI(
    api_key=api_key,
    api_version=api_version,
    base_url=f"{api_base}/openai/deployments/{deployment_name}/extensions",
)

def process_image(image_data):
    # Convert the image data to a PIL image and then to a byte array
    image = Image.open(BytesIO(image_data))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Prepare the body for the OpenAI API call
    response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": [
                    {"type": "text", "text": "Describe this picture:"},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
                ]}
            ],
            extra_body={
                "dataSources": [
                    {
                        "type": "AzureComputerVision",
                        "parameters": {
                            "endpoint": vision_endpoint,
                            "key": vision_key
                        }
                    }
                ],
                "enhancements": {
                    "ocr": {"enabled": True},
                    "grounding": {"enabled": True}
                }
            },
            max_tokens=2000
        )
    return response.as_dict()

st.title("Azure OpenAI + AI Vision")

with st.container():
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
    if uploaded_file is not None:
        # Display the uploaded image
        st.image(uploaded_file, caption='Uploaded Image', use_column_width=True)
        # Process the image
        result = process_image(uploaded_file.getvalue())
        # Display results
        st.write("OpenAI Analysis:", result)
