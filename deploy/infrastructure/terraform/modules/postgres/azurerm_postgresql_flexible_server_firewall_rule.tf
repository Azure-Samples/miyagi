
resource "azurerm_postgresql_flexible_server_firewall_rule" "default" {
  name             = "default-fw"
  server_id        = azurerm_postgresql_flexible_server.default.id
  start_ip_address = var.myip
  end_ip_address   = var.myip
}


resource "azurerm_postgresql_flexible_server_firewall_rule" "vnet" {
  name             = "vnet-fw"
  server_id        = azurerm_postgresql_flexible_server.default.id
  start_ip_address = var.vnet_range.first
  end_ip_address   = var.vnet_range.last
}

