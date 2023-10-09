using System.Diagnostics;
using System.Text.Json;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.plugins;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.Planning;
using Microsoft.SemanticKernel.Planning.Stepwise;
using Microsoft.SemanticKernel.Skills.Core;
using Microsoft.SemanticKernel.Skills.Web;

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
    private readonly string _memoryCollection = Env.Var("MEMORY_COLLECTION");
    private readonly WebSearchEngineSkill _webSearchEngineSkill;

    public InvestmentsController(IKernel kernel, WebSearchEngineSkill webSearchEngineSkill)
    {
        _kernel = kernel;
        _webSearchEngineSkill = webSearchEngineSkill;
    }

    
    [HttpPost("/v2/investments")]
    public async Task<IActionResult> GetRecommendationsWithPlanner([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log?.BeginScope("InvestmentController.GetRecommendationsAsync");
        // ========= Import Advisor skill from local filesystem =========
        log?.LogDebug("Path: {P}", Directory.GetCurrentDirectory());
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        _kernel.ImportSemanticSkillFromDirectory(pluginsDirectory, "AdvisorPlugin");
        _kernel.ImportSkill(new UserProfilePlugin(), "UserProfilePlugin");

        // ========= Fetch memory from vector store using recall =========
        _kernel.ImportSkill(new TextMemorySkill(_kernel.Memory));

        // ========= Set context variables for Advisor skill =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
        context.Set("voice", miyagiContext.UserInfo.FavoriteAdvisor);
        context.Set("risk", miyagiContext.UserInfo.RiskLevel);
        context.Set("semanticQuery", $"Investment advise for {miyagiContext.UserInfo.RiskLevel} risk level");

        context[TextMemorySkill.CollectionParam] = _memoryCollection;
        //context[TextMemorySkill.KeyParam] = miyagiContext.UserInfo.FavoriteBook;
        context[TextMemorySkill.RelevanceParam] = "0.8";
        context[TextMemorySkill.LimitParam] = "3";
        context.Set("tickers", miyagiContext.Stocks?.Select(s => s.Symbol).ToList().ToString());
        
        // ========= Import Bing web search skill to augment current info =========
        _kernel.ImportSkill(_webSearchEngineSkill, "WebSearch");
        _kernel.ImportSkill(new TimeSkill(), "time");

        var ask = "Given stocks, return investment advise, factoring current inflation from search?";

        Console.WriteLine("*****************************************************");
        Stopwatch sw = new();
        Console.WriteLine("Question: " + ask);

        var plannerConfig = new StepwisePlannerConfig();
        plannerConfig.ExcludedFunctions.Add("PortfolioAllocation");
        plannerConfig.MinIterationTimeMs = 1500;
        plannerConfig.MaxTokens = 3000;

        StepwisePlanner planner = new(_kernel, plannerConfig);
        sw.Start();
        var plan = planner.CreatePlan(ask);

        var result = await plan.InvokeAsync(_kernel.CreateNewContext());
        Console.WriteLine("Result: " + result);
        if (result.Variables.TryGetValue("stepCount", out string? stepCount))
        {
            Console.WriteLine("Steps Taken: " + stepCount);
        }

        if (result.Variables.TryGetValue("skillCount", out string? skillCount))
        {
            Console.WriteLine("Skills Used: " + skillCount);
        }

        Console.WriteLine("Time Taken: " + sw.Elapsed);
        Console.WriteLine("*****************************************************");

        var output = result.Result.Replace("\n", "");

        var jsonDocument = JsonDocument.Parse(output);

        return new JsonResult(jsonDocument);

    }
    
    [HttpPost("/investments")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log?.BeginScope("InvestmentController.GetRecommendationsAsync");
        // ========= Import Advisor skill from local filesystem =========
        log?.LogDebug("Path: {P}", Directory.GetCurrentDirectory());
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        var advisorPlugin = _kernel.ImportSemanticSkillFromDirectory(pluginsDirectory, "AdvisorPlugin");
        var userProfilePlugin = _kernel.ImportSkill(new UserProfilePlugin(), "UserProfilePlugin");

        // ========= Fetch memory from vector store using recall =========
        _kernel.ImportSkill(new TextMemorySkill(_kernel.Memory));

        // ========= Set context variables for Advisor skill =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
        context.Set("voice", miyagiContext.UserInfo.FavoriteAdvisor);
        context.Set("risk", miyagiContext.UserInfo.RiskLevel);
        context.Set("semanticQuery", $"Investment advise for {miyagiContext.UserInfo.RiskLevel} risk level");

        context[TextMemorySkill.CollectionParam] = _memoryCollection;
        //context[TextMemorySkill.KeyParam] = miyagiContext.UserInfo.FavoriteBook;
        context[TextMemorySkill.RelevanceParam] = "0.8";
        context[TextMemorySkill.LimitParam] = "3";
        context.Set("tickers", miyagiContext.Stocks?.Select(s => s.Symbol).ToList().ToString());
        
        log?.LogDebug("Context: {S}", context.ToString());

        const int maxRetries = 2;
        for (var currentRetry = 0; currentRetry < maxRetries; currentRetry++)
            try
            {
                // ========= Prometheus - RaG with current data =========
                _kernel.ImportSkill(_webSearchEngineSkill, "bing");
                var question = "What is the current inflation rate?";
                var bingResult = await _kernel.Func("bing", "search").InvokeAsync(question);
                context.Set("bingResult", bingResult.Result);
                log?.LogDebug("Bing Result: {S}", bingResult.Result);

                var searchResults = _kernel.Memory.SearchAsync(_memoryCollection, "investment advise", 3, 0.8);

                await foreach (var item in searchResults) log?.LogDebug(item.Metadata.Text + " : " + item.Relevance);

                // ========= Orchestrate with LLM using context, connector, and memory =========
                var result = await _kernel.RunAsync(
                    context,
                    userProfilePlugin["GetUserAge"],
                    userProfilePlugin["GetAnnualHouseholdIncome"],
                    advisorPlugin["InvestmentAdvise"]);
                log?.LogDebug("Result: {S}", result.Result);
                var output = result.Result.Replace("\n", "");

                var jsonDocument = JsonDocument.Parse(output);

                return new JsonResult(jsonDocument);
            }
            catch (JsonException ex)
            {
                if (currentRetry == maxRetries - 1)
                {
                    // Handle error gracefully, e.g. return an error response
                    log?.LogError(ex, "Failed to parse JSON data");
                    return BadRequest(new { error = "Failed to parse JSON data after retrying investments" });
                }

                // Log the error and proceed to the next iteration to retry
                log?.LogError(ex, $"Failed to parse JSON data, retry attempt {currentRetry + 1}");
            }

        log?.LogError("Failed to parse JSON data, returning 400");
        return BadRequest(new { error = "Unexpected error occurred during processing investments" });
    }
}