using Microsoft.SemanticKernel;

namespace GBB.Miyagi.RecommendationService.config;

internal static class KernelBuilderExtensions
{
    /// <summary>
    ///     Adds a text completion service to the list. It can be either an OpenAI or Azure OpenAI backend service.
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
                kernelBuilder.WithAzureChatCompletionService(
                    kernelSettings.DeploymentOrModelId,
                    kernelSettings.Endpoint,
                    kernelSettings.ApiKey,
                    serviceId: kernelSettings.ServiceId);
                break;

            case ServiceTypes.OpenAI:

                kernelBuilder.WithOpenAIChatCompletionService(
                    kernelSettings.DeploymentOrModelId,
                    kernelSettings.ApiKey,
                    kernelSettings.OrgId,
                    kernelSettings.ServiceId
                );
                break;

            default:
                throw new ArgumentException($"Invalid service type value: {kernelSettings.ServiceType}");
        }

        return kernelBuilder;
    }

    /// <summary>
    ///     Adds a embedding service to the list. It can be either an OpenAI or Azure OpenAI backend service.
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
                    kernelSettings.EmbeddingDeploymentOrModelId,
                    kernelSettings.Endpoint,
                    kernelSettings.ApiKey,
                    kernelSettings.EmbeddingServiceId
                );
                break;
            case ServiceTypes.OpenAI:
                kernelBuilder.WithOpenAITextEmbeddingGenerationService(
                    kernelSettings.EmbeddingDeploymentOrModelId,
                    kernelSettings.ApiKey,
                    kernelSettings.OrgId,
                    kernelSettings.EmbeddingDeploymentOrModelId
                );
                break;
            default:
                throw new ArgumentException($"Invalid service type value: {kernelSettings.ServiceType}");
        }

        return kernelBuilder;
    }
}