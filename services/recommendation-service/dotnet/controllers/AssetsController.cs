using System.Diagnostics;
using System.Text.Json;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.plugins;
using GBB.Miyagi.RecommendationService.utils;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AI.OpenAI.Tokenizers;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.Planning;
using Microsoft.SemanticKernel.TemplateEngine;

namespace GBB.Miyagi.RecommendationService.Controllers;

/// <summary>
/// The controller below is used to recommend asset allocation to the user, given their preferences.
///   Usage: POST /assets with miyagiContext as the JSON body
/// </summary>
[ApiController]
[Route("recommendations")]
public class AssetsController : ControllerBase
{
    private readonly IKernel _kernel;
    private const string DefaultRiskLevel = "moderate";

    /// <summary>
    /// Initializes a new instance of the <see cref="AssetsController"/> class.
    /// </summary>
    public AssetsController(IKernel kernel)
    {
        _kernel = kernel;
    }
    
    /// <summary>
    /// Returns the recommended asset allocation for the user using planner.
    /// </summary>
    /// <param name="miyagiContext">User preferences.</param>
    /// <returns>JSON object of LLM response with asset allocation</returns>
    [HttpPost("/assets")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log?.BeginScope("AssetsController.GetRecommendations");
        log?.LogDebug("*************************************");
        Stopwatch sw = new();
        sw.Start();
        // ========= Import semantic functions as plugins =========
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        var advisorPlugin = _kernel.ImportSemanticSkillFromDirectory(pluginsDirectory, "AdvisorPlugin");

        // ========= Import native function  =========
        var userProfilePlugin = _kernel.ImportSkill(new UserProfilePlugin(), "UserProfilePlugin");

        // ========= Set context variables to populate the prompt  =========
        SKContext context = _kernel.CreateNewContext();
        context.Variables.Set("userId", miyagiContext.UserInfo.UserId);
        context.Variables.Set("portfolio", JsonSerializer.Serialize(miyagiContext.Portfolio));
        context.Variables.Set("risk", miyagiContext.UserInfo.RiskLevel ?? DefaultRiskLevel);
        
        // ========= Chain and orchestrate with LLM =========
        var plan = new Plan("Execute userProfilePlugin and then advisorPlugin");
        plan.AddSteps(userProfilePlugin["GetUserAge"],
            userProfilePlugin["GetAnnualHouseholdIncome"],
            advisorPlugin["PortfolioAllocation"]);

        // Execute plan
        var ask = "Using the userId, get user age and household income, and then get the recommended asset allocation";
        context.Variables.Update(ask);
        log?.LogDebug("Planner steps: {N}", plan.Steps.Count);
        var result = await plan.InvokeAsync(context);

        // ========= Log token count, which determines cost =========
        var promptRenderer = new PromptTemplateEngine();
        var renderedPrompt = await promptRenderer.RenderAsync(
            ask,
            context);
        var numTokens = GPT3Tokenizer.Encode(renderedPrompt).Count;
        log?.LogDebug("Number of Tokens: {N}", numTokens);
        log?.LogDebug("Rendered Prompt: {S}", renderedPrompt);
        log?.LogDebug("Result: {S}", result.Result);
        if (result.Variables.TryGetValue("stepCount", out string? stepCount))
        {
            log?.LogDebug("Steps Taken: {N}", stepCount);
        }

        if (result.Variables.TryGetValue("skillCount", out string? skillCount))
        {
            log?.LogDebug("Skills Used: {N}", skillCount);
        }

        log?.LogDebug("Time Taken: {N}", sw.Elapsed);
        log?.LogDebug("*************************************");

        var output = result.Result.Replace("\n", "").Replace("\r", "").Replace(" ", "");

        return Content(output, "application/json");
    }
    

    /// <summary>
    /// Returns the recommended asset allocation for the user using RunAsync.
    /// </summary>
    /// <param name="miyagiContext">User preferences.</param>
    /// <returns>JSON object of LLM response with asset allocation</returns>
    [HttpPost("/assets-async")]
    public async Task<IActionResult> GetRecommendationsRunAsync([FromBody] MiyagiContext miyagiContext)
    {
        // ========= Import semantic functions as plugins =========
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        var advisorPlugin = _kernel.ImportSemanticSkillFromDirectory(pluginsDirectory, "AdvisorPlugin");

        // ========= Import native function  =========
        var userProfilePlugin = _kernel.ImportSkill(new UserProfilePlugin(), "UserProfilePlugin");

        // ========= Set context variables to populate the prompt  =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("portfolio", JsonSerializer.Serialize(miyagiContext.Portfolio));
        context.Set("risk", miyagiContext.UserInfo.RiskLevel ?? DefaultRiskLevel);

        Console.WriteLine("Context: {0}", context);
        // ========= Chain and orchestrate with LLM =========
        var result = await _kernel.RunAsync(
            context,
            userProfilePlugin["GetUserAge"],
            userProfilePlugin["GetAnnualHouseholdIncome"],
            advisorPlugin["PortfolioAllocation"]);

        // ========= Log token count, which determines cost =========
        var numTokens = GPT3Tokenizer.Encode(result.ToString()).Count;
        ConsoleLogger.Log.LogDebug("Number of Tokens: {N}", numTokens);
        ConsoleLogger.Log.LogDebug("Context: {S}", context.ToString());
        ConsoleLogger.Log.LogDebug("Result: {0}", result.Result);

        var output = result.Result.Replace("\n", "").Replace("\r", "").Replace(" ", "");

        return Content(output, "application/json");
    }
}