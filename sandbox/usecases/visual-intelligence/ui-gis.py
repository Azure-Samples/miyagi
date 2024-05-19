import streamlit as st
from openai import AzureOpenAI
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
import os
import base64
import requests  # Added to make REST API calls

# Load the environment variables
load_dotenv()

# Load the environment variables
api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment_name = os.getenv("DEPLOYMENT_NAME")
api_version = '2023-12-01-preview'
vision_endpoint = os.getenv("VISION_ENDPOINT")
vision_key = os.getenv("VISION_KEY")

# Initialize the Azure OpenAI client
client = AzureOpenAI(
    api_key=api_key,
    api_version=api_version,
    base_url=f"{api_base}/openai/deployments/{deployment_name}/extensions",
)

def get_country_data():
    # REST API call to get data
    url = "https://firms.modaps.eosdis.nasa.gov/api/country/csv/01abe4b8c83aa2f2ee5668d13e01e5a3/MODIS_NRT/USA/1"
    response = requests.get(url)
    if response.status_code == 200:
        return response.text  
    else:
        return "Failed to retrieve data"

def process_image(image_data):
    # Convert the image data to a PIL image and then to a byte array
    image = Image.open(BytesIO(image_data))
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Get the additional data from the REST API
    modis_data_us = get_country_data()

    wildfire_risk_assessment_prompt = f"""
        As an AI with advanced natural language understanding and computer vision capabilities who gives risk assessment score for wildfires, you will analyze images to determine risks. Utilize your integrated visual recognition to examine the data to determine what could contribute to wildfire susceptibility.

        Attached are a series of images representing the same geographical location. Each image will be described to you. Your task is to review the data and determine if there is a legitimate risk of a wildfire stemming from electrical equipment based on current status. You must provide your rationale for determining if there is a risk or not in detail.

        ** Consider proximity of currently burning fires to transmission lines and power plants.**


        Also, factor in current hotspots from MODIS data for US: 
        {modis_data_us}

        Your output should be a localized wildfire risk score, **highlighting** the factors and concluding with a terse description. DO NOT BE VERBOSE. Think step by step. 
        """

    print(wildfire_risk_assessment_prompt)
    # Prepare the body for the OpenAI API call
    response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {"role": "system", "content": wildfire_risk_assessment_prompt},
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
            max_tokens=4000
        )
    return response

st.title("Azure OpenAI + AI Vision")

st.write("This tool allows you to upload an image and receive an AI-generated risk assessment for wildfire susceptibility, taking into account various visual indicators. It uses Azure OpenAI GPT-4 Vision with Azure Computer Vision.")

with st.container():
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
    if uploaded_file is not None:
        # Display the uploaded image
        st.image(uploaded_file, caption='Uploaded Image', use_column_width=True)
        # Process the image
        result = process_image(uploaded_file.getvalue())
        # Display results
        if result:
            st.header("Azure OpenAI with Azure AI Vision Analysis", divider='rainbow')
            st.markdown(result.choices[0].message.content)
        else:
            st.error("Failed to process the image.")
