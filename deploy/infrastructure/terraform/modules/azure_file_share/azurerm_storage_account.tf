resource "azurerm_storage_account" "default" {
  name                     = "${local.account_name}sa"
  resource_group_name      = var.resource_group.name
  location                 = var.resource_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_share" "default" {
  name                 = "${local.account_name}fs"
  storage_account_name = azurerm_storage_account.default.name
  quota                = var.share_size
}