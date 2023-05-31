module "aks" {
  source = "./modules/aks/public"

  count = 1

  resource_group = azurerm_resource_group.default
  subnet_id = azurerm_subnet.aks.id
  base_name = "${local.base_name}-${count.index}-cluster"
  myip = local.myip
  admin_username = var.admin_username
  public_key = azurerm_ssh_public_key.default.public_key
}