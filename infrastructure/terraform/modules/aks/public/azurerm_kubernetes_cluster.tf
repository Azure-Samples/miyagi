resource azurerm_kubernetes_cluster default {
 	name                = var.cluster_name
	location            = var.resource_group.location
	resource_group_name = var.resource_group.name
	
	dns_prefix = var.cluster_name
	private_cluster_enabled = false
	
  api_server_access_profile {
    authorized_ip_ranges = [
        "${var.myip}/32"
    ]
  }

	default_node_pool {
		name                = "systemnp01"
		vm_size             = "Standard_D4s_v3"
    os_disk_type 			= "Ephemeral"
    os_disk_size_gb 		= "100"
		vnet_subnet_id      = var.aks_subnet_id
		node_count = 3
    only_critical_addons_enabled = true
	}

	identity {
		type = "UserAssigned"
		identity_ids = [
			azurerm_user_assigned_identity.cluster-identity.id
		]
	}

    kubelet_identity {
        client_id = azurerm_user_assigned_identity.kubelet-identity.client_id
        object_id = azurerm_user_assigned_identity.kubelet-identity.principal_id
        user_assigned_identity_id = azurerm_user_assigned_identity.kubelet-identity.id
    }

	linux_profile {
		admin_username = var.admin_username
		ssh_key {
			key_data = var.public_key
		}
	}

	network_profile {
		network_plugin     = "azure"
		network_policy     = "calico"
		load_balancer_sku  = "standard"
		service_cidr       = "192.168.0.0/24"
		dns_service_ip     = "192.168.0.10"
	}
}


resource "azurerm_kubernetes_cluster_node_pool" "np1" {
  name                  = "usernp01"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.default.id
  vm_size               = "Standard_D4s_v3"
  node_count            = 3
  os_disk_type 			= "Ephemeral"
  os_disk_size_gb 		= "100"
  vnet_subnet_id = var.aks_subnet_id
}