# Cluster Identity
resource "azurerm_user_assigned_identity" "cluster-identity" {
  name                = "cluster-identity"
  resource_group_name = azurerm_resource_group.default.name
  location            = azurerm_resource_group.default.location
}

# Needed for cluster identity to create resource in the same RG as Cluster (e.g. LBs, VMs etc)
resource "azurerm_role_assignment" "cluster-resource-group-contrib" {
  scope                = azurerm_resource_group.default.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.cluster-identity.principal_id
}

# Needed for cluster identity to assign kubelet with some default permissions
resource "azurerm_role_assignment" "cluster-kublet-identity-operator" {
  scope                = azurerm_user_assigned_identity.kubelet-identity.id
  role_definition_name = "Managed Identity Operator"
  principal_id         = azurerm_user_assigned_identity.cluster-identity.principal_id
}

# Needed for multiple reasons
resource "azurerm_role_assignment" "cluster-network-contrib" {  	
	scope                = azurerm_subnet.aks.id
	role_definition_name = "Network Contributor"
	principal_id         = azurerm_user_assigned_identity.cluster-identity.principal_id
}