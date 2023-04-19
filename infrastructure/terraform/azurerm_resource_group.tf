resource "azurerm_resource_group" "default" {
  name = local.base_name
  location = var.location
}