# Deployment steps

## Prerequisites

- [Azure SUbscription](https://azure.microsoft.com/en-us/free/)
- [Azure OpenAI](https://aka.ms/oai/access) access with the following models
  - gpt-35-turbo
  - text-embedding-ada-002


## Deploying the solution in your Azure subscription

### Deploying the solution using Azure Portal

1. Click on the **Deploy to

    <img src="https://aka.ms/deploytoazurebutton"" alt="Deploy to Azure" />

2. Fill in the required parameters


### Deploying the solution using Azure CLI

1. Clone the repository

    ```bash
    git clone
    ```
2. Configure and run Deploy scripts (TODO: We welcome community contributions, see [CONTRIBUTING.md](../CONTRIBUTING.md) for details)
    
        ```bash
        cd miyagi/deploy/infrastructure
        code config.json
        ./deploy.sh
        ```