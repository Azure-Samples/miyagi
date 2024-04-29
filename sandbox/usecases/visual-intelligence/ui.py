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
api_version = '2023-12-01-preview'
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

    wildfire_risk_assessment_prompt = """
        As an AI with advanced natural language understanding and computer vision capabilities who write proper markdown, you will analyze images of vegetation to assess wildfire risks. Utilize your integrated visual recognition to examine the health of plant life, the dryness of the area, and any other indicators that contribute to wildfire susceptibility. Your analysis should cover the following:

        1. **Vegetation Health**: Look for signs of stressed or dying plants, which are more flammable. Assess the color and condition of leaves and stems.

        2. **Vegetation Density**: Evaluate the density of the plant life. Overcrowding can contribute to the spread of wildfires.

        3. **Dryness Indicators**: Identify visual cues indicating the moisture level in the area, such as the presence of dry, brown grass or brittle branches.

        4. **Area Topography**: Consider the landscape's features that might affect fire behavior, such as slopes, hills, or valleys.

        5. **Weather Influence**: Take into account any visible weather patterns or evidence that might indicate hot, dry, and windy conditions, which can amplify wildfire risks.

        6. **Human Activity**: Note any signs of human activity that could influence wildfire risk, like campfires, building developments, or cleared land.

        Your output should be a risk assessment report in Markdown based on the visual data, **highlighting** the above factors and concluding with an overall wildfire risk level ranging from low, moderate, high, to extreme. Include any recommendations in markdown for reducing the identified risk where applicable.
        """


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