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

variable "sku" {
  type = string
  default = "Standard"
}

variable "capacity" {
  type = number
  default = 1
}

variable "hubs" {
  type = list(object ({
    partition_count = optional(number, 2)
    message_retention = optiona(number, 1)
  }))
}