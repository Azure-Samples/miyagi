module "keyvault" {
  source = "./modules/keyvault"

  count = 1

  tenant_id         = data.azurerm_client_config.current.tenant_id
  base_name         = "${local.base_name}-${count.index}"
  resource_group    = azurerm_resource_group.default
  
  admin_objects_ids = [
    data.azurerm_client_config.current.object_id
  ]
}