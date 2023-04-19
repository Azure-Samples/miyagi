output "admin_username" {
  value = azurerm_linux_virtual_machine.jumpbox.admin_username
}

output public_ip { 
    value = azurerm_public_ip.jumpbox.ip_address
}