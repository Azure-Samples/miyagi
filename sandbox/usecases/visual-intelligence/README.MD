# Visual Intelligence with GPT-4V

This sample demonstrates visual synthesis of GPT-4V using Azure OpenAI

## Prerequisites

Before you start, ensure you have the following:
- An Azure OpenAI service with [GPT-4V model deployment](https://learn.microsoft.com/en-us/azure/ai-services/openai/gpt-v-quickstart?tabs=image%2Ccommand-line&pivots=programming-language-python)
- For Vision enhancement (optional): An Azure [Computer Vision resource](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40?tabs=visual-studio%2Cwindows&pivots=programming-language-python#prerequisites) in the same region as your Azure OpenAI resource, in the paid (S1) tier.
- Python 3.10 or later

## Setup Instructions

To set up the project, follow these steps:

1. Clone the repository
1. Navigate to this directory
1. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
1. Create a new file named `.env` in the project directory and add the following environment variables:

    ```plaintext
    AZURE_OPENAI_API_KEY=<YOUR_AZURE_OPENAI_API_KEY>
    AZURE_OPENAI_ENDPOINT=<YOUR_AZURE_OPENAI_ENDPOINT>
    VISION_ENDPOINT=<YOUR_VISION_ENDPOINT>
    VISION_KEY=<YOUR_VISION_KEY>
    ```

## Running the Sample

To run the sample, execute the following command:

```bash
streamlit ui.py
```


## Sample run
![sample_run](sample_run.png)