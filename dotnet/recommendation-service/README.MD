# Recommendation Service

Microservice that leverages Semantic Kernel to orchestrate the recommendation flow with native and semantic functions,
along with vector stores and connectors.

## Overview

![Recommendation Service](../../assets/images/sk-memory-orchestration.png)

## Getting Started

Set the following environment variables:

```bash
dotnet user-secrets set "BING_API_KEY" ""
dotnet user-secrets set "AZURE_OPENAI_SERVICE_ID" ""
dotnet user-secrets set "AZURE_OPENAI_DEPLOYMENT_NAME" ""
dotnet user-secrets set "AZURE_OPENAI_ENDPOINT" "https://{}.openai.azure.com/"
dotnet user-secrets set "AZURE_OPENAI_KEY" ""
dotnet user-secrets set "QDRANT_ENDPOINT" "http://localhost"
dotnet user-secrets set "QDRANT_PORT" "6333"
dotnet user-secrets set "QDRANT_MEMORY_COLLECTION" ""
dotnet user-secrets set "AZURE_OPENAI_EMBEDDINGS_SERVICE_ID" ""
dotnet user-secrets set "AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME" ""
dotnet user-secrets set "AZURE_OPENAI_EMBEDDINGS_ENDPOINT" "https://{}.openai.azure.com/"
dotnet user-secrets set "AZURE_OPENAI_EMBEDDINGS_KEY" ""

```
