module "jumpbox" {
  source = "./modules/jumpbox"

  count = 1

  base_name = "${local.base_name}-${count.index}"
  resource_group = azurerm_resource_group.default
  subnet_id = azurerm_subnet.jumpbox.id
  myip = local.myip
  admin_username = var.admin_username
  public_key = azurerm_ssh_public_key.default.public_key
}