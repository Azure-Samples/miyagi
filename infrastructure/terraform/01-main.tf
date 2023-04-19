terraform {
    required_version = ">= 1.4.5"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.35.0"
    }
  }
}

provider "azurerm" {
    features {
      resource_group {
        prevent_deletion_if_contains_resources = false
      }
    }
}


resource "random_password" "admin_password" {
  length  = 16
  min_upper   = 1
  min_lower   = 1
  min_numeric  = 1
  min_special = 1
}

resource "random_string" "suffix" {
	length  = 4
	special = false
	numeric 	= false
	upper 	= false
}

data "http" "myip" {
  url = "https://ipv4.icanhazip.com/"
}

locals {
  suffix = var.suffix !="" ? var.suffix : random_string.suffix.result
  base_name = "miyagi-${local.suffix}"

  admin_username = var.admin_username
  admin_password = var.admin_password !="" ? var.admin_password : random_password.admin_password.result
  public_key = file(var.ssh_public_key_path)

  address_space = "10.0.0.0/16"

  cluster_name = "${local.base_name}-cluster"

  myip = trimspace(data.http.myip.response_body)
}
