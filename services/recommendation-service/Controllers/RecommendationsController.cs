using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Memory.Qdrant;
using Microsoft.SemanticKernel.Skills.Web;

namespace GBB.Miyagi.RecommendationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecommendationsController : ControllerBase
    {
        private readonly IKernel _kernel;
        private readonly QdrantMemoryStore _memoryStore;
        private readonly WebSearchEngineSkill _webSearchEngineSkill;
        private readonly BlobServiceClient _blobServiceClient;

        public RecommendationsController(IKernel kernel, 
            QdrantMemoryStore memoryStore, 
            WebSearchEngineSkill webSearchEngineSkill,
            BlobServiceClient blobServiceClient)
        {
            _kernel = kernel;
            _memoryStore = memoryStore;
            _webSearchEngineSkill = webSearchEngineSkill;
            _blobServiceClient = blobServiceClient;
        }

        [HttpGet("GetRecommendations")]
        public async Task<IActionResult> GetRecommendations(string user, string portfolio)
        {
            
            Console.WriteLine("== Printing Collections in DB ==");
            var collections = _memoryStore.GetCollectionsAsync();
            await foreach (var collection in collections)
            {
                Console.WriteLine(collection);
            }
            
            var memoryCollectionName = Env.Var("QDRANT_MEMORY_COLLECTION");
            var prompt = $"How should {user} allocate {portfolio}?";

            // Search Qdrant vector store
            var searchResults = _kernel.Memory.SearchAsync(memoryCollectionName, prompt, limit: 3, minRelevanceScore: 0.8);
            var similarTexts = new List<string>();

            await foreach (var item in searchResults)
            {
                similarTexts.Add(item.Metadata.Text);
            }
            
            var web = _kernel.ImportSkill(_webSearchEngineSkill);

            // Run
            var ask = "Current finance news";
            const string FUNCTION_DEFINITION = @"
                Act as a financial advisor, with only the following outputs: Buy, Sell, Hold.
                Given the following portfolio allocation and user information:
                Portfolio: {{$portfolio}}
                User: {{$user}}
                ";

            var portfolioFunction = _kernel.CreateSemanticFunction(FUNCTION_DEFINITION, maxTokens: 100, temperature: 0.4, topP: 1);
            // Get latest finance news from Bing
            var newsResults = await _kernel.RunAsync(
                ask,
                portfolioFunction,
                web["SearchAsync"]
            );
            
            Console.WriteLine(ask + "\n");
            Console.WriteLine(newsResults);

            // Build the new prompt with similar texts and news
            string newPrompt = $"{prompt}\n\nSimilar recommendations:\n{string.Join("\n", similarTexts)}\n\nLatest news:\n{string.Join("\n", newsResults.Result)}\n\n";
            
            // Call text completion API

            return Ok(new { Recommendation = newsResults.Result, Prompt = newPrompt });
        }
        
        [HttpGet("ListBlobs")]
        public async Task<IActionResult> ListBlobsAsync(string containerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobs = new List<string>();

            await foreach (var blob in containerClient.GetBlobsAsync())
            {
                blobs.Add(blob.Name);
            }

            return Ok(blobs);
        }

        [HttpPost("SendBlobToQdrant")]
        public async Task<IActionResult> SendBlobToQdrantAsync(string containerName, string blobName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.DownloadAsync();
            using var streamReader = new StreamReader(response.Value.Content);
            var text = await streamReader.ReadToEndAsync();

            // Save the text to Qdrant
            var memoryCollectionName = Env.Var("QDRANT_MEMORY_COLLECTION");
            var key = await _kernel.Memory.SaveInformationAsync(memoryCollectionName, id: blobName, text: text);

            return Ok(new { Id = key });
        }
    }
}
