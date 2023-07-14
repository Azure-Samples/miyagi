﻿using Microsoft.SemanticKernel;

namespace GBB.Miyagi.RecommendationService.config;

internal static class KernelBuilderExtensions
{
    /// <summary>
    /// Adds a text completion service to the list. It can be either an OpenAI or Azure OpenAI backend service.
    /// </summary>
    /// <param name="kernelBuilder"></param>
    /// <param name="kernelSettings"></param>
    /// <exception cref="ArgumentException"></exception>
    internal static KernelBuilder WithCompletionService(this KernelBuilder kernelBuilder,
    KernelSettings kernelSettings)
    {
        switch (kernelSettings.ServiceType.ToUpperInvariant())
        {
            case ServiceTypes.AzureOpenAI:
                if (kernelSettings.EndpointType == EndpointTypes.TextCompletion)
                {
                    kernelBuilder.WithAzureTextCompletionService(
                        deploymentName: kernelSettings.DeploymentOrModelId,
                        endpoint: kernelSettings.Endpoint,
                        apiKey: kernelSettings.ApiKey,
                        serviceId: kernelSettings.ServiceId
                    );
                }
                else if (kernelSettings.EndpointType == EndpointTypes.ChatCompletion)
                {
                    kernelBuilder.WithAzureChatCompletionService(
                        deploymentName: kernelSettings.DeploymentOrModelId,
                        endpoint: kernelSettings.Endpoint,
                        apiKey: kernelSettings.ApiKey,
                        serviceId: kernelSettings.ServiceId
                    );
                }
                break;

            case ServiceTypes.OpenAI:
                if (kernelSettings.EndpointType == EndpointTypes.TextCompletion)
                {
                    kernelBuilder.WithOpenAITextCompletionService(
                        modelId: kernelSettings.DeploymentOrModelId,
                        apiKey: kernelSettings.ApiKey,
                        orgId: kernelSettings.OrgId,
                        serviceId: kernelSettings.ServiceId
                    );
                }
                else if (kernelSettings.EndpointType == EndpointTypes.ChatCompletion)
                {
                    kernelBuilder.WithOpenAIChatCompletionService(
                        modelId: kernelSettings.DeploymentOrModelId,
                        apiKey: kernelSettings.ApiKey,
                        orgId: kernelSettings.OrgId,
                        serviceId: kernelSettings.ServiceId
                    );
                }
                break;

            default:
                throw new ArgumentException($"Invalid service type value: {kernelSettings.ServiceType}");
        }

        return kernelBuilder;
    }
    
    /// <summary>
    /// Adds a embedding service to the list. It can be either an OpenAI or Azure OpenAI backend service.
    /// </summary>
    /// <param name="kernelBuilder"></param>
    /// <param name="kernelSettings"></param>
    /// <exception cref="ArgumentException"></exception>
    internal static KernelBuilder WithEmbeddingGenerationService(this KernelBuilder kernelBuilder,
    KernelSettings kernelSettings)
    {
        switch (kernelSettings.ServiceType.ToUpperInvariant())
        {
            case ServiceTypes.AzureOpenAI:
                kernelBuilder.WithAzureTextEmbeddingGenerationService(
                    deploymentName: kernelSettings.EmbeddingDeploymentOrModelId,
                    endpoint: kernelSettings.Endpoint,
                    apiKey: kernelSettings.ApiKey,
                    serviceId: kernelSettings.EmbeddingServiceId
                );
                break;
            case ServiceTypes.OpenAI:
                kernelBuilder.WithOpenAITextEmbeddingGenerationService(
                    modelId: kernelSettings.EmbeddingDeploymentOrModelId,
                    apiKey: kernelSettings.ApiKey,
                    orgId: kernelSettings.OrgId,
                    serviceId: kernelSettings.EmbeddingDeploymentOrModelId
                );
                break;
            default:
                throw new ArgumentException($"Invalid service type value: {kernelSettings.ServiceType}");
        }

        return kernelBuilder;
    }
}