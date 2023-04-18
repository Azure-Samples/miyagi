resource "azurerm_resource_group" "default" {
  name = "miyagi-${local.prefix}"
  location = var.location
}