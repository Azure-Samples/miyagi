
resource "azurerm_private_dns_zone_virtual_network_link" "default" {
  name                  = local.server_name
  private_dns_zone_name = var.private_dns_zone.name
  virtual_network_id    = var.virtual_network.id
  resource_group_name   = var.resource_group.name
}

resource "azurerm_postgresql_flexible_server" "default" {
  name                   = local.server_name
  resource_group_name    = var.resource_group.name
  location               = var.resource_group.location
  version                = "12"
  delegated_subnet_id    = var.subnet_id
  private_dns_zone_id    = var.private_dns_zone.id
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  zone                   = "1"

  storage_mb = 32768

  sku_name   = "GP_Standard_D4s_v3"
  depends_on = [azurerm_private_dns_zone_virtual_network_link.default]
}