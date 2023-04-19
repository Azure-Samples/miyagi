resource "azurerm_private_dns_zone" "postgres" {
  name                = "${local.base_name}.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.default.name
}

resource "azurerm_private_dns_zone" "redis" {
  name                = "privatelink.redis.cache.windows.net"
  resource_group_name = azurerm_resource_group.default.name
}
