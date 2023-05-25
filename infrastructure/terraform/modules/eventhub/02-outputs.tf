output "name" {
  value = {
    for index, hub in azurerm_eventhub.default : index => hub.name
  }
}

output "resource_group" {
  value = azurerm_eventhub_namespace.default.resource_group_name
}

output "connection_strings" {
  value = [
    azurerm_eventhub_namespace.default.default_primary_connection_string,
    azurerm_eventhub_namespace.default.default_secondary_connection_string
  ]
}

output "hubs" {
  value = azurerm_eventhub.default
}