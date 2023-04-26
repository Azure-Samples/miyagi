resource "azurerm_container_registry" "default" {
    name = replace(var.base_name, "-", "")
    resource_group_name = var.resource_group.name
    location = var.resource_group.location

    sku = "Premium"
    admin_enabled = false
}