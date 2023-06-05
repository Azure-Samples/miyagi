# Provisioning Azure Services

In this section we'll go through the steps needed to provision/deploy the necessary Azure services to run our demo environment.  In this version we'll be using [Terraform](https://terraform.io) to streamline this experience.  This lab is not meant to be an Azure services or landing zone hands on lab, but rather showing how to deploy and use apps and services to create intelligent apps.  Your networking, security and other requirements may differ from what your organization will require for a production envirnonment.

## Deploying the enviroment

1. Log in to Azure CLI

    Assuming your organization or demo environment does not enforce any Multi Factor Authentication or Device security policies you can run the following command:

    ```bash
    # log in to Azure with your user account
    az login
    ```

2. [**OPTIONAL**] Create an SSH key (if you do not already have one)

    ```bash
    # If your system does not have an SSH Key Pair then you will need to generate one
    # Create an ssh key for use later - this will create a key in your users home directory
    ssh-keygen
    ```

3. Run Terraform - this process may take 15-20 minutes

    ```bash
    # Change directory to Terraform from the repo root
    cd infrastructure/terraform

    # Initialize and setup required plguins/providers/modules for the project
    terraform init

    # Plan a deployment - this will define what services will be deployed into your environment
    terraform plan -out tfplan

    # Apply the plan
    terraform apply tfplan
    ```

## Next Steps

[Install Kubernetes Dependent Services](./010-kubernetes-dependent-services.md)