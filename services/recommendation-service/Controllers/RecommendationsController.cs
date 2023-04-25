using System.Collections.Generic;
using System.Threading.Tasks;
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

        public RecommendationsController(IKernel kernel, QdrantMemoryStore memoryStore, WebSearchEngineSkill webSearchEngineSkill)
        {
            _kernel = kernel;
            _memoryStore = memoryStore;
            _webSearchEngineSkill = webSearchEngineSkill;
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
            
            string memoryCollectionName = Env.Var("QDRANT_MEMORY_COLLECTION"); // Replace with your desired memory collection name
            string prompt = $"How should {user} allocate {portfolio}?";
            
            // Get embeddings for the prompt
            
            // var embeddings = await _kernel.RunAsync()
            
            // Search Qdrant vector store
            var searchResults = _kernel.Memory.SearchAsync(memoryCollectionName, embeddings, limit: 3, minRelevanceScore: 0.8);
            var similarTexts = new List<string>();

            await foreach (var item in searchResults)
            {
                similarTexts.Add(item.Metadata.Text);
            }

            // Get latest finance news from Bing
            var newsResults = await _webSearchEngineSkill.SearchAsync($"latest finance news {portfolio}", count: 3);
            var newsTexts = new List<string>();

            foreach (var newsItem in newsResults)
            {
                newsTexts.Add(newsItem.Title);
            }

            // Build the new prompt with similar texts and news
            string newPrompt = $"{prompt}\n\nSimilar recommendations:\n{string.Join("\n", similarTexts)}\n\nLatest news:\n{string.Join("\n", newsTexts)}\n\n";
            
            // Call text completion API
            var completionResult = await _kernel.RunAsync(newPrompt, _kernel.Skills.Get("text-davinci-003"));

            return Ok(new { Recommendation = completionResult });
        }
    }
}
