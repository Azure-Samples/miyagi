variable "resource_group" {
    type = object({
        id = string
        location = string
        name = string
    })
}

variable "aks_subnet_id" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "myip" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "public_key" {
  type = string
}
