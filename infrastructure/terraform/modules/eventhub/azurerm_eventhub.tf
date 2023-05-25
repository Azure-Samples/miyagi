resource "azurerm_eventhub_namespace" "default" {
  name                = "${var.base_name}-EventHubNamespace"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  sku                 = var.sku
  capacity            = var.capacity
}

resource "azurerm_eventhub" "default" {
  count = length(var.hubs)

  name                = "${var.base_name}-EventHub-${count.index}"
  namespace_name      = azurerm_eventhub_namespace.default.name
  resource_group_name = var.resource_group.name
  partition_count = var.hubs[count.index].partition_count
  message_retention = var.hubs[count.index].message_retention
}