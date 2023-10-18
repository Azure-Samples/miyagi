# CLI scripts for creating the Azure resources needed for the workshop

## Synopsis
This folder contains a PowerShell script that will create the Azure resources needed for the workshop. The script will create a resource group for each of the workshop participants, and will create the required resources in each resource group. You will need to provide a subscription id, and optionally a resource group prefix, location, and the number of resource groups you want. The script will default to the values below if not provided.
resourceGroupPrefix = "myagi-1-rg-"
location = "eastus"
resourceGroupCount = 1


## Steps
1. Install Azure CLI (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), min version 2.53.0
2. Install PowerShell (https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.1)
3. Change folder to `infrastructure/cli`
4. Run
   ```
   ./deploy.ps1  -resourceGroupPrefix "<myagi-3-rg->" -location "<eastus>" -resourceGroupCount "<1>" -subscriptionId "<your subscription id>"
   ```
   Note: Only subscriptionId is required, the rest are optional and will default to the values above if not provided.

