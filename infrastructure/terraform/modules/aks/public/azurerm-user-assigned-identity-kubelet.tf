
## Kubelet
resource "azurerm_user_assigned_identity" "kubelet-identity" {
  name                = "kubelet-identity"
  resource_group_name = azurerm_resource_group.default.name
  location            = azurerm_resource_group.default.location
}

#### Needed for External-DNS
resource "azurerm_role_assignment" "kubelet-dns-contrib" {
  scope                = data.azurerm_dns_zone.example.id
  role_definition_name = "DNS Zone Contributor"
  principal_id         = azurerm_user_assigned_identity.kubelet-identity.principal_id
}

#### Needed kubelet ideneity to access ACR
resource "azurerm_role_assignment" "kubelet-acr-pull" {  	
	scope                = azurerm_container_registry.default.id
	role_definition_name = "AcrPull"
	principal_id         = azurerm_user_assigned_identity.kubelet-identity.principal_id
}