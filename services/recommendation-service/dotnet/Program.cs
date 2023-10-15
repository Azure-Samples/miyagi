using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.Azure.Cosmos;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AI.OpenAI;
using Microsoft.SemanticKernel.Connectors.Memory.AzureCognitiveSearch;
using Microsoft.SemanticKernel.Connectors.Memory.Qdrant;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Plugins.Memory;
using ConsoleLogger = GBB.Miyagi.RecommendationService.config.ConsoleLogger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// initialize the kernel
var kernelSettings = KernelSettings.LoadSettings();

// Add BlobServiceClient to the container
builder.Services.AddSingleton(x => new BlobServiceClient(Env.Var("AZURE_STORAGE_CONNECTION_STRING")));

// Register the required services
builder.Services.AddSingleton<IKernel>(provider =>
{
    var kernel =Kernel.Builder
        .WithLoggerFactory(ConsoleLogger.LoggerFactory)
        .WithAzureChatCompletionService(
            kernelSettings.DeploymentOrModelId,
            kernelSettings.Endpoint,
            kernelSettings.ApiKey
        )
        .Build();

    return kernel;
});

// add memory store
builder.Services.AddSingleton<ISemanticTextMemory>(provider =>
{
    var memoryBuilder = new MemoryBuilder();
    memoryBuilder
        .WithAzureTextEmbeddingGenerationService(
            kernelSettings.EmbeddingDeploymentOrModelId,
            kernelSettings.Endpoint,
            kernelSettings.ApiKey
        )
        .WithMemoryStore(
            new AzureCognitiveSearchMemoryStore(
                kernelSettings.AzureCognitiveSearchEndpoint,
                kernelSettings.AzureCognitiveSearchApiKey
            ));

    var memoryStore = memoryBuilder.Build();
    return memoryStore;
});

builder.Services.AddSingleton<QdrantMemoryStore>(provider =>
{
    var memoryStore = new QdrantMemoryStore(Env.Var("QDRANT_ENDPOINT"), 1536, ConsoleLogger.LoggerFactory);
    return memoryStore;
});

builder.Services.AddSingleton(x => 
    new CosmosClient(Env.Var("COSMOS_DB_CONNECTION_STRING")));

builder.Services.AddSingleton<CosmosDbService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
// app.UseHttpsRedirection(); // TODO: Issue with Next.js to use https redirection

app.Map("/", () => Results.Redirect("/swagger"));

// app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=AssetsController}/{action=Index}/{id?}");

app.Run();