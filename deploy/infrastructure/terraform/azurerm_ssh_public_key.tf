resource "azurerm_ssh_public_key" "default" {
  name                = "default"
  resource_group_name = azurerm_resource_group.default.name
  location            = azurerm_resource_group.default.location
  public_key          = local.public_key
}