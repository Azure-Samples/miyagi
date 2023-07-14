variable "account_name" {
  type = string
}

variable "resource_group" {
    type = object({
        id = string
        location = string
        name = string
    })
}

variable "share_size" {
  type = number
  default = 50
}