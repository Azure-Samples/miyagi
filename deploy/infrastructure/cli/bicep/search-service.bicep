
param location string = resourceGroup().location
param searchServiceName string


param sku object = {
  name: 'standard'
}

resource searchService 'Microsoft.Search/searchServices@2021-04-01-Preview' = {
  name: searchServiceName
  location: location
 
  properties: {
    semanticSearch: 'free'
  }
  sku:sku
  
}

