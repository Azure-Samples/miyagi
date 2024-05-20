# Lab 1 - Run Miyagi Locally

In this lab, you'll setup and configure Miyagi app locally.

### Prerequisites:

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
6. Install .NET 8.0 SDK (https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
7. Install python 3.11 (https://www.python.org/downloads/)
8. Install jq (https://stedolan.github.io/jq/download/)
9. Install Postman (https://www.postman.com/downloads/)

### Task 1: Clone miyagi app

1. Create a new folder for the workshop
1. Start Visual Studio Code and Open the new folder: File -> Open Folder -> Select the folder you created in step 1
1. Open a new terminal: Terminal -> New Terminal (or Ctrl + Shift + `)   
1. Clone this repo
   
   ```
    git clone https://github.com/Azure-Samples/miyagi.git

   ```
### Task 2: Provision Azure Resources required for Miyagi app

1. Change folder to miyagi/deploy/infrastructure/cli
   
   ```
    cd miyagi/deploy/infrastructure/cli
   ```
2. Login to Azure and select the subscription you want to use for the workshop
   
   ```
    az login
    az account set --subscription "<your subscription id>"

   ```
3. Run the following command to create the Azure resources needed for the workshop. The script will create a resource group for each of the workshop participants, and will create the required resources in each resource group. You will need to provide a subscription id, and optionally a resource group prefix, location, and the number of resource groups you want. The script will default to the values below if not provided. Pick the deployment type based on whether you want to deploy the workshop for Azure Container Apps (ACA) or Azure Kubernetes Service (AKS).
   
   **ACA Lab**
   ```
    ./deploy.ps1  -resourceGroupPrefix "<miyagi>" -location "<eastus2>" -resourceGroupCount "<1>" -subscriptionId "<your subscription id>" -deploymentType "aca"
   ```

   **AKS Lab**
   ```
    ./deploy.ps1  -resourceGroupPrefix "<miyagi>" -location "<eastus2>" -resourceGroupCount "<1>" -subscriptionId "<your subscription id>" -deploymentType "aks"
   ```
   Note: If you are setting up the workshop just for you, make sure you set the value of resourceGroupCount to 1
4. Wait until the script completes. It will take less than 10 minutes to complete.
5. Bump up the capacity for Open AI model deployments

   By default the Open AI model are deployed with 1K Tokens per minute (TPM) capacity. This is not enough for the workshop. You will need to bump up the capacity to 20K Tokens per minute. You can do this by going to Azure Portal -> Resource Groups -> Select the resource group you created in step 3 of the previous section -> Select the Open AI resource -> Overview -> Click Go to Azure OpenAI Studio -> Deployments -> Select the deployment for gpt-35-turbo model -> Click Edit Deployment -> Advanced Options -> Slide the TPM slider to 20K -> Click Save and close.
   
   Repeat the same steps for the deployment for text-embedding-ada-002 model.

### Task 2: Configure miyagi app

2. Open **Visual Studio Code** from your desktop by double-clicking on it.

   ![](./Media/vs.png)

 
1. In **Visual Studio Code** from menu bar select **File(1)>open folder(2)**.

   ![](./Media/image-rg-02.png)

1. Within **File Explorer**, navigate to C:\LabFiles\miyagi select **miyagi**(1) click on **Select folder(2)**

   ![](./Media/image-rg(003).png)

1. In **Visual Studio Code**, click on **Yes, I trust the authors** when **Do you trust the authors of the files in this folder?** window prompted.

   ![](./Media/image-rg-18.png)
   
1. Expand **miyagi>ui** directory and verify that **.env.** file is present. 
1. Create a new file named appsettings.json in miyagi/services/recommendation-service/dotnet
1. Copy paste the contents of appsettings.json.example into appsettings.json and save the file
1. Update appsettings.json with the values for the variables below. You can get the values from the Azure Portal.

1. To obtain the deployment model names for "deploymentOrModelId" and "embeddingDeploymentOrModelId" follow the below steps:
   
      - In Azure Portal, click on **Resource groups** from the Navigate panel.

      - From the Resource groups page, click on the resource group you created in the previous task.

         ![](./Media/image-rg-1.png)

      - Click Overview and select Open AI Service from the resources list.

        ![](./Media/image-rg-2.png)

      - From the OpenAI Overview page, right-click on Go to Azure OpenAI Studio button and click on Open link a new tab.

         ![](./Media/image-rg-03.png) 
   
      - In the Azure AI Studio, select Deployments, under Management section.
        ![](./Media/image-rg-6.png)

      - On the Deployments blade of Azure AI Studio, click on gpt-35-turbo model model name  and Copy full deployment name of **gpt-35-turbo model** and enter copied deployment name into 
        **"deploymentOrModelId"** in appsettings.json by navigating back to visual studio code.
          ![](./Media/image-rg-7.png)
        
          ![](./Media/image-rg-8.png)

          >**Note**: Kindly record deployment name of gpt-35-turbo model values in Notepad you need this values in further tasks.
      
      -  Navigate back to deployment page

      - On the Deployments blade of Azure AI Studio, click on **text-embedding-ada-002 model name** and Copy full deployment name of **text-embedding-ada-002 model** and enter copied deployment name into 
        **"embeddingDeploymentOrModelId"** in appsettings.json by navigating back to visual studio code.   

         ![](./Media/image-rg-10.png)

         ![](./Media/image-rg-11.png)

      >**Note**: Kindly record the text-embedding-ada-002 model name in notepad you need these values in further tasks.

1. To obtain the values for **endpoint** and **apiKey** follow the below steps:
   
   -  Go back to your Open AI Service and under **Resource Management** section select **Keys and Endpoint**, copy the **KEY1** and **Endpoint** values in notepad and get back to appsettings.json file in Visual Studi Code and paste **Key1** into **apikey**, and **Endpoint** into **endpoint**.

      ![](./Media/image-rg-3.png)

       >**Note**: Kindly record the **KEY1** and **Endpoint** values in notepad you need this values further tasks.

2. To obtain the values for  "azureCognitiveSearchEndpoint", "azureCognitiveSearchApiKey", follow below steps:
   
   1. Navigate back to your resource group.

   2. Select Search Service from resources list.
   
      ![](./Media/image-rg-12.png)
 
   3. From the Overview blade copy the URL and get back to Visual studio code and paste URL to **azureCognitiveSearchEndpoint**
   
      ![](./Media/image-rg-13.png)

      >**Note**: Please record **URL** and paste in notepad you need this values in further tasks.

   4. Click on Settings > Keys and copy **Primary admin Key** value and paste it into **azureCognitiveSearchApiKey** 
      in visual studio code
   
      ![](./Media/image-rg-14.png)

       >**Note**: Please record **Key** values in notepad you need this values in further tasks.

3. To obtain the values for "cosmosDbUri" and "cosmosDbName," please follow the steps below:

   1. Navigative back to your resource group and select Azure Cosmos DB account from resources list.
      ![](./Media/image-rg-15.png)

   2. Copy the URI from the Overview blade and paste it into **cosmosDbUri** in appsettings.json file in visual studio code. 
      ![](./Media/image-rg-16.png)

      >**Note**: Please record **URI** in notepad you need this values in further tasks.

   3. Click on **Settings** > **Keys** and Copy the value of the **Cosmos DB Primary Connection String** and paste it into **CosmosDbConnectionString** in appsettings.json file in visual studio code.
      ![](./Media/cs.png)

       >**Note**: Please record **Cosmos DB Primary Connection String** in notepad you need this values in further tasks.

  
4. For "blobServiceUri", replace Your **blobServiceUri** with https://[yourstorageaccountname].blob.core.windows.net/

5. Leave default settings for "cosmosDbName": "miyagi","cosmosDbContainerName": "recommendations", "collectionName": "miyagi-embeddings","logLevel": "Trace"
6. Set the value of **bingApiKey** to **none**
7. After updating the values save the file by pressing **CTRL + S**.
   
8. Create a new file named .env in miyagi/sandbox/usecases/rag/dotnet
9.  Copy paste the contents of rag/.env.local.example into .env and save the file
10. Update the values which you recorded in previous steps into .env file and save the file

   >**Note**: Please refer the below image to know how to update the values in .env files.

   ![](./Media/image-rg-24.png)

### Task 3: Understanding implementation of the recommendation service

Recommendation service implements RAG pattern using Semantic Kernel SDK. The details of the implementation are captured in the Jupyter notebook in the folder miyagi/sandbox/usecases/rag/dotnet. You can open the notebook in VSCode and run the cells to understand step by step details of how the Recommendation Service is implemented. Pay special attention to how RAG pattern is implemented using Semantic Kernel. Select kernel as .NET Interactive in the top right corner of the notebook.

1. In Visual Studio Code navigate to **miyagi/sandbox/usecases/rag/dotnet** folder and select **Getting-started.ipynb**

   ![](./Media/image-rg-23.png)

1. Execute the notebook cell by cell (using either Ctrl + Enter to stay on the same cell or Shift + Enter to advance to the next cell) and observe the results of each cell execution.
   
      **Note:** Please make sure that you are not running all the cells together as it can lead to exceeding the Azure OpenAI TPM limit and you may face an issue with 503 Service unreachable. You will need to wait for few minutes before running the cells again to fix the 503 issue.

   ![](./Media/run.png)

 1. Once after Excuting all the cell you need see the output as shown in below diagram.

    ![](./Media/output.png)
   
### Task 4: Run recommendation service locally

1. Open a new terminal: by navigating **miyagi/services/recommendation-service/dotnet** and right-click on in cascading menu select **Open in intergate Terminal**.

    ![](./Media/task4-1.png)

1. Run the following command to run the recommendation service locally
    ```
     dotnet build
     dotnet run
    ```

   **Note**: Let the command run, meanwhile you can proceed with the next step.

1. Open another tab in Edge, in the browser window paste the following link

   ```
     http://localhost:5224/swagger/index.html 
   ```

   **Note**: Refresh the page continuously until you get the swagger page for the recommendation service as depicted in the image below.

   ![](./Media/miyagi2.png)


### Task 5: Run miyagi frontend locally

1. Open a new terminal: by navigating  **miyagi/ui** and right-click on **ui/typescript** , in cascading menu select **Open in intergate Terminal**.

   ![](./Media/image-rg-25.png)

1. Run the following command to install the dependencies
   
    ```
     npm install --global yarn
     yarn install
     yarn dev
    ```

   **Note**: Let the command run, meanwhile you can proceed with the next step.

1. Open another tab in Edge, and  browse the following

   ```
     http://localhost:4001
   ```

   **Note**: Refresh the page continuously until you get miyagi app running locally as depicted in the image below.
                       
   ![](./Media/miyagi1.png)
   
### Task 6: Persist embeddings in Azure Cognitive Search

1. Navigate back to the **swagger UI** page, scoll to **Memory** session, click on **POST /dataset** for expansion, and click on **Try it out**.

   ![](./Media/swaggerUI-memory.png)

1. Replace the code with the below code, and click on **Execution**.
   
     >**Note:** Please make sure that you are not clicking multiple times on the Execute button as it can lead to exceeding the Azure OpenAI TPM limit and you may face an issue with 503 Service unreachable. You will need to wait for a few minutes before executing it again to fix the 503 issue.
   
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

      ![](./Media/swaggerUI-Execution.png)
      
1. In the **swagger UI** page, Scroll down to the **Responses** session review that it has been executed successfully by checking the code status is **200**.

    ![](./Media/swaggerUI-Responses.png)

1. Navigate back to the **Azure portal** tab, search and select **Cognitive Search**.

    ![](./Media/cognitive-search.png)    

1. In **Azure AI services | Cognitive search** tab, select **acs-<inject key="DeploymentID" enableCopy="false"/>**.

1. In **acs-<inject key="DeploymentID" enableCopy="false"/>** Search service tab, click on **Indexes** **(1)** under Search management, and review the **miyagi-embeddings** **(2)** has been created.   

    ![](./Media/search-service.png)

    > **Note**: Please click on the refresh button still you view the **Document Count**.

### Task 7: Explore the recommendation service

1. Navigate back to the **recommendation service** ui page, and click on **personalize** button.

    ![](./Media/service-personalize.png)

1. In the **personalize** page, select your **financial advisor** from the drop-down, and click on **Personalize**.

   ![](./Media/financial-advisor.png)  

1. You should see the recommendations from the recommendation service in the Top Stocks widget.

   ![](./Media/financial-advisor-output.png) 
