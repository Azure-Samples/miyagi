output "cluster_name" {
  value = azurerm_kubernetes_cluster.default.name
}

output "resource_group" {
    value = {
        name = azurerm_kubernetes_cluster.default.resource_group_name
        location = azurerm_kubernetes_cluster.default.location
    }
}