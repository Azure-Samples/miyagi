using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Memory.Qdrant;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Skills.Web;
using Microsoft.SemanticKernel.Skills.Web.Bing;
using ConsoleLogger = GBB.Miyagi.RecommendationService.config.ConsoleLogger;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add BlobServiceClient to the container
builder.Services.AddSingleton(x => new BlobServiceClient(Env.Var("AZURE_STORAGE_CONNECTION_STRING")));


// Register the required services
builder.Services.AddSingleton<IKernel>(provider =>
{
    // initialize the kernel
    var kernelSettings = KernelSettings.LoadSettings();
    // Uncomment below line to use Qdrant
    // var memoryStore = new QdrantMemoryStore(Env.Var("QDRANT_ENDPOINT"), 1536, ConsoleLogger.Log);
    var memoryStore = new VolatileMemoryStore();

    var kernel = new KernelBuilder()
        .WithLoggerFactory(ConsoleLogger.LoggerFactory)
        .WithCompletionService(kernelSettings)
        .WithEmbeddingGenerationService(kernelSettings)
        // Use QdrantMemoryStore instead of VolatileMemoryStore
        .WithMemoryStorage(memoryStore)
        .WithRetryBasic(new()
            {
                MaxRetryCount = 3,
                UseExponentialBackoff = true,
                MinRetryDelay = TimeSpan.FromSeconds(3)
            })
        .Build();

    return kernel;
});

builder.Services.AddSingleton<QdrantMemoryStore>(provider =>
{
    var memoryStore = new QdrantMemoryStore(Env.Var("QDRANT_ENDPOINT"), 1536, ConsoleLogger.LoggerFactory);
    return memoryStore;
});

builder.Services.AddSingleton<BingConnector>(provider =>
{
    var bingConnector = new BingConnector(Env.Var("BING_API_KEY"));
    return bingConnector;
});

builder.Services.AddSingleton<WebSearchEngineSkill>(provider =>
{
    var bingConnector = provider.GetRequiredService<BingConnector>();
    var bing = new WebSearchEngineSkill(bingConnector);
    return bing;
});

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