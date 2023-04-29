using System.Globalization;
using Azure.Storage.Blobs;
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
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add BlobServiceClient to the container
builder.Services.AddSingleton(x => new BlobServiceClient(Env.Var("AZURE_STORAGE_CONNECTION_STRING")));


// Register the required services
builder.Services.AddSingleton<IKernel>(provider =>
{
    int qdrantPort = int.Parse(Env.Var("QDRANT_PORT"), CultureInfo.InvariantCulture);
    QdrantMemoryStore memoryStore = new QdrantMemoryStore(Env.Var("QDRANT_ENDPOINT"), qdrantPort, vectorSize: 1536, ConsoleLogger.Log);
    
    IKernel kernel = Kernel.Builder
        .WithLogger(ConsoleLogger.Log)
        .Configure(c =>
        {
            c.AddAzureTextCompletionService(
                Env.Var("AZURE_OPENAI_SERVICE_ID"),
                Env.Var("AZURE_OPENAI_DEPLOYMENT_NAME"),
                Env.Var("AZURE_OPENAI_ENDPOINT"),
                Env.Var("AZURE_OPENAI_KEY"));
            c.AddAzureTextEmbeddingGenerationService(
                Env.Var("AZURE_OPENAI_EMBEDDINGS_SERVICE_ID"),
                Env.Var("AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME"),
                Env.Var("AZURE_OPENAI_EMBEDDINGS_ENDPOINT"),
                Env.Var("AZURE_OPENAI_EMBEDDINGS_KEY"));
        })
        // TODO: Fix bug w/ Qdrant.WithMemoryStorage(memoryStore)
        .WithMemoryStorage(new VolatileMemoryStore())
        .Configure(c => c.SetDefaultHttpRetryConfig(new HttpRetryConfig
        {
            MaxRetryCount = 2,
            UseExponentialBackoff = true,
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
    int qdrantPort = int.Parse(Env.Var("QDRANT_PORT"), CultureInfo.InvariantCulture);
    QdrantMemoryStore memoryStore = new QdrantMemoryStore(Env.Var("QDRANT_ENDPOINT"), qdrantPort, vectorSize: 1536, ConsoleLogger.Log);
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

app.UseHttpsRedirection();

app.Map("/", () => Results.Redirect("/swagger"));

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=RecommendationsController}/{action=Index}/{id?}");

app.Run();
