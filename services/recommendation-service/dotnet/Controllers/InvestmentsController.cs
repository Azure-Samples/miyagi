using System.Diagnostics;
using System.Text.Json;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Models;
using GBB.Miyagi.RecommendationService.Plugins;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.Planning;
using Microsoft.SemanticKernel.Planning.Stepwise;
using Microsoft.SemanticKernel.Plugins.Core;
using Microsoft.SemanticKernel.Plugins.Memory;
using Microsoft.SemanticKernel.Plugins.Web;
using Microsoft.SemanticKernel.Plugins.Web.Bing;
using ConsoleLogger = GBB.Miyagi.RecommendationService.Utils.ConsoleLogger;

namespace GBB.Miyagi.RecommendationService.Controllers;

/// <summary>
///     The static plan below is meant to emulate a plan generated from the following request:
///     "Summarize the content of cheese.txt and send me an email with the summary and a link to the file.
///     Then add a reminder to follow-up next week."
/// </summary>
[ApiController]
[Route("recommendations")]
public class InvestmentsController : ControllerBase
{
    private readonly IKernel _kernel;
    private readonly ISemanticTextMemory _memory;
    private readonly KernelSettings _kernelSettings = KernelSettings.LoadSettings();

    public InvestmentsController(IKernel kernel, ISemanticTextMemory memory)
    {
        _kernel = kernel;
        _memory = memory;
    }

    
    [HttpPost("/v2/investments")]
    public async Task<IActionResult> GetRecommendationsWithPlanner([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log.BeginScope("InvestmentController.GetRecommendationsAsync");
        // ========= Import Advisor skill from local filesystem =========
        log.LogDebug("Path: {P}", Directory.GetCurrentDirectory());
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        _kernel.ImportSemanticFunctionsFromDirectory(pluginsDirectory, "AdvisorPlugin");
        _kernel.ImportFunctions(new UserProfilePlugin(), "UserProfilePlugin");
        var memoryCollection = _kernelSettings.CollectionName;

        // ========= Fetch memory from vector store using recall =========
        _kernel.ImportFunctions(new TextMemoryPlugin(_memory));

        // ========= Set context variables for Advisor skill =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
        context.Set("voice", miyagiContext.UserInfo.FavoriteAdvisor);
        context.Set("risk", miyagiContext.UserInfo.RiskLevel);
        context.Set("semanticQuery", $"Investment advise for {miyagiContext.UserInfo.RiskLevel} risk level");

        context[TextMemoryPlugin.CollectionParam] = memoryCollection;
        //context[TextMemoryPlugin.KeyParam] = miyagiContext.UserInfo.FavoriteBook;
        context[TextMemoryPlugin.RelevanceParam] = "0.8";
        context[TextMemoryPlugin.LimitParam] = "3";
        context.Set("tickers", miyagiContext.Stocks?.Select(s => s.Symbol).ToList().ToString());
        
        // ========= Import Time Plugin =========
        _kernel.ImportFunctions(new TimePlugin(), "time");

        var ask = "Given stocks, return investment advise, factoring current inflation from search?";

        Console.WriteLine("*****************************************************");
        Stopwatch sw = new();
        Console.WriteLine("Question: " + ask);

        var plannerConfig = new StepwisePlannerConfig();
        plannerConfig.IncludedFunctions.Add("InvestmentAdvise");
        plannerConfig.MinIterationTimeMs = 1500;
        plannerConfig.MaxTokens = 3000;

        StepwisePlanner planner = new(_kernel, plannerConfig);
        sw.Start();
        var plan = planner.CreatePlan(ask);

        var result = await plan.InvokeAsync(_kernel.CreateNewContext());
        Console.WriteLine("Result: " + result);

        Console.WriteLine("Time Taken: " + sw.Elapsed);
        Console.WriteLine("*****************************************************");

        var output = result.GetValue<string>()?.Replace("\n", "");

        var jsonDocument = JsonDocument.Parse(output ?? string.Empty);

        return new JsonResult(jsonDocument);

    }
    
    [HttpPost("/investments")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log.BeginScope("InvestmentController.GetRecommendationsAsync");
        // ========= Import Advisor skill from local filesystem =========
        log.LogDebug("Path: {P}", Directory.GetCurrentDirectory());
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        var advisorPlugin = _kernel.ImportSemanticFunctionsFromDirectory(pluginsDirectory, "AdvisorPlugin");
        var userProfilePlugin = _kernel.ImportFunctions(new UserProfilePlugin(), "UserProfilePlugin");
        var memoryCollection = _kernelSettings.CollectionName;
        // ========= Fetch memory from vector store using recall =========
        _kernel.ImportFunctions(new TextMemoryPlugin(_memory));

        // ========= Set context variables for Advisor skill =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
        context.Set("voice", miyagiContext.UserInfo.FavoriteAdvisor);
        context.Set("risk", miyagiContext.UserInfo.RiskLevel);
        context.Set("semanticQuery", $"Investment advise for {miyagiContext.UserInfo.RiskLevel} risk level");

        context[TextMemoryPlugin.CollectionParam] = memoryCollection;
        //context[TextMemoryPlugin.KeyParam] = miyagiContext.UserInfo.FavoriteBook;
        context[TextMemoryPlugin.RelevanceParam] = "0.8";
        context[TextMemoryPlugin.LimitParam] = "3";
        context.Set("tickers", miyagiContext.Stocks?.Select(s => s.Symbol).ToList().ToString());
        
        log.LogDebug("Context: {S}", context.ToString());

        const int maxRetries = 2;
        for (var currentRetry = 0; currentRetry < maxRetries; currentRetry++)
            try
            {
                // ========= Bing Connector - RaG with current data =========
                var bingConnector = new BingConnector(_kernelSettings.BingApiKey);
                _kernel.ImportFunctions(new WebSearchEnginePlugin(bingConnector), "bing");
                
                var bingPlugin = _kernel.Functions.GetFunction("bing", "search");
                var question = "What is the current inflation rate?";
                var bingResult = await _kernel.RunAsync(question, bingPlugin);
                context.Set("bingResults", bingResult.GetValue<string>());
                log.LogDebug("Bing Result: {S}", bingResult.GetValue<string>());

                var memories = _memory.SearchAsync(collection: memoryCollection,
                    query: "investment advise",
                    limit: 3,
                    minRelevanceScore: 0.8);

                await foreach (var memory in memories)
                    log.LogInformation("Memory metadata - Id: {Id}, Description: {Description}", memory.Metadata.Id,
                        memory.Metadata.Description);


                // ========= Orchestrate with LLM using context, connector, and memory =========
                var result = await _kernel.RunAsync(
                    context,
                    userProfilePlugin["GetUserAge"],
                    userProfilePlugin["GetAnnualHouseholdIncome"],
                    advisorPlugin["InvestmentAdvise"]);
                log.LogDebug("Result: {S}", result.GetValue<string>());
                var output = result.GetValue<string>()?.Replace("\n", "");

                var jsonDocument = JsonDocument.Parse(output ?? string.Empty);

                return new JsonResult(jsonDocument);
            }
            catch (JsonException ex)
            {
                if (currentRetry == maxRetries - 1)
                {
                    // Handle error gracefully, e.g. return an error response
                    log.LogError(ex, "Failed to parse JSON data");
                    return BadRequest(new { error = "Failed to parse JSON data after retrying investments" });
                }

                // Log the error and proceed to the next iteration to retry
                log.LogError(ex, "Failed to parse JSON data, retry attempt {CurrentRetry}", currentRetry + 1);
            }

        log.LogError("Failed to parse JSON data, returning 400");
        return BadRequest(new { error = "Unexpected error occurred during processing investments" });
    }
}