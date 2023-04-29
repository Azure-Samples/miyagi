using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.Models;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Memory.Qdrant;
using Microsoft.SemanticKernel.Skills.Web;

namespace GBB.Miyagi.RecommendationService.Controllers
{
    [ApiController]
    [Route("recommendations")]
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

        [HttpPost("/personalize")]
        public async Task<IActionResult> GetRecommendations([FromBody] Context context)
        {
            
            Console.WriteLine("== Printing Collections in DB ==");
            var collections = _memoryStore.GetCollectionsAsync();
            await foreach (var collection in collections)
            {
                Console.WriteLine(collection);
            }
            
            var memoryCollectionName = Env.Var("QDRANT_MEMORY_COLLECTION");
            var prompt = $"How should {context.UserId} allocate {context.Portfolio?.ToString()}?";

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
                ONLY USE XML TAGS IN THIS LIST: 
                [XML TAG LIST]
                list: Surround any lists with this tag
                synopsis: An outline of the chapter to write 
                [END LIST]

                EMIT WELL FORMED XML ALWAYS. Code should be CDATA. 

                Portfolio: <portfolio>
                    <stock>
                        <ticker>MSFT</ticker>
                        <allocation>0.5</allocation>
                    </stock>
                    <stock>
                        <ticker>GOOG</ticker>
                        <allocation>0.5</allocation>
                    </stock>
                User: <user>
                    <age>30</age>
                    <income>100000</income>
                    <risk>0.5</risk>
                ";

            var portfolioFunction = _kernel.CreateSemanticFunction(FUNCTION_DEFINITION,
                skillName: "Portfolio",
                functionName: "AllocationAdvice",
                description: "Advises on how to allocate a portfolio",
                maxTokens: 150, temperature: 0.4, topP: 1);
            // Get latest finance news from Bing
            var newsResults = await _kernel.RunAsync(
                prompt,
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
        
        [HttpGet("memory/collections/{containerName}")]
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

        [HttpPost("memory/collections")]
        public async Task<IActionResult> SendBlobToQdrantAsync([FromBody] SubRedditBlobInfo subRedditBlobInfo)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(subRedditBlobInfo.ContainerName);
            var blobClient = containerClient.GetBlobClient(subRedditBlobInfo.BlobName);

            var response = await blobClient.DownloadAsync();
            using var streamReader = new StreamReader(response.Value.Content);
            var text = await streamReader.ReadToEndAsync();

            // Save the text to Qdrant
            var memoryCollectionName = Env.Var("QDRANT_MEMORY_COLLECTION");
            var key = await _kernel.Memory.SaveInformationAsync(memoryCollectionName, id: subRedditBlobInfo.BlobName, text: text);

            return Ok(new { Id = key });
        }

    }
}
