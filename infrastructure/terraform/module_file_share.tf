module "file_share" {
    source = "./modules/azure_file_share"

    account_name = "${local.base_name}-0"
    resource_group = azurerm_resource_group.default
}