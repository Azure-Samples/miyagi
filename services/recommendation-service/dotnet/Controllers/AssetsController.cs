using System.Diagnostics;
using System.Text.Json;
using GBB.Miyagi.RecommendationService.Models;
using GBB.Miyagi.RecommendationService.Plugins;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.TemplateEngine.Prompt;

namespace GBB.Miyagi.RecommendationService.Controllers;

/// <summary>
///     The controller below is used to recommend asset allocation to the user, given their preferences.
///     Usage: POST /assets with miyagiContext as the JSON body
/// </summary>
[ApiController]
[Route("recommendations")]
public class AssetsController : ControllerBase
{
    private const string DefaultRiskLevel = "moderate";
    private readonly Kernel _kernel;

    /// <summary>
    ///     Initializes a new instance of the <see cref="AssetsController" /> class.
    /// </summary>
    public AssetsController(Kernel kernel)
    {
        _kernel = kernel;
    }

    /// <summary>
    ///     Returns the recommended asset allocation for the user using planner.
    /// </summary>
    /// <param name="miyagiContext">User preferences.</param>
    /// <returns>JSON object of LLM response with asset allocation</returns>
    [HttpPost("/assets")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log.BeginScope("AssetsController.GetRecommendations");
        log.LogDebug("*************************************");
        Stopwatch sw = new();
        sw.Start();
        // ========= Import semantic functions as plugins =========
        log.LogDebug("Path: {S}", Directory.GetCurrentDirectory());
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
        var advisorPlugin = _kernel.ImportPluginFromPromptDirectory(pluginsDirectory, "AdvisorPlugin");

        // ========= Import native function  =========
        var userProfilePlugin = _kernel.ImportFunctions(new UserProfilePlugin(), "UserProfilePlugin");

        // ========= Set context variables to populate the prompt  =========
        var arguments = new KernelArguments()
        {
            ["userId"] = miyagiContext.UserInfo.UserId,
            ["portfolio"] = JsonSerializer.Serialize(miyagiContext.Portfolio),
            ["risk"] = miyagiContext.UserInfo.RiskLevel ?? DefaultRiskLevel
        };

        // ========= Chain and orchestrate with LLM =========
        var plan = new Plan("Execute userProfilePlugin and then advisorPlugin");
        plan.AddSteps(userProfilePlugin["GetUserAge"],
            userProfilePlugin["GetAnnualHouseholdIncome"],
            advisorPlugin["PortfolioAllocation"]);

        // Execute plan
        var ask = "Using the userId, get user age and household income, and then get the recommended asset allocation";
        context.Variables.Update(ask);
        log.LogDebug("Planner steps: {N}", plan.Steps.Count);
        var result = await plan.InvokeAsync(arguments);

        // ========= Log token count, which determines cost =========
        // Handler which is called before a function is invoked
        void MyInvokingHandler(object? sender, FunctionInvokingEventArgs e)
        {
            Console.WriteLine($"Invoking {e.Function.Name}");
        }

        // Handler which is called after a prompt is rendered
        void MyRenderedHandler(object? sender, PromptRenderedEventArgs e)
        {
            Console.WriteLine($"Prompt sent to model: {e.RenderedPrompt}");
        }

        // Handler which is called after a function is invoked
        void MyInvokedHandler(object? sender, FunctionInvokedEventArgs e)
        {
            if (e.Result.Metadata is not null && e.Result.Metadata.ContainsKey("Usage"))
            {
                Console.WriteLine($"Token usage: {e.Result.Metadata?["Usage"]?.AsJson()}");
            }
        }
        
        // Add the handlers to the kernel
        _kernel.FunctionInvoking += MyInvokingHandler;
        _kernel.PromptRendered += MyRenderedHandler;
        _kernel.FunctionInvoked += MyInvokedHandler;

        var output = result.GetValue<string>()?.Replace("\n", "").Replace("\r", "").Replace(" ", "");

        return Content(output ?? string.Empty, "application/json");
    }


    /// <summary>
    ///     Returns the recommended asset allocation for the user using RunAsync.
    /// </summary>
    /// <param name="miyagiContext">User preferences.</param>
    /// <returns>JSON object of LLM response with asset allocation</returns>
    [HttpPost("/assets-async")]
    public async Task<IActionResult> GetRecommendationsRunAsync([FromBody] MiyagiContext miyagiContext)
    {
        // ========= Import semantic functions as plugins =========
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "plugins");
        var advisorPlugin = _kernel.ImportSemanticFunctionsFromDirectory(pluginsDirectory, "AdvisorPlugin");

        // ========= Import native function  =========
        var userProfilePlugin = _kernel.ImportFunctions(new UserProfilePlugin(), "UserProfilePlugin");

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
        ConsoleLogger.Log.LogDebug("Context: {S}", context.ToString());
        ConsoleLogger.Log.LogDebug("Result: {S}", result.GetValue<string>());

        var output = result.GetValue<string>()?.Replace("\n", "").Replace("\r", "").Replace(" ", "");

        return Content(output ?? string.Empty, "application/json");
    }
}