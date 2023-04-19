module "jumpbox" {
  source = "./modules/jumpbox"

  base_name = local.base_name
  resource_group = azurerm_resource_group.default
  jumpbox_subnet_id = azurerm_subnet.jumpbox.id
  myip = local.myip
  admin_username = var.admin_username
  public_key = local.public_key
}