resource "azurerm_private_dns_a_record" "default" {
    name                = var.base_name
    zone_name           = var.private_dns_zone.name
    resource_group_name = var.resource_group.name
    ttl                 = 30
    records             = [azurerm_private_endpoint.default.private_service_connection[0].private_ip_address]
}
