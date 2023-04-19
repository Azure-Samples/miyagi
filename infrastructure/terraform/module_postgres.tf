module "postgres" {
    source = "./modules/postgres"

    base_name = local.base_name
    resource_group = azurerm_resource_group.default
    subnet_id = azurerm_subnet.postgres.id
    admin_username = local.admin_username
    admin_password = local.admin_password
    private_dns_zone = azurerm_private_dns_zone.postgres
    myip = local.myip
    virtual_network = azurerm_virtual_network.default
    vnet_range = {
        "first" = cidrhost(azurerm_virtual_network.default.address_space[0], 1)
        "last" = cidrhost(azurerm_virtual_network.default.address_space[0], 65024)
    }
}