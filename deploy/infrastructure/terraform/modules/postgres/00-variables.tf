variable "base_name" {
  type = string
}

variable "resource_group" {
    type = object({
        id = string
        location = string
        name = string
    })
}
variable "virtual_network" {
  type = object({
    id = string
  })
}
variable "subnet_id" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "admin_password" {
  type = string
}

variable "private_dns_zone" {
  type = object({
    id = string
    name = string
  })
}

variable "myip" {
  type = string
}

variable "vnet_range" {
  type = object({
    first = string
    last = string
  })
}