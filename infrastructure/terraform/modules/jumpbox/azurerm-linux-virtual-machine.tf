resource "azurerm_public_ip" "jumpbox" {
  name                = "${local.vm_name}-pip"
  resource_group_name = var.resource_group.name
  location            = var.resource_group.location
  sku = "Standard"
  allocation_method   = "Static"
}

resource "azurerm_network_interface" "jumpbox" {
	name                = "${local.vm_name}-nic"
	location            = var.resource_group.location
	resource_group_name = var.resource_group.name

	enable_accelerated_networking = true
	
	ip_configuration {
		name                          = "primary"
		subnet_id                     = var.jumpbox_subnet_id
		private_ip_address_allocation = "Dynamic"
        public_ip_address_id = azurerm_public_ip.jumpbox.id
	}
}

resource "azurerm_network_security_group" "jumpbox" {
  
	name                = "${local.vm_name}-nsg"
  	location            = var.resource_group.location
  	resource_group_name = var.resource_group.name

  	security_rule {
		name                       = "AllowSSHInbound22"
		priority                   = 100
		direction                  = "Inbound"
		access                     = "Allow"
		protocol                   = "Tcp"
		source_port_range          = "*"
		destination_port_range     = "22"
		source_address_prefix      = "*"
		destination_address_prefix = "*"
	}

	security_rule {
		name                       = "AllowHttpInternetInbound"
		priority                   = 200
		direction                  = "Inbound"
		access                     = "Allow"
		protocol                   = "Tcp"
		source_port_range          = "*"
		destination_port_range     = "80"
		source_address_prefix      = "*"
		destination_address_prefix = "*"
	}

	security_rule {
		name                       = "AllowHttpsInternetInbound"
		priority                   = 201
		direction                  = "Inbound"
		access                     = "Allow"
		protocol                   = "Tcp"
		source_port_range          = "*"
		destination_port_range     = "443"
		source_address_prefix      = "*"
		destination_address_prefix = "*"
	}
}

resource "azurerm_network_interface_security_group_association" "jumpbox" {
	network_interface_id                 = azurerm_linux_virtual_machine.jumpbox.network_interface_ids[0]
	network_security_group_id 			 = azurerm_network_security_group.jumpbox.id
}

resource "azurerm_linux_virtual_machine" "jumpbox" {
	name                = "${local.vm_name}"
	resource_group_name = var.resource_group.name
	location            = var.resource_group.location
	size                = "Standard_D2s_v3"
	admin_username      = var.admin_username
	
	network_interface_ids = [
		azurerm_network_interface.jumpbox.id,
	]

	identity {
		type = "SystemAssigned"
	}

	admin_ssh_key {
		username   = var.admin_username
		public_key = var.public_key
	}

	os_disk {
		caching              	= "ReadOnly"
		storage_account_type 	= "Premium_LRS"
		disk_size_gb 			= "1024"
	}

	source_image_reference {
		publisher = "Canonical"
		offer     = "0001-com-ubuntu-server-focal"
		sku       = "20_04-lts-gen2"
		version   = "latest"
	}

	lifecycle {
		ignore_changes = [
			custom_data
		]
  }
}