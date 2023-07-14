module "file_share" {
    source = "./modules/azure_file_share"
    
    count = 1

    account_name = "${local.base_name}-${count.index}"
    resource_group = azurerm_resource_group.default
}
