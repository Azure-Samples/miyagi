resource "azurerm_eventhub_namespace" "default" {
  name                = "${var.base_name}-EventHubNamespace-${each.key}"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  sku                 = var.sku
  capacity            = var.capacity
}

resource "azurerm_eventhub" "default" {
  for_each = var.hubs

  name                = "${var.base_name}-EventHub-${each.key}"
  namespace_name      = azurerm_eventhub_namespace.default.name
  resource_group_name = azurerm_eventhub_namespace.default.resource_group.name
  partition_count     = each.value.partition_count
  message_retention   = each.value.message_retention
}