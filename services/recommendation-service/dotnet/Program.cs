using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Extensions;
using Microsoft.SemanticKernel.Connectors.AzureCosmosDBMongoDB;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Memory;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Load user secrets
builder.Configuration.AddUserSecrets<Program>();

// Load kernel settings from configuration
var kernelSettings = KernelSettings.LoadSettings();
builder.Services.AddSingleton(kernelSettings);

// Add Azure services
builder.Services.AddAzureServices();

// Add Semantic Kernel services
builder.Services.AddSkServices();

// Add Semantic Kernel services for Vector Indexing
if (kernelSettings.useCosmosDBWithVectorIndexing)
{
    var azureCosmosDBMongoDBMemoryStore = new AzureCosmosDBMongoDBMemoryStore(kernelSettings.mongoVectorDBConnectionString, kernelSettings.mongoVectorDBName, new AzureCosmosDBMongoDBConfig(1536));
    var embeddingGenerator = new AzureOpenAITextEmbeddingGenerationService(
            deploymentName: kernelSettings.EmbeddingDeploymentOrModelId,
            endpoint: kernelSettings.Endpoint,
            apiKey: kernelSettings.ApiKey,
            modelId: "text-embedding-ada-002"
        );
    SemanticTextMemory textMemory = new(azureCosmosDBMongoDBMemoryStore, embeddingGenerator);
    builder.Services.AddSingleton(textMemory);
}

// Read additional CORS origins from the environment variable
var envCorsOrigins = Environment.GetEnvironmentVariable("ENV_CORS_ORIGINS")?.Split(',') ?? Array.Empty<string>();

// Combine CORS origins from kernel settings and the environment variable
var allCorsOrigins = kernelSettings.CorsAllowedOrigins.Union(envCorsOrigins).ToArray();

// Configure CORS to allow specific origins from KernelSettings and environment variables
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MiyagiAllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins(allCorsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("MiyagiAllowSpecificOrigins");
// app.UseHttpsRedirection(); // Issue with Next.js to use https redirection


app.Map("/", () => Results.Redirect("/swagger"));

// app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=AssetsController}/{action=Index}/{id?}");

app.Run();