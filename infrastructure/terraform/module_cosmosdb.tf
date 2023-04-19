module "cosmosdb" {
  source = "./modules/cosmosdb"

  base_name = local.base_name
  resource_group = azurerm_resource_group.default
}