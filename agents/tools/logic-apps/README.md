# Logic Apps workflows
This folder contains the Logic Apps workflows that are used by other use cases as plugins for grounding the LLMs with proprietary data sources, and to orchestrate asynchronous workflows with LLMs.

## Workflows
- [assistants-auto-invest.json](./assistants-auto-invest.json): This workflow is used as a function calling plugin for [Assistants API use case](../../agents/assistants-api/azure-openai/function-calling-ea.ipynb) to ground the LLMs with proprietary data sources, and orchestrate workflows with LLMs and proprietary data sources.

## How to deploy

### Prerequisites
- [Logic Apps](https://azure.microsoft.com/en-us/services/logic-apps/)
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)

Create connections for the following services:
- [Service Bus](https://azure.microsoft.com/en-us/services/service-bus/)
- [Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/)
- [AI Search](https://azure.microsoft.com/en-us/services/search/)


## Sample run
![Logic Apps workflow](./data-collection-run.png)