# Expense Classification Service

This service implements use cases related to expense classification by utilizing Language Learning Models (LLMs). It showcases how to classify, generate code, and provide recommendations using several orchestrators (working with LLM) such as [Guidance](https://github.com/microsoft/guidance), [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/#semantic-kernel-is-at-the-center-of-the-copilot-stack), [Prompt Flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/overview-what-is-prompt-flow?view=azureml-api-2), [Llama Index](https://gpt-index.readthedocs.io/en/latest/guides/primer.html), and [Langchain](https://python.langchain.com/docs/get_started/introduction).  are used to categorize expenses, recommend savings, and generate SQL to visualize.

## Getting Started
Before you begin, ensure you have the following software installed and provisioned:
- [Docker](https://www.docker.com/)
- [Python](https://www.python.org/downloads/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Setup
To initialize the project, you'll need to create a `.env` file at the root of the project. This file should contain all of the environment variables required by the project. Use the `.env.example` file as a template.

### Local Development
To run the project locally, execute the following command:
```bash
docker-compose up
```

### Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
