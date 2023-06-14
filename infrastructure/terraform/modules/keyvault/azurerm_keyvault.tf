resource "azurerm_key_vault" "keyvault" {
  name                        = "${var.base_name}-KeyVault"
  location                    = var.resource_group.location
  resource_group_name         = var.resource_group.name
  tenant_id                   = var.tenant_id
  enable_rbac_authorization   = var.enable_rbac_authorization
  sku_name                    = var.sku_name
}

resource "azurerm_role_assignment" "rbac_keyvault_administrator" {
  for_each = toset(var.admin_objects_ids)

  scope                 = azurerm_key_vault.keyvault.id
  role_definition_name  = "Key Vault Administrator"
  principal_id          = each.value
}

resource "azurerm_role_assignment" "rbac_keyvault_reader" {
  for_each = toset(var.reader_objects_ids)

  scope                 = azurerm_key_vault.keyvault.id
  role_definition_name  = "Key Vault Reader"
  principal_id          = each.value
}