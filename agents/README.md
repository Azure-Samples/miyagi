# Notebooks to showcase Agents and Assistants

This folder contains notebooks that demonstrate several use cases implemented using Azure OpenAI's Assistants API and Agent frameworks such as AutoGen, TaskWeaver, Semantic Kernel, and Langgraph. 

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
- An Azure OpenAI resource - [Create one](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesOpenAIAccount)
- Python 3.10 or later - [Install Python](https://www.python.org/downloads/)
- VS Code or Jupyter Notebook - [Install VS Code](https://code.visualstudio.com/download) | [Install Jupyter Notebook](https://jupyter.org/install)

## Setup

1. From Azure OpenAI, retrieve your model's API key, name, and endpoint.
1. Set the `.env` file with the following environment variables:
    ```bash
    OPENAI_API_KEY=<your-api-key>
    OPENAI_MODEL_NAME=<your-model-name>
    OPENAI_ENDPOINT=<your-endpoint>
    ```
1. Run the notebooks.

## Architecture
![](../assets/images/agents-block-diagram.png)

## Notebooks

> WIP

1. [Agents with AutoGen](./autogen/notebooks/expense-tracking-budgeting.ipynb)
1. [Agents with Assistants API](./assistants-api/azure-openai/equity-analyst.ipynb)
1. [Agents with Assistants API and function calling](./assistants-api/azure-openai/function-calling-ea.ipynb)
