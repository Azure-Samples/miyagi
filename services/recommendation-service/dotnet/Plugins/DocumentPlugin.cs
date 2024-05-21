using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.SemanticKernel.Memory;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq;
using System.Text.Json;
using Microsoft.SemanticKernel;
// using Microsoft.SemanticKernel.Annotations;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Plugins.Memory;
// using Microsoft.SemanticKernel.Utils;
using Microsoft.SemanticKernel.Embeddings;
// using Microsoft.SemanticKernel.TextGeneration;


namespace GBB.Miyagi.RecommendationService.Plugins
{
    /// <summary>
    /// MongoMemoryPlugin provides a plugin to save or recall information from the long or short term memory using MongoDB.
    /// </summary>
    [Experimental("SKEXP0001")]
    public sealed class DocumentPlugin
    {
        /// <summary>
        /// Represents a memory storage for MongoDB.
        /// </summary>
        private readonly IMongoClient _mongoClient;
        private readonly ILogger _logger;

        private readonly IMongoCollection<BsonDocument> _collection;
        private readonly ITextEmbeddingGenerationService _embeddingGenerator;

        /// <summary>
        /// Creates a new instance of the MongoMemoryPlugin.
        /// </summary>
        /// <param name="memory">The memory storage for MongoDB.</param>
        /// <param name="loggerFactory">The logger factory.</param>
        public DocumentPlugin(
            IMongoClient? mongoClient = null,
            ILoggerFactory? loggerFactory = null,
            IMongoCollection<BsonDocument>? collection = null,
            ITextEmbeddingGenerationService? embeddingGenerator = null)
        {
            this._mongoClient= mongoClient;
            this._logger = loggerFactory?.CreateLogger(typeof(DocumentPlugin)) ?? NullLogger.Instance;
            this._collection = collection;
            this._embeddingGenerator = embeddingGenerator;
        }

    private const int DefaultMaxVectorSearchResults = 5;
    private const string DefaultQuery = "query";

    /// <summary>
    /// Semantic search and return up to N memories related to the input text.
    /// </summary>
    /// <param name="query">The query string.</param>
    /// <param name="maxVectorSearchResults">The maximum number of vector search results to retrieve.</param>
    /// <param name="collection">The MongoDB collection to search.</param>
    /// <param name="embeddingGenerator">The embedding generator.</param>
    /// <param name="cancellationToken">The <see cref="CancellationToken"/> to monitor for cancellation requests. The default is <see cref="CancellationToken.None"/>.</param>
    /// <returns>A task representing the asynchronous operation. The task result contains the recalled memories as a JSON string.</returns>
    [KernelFunction, Description("Semantic search and return up to N memories related to the input text")]
    public async Task<string> RecallAsync(
        [Description("The query string")] string query,
        [Description("The maximum number of vector search results to retrieve")] int maxVectorSearchResults,
        CancellationToken cancellationToken = default)
    {

        maxVectorSearchResults = maxVectorSearchResults==0 ? DefaultMaxVectorSearchResults : maxVectorSearchResults;
        query = string.IsNullOrEmpty(query) ? DefaultQuery : query;

        // Generate the embedding for the query
        var queryEmbedding = await _embeddingGenerator.GenerateEmbeddingsAsync([ query], null, default);

        // Serialize the embedding to a JSON string
        var jsonString = JsonSerializer.Serialize(queryEmbedding[0]);

        // Deserialize the JSON string to a list of floats
        var embedding = JsonSerializer.Deserialize<List<float>>(jsonString);

        // Create a BSON array from the embedding
        var embeddingsArray = new BsonArray(embedding.Select(e => new BsonDouble(Convert.ToDouble(e))));

        // Define the pipeline for the aggregation
        var pipeline = new BsonDocument[]
        {
                BsonDocument.Parse($"{{$search: {{cosmosSearch: {{ vector: [{string.Join(',', embeddingsArray)}], path: 'embedding', k: {maxVectorSearchResults}}}, returnStoredSource:true}}}}"),
                BsonDocument.Parse($"{{$project: {{similarityScore: {{\"$meta\": \"searchScore\" }},document:\"$$ROOT\"}}}}"),
        };

        // Execute the aggregation pipeline
        var bsonDocuments = await _collection.Aggregate<BsonDocument>(pipeline).ToListAsync();


        // Return the text of the recalled memories
        if (bsonDocuments.Count == 0)
        {
            return string.Empty;
        }

        return bsonDocuments.Count == 1 ? (string)bsonDocuments[0]["document"]["metadata"]["text"] : (string)JsonSerializer.Serialize(bsonDocuments.Select(x => {return x["document"]["metadata"]["text"].AsString;}));
    }

    /// <summary>
    /// Creates an index if it does not already exist in the specified collection.
    /// </summary>
    /// <param name="connectionString">The MongoDB connection string.</param>
    /// <param name="databaseName">The name of the database.</param>
    /// <param name="collectionName">The name of the collection.</param>
    /// <param name="indexName">The name of the index.</param>
    /// <param name="vectorFieldName">The name of the vector field.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task CreateIndexIfNotExistsAsync(string connectionString, string databaseName, string collectionName, string indexName, string vectorFieldName)
    {
        var client = _mongoClient ?? new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);
        var collection = database.GetCollection<BsonDocument>(collectionName);

        var doesIndexExistsInCollection = false;

        var index = Builders<BsonDocument>.IndexKeys.Ascending(vectorFieldName);
        var indexOptions = new CreateIndexOptions { Name = indexName };

        var existingIndexes = await collection.Indexes.ListAsync();
        var existingIndexNames = existingIndexes.ToList().Select(x => x["name"].AsString);

        if (!existingIndexNames.Contains(indexName))
        {
            await collection.Indexes.CreateOneAsync(new CreateIndexModel<BsonDocument>(index, indexOptions));
        }
    }
}
}