resource "azurerm_redis_firewall_rule" "default" {
  name                = "defaultPoolRange"
  redis_cache_name    = azurerm_redis_cache.default.name
  resource_group_name = var.resource_group.name
  start_ip            = var.vnet_range.first
  end_ip              = var.vnet_range.last
}