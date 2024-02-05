## Introduction

In this hands-on workshop, you will learn how to build Intelligent Applications using Microsoft Copilot stack and Azure Open AI services, and run them on Azure Container Apps or Azure Kubernetes Service. You will bootstrap a sample application called Miyagi, and understand how to build a financial advisor application that provides personalized recommendations to users based on their financial goals and preferences. The application uses Azure Open AI services to generate personalized responses to user queries and Azure Cognitive Search to index and search financial documents. The application is composed of the following components:

1. **Miyagi Frontend**: A Next.js application that provides a user interface for the application. The frontend is built using TypeScript and React.
2. **Recommendation Service**: A .NET 8 application that provides personalized recommendations to users. The service uses Azure Open AI services to generate personalized responses to user queries and Azure Cognitive Search to index and search financial documents.
3. **RAG Usecase**: A .NET 8 application that demonstrates how to use the Semantic Kernel SDK to implement the RAG pattern for the recommendation service.
4. **Azure Open AI**: A service that provides AI models for generating personalized responses to user queries.
5. **Azure Cognitive Search**: A service that provides indexing and search capabilities for financial documents.
6. **Azure Container Apps**: A service that provides a platform for deploying and running containerized applications.
7. **Azure Kubernetes Service**: A service that provides a platform for deploying and managing containerized applications.
8. **Azure API Management**: A service that provides a platform for exposing and managing APIs.
9. **Azure Cosmos DB**: A service that provides a globally distributed, multi-model database for building highly responsive and scalable applications.
10. **Azure Blob Storage**: A service that provides object storage for storing large amounts of unstructured data.

## Labs

The workshop is divided into the following labs. We recommend you to follow the labs in the order they are listed.

1. [Build and Run Miyagi locally](./Lab1.md)
2. Choose one of the following: 
   1. [Deploy Apps to Azure Container Apps](./Lab2.md) OR 
   2. [Deploy Apps to Azure Kubernetes Service](./Lab2-A(AKS).md)
3. [Protect Azure Open AI with APIM](./Lab3.md)
4. [Getting Started with your own Copilot Project](./Lab4.md)