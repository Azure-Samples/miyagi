# Infrastructure Lab Prerequsites

## Environment
For these labs we'll be running in a linux environment (Generally Ubuntu).  We have created and will maintain a GitHub codespaces configuration to ensure that the required software is included and to ensure we pin the correct tool version to the lab in a controllable setup.  For a list of required tools please see the [Required Software](#required-software) section.

While our documentation assumes Ubuntu as the linux disrto, you are free to use any environment (including PowerShell) so long as you can run the [required software](#required-software) below, and understand that you'll need to substitute certain commands.

## Required Software
- [jq](https://jqlang.github.io/jq/)
- [terraform](https://terraform.io)
- [azure cli](https://aka.ms/azure-cli)
- [kubectl](https://github.com/kubernetes/kubectl)
- [helm](https://helm.sh)
- [kustomize](https://kustomize.io/) (Generally included with kubectl as a subcommand)

## Required Azure Services
Below are a list of Azure Services that are required to run this demo environment.  Please ensure that you have these services registered and enabled for your subscription.

- [Azure Kubernetes Service](https://learn.microsoft.com/en-us/azure/aks/) (AKS)
- CosmosDB
- Event Hub (EH)
- Azure File Share
- Azure Databases for Postgres
- Azure Cache for Redis
- Azure App Service
- Azure Container Aps (ACA)