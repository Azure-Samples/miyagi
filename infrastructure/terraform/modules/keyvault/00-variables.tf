variable "base_name" {
  type = string
}

variable "tenant_id" {
  type = string
}

variable "resource_group" {
    type = object({
        id = string
        location = string
        name = string
    })
}

variable "enable_rbac_authorization" {
  type    = bool
  
  default = true
}

variable "sku_name" {
  type        = string
  default     = "standard"

  validation {
    condition     = contains(["standard", "premium"], var.sku_name)
    error_message = "Valid values for variable sku_name are standard and premium."
  } 
}

variable "admin_objects_ids" {
  type        = list(string)
  default     = []
}

variable "reader_objects_ids" {
  type        = list(string)
  default     = []
}