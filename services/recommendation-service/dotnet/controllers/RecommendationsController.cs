using System.Text.Json;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Memory.Qdrant;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.Skills.Web;

namespace GBB.Miyagi.RecommendationService.Controllers;

[ApiController]
[Route("recommendations")]
public class RecommendationsController : ControllerBase
{
    private readonly AssetsController _assetsController;

    private readonly InvestmentsController _investmentsController;
    private readonly IKernel _kernel;
    private readonly QdrantMemoryStore _memoryStore;
    private readonly WebSearchEngineSkill _webSearchEngineSkill;

    public RecommendationsController(IKernel kernel,
        QdrantMemoryStore memoryStore,
        WebSearchEngineSkill webSearchEngineSkill)
    {
        _kernel = kernel;
        _memoryStore = memoryStore;
        _webSearchEngineSkill = webSearchEngineSkill;
        _assetsController = new AssetsController(kernel);
        _investmentsController = new InvestmentsController(kernel, webSearchEngineSkill);
    }


    [HttpPost("/personalize")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        const int maxRetries = 2;
        var currentRetry = 0;

        while (currentRetry <= maxRetries)
        {
            try
            {
                var assetsResult = await _assetsController.GetRecommendations(miyagiContext) as ContentResult;
                var investmentsResult = await _investmentsController.GetRecommendations(miyagiContext) as JsonResult;

                if (assetsResult == null || investmentsResult == null)
                {
                    return StatusCode(500, "Failed to get recommendations");
                }

                var assetsJson = JsonDocument.Parse(assetsResult.Content);
                var investmentsJson = investmentsResult.Value as JsonDocument;

                var aggregatedResult = new Dictionary<string, JsonElement>
                {
                    { "assets", assetsJson.RootElement },
                    { "investments", investmentsJson.RootElement }
                };

                return new JsonResult(aggregatedResult);
            }
            catch (JsonException ex)
            {
                if (currentRetry == maxRetries)
                {
                    // Handle error gracefully, e.g. return an error response
                    return BadRequest(new { error = "Failed to parse JSON data after retries" });
                }
                log?.LogError("Failed to parse JSON data: {S}", ex.Message);
                currentRetry++;
            }
        }

        return BadRequest(new { error = "Unexpected error occurred during processing recommendations" });
    }

    [HttpPost("/personalize/sample")]
    public async Task<IActionResult> GetRecommendationsSample([FromBody] MiyagiContext miyagiContext)
    {
        Console.WriteLine("== Printing Collections in DB ==");
        var collections = _memoryStore.GetCollectionsAsync();
        await foreach (var collection in collections) Console.WriteLine(collection);

        var memoryCollectionName = Env.Var("QDRANT_MEMORY_COLLECTION");
        var prompt = $"How should {miyagiContext.UserInfo.UserId} allocate {miyagiContext.Portfolio}?";

        // Search Qdrant vector store
        var searchResults =
            _kernel.Memory.SearchAsync(memoryCollectionName, prompt, 3, 0.8);
        var similarTexts = new List<string>();

        await foreach (var item in searchResults) similarTexts.Add(item.Metadata.Text);

        var web = _kernel.ImportSkill(_webSearchEngineSkill);

        var skillsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");

        var advisorSkill = _kernel.ImportSemanticSkillFromDirectory(skillsDirectory, "AdvisorPlugin");

        var context = new ContextVariables();

        var history = "";
        context.Set("portfolio",
            "\"portfolio\":[{\"name\":\"Stocks\",\"allocation\":0.6},{\"name\":\"Bonds\",\"allocation\":0.2},{\"name\":\"Cash\",\"allocation\":0.1},{\"name\":\"HomeEquity\",\"allocation\":0.1}]");

        context.Set("user", "\"user\":{\"age\":30,\"income\":100000,\"risk\":0.5}");

        var result = await _kernel.RunAsync(
            context,
            web["SearchAsync"],
            advisorSkill["PortfolioAllocation"]);

        Console.WriteLine("Result:");
        Console.WriteLine(result);
        Console.WriteLine("End Result");

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
        var newPrompt =
            $"{prompt}\n\nSimilar recommendations:\n{string.Join("\n", similarTexts)}\n\nLatest news:\n{string.Join("\n", newsResults.Result)}\n\n";

        // Call text completion API

        return Ok(new { Recommendation = newsResults.Result, Prompt = newPrompt });
    }
}