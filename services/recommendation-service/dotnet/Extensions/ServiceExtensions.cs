using Azure.Core;
using Azure.Identity;
using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.config;
using Microsoft.Azure.Cosmos;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Memory.AzureCognitiveSearch;
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
            services.AddLogging(c => c.AddConsole().SetMinimumLevel(LogLevel.Information));
            services.AddHttpClient();
            services.AddKernel().AddAzureOpenAIChatCompletion(
                deploymentName: kernelSettings.DeploymentOrModelId,
                endpoint: kernelSettings.Endpoint,
                apiKey: kernelSettings.ApiKey,
                modelId: kernelSettings.DeploymentOrModelId);
            services.AddSingleton<KernelPlugin>(sp => KernelPluginFactory.CreateFromType<TimePlugin>(serviceProvider: sp));
            services.AddSingleton<KernelPlugin>(sp => KernelPluginFactory.CreateFromType<HttpPlugin>(serviceProvider: sp));
            var kernel = services.BuildServiceProvider().GetRequiredService<Kernel>();

            return kernel;
        });
            
        services.AddSingleton<ISemanticTextMemory>(_ =>
        {
            var memoryBuilder = new MemoryBuilder();
            memoryBuilder
                .WithAzureOpenAITextEmbeddingGeneration(
                    kernelSettings.EmbeddingDeploymentOrModelId,
                    kernelSettings.Endpoint,
                    kernelSettings.ApiKey)
                .WithMemoryStore(
                    new AzureCognitiveSearchMemoryStore(
                        kernelSettings.AzureCognitiveSearchEndpoint,
                        kernelSettings.AzureCognitiveSearchApiKey));

            var memoryStore = memoryBuilder.Build();
            return memoryStore;
        });
    }
        
}