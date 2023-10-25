param (
    [string]$resourceGroupPrefix = "miyagi1",
    [string]$location = "eastus",
    [string]$resourceGroupCount = 1,
    [Parameter(Mandatory = $true)]
    [string]$subscriptionId
)

# print variables

Write-Host "resourceGroupPrefix: $resourceGroupPrefix"
Write-Host "location: $location"
Write-Host "resourceGroupCount: $resourceGroupCount"
Write-Host "subscriptionId: $subscriptionId"

# set rgIndex to resourceGroupCount

$rgIndex = $resourceGroupCount

# set all these to false the first time you run this script. After that you can set them to true to skip creating resources that already exist
$skipRg = $false
$skipOpenAI = $false
$skipEmbeddingModelDeployment = $false
$skipCompletionModelDeployment = $false
$skipcognitiveSearch = $false
$skipCosmosDB = $false
$skipBlobStorage = $false
$skipAzureContainerApps = $false
$skipAzureContainerRegistry = $false
$skipAPIM = $false

# strip - from resourceGroupPrefix

$resourceGroupPrefix = $resourceGroupPrefix.Replace("-","");

# create resource groups in a loop for rgIndex
# if skipRg is true, skip creating resource group

if ($skipRg) {
    Write-Host "Skipping resource group creation"
}
else {

    for ($i = 1; $i -le $rgIndex; $i++) {
        Write-Host "Creating resource group $resourceGroupPrefix-rg-$i in $location"
        az group create --name "$resourceGroupPrefix-rg-$i" --location $location
    }
}
   
# create Azure Open AI service resource for each resource group

for ($i = 1; $i -le $rgIndex; $i++) {
    # if skipRg is true, skip creating resource group
    if ($skipOpenAI -eq "true") {
        Write-Host "Skipping OpenAI resource creation"
    }
    else {
        Write-Host "Creating Azure Open AI service resource named $resourceGroupPrefix-OpenAIService-$i in $resourceGroupPrefix-rg-$i"
    
        az cognitiveservices account create `
            --name "$resourceGroupPrefix-OpenAIService-$i" `
            --resource-group "$resourceGroupPrefix-rg-$i" `
            --location $location `
            --kind "OpenAI" `
            --sku "s0" `
            --subscription $subscriptionId 
    }
    
    # if skipEmbeddingModelDeployment is true, skip embedding model deployment

    if ($skipEmbeddingModelDeployment -eq "true") {
        Write-Host "Skipping embedding model deployment"
    }
    else {
        # deploy embedding model

        Write-Host "Deploying embedding model $resourceGroupPrefix-EmbeddingModel-$i"

        az cognitiveservices account deployment create `
            --name "$resourceGroupPrefix-OpenAIService-$i" `
            --resource-group  "$resourceGroupPrefix-rg-$i" `
            --deployment-name "$resourceGroupPrefix-EmbeddingModel-$i" `
            --model-name text-embedding-ada-002 `
            --model-version "2"  `
            --model-format "OpenAI" `
            --scale-capacity "20" `
            --capacity "20"
    
    }
    
    # if skipCompletionModelDeployment is true, skip completion model deployment

    if ($skipCompletionModelDeployment) {
        Write-Host "Skipping completion model deployment"
    }
    else {
        # deploy completion model

        Write-Host "Deploying completion model $resourceGroupPrefix-CompletionModel-$i"

        az cognitiveservices account deployment create `
            --name "$resourceGroupPrefix-OpenAIService-$i" `
            --resource-group  "$resourceGroupPrefix-rg-$i" `
            --deployment-name "$resourceGroupPrefix-CompletionModel-$i" `
            --model-name "gpt-35-turbo" `
            --model-version "0613"  `
            --model-format "OpenAI" `
            --capacity "30"
      
    }

    # if skipCosmosDB is false, create CosmosDB account called miyagi with a container called recommendations

    if ($skipCosmosDB) {
        Write-Host "Skipping CosmosDB account creation"
    }
    else {
        Write-Host "Creating CosmosDB account $resourceGroupPrefix-cosmos-$i in $resourceGroupPrefix-rg-$i"
        
        az cosmosdb create `
            --name "$resourceGroupPrefix-cosmos-$i" `
            --resource-group "$resourceGroupPrefix-rg-$i" `
            --kind "GlobalDocumentDB" `
            --subscription $subscriptionId

        Write-Host "Creating CosmosDB database $resourceGroupPrefix-cosmos-$i in $resourceGroupPrefix-rg-$i"
        
        az cosmosdb sql database create `
            --account-name "$resourceGroupPrefix-cosmos-$i" `
            --name "miyagi" `
            --resource-group "$resourceGroupPrefix-rg-$i" `
            --subscription $subscriptionId

        Write-Host "Creating CosmosDB container $resourceGroupPrefix-cosmos-$i in $resourceGroupPrefix-rg-$i"
        
        az cosmosdb sql container create `
            --account-name "$resourceGroupPrefix-cosmos-$i" `
            --database-name "miyagi" `
            --name "recommendations" `
            --partition-key-path "/partitionKey" `
            --resource-group "$resourceGroupPrefix-rg-$i" `
            --subscription $subscriptionId
    }

    # if skipBlobStorage is false, create blob storage account with a container called miyagi

    if ($skipBlobStorage) {
        Write-Host "Skipping blob storage account creation"
    }
    else {
        
        $storageaccount = -join($resourceGroupPrefix,"blobstorge",$i)
        Write-Host "Creating blob storage account $storageaccount in $resourceGroupPrefix-rg-$i"
        
        az storage account create `
            --name $storageaccount `
            --resource-group "$resourceGroupPrefix-rg-$i" `
            --location $location `
            --sku "Standard_LRS" `
            --subscription $subscriptionId

        Write-Host "Creating blob storage container miyagi in $resourceGroupPrefix-rg-$i"
        
        az storage container create `
            --name "miyagi" `
            --account-name $storageaccount `
            --subscription $subscriptionId
    }

    # if skipAzureContainerRegistry is false, create Azure Container Registry called miyagi

    if ($skipAzureContainerRegistry) {
        Write-Host "Skipping Azure Container Registry creation"
    }
    else {
        
        $containerregistry = -join($resourceGroupPrefix,"acr",$i)
        Write-Host "Creating Azure Container Registry $containerregistry in $resourceGroupPrefix-rg-$i"
        
        az acr create `
            --name $containerregistry `
            --resource-group "$resourceGroupPrefix-rg-$i" `
            --location $location `
            --sku "Basic" `
            --subscription $subscriptionId
    }

    # if skipAzureContainerApps is false, create Azure Container Apps with a container called miyagi

    if ($skipAzureContainerApps -eq "true") {
        Write-Host "Skipping Azure Container App creation"
    }
    else {
        
        $containerapp = -join($resourceGroupPrefix,"miyagi",$i)
        Write-Host "Creating Azure Container Apps $containerapp in $resourceGroupPrefix-rg-$i"

        az containerapp up --name $containerapp  `
        --resource-group "$resourceGroupPrefix-rg-$i" `
        --location centralus `
        --environment "$resourceGroupPrefix-env" `
        --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest `
        --target-port 80 `
        --ingress external `
        --query properties.configuration.ingress.fqdn `


        
        
    }

    # if skipcognitiveSearch is false, create cognitive search service with semantic search capability

    if ($skipcognitiveSearch) {
        Write-Host "Skipping cognitive search service creation"
    }
    else {
        
        Write-Host "Creating cognitive search service $resourceGroupPrefix-acs-$i in $resourceGroupPrefix-rg-$i"
        
        az deployment group create `
        --resource-group "$resourceGroupPrefix-rg-$i" `
        --template-file "bicep/search-service.bicep" `
        --parameters "searchServiceName=$resourceGroupPrefix-acs-$i"
            
    }
}




