param location string = resourceGroup().location
param apiManagementName string
param eventHubNamespaceName string
param eventHubName string

module deployEventHub './modules/eventhub.bicep' = {
  name: 'EventHub'
  params: {
    eventHubNamespaceName: eventHubNamespaceName
    eventHubName: eventHubName
    location: location
  }
}

module deployAPIM './modules/apim.bicep' = {
  name: 'APIM'
  scope: resourceGroup()
  params: {
    apiManagementName: apiManagementName
    location: location
  }
  dependsOn:[
    deployEventHub
  ]
}
