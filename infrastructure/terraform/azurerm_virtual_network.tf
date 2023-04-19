resource "azurerm_virtual_network" "default" {
  name = "${local.base_name}-vnet"
  resource_group_name = azurerm_resource_group.default.name
  location = azurerm_resource_group.default.location
  address_space = [local.address_space]
}

resource "azurerm_subnet" "aks" {
  name = "AksSubnet"
  virtual_network_name = azurerm_virtual_network.default.name
  resource_group_name = azurerm_resource_group.default.name
  address_prefixes = [
    cidrsubnet(local.address_space, 8, 1)
  ]
}

resource "azurerm_subnet" "postgres" {
  name = "PostgresSubnet"
  virtual_network_name = azurerm_virtual_network.default.name
  resource_group_name = azurerm_resource_group.default.name
  address_prefixes = [
    cidrsubnet(local.address_space, 8, 2)
  ]

  service_endpoints = ["Microsoft.Storage"]

  delegation {
    name = "flexibleServer"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

resource "azurerm_subnet" "jumpbox" {
  name = "JumpboxSubnet"
  virtual_network_name = azurerm_virtual_network.default.name
  resource_group_name = azurerm_resource_group.default.name
  address_prefixes = [
    cidrsubnet(local.address_space, 8, 255)
  ]
}