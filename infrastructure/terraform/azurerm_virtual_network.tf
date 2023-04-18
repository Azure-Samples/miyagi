resource "azurerm_virtual_network" "default" {
  name = "miyagi-vnet"
  resource_group_name = azurerm_resource_group.default.name
  location = azurerm_resource_group.default.location
  address_space = [local.address_space]
}

resource "azurerm_subnet" "aks" {
  name = "AksSubnet"
  address_prefixes = [
    cidrsubnet(local.address_space, 8, 1)
  ]
}