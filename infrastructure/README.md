# Project Miyagi Infrastructure

This sub directory of "Project Miyagi" is designed to deploy the underlying Azure Infrastructure to run the demo services on.

There will be two Paths:
1. Terraform - Since many customers are using Hashicorp Terraform as their preferred declarative infrastructure as code/provisioning tool of choice 
2. Azure Bicep - Since Bicep is Microsoft's first party declarative tool for provisioning Azure Services

## Roadmap
The current version of the infrastructure and service provisioning is designed for a simplified deployment and does not include a what would be considered a secured/locked down networking baseline, nor does it take into account Role Based Access Controls beyond what's needed to bootstrap the environment successfully.

We will iteratively improve upon this and add secure best practices over time, but the immediate core value is to show the usage of OpenAI and other intelligent services.

## Requirements

### Terraform
Tested on:
- python 3.10.10
- az cli v2.47.0
- terraform v1.45.0
- terraform azurerm provider v3.35.0

```bash
# from repo root
cd infrastructure/terraform

# For Local Dev/Test as your user account
az login

# Terraform song/dance
terraform init
terraform plan -out tfplan
terraform apply tfplan
```

## Bicep

```bash

```
