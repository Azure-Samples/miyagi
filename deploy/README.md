# Deployment steps

## Prerequisites

- [Azure Subscription](https://azure.microsoft.com/en-us/free/)
- [Azure OpenAI](https://aka.ms/oai/access) access with the following models
  - gpt-35-turbo
  - text-embedding-ada-002

## Deploying the solution in your Azure subscription
>TODO: We welcome community contributions, see [CONTRIBUTING.md](../CONTRIBUTING.md) for details
### Deploying the solution using Azure Portal

1. Click on the "Deploy to Azure" button (TODO)

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](#)

2. Fill in the required parameters

### Deploying the solution using Azure CLI (TODO)

1. Clone the repository. 

    ```bash
    git clone https://github.com/Azure-Samples/miyagi
    ```

2. Configure and run Deploy scripts (TODO)

    ```bash
    cd miyagi/deploy/infrastructure
    code config.json
    ./deploy.sh
    ```
