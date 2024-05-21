using Microsoft.SemanticKernel.Connectors.AzureAISearch;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Plugins.Core;
using Microsoft.SemanticKernel.Connectors.MongoDB;
using MongoDB.Driver;
using MongoDB.Bson;
// using Microsoft.SemanticKernel.Connectors.MongoDB;

#pragma warning disable SKEXP0003
#pragma warning disable SKEXP0011
#pragma warning disable SKEXP0021
#pragma warning disable SKEXP0030
#pragma warning disable SKEXP0032

/// <summary>
/// Provides extension methods for performing vector search using MongoDB as the memory store.
/// </summary>
public class MongoVectorSearchExtensions
{
    /// <summary>
    /// Creates a semantic text memory object with MongoDB as the memory store and Azure OpenAI as the embedding generator.
    /// </summary>
    /// <param name="cosmosConnectionString">The connection string for the MongoDB Cosmos DB.</param>
    /// <param name="cosmosDatabaseName">The name of the MongoDB database.</param>
    /// <param name="openAiEndpoint">The endpoint URL for the Azure OpenAI service.</param>
    /// <param name="openAiApiKey">The API key for accessing the Azure OpenAI service.</param>
    /// <param name="openAiModelId">The ID of the OpenAI model to use for text embedding generation.</param>
    /// <returns>A SemanticTextMemory object with MongoDB as the memory store and Azure OpenAI as the embedding generator.</returns>
    // public dynamic GetMemoryStoreWithMongoDB(string cosmosConnectionString, string cosmosDatabaseName, string openAiEndpoint, string openAiApiKey, string openAiModelId, string deploymentName)
    // {
    //     // Create memory store for Mongo DB
    //     IMemoryStore store = new MongoDBMemoryStore(cosmosConnectionString, cosmosDatabaseName);

    //     // Create an embedding generator to use for semantic memory.
    //     var embeddingGenerator = new AzureOpenAITextEmbeddingGenerationService(
    //         deploymentName: deploymentName,
    //         endpoint: openAiEndpoint,
    //         apiKey: openAiApiKey,
    //         modelId: openAiModelId);

    //     return new(store, embeddingGenerator);

    // }
}