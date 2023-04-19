variable "suffix" {
  type = string
  default = ""
}

variable "admin_username" {
  type = string
  default = "gbbadmin"
}

variable "admin_password" {
  type = string
  default = ""
}

variable "ssh_public_key_path" {
  type = string
  default = "~/.ssh/id_rsa.pub"
}

variable "location" {
  type = string
  default = "eastus"
}