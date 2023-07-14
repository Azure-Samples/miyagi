resource "azurerm_redis_cache" "default" {
  name                = "${var.base_name}-redis"
  location            = var.resource_group.location
  resource_group_name = var.resource_group.name
  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  redis_configuration {
  }
}