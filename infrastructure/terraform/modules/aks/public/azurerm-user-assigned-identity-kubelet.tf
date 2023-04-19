
## Kubelet
resource "azurerm_user_assigned_identity" "kubelet-identity" {
  name                = "kubelet-identity"
  resource_group_name = var.resource_group.name
  location            = var.resource_group.location
}