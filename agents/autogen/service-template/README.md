# AutoGen Microservices Template for Azure

This template demonstrates how to set up a microservices architecture using FastAPI, Celery, and RabbitMQ for task queuing, Redis for the Celery backend, and Flower for monitoring Celery tasks. This setup is optimized for deployment on Azure services, leveraging Azure Container Apps.

## Prerequisites

- [Docker Compose](https://docs.docker.com/compose/install/) (for local testing)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for deploying services on Azure)
- [Azure Container Apps](https://docs.microsoft.com/en-us/azure/container-apps/quickstart-python) (for deploying the application)
- [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/) (for storing Docker images)
 

## Local Development and Testing

### Quick Start with Docker Compose

1. Run the following command to start RabbitMQ, Redis, Flower, and the application/worker instances:
   ```bash
   docker-compose up
   ```
## Run Example

1. Execute the command `docker-compose up` to start the RabbitMQ, Redis, Flower, and the application/worker instances. This will start the FastAPI web application, the Celery worker, and the Flower monitoring interface.
2. Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to access the FastAPI documentation and execute test API calls. This will allow you to interact with the API directly through an auto-generated and interactive UI.
3. To monitor the execution of Celery tasks, you can either check the console logs or visit the Flower monitoring interface at [http://localhost:5555](http://localhost:5555) using the credentials (`flower`/`for_local-dev_only`).

## Deploy to Azure

### Deploy to Azure Container Apps
Coming after //Build announcements
