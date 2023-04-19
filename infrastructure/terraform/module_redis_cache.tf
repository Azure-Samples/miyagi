module "redis" {
    source = "./modules/redis_cache"

    count = 1

    base_name = "${local.base_name}-${count.index}-redis"
    resource_group = azurerm_resource_group.default
    virtual_network = azurerm_virtual_network.default
    subnet_id = azurerm_subnet.redis.id
    admin_username = local.admin_username
    admin_password = local.admin_password
    private_dns_zone = azurerm_private_dns_zone.redis
    vnet_range = {
        "first" = cidrhost(azurerm_virtual_network.default.address_space[0], 1)
        "last" = cidrhost(azurerm_virtual_network.default.address_space[0], 65024)
    }
}


resource "azurerm_private_dns_a_record" "redis" {
    count = length(module.redis)

    name                = "${module.redis[count.index].base_name}"
    zone_name           = azurerm_private_dns_zone.redis.name
    resource_group_name = azurerm_resource_group.default.name
    ttl                 = 30
    records             = [module.redis[count.index].private_ip_address]
}
