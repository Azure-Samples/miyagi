using System.Text.Json.Serialization;

namespace GBB.Miyagi.RecommendationService.config;

internal class KernelSettings
{
    public const string DefaultConfigFile = "appsettings.json";

    [JsonPropertyName("deploymentOrModelId")]
    public string DeploymentOrModelId { get; set; } = string.Empty;

    [JsonPropertyName("blobServiceUri")] public string BlobServiceUri { get; set; } = string.Empty;

    [JsonPropertyName("embeddingDeploymentOrModelId")]
    public string EmbeddingDeploymentOrModelId { get; set; } = string.Empty;

    [JsonPropertyName("endpoint")] 
    public string Endpoint { get; set; } = string.Empty;

    [JsonPropertyName("apiKey")] 
    public string ApiKey { get; set; } = string.Empty;

    [JsonPropertyName("orgId")] 
    public string OrgId { get; set; } = string.Empty;

    [JsonPropertyName("logLevel")] 
    public LogLevel? LogLevel { get; set; }

    [JsonPropertyName("azureCognitiveSearchEndpoint")]
    public string AzureCognitiveSearchEndpoint { get; set; } = string.Empty;

    [JsonPropertyName("azureCognitiveSearchApiKey")]
    public string AzureCognitiveSearchApiKey { get; set; } = string.Empty;

    [JsonPropertyName("collectionName")] 
    public string CollectionName { get; set; } = string.Empty;
    
    [JsonPropertyName("bingApiKey")] 
    public string BingApiKey { get; set; } = string.Empty;
    
    [JsonPropertyName("cosmosDbName")] 
    public string CosmosDbName { get; set; } = string.Empty;
    
    [JsonPropertyName("cosmosDbUri")] 
    public string CosmosDbUri { get; set; } = string.Empty;

    [JsonPropertyName("cosmosDbContainerName")]
    public string CosmosDbContainerName { get; set; } = string.Empty;
    
    [JsonPropertyName("cosmosDbConnectionString")] 
    public string CosmosDbConnectionString { get; set; } = string.Empty;

    [JsonPropertyName("corsAllowedOrigins")]
    public string[] CorsAllowedOrigins { get; set; } = Array.Empty<string>();


    /// <summary>
    ///     Load the kernel settings from settings.json if the file exists and if not attempt to use user secrets.
    /// </summary>
    internal static KernelSettings LoadSettings()
    {
        try
        {
            if (File.Exists(DefaultConfigFile)) return FromFile();

            Console.WriteLine(
                $"Semantic kernel settings '{DefaultConfigFile}' not found, attempting to load configuration from user secrets.");

            return FromUserSecrets();
        }
        catch (InvalidDataException ide)
        {
            Console.Error.WriteLine(
                "Unable to load semantic kernel settings, please provide configuration settings using instructions in the README.\n" +
                "Please refer to: https://github.com/microsoft/semantic-kernel-starters/blob/main/03-Chaining-Functions/README.md#configuring-the-starter"
            );
            throw new InvalidOperationException(ide.Message);
        }
    }

    /// <summary>
    ///     Load the kernel settings from the specified configuration file if it exists.
    /// </summary>
    internal static KernelSettings FromFile(string configFile = DefaultConfigFile)
    {
        if (!File.Exists(configFile)) throw new FileNotFoundException($"Configuration not found: {configFile}");

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile(configFile, true, true)
            .Build();

        return configuration.Get<KernelSettings>()
               ?? throw new InvalidDataException(
                   $"Invalid semantic kernel settings in '{configFile}', please provide configuration settings using instructions in the README.");
    }

    /// <summary>
    ///     Load the kernel settings from user secrets.
    /// </summary>
    internal static KernelSettings FromUserSecrets()
    {
        var configuration = new ConfigurationBuilder()
            .AddUserSecrets<KernelSettings>()
            .Build();

        return configuration.Get<KernelSettings>()
               ?? throw new InvalidDataException(
                   "Invalid semantic kernel settings in user secrets, please provide configuration settings using instructions in the README.");
    }
}