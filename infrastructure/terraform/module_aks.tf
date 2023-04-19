module "aks" {
  source = "./modules/aks/public"

  resource_group = azurerm_resource_group.default
  subnet_id = azurerm_subnet.aks.id
  cluster_name = local.cluster_name
  myip = local.myip
  admin_username = var.admin_username
  public_key = local.public_key
}