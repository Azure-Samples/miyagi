
## Kubelet
resource "azurerm_user_assigned_identity" "kubelet-identity" {
  name                = "kubelet-identity"
  resource_group_name = var.resource_group.name
  location            = var.resource_group.location
}

resource "azurerm_role_assignment" "acr" {
  principal_id                     = azurerm_user_assigned_identity.kubelet-identity.principal_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.default.id
}