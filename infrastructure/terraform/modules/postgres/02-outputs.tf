output "admin" {
  value = {
    username = azurerm_postgresql_flexible_server.default.administrator_login
    password = azurerm_postgresql_flexible_server.default.administrator_password
  }
}