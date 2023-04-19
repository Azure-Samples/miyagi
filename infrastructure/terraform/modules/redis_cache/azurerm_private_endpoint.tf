resource "azurerm_private_endpoint" "default" {
  name                = "${var.base_name}-endpoint"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  subnet_id           = var.subnet_id

  private_service_connection {
    name                           = "${var.base_name}-connection"
    private_connection_resource_id = azurerm_redis_cache.default.id
    is_manual_connection           = false
    subresource_names              = ["redisCache"] 
  }
}