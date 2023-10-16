# Recommendation Service

This microservice orchestrates recommendation flows by leveraging Semantic Kernel. It integrates both native and semantic functions, alongside vector stores and connectors to provide accurate and intuitive recommendations. Detailed insights into the architecture and functionality of this service can be explored in the [Synthesis use case](https://iappwksp.com/wksp/05-use-cases/synthesis/).

> **Tip:** For those keen on exploring advanced deep learning-based recommender systems, take a look at [microsoft/recommenders](https://github.com/microsoft/recommenders#algorithms) which provides complex DLRMs.

## Overview

![Recommendation Service Architecture](../../../assets/images/sk-memory-orchestration.png)

## Getting Started

### Authentication
The services within this microservice communicate securely using OAuth flows facilitated by [Azure Identity](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.Identity/1.10.2/api/index.html). 
This simplifies the process of securely managing credentials. 
The [`DefaultAzureCredential`](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.Identity/1.10.2/api/index.html#defaultazurecredential) authentication mechanism is used in this setup.

If you're not using Visual Studio, it's advisable to use 
[Azure Developer CLI](https://aka.ms/azure-dev) to authenticate, which will then be propagated to `AzureDefaultCredential`.

```bash
azd auth login
```

Optionally, If dev cli didn't work, you can use [service principal authentication](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.Identity/1.10.2/api/index.html#service-principal-with-secret).
dev cyou can also set the following environment variables:

```bash
dotnet user-secrets set "AZURE_CLIENT_ID" ""
dotnet user-secrets set "AZURE_CLIENT_SECRET" ""
dotnet user-secrets set "AZURE_TENANT_ID" ""
```

### Required services

The following services are required to run this microservice:
1. Bing Search API
2. Azure Cognitive Search
3. Azure OpenAI
4. Azure Cosmos DB
5. Azure Storage

Including the following environment variables:

```bash
dotnet user-secrets set "BING_API_KEY" ""
dotnet user-secrets set "deploymentOrModelId" ""
dotnet user-secrets set "embeddingDeploymentOrModelId" ""
dotnet user-secrets set "endpoint" "https://{}.openai.azure.com/"
dotnet user-secrets set "apiKey" ""
dotnet user-secrets set "COSMOS_DB_CONNECTION_STRING" ""
```

## Configuring Cosmos DB Managed Identity Access and Authentication (Optional)

> **Note:** This section is only applicable if you're using `DefaultAzureCredential` for authentication.

To ensure the principal used has the necessary permissions to access Cosmos DB, you may need to create and assign a custom role. Here's how to do it:

1. *Create a JSON file for the custom role:*
    For read-write access:
    ```json
    {
       "RoleName":"CosmosDBReadWriteRole",
       "Type":"CustomRole",
       "AssignableScopes":[
          "/"
       ],
       "Permissions":[
          {
             "DataActions":[
                "Microsoft.DocumentDB/databaseAccounts/readMetadata",
                "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
                "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
             ]
          }
       ]
    }
    ```

2. Create the custom role using Azure CLI:
    ```bash
    resourceGroupName='<your-resource-group>'
    accountName='<your-cosmos-account>'
    az cosmosdb sql role definition create -a $accountName -g $resourceGroupName -b @role-definition.json
    ```
   
3. List the role definitions to find the `roleDefinitionId`:
    ```bash
    az cosmosdb sql role definition list --account-name $accountName -g $resourceGroupName
    ```
   Find the roleDefinitionId from the output in the id field of the created custom role.
4. Assign the custom role to your principal:
    ```bash
    roleDefinitionId='<role-definition-id>'
    principalId='<principal-id>'
    az cosmosdb sql role assignment create -a $accountName -g $resourceGroupName -s "/" -p $principalId -d $roleDefinitionId

    ```
