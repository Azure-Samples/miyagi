resource "azurerm_eventhub_namespace" "default" {
  name                = "${var.base_name}-EventHubNamespace"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  sku                 = "Standard"
  capacity            = 1
}

resource "azurerm_eventhub" "default" {
  name                = "${var.base_name}-EventHub"
  namespace_name      = azurerm_eventhub_namespace.default.name
  resource_group_name = var.resource_group.name
  partition_count     = 2
  message_retention   = 1
}