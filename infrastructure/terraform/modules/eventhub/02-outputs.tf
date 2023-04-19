output "connection_strings" {
  value = [
    azurerm_eventhub_namespace.default.default_primary_connection_string,
    azurerm_eventhub_namespace.default.default_secondary_connection_string
  ]
}