# Steps: Build Your Own Copilot workshop

## 1. Setup Local Environment

1. Install Visual Studio Code (https://code.visualstudio.com/download)
2. Install the following VSCode extenstions
    1. Azure Tools (https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)
    2. Polyglot Notebooks (https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.dotnet-interactive-vscode)
    3. Semantic Kernel (https://marketplace.visualstudio.com/items?itemName=ms-semantic-kernel.semantic-kernel)
    4. Prompt flow for VSCode (https://marketplace.visualstudio.com/items?itemName=prompt-flow.prompt-flow)

3. Install Azure CLI (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), min version 2.53.0
4. Install PowerShell (https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.1)
5. Install Docker Desktop (https://www.docker.com/products/docker-desktop)
6. Install .NET 7.0 SDK (https://dotnet.microsoft.com/download/dotnet/7.0)
7. Install python 3.11 (https://www.python.org/downloads/)
8. Install jq (https://stedolan.github.io/jq/download/)

## 2. Clone and run myagi locally

1. Create a new folder for the workshop
2. Open Visual Studio Code
3. Open the new folder: File -> Open Folder -> Select the folder you created in step 1
4. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)   
5. Clone this repo
   
   ```
    git clone https://github.com/ajai-d/miyagi.git
   ```
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
    ./deploy.ps1  -resourceGroupPrefix "<myagi>" -location "<eastus2>" -resourceGroupCount "<1>" -subscriptionId "<your subscription id>"
   ```
   Note: If you are setting up the workshop just for you, make sure you set the value of resourceGroupCount to 1
4. Wait until the script completes. It will take less than 10 minutes to complete.

### 2.2 Setup configuration for myagi app

1. Create a new file called .env in myagi/ui/typescript
2. Copy paste the contents of .env.local.example into .env and save the file
3. You will setup the values for the variables in the workshop [ this will be updated later]
4. Create a new file named appsettings.json in myagi/services/recommendation-service/dotnet
5. Copy paste the contents of appsettings.json.example into appsettings.json and save the file
6. Update appsettings.json with the values for the variables below. You can get the values from the Azure Portal.
   > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Select Keys and Endpoint

   > Copy the values of the Language API endpoint and the key1 into "endpoint" and "apikey" in the appsettings.json file and save the file

   > Go back to your Open AI resource -> Overview -> Click Go to Azure OpenAI Studio -> Deployments

   > Copy the value of the deployment name for gpt-35-turbo model and paste it into the appsettings.json file as the value of the variable "deploymentOrModelId"

   > Copy the value of the deployment name for text-embedding-ada-002 model and paste it into the appsettings.json file as the value of the variable "embeddingDeploymentOrModelId"

7. Create a new file named .env in myagi/sandbox/usecases/rag/dotnet
8. Copy paste the contents of .env.local.example into .env and save the file
9. Copy the values of OPenAI endpoint and key1 from step 6 into the .env file and save the file
10. Get the Azure Cognitive Search endpoint and the api key
    > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Azure Cognitive Search resource -> Select Keys -> Copy the value of Primary Admin Key and paste it into the .env file as the value of the variable "SEARCH_API_KEY"

    > Go to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Azure Cognitive Search resource -> Overview -> Copy the value of Url and paste it into the .env file as the value of the variable "SEARCH_ENDPOINT"

### 2.3 Setup .NET secrets

1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)
2. Change folder to myagi/services/recommendation-service/dotnet
3. Run the following command to set the secrets for the recommendation service. You will need to provide the values for the variables below.
   
   ```
        dotnet user-secrets set "USE_OPEN_AI" "False"
        dotnet user-secrets set "serviceType" "AzureOpenAI"
        dotnet user-secrets set "AZURE_SEARCH_ENDPOINT" "<Azure Cognitive Search endpoint from previous section step 10 >"
        dotnet user-secrets set "AZURE_SEARCH_API_KEY" "<Azure Cognitive Search api key from previous section step 10 >"
        dotnet user-secrets set "BING_API_KEY" "<Your Bing API Key>"
        dotnet user-secrets set "MEMORY_COLLECTION" "miyagi-embeddings"
        dotnet user-secrets set "QDRANT_PORT" "6333"
        dotnet user-secrets set "QDRANT_ENDPOINT" "<Qdrant endpoint>"

   ```
### 2.4 Understanding implementation of the recommendation service

Recommendation service implements RAG pattern using Semantic Kernel SDK. The details of the implementation are captured in the Jupyter notebook in the folder miyagi/sandbox/usecases/rag/dotnet. You can open the notebook in VSCode and run the cells to understand the implementation. Select kernel as .NET Interactive in the top right corner of the notebook.

### 2.5 Run myagi frontend locally

1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)
2. Change folder to myagi/ui/typescript
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
   Get the port from the logs in the terminal. You should see the myagi app running locally.
   
### 2.6 Run recommendation service locally
1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)
2. Change folder to myagi/services/recommendation-service/dotnet
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

### 2.7 Explore the recommendation service

Go back to the ui -> click personalize button -> select financial advisor. You should see the recommendations from the recommendation service in the Top Stocks widget.






