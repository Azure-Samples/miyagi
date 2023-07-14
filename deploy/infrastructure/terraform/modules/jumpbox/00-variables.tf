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

variable "subnet_id" {
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