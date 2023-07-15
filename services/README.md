# Miyagi Services

This folder contains the microservices that implement the [use cases](https://iappwksp.com/wksp/05-use-cases/) for intelligent apps using the Miyagi sample. 

## Use cases implemented

### Generative AI 

| Use Case | Subfolder |
|----------|-----------|
| Synthesis & Summarization | [recommendation-service](./recommendation-service/dotnet/) |
| Images | [reddog-repo](https://github.com/Azure/reddog-solutions) [inference](https://huggingface.co/thegovind/reddogpillmodel512) |
| Code | [sql-code-gen.ipynb](../sandbox/generative/code-gen/sk-c#/sql-code-gen.ipynb) |
| Chat (Q&A) | [sk-copilot-chat-api](../services/sk-copilot-chat-api/) |
| Synthetic data | [user-service](./user-service/java/) |

### Discriminative 

| Use Case | Subfolder |
|----------|-----------|
| Classification | [expense-service](./expense-service/python/) |
| Translation | |
| Analysis | [./expense-service](./expense-service/python/) |
| Entity Extraction |[Memory usecase](../sandbox/experiments/langchain/Memory_Usecases.ipynb) |
| Anomaly Detection | |

> Please note that some use cases are currently under development and do not yet have associated subfolders.
