using Azure.Core;
using Azure.Identity;
using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Plugins;
using Microsoft.Azure.Cosmos;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AzureAISearch;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Plugins.Core;

namespace GBB.Miyagi.RecommendationService.Extensions;

public static class ServiceExtensions
{
        
    private static KernelSettings GetKernelSettings(IServiceProvider serviceProvider)
    {
        return serviceProvider.GetRequiredService<KernelSettings>();
    }
        
    public static void AddAzureServices(this IServiceCollection services)
    {
        var kernelSettings = GetKernelSettings(services.BuildServiceProvider());
        // var serviceProvider = services.BuildServiceProvider();
        // var configuration = serviceProvider.GetRequiredService<IConfiguration>();
        
        TokenCredential credential = new DefaultAzureCredential();
        
        services.AddSingleton(_ => new BlobServiceClient(
            new Uri(kernelSettings.BlobServiceUri),
            credential));
        
        // TODO: Debug why DefaultAzureCredential is not working for multiple tenants
        // TokenCredential credential = new DefaultAzureCredential(
        // new DefaultAzureCredentialOptions { ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_CLIENT_ID") });
        // TokenCredential credential = new ClientSecretCredential(
        // tenantId: configuration["AZURE_TENANT_ID"]!,
        // clientId: configuration["AZURE_CLIENT_ID"]!,
        // clientSecret: configuration["AZURE_CLIENT_SECRET"]!,
        // options: new TokenCredentialOptions()
        //     );
        // CosmosClient cosmosClient = new(
        //     accountEndpoint: new Uri(kernelSettings.CosmosDbUri).ToString(),
        //     tokenCredential: credential
        // );

        CosmosClient cosmosClient = new(
            connectionString: kernelSettings.CosmosDbConnectionString
        );
        services.AddSingleton(_ => cosmosClient);
        services.AddSingleton<CosmosDbService>();
    }

    public static void AddSkServices(this IServiceCollection services)
    {
        var kernelSettings = GetKernelSettings(services.BuildServiceProvider());

        services.AddSingleton<Kernel>(_ =>
        {
            services = new ServiceCollection();
            services.AddLogging(c => c.AddConsole().SetMinimumLevel(LogLevel.Trace));
            services.AddHttpClient();
            services.AddKernel().AddAzureOpenAIChatCompletion(
                deploymentName: kernelSettings.DeploymentOrModelId,
                endpoint: kernelSettings.Endpoint,
                // credentials: new DefaultAzureCredential() // Use this for token based authentication (recommended)
                apiKey: kernelSettings.ApiKey, // Use this for API key based authentication (not recommended for production use)
                modelId: kernelSettings.DeploymentOrModelId);
            services.AddSingleton<KernelPlugin>(sp => KernelPluginFactory.CreateFromType<TimePlugin>(serviceProvider: sp));
            services.AddSingleton<KernelPlugin>(sp => KernelPluginFactory.CreateFromType<UserProfilePlugin>(serviceProvider: sp));
            var kernel = services.BuildServiceProvider().GetRequiredService<Kernel>();

            return kernel;
        });
            
        services.AddSingleton<SemanticTextMemory>(_ =>
        {
            // Azure AI Search Vector DB - a store that persists data in a hosted Azure AI Search database
            IMemoryStore store = new AzureAISearchMemoryStore(
                kernelSettings.AzureCognitiveSearchEndpoint,
                // credentials: new DefaultAzureCredential() // Use this for token based authentication (recommended)
                kernelSettings.AzureCognitiveSearchApiKey // Use this for API key based authentication (not recommended for production use)
                );
            
            // Create an embedding generator to use for semantic memory.
            var embeddingGenerator = new AzureOpenAITextEmbeddingGenerationService(
                kernelSettings.EmbeddingDeploymentOrModelId, 
                kernelSettings.Endpoint,
                // credential: new DefaultAzureCredential(), // Use this for token based authentication (recommended)
                kernelSettings.ApiKey, // Use this for API key based authentication (not recommended for production use)
                kernelSettings.EmbeddingDeploymentOrModelId);

            // The combination of the text embedding generator and the memory store makes up the 'SemanticTextMemory' object used to
            // store and retrieve memories.
            SemanticTextMemory textMemory = new(store, embeddingGenerator);
            return textMemory;
        });
    }
        
}