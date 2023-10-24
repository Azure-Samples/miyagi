# Steps: Build Your Own Copilot workshop

## 1. Setup Local Environment

1. Install Visual Studio Code (https://code.visualstudio.com/download)
2. Install the following VSCode extenstions
    1. Azure Tools (https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)
    2. Polyglot Notebooks (https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode)
    3. Semantic Kernel (https://marketplace.visualstudio.com/items?itemName=ms-semantic-kernel.semantic-kernel)
    4. Prompt flow for VSCode (https://marketplace.visualstudio.com/items?itemName=prompt-flow.prompt-flow)
    5. Azure Container Apps (https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps)
    6. Docker Extension (https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

3. Install Azure CLI (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), min version 2.53.0
4. Install PowerShell (https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.1)
5. Install Docker Desktop (https://www.docker.com/products/docker-desktop)
6. Install .NET 7.0 SDK (https://dotnet.microsoft.com/download/dotnet/7.0)
7. Install python 3.11 (https://www.python.org/downloads/)
8. Install jq (https://stedolan.github.io/jq/download/)
9. Install Postman (https://www.postman.com/downloads/)



## 2. Clone and run miyagi locally

1. Create a new folder for the workshop
2. Open Visual Studio Code
3. Open the new folder: File -> Open Folder -> Select the folder you created in step 1
4. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)   
5. Clone this repo
   
   ```
    git clone -b ap/docs-and-iaac https://github.com/Azure-Samples/miyagi.git

   ```
   **Note:** the above branch is temporary. Soon you will be using the main branch.
   
### 2.1 Provision Azure Services required for the workshop

1. Change folder to miyagi/deploy/infrastructure/cli
   
   ```
    cd miyagi/deploy/infrastructure/cli
   ```
2. Login to Azure and select the subscription you want to use for the workshop
   
   ```
    az login
    az account set --subscription "<your subscription id>"

   ```
3. Run the following command to create the Azure resources needed for the workshop. The script will create a resource group for each of the workshop participants, and will create the required resources in each resource group. You will need to provide a subscription id, and optionally a resource group prefix, location, and the number of resource groups you want. The script will default to the values below if not provided.
   
   ```
    ./deploy.ps1  -resourceGroupPrefix "<miyagi>" -location "<eastus2>" -resourceGroupCount "<1>" -subscriptionId "<your subscription id>"
   ```
   Note: If you are setting up the workshop just for you, make sure you set the value of resourceGroupCount to 1
4. Wait until the script completes. It will take less than 10 minutes to complete.

5. Bump up the capacity for Open AI model deployments

   By default the Open AI model are deployed with 1K Tokens per minute (TPM) capacity. This is not enough for the workshop. You will need to bump up the capacity to 20K Tokens per minute. You can do this by going to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Overview -> Click Go to Azure OpenAI Studio -> Deployments -> Select the deployment for gpt-35-turbo model -> Click Edit Deployment -> Advanced Options -> Slide the TPM slider to 20K -> Click Save and close.
   
   Repeat the same steps for the deployment for text-embedding-ada-002 model.

### 2.2 Setup configuration for miyagi app

1. Create a new file called .env in miyagi/ui/typescript
2. Copy paste the contents of .env.local.example into .env and save the file
3. You will setup the values for the variables in the workshop [ this will be updated later]
4. Create a new file named appsettings.json in miyagi/services/recommendation-service/dotnet
5. Copy paste the contents of appsettings.json.example into appsettings.json and save the file
6. Update appsettings.json with the values for the variables below. You can get the values from the Azure Portal.
   > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Select Keys and Endpoint

   > Copy the values of the Language API endpoint and the key1 into "endpoint" and "apikey" in the appsettings.json file and save the file

   > Go back to your Open AI resource -> Overview -> Click Go to Azure OpenAI Studio -> Deployments

   > Copy the value of the deployment name for gpt-35-turbo model and paste it into the appsettings.json file as the value of the variable "deploymentOrModelId"

   > Copy the value of the deployment name for text-embedding-ada-002 model and paste it into the appsettings.json file as the value of the variable "embeddingDeploymentOrModelId"

   > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select Azure Cognitive Search resource -> Overview -> Copy the value of the Url and paste it into the appsettings.json file as the value of the variable "azureCognitiveSearchEndpoint"

   > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select Azure Cognitive Search resource -> Keys -> Copy the value of the Primary Admin Key and paste it into the appsettings.json file as the value of the variable "azureCognitiveSearchApiKey"
   
   > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Cosmos DB resource -> Overview -> Copy the value of the Url and paste it into the appsettings.json file as the value of the variable "cosmosDbUri"

   > Leave the cosmosDbName as "miyagi" and the cosmosDbContainer name as "recommendations"

   > Set the blobServiceUri tp https://yourstorageservicename.blob.core.windows.net/


7. Create a new file named .env in miyagi/sandbox/usecases/rag/dotnet
8. Copy paste the contents of rag/.env.local.example into .env and save the file
9. Copy the values from Step 6 into the .env file and save the file


### 2.3 Setup .NET secrets

1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)
2. Change folder to miyagi/services/recommendation-service/dotnet
3. Run the following command to set the secrets for the recommendation service. You will need to provide the values for the variables below.
   
   ```
        dotnet user-secrets set "USE_OPEN_AI" "False"
        dotnet user-secrets set "serviceType" "AzureOpenAI"
        dotnet user-secrets set "BING_API_KEY" "<Your Bing API Key>"
        dotnet user-secrets set "MEMORY_COLLECTION" "miyagi-embeddings"
        dotnet user-secrets set "deploymentOrModelId" "<Your Open AI Completions model Deployment Id>"
        dotnet user-secrets set "embeddingDeploymentOrModelId" "<Your Open AI Embeddings model Deployment Id>"
        dotnet user-secrets set "endpoint" "<Your Open AI Endpoint>" 
        dotnet user-secrets set "apiKey" "<Your Open AI API Key>"
        dotnet user-secrets set "COSMOS_DB_CONNECTION_STRING" "<Cosmos DB Connection String>"
       
   ```
   Use the following instructions to get the values for the arguments to the dotnet user-secrets set command

   > **Bing API Key:** This will be provided to you during the workshop.

   > **Open AI Endpoint:** Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Select Keys and Endpoint -> Copy the value of Endpoint.

   > **Open AI API Key:** Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Select Keys and Endpoint -> Copy the value of key1.

   > **Completions model Deployment Id:** Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Overview -> Click Go to Azure OpenAI Studio -> Deployments -> Copy the value of the deployment name for gpt-35-turbo model.

   > **Embeddings model Deployment Id:** Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Overview -> Click Go to Azure OpenAI Studio -> Deployments -> Copy the value of the deployment name for text-embedding-ada-002 model.

   > **Cosmos DB Connection String:** Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Cosmos DB resource -> Keys -> Copy the value of the Cosmos DB Connection String.



### 2.4 Understanding implementation of the recommendation service

Recommendation service implements RAG pattern using Semantic Kernel SDK. The details of the implementation are captured in the Jupyter notebook in the folder miyagi/sandbox/usecases/rag/dotnet. You can open the notebook in VSCode and run the cells to understand step by step details of how the Recommendation Service is implemented. Pay special attention to how RAG pattern is implemented using Semantic Kernel. Select kernel as .NET Interactive in the top right corner of the notebook.

### 2.5 Run miyagi frontend locally

1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)
2. Change folder to miyagi/ui/typescript
3. Run the following command to install the dependencies
   
    ```
     npm install --global yarn
     yarn install
     yarn dev
    ```
4. Open a browser and navigate to
   ```
     http://localhost:<port>
   ```
   Get the port from the logs in the terminal. You should see the miyagi app running locally.
   
### 2.6 Run recommendation service locally
1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)
2. Change folder to miyagi/services/recommendation-service/dotnet
3. Run the following command to run the recommendation service locally
    ```
     dotnet build
     dotnet run
    ```
4. Open a browser and navigate to
   ```
     http://localhost:<port>/swagger/index.html
   ```
   Get the port from the logs in the terminal. You should see the swagger page for the recommendation service.

### 2.7 Vectorize and persist embeddings in Azure Cognitive Search
1. Open Postman -> Click import -> select Files -> select the file miyagi/services/recommendation-service/dotnet/setup/hydate.postman_collection.json
2.  Click hydrate -> GET 7288/datasets -> Click Send. You should see the following response
    ```
    [
    "resources\\sample-datasets\\common-stocks-uncommon-profits.txt",
    "resources\\sample-datasets\\intelligent-investor.txt",
    "resources\\sample-datasets\\random-walk-down-wall-street.txt"
    ]
    ```
3.  Click hydrate -> POST save 7288/datasets -> Click Send. You should see the following response
    ```
      {
      "metadata": {
         "userId": "50",
         "riskLevel": "aggressive",
         "favoriteSubReddit": "finance",
         "favoriteAdvisor": "Jim Cramer"
      },
      "dataSetName": "intelligent-investor"

      }
    ```

### 2.8 Explore the recommendation service

Go back to the ui -> click personalize button -> select financial advisor. You should see the recommendations from the recommendation service in the Top Stocks widget.

### 2.9 TODO: Deploy Apps to Azure Container Apps

### 2.10 TODO: Expose Open AI through APIM






