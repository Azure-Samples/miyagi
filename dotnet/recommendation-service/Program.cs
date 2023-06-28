using System.Globalization;
using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Memory.Qdrant;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Reliability;
using Microsoft.SemanticKernel.Skills.Web;
using Microsoft.SemanticKernel.Skills.Web.Bing;

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
    IKernel kernel = new KernelBuilder()
            .WithCompletionService(kernelSettings)
            // swap with pgvector, acs, redis etc.
        .WithMemoryStorage(new VolatileMemoryStore())
        .Configure(c => c.SetDefaultHttpRetryConfig(new HttpRetryConfig
        {
            MaxRetryCount = 2,
            UseExponentialBackoff = true
            //  MinRetryDelay = TimeSpan.FromSeconds(2),
            //  MaxRetryDelay = TimeSpan.FromSeconds(8),
            //  MaxTotalRetryTime = TimeSpan.FromSeconds(30),
            //  RetryableStatusCodes = new[] { HttpStatusCode.TooManyRequests, HttpStatusCode.RequestTimeout },
            //  RetryableExceptions = new[] { typeof(HttpRequestException) }
        }))
        .Build();

    return kernel;
});

builder.Services.AddSingleton<QdrantMemoryStore>(provider =>
{
    var qdrantPort = int.Parse(Env.Var("QDRANT_PORT"), CultureInfo.InvariantCulture);
    var memoryStore = new QdrantMemoryStore(Env.Var("QDRANT_ENDPOINT"), qdrantPort, 1536, ConsoleLogger.Log);
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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
// app.UseHttpsRedirection(); // TODO: Issue with Next.js to use https redirection

app.Map("/", () => Results.Redirect("/swagger"));

// app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=AssetsController}/{action=Index}/{id?}");

app.Run();