@description('Name of the event hub namespace to be created. Must be globally unique.')
param eventHubNamespaceName string

@description('Name of the event hub to be created.')
param eventHubName string

@description('Location for the resource.')
param location string

resource eventHubNamespace 'Microsoft.EventHub/namespaces@2023-01-01-preview' = {
  name: eventHubNamespaceName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 1
  }
  properties: {
    minimumTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
    zoneRedundant: true
    isAutoInflateEnabled: false
  }
}

resource eventHubForAPIM 'Microsoft.EventHub/namespaces/eventhubs@2023-01-01-preview' = {
  parent: eventHubNamespace
  name: eventHubName
  properties: {
    retentionDescription: {
      cleanupPolicy: 'Delete'
      retentionTimeInHours: 1
    }
    messageRetentionInDays: 1
    partitionCount: 2
    status: 'Active'
  }
}

resource eventHubForAPIMDiagnosticSettings 'Microsoft.EventHub/namespaces/eventhubs@2023-01-01-preview' = {
  parent: eventHubNamespace
  name: 'insights-metrics-pt1m'
  properties: {
    retentionDescription: {
      cleanupPolicy: 'Delete'
      retentionTimeInHours: 1
    }
    messageRetentionInDays: 1
    partitionCount: 2
    status: 'Active'
  }
}

resource eventHubForAPIMAuthorizationRule 'Microsoft.EventHub/namespaces/eventhubs/authorizationRules@2022-10-01-preview' = {
  name: 'apimLoggerAccessPolicy'
  parent: eventHubForAPIM
  properties: {
    rights: [
      'Send'
    ]
  }
}

output eventHubForAPIMAuthorizationRuleName string = eventHubForAPIMAuthorizationRule.name
