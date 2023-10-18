param (
    [string]$resourceGroupPrefix = "myagi-1",
    [string]$location = "eastus",
    [string]$resourceGroupCount = 1,
    [string]$subscriptionId = "SubscriptionId is required"
)

# print variables

Write-Host "resourceGroupPrefix: $resourceGroupPrefix"
Write-Host "location: $location"
Write-Host "resourceGroupCount: $resourceGroupCount"
Write-Host "subscriptionId: $subscriptionId"

# set rgIndex to resourceGroupCount

$rgIndex = $resourceGroupCount

# set all these to false the first time you run this script. After that you can set them to true to skip creating resources that already exist
$skipRg = "false"
$skipOpenAI = "false"
$skipEmbeddingModelDeployment = "false"
$skipCompletionModelDeployment = "false"
$skipcognitiveSearch = "false"



# create resource groups in a loop for rgIndex
# if skipRg is true, skip creating resource group

if ($skipRg -eq "true") {
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
    
    }
    
    # if skipCompletionModelDeployment is true, skip completion model deployment

    if ($skipCompletionModelDeployment -eq "true") {
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
      
    }

    # if skipcognitiveSearch is false, create cognitive search service with semantic search capability

    if ($skipcognitiveSearch -eq "true") {
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




