using System.Reflection;
using System.Text.Json;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Models;
using GBB.Miyagi.RecommendationService.Plugins;
using GBB.Miyagi.RecommendationService.Resources;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.Memory;
using Microsoft.SemanticKernel.Plugins.Memory;
using Microsoft.SemanticKernel.PromptTemplates.Handlebars;
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
    private readonly Kernel _kernel;
    private readonly KernelSettings _kernelSettings = KernelSettings.LoadSettings();
    private SemanticTextMemory _memory;

    public InvestmentsController(Kernel kernel, SemanticTextMemory memory)
    {
        _kernel = kernel;
        _memory = memory;
    }
    
    
    [HttpPost("/investments")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log.BeginScope("InvestmentController.GetRecommendationsAsync");
        // ========= Import Advisor skill from local filesystem =========
        
        // Load prompts
        var prompts = _kernel.CreatePluginFromPromptDirectory("Prompts");

        // Load prompt from YAML
        var promptYaml = EmbeddedResource.Read("Prompts.InvestmentAdvise.prompt.yaml");
        //using StreamReader reader = new(Assembly.GetExecutingAssembly().GetManifestResourceStream("prompts.InvestmentAdvise.prompt.yaml")!);
        KernelFunction investmentAdvise = _kernel.CreateFunctionFromPromptYaml(
            promptYaml,
            new HandlebarsPromptTemplateFactory()
        );
        
        // Import TextMemoryPlugin
        _kernel.ImportPluginFromObject(new TextMemoryPlugin(_memory));
        
        // Create few-shot examples
        List<ChatHistory> fewShotExamples = [
            [
                new ChatMessageContent(AuthorRole.User, @"{""stocks"":[{""symbol"":""MSFT"",""allocation"":0.6},{""symbol"":""ACN"",""allocation"":0.4}]}"),
                new ChatMessageContent(AuthorRole.Assistant, @"{""portfolio"":[{""symbol"":""MSFT"",""gptRecommendation"":""Booyah! Hold on, steady growth! Diversify, though!""},{""symbol"":""ACN"",""gptRecommendation"":""Buy! Services will see a boom!""}]}")
            ]
        ];
        
        // Add arguments for context
        const string defaultRiskLevel = "Conservative";
        var arguments = new KernelArguments
        {
            ["userId"] = miyagiContext.UserInfo.UserId,
            ["stocks"] = JsonSerializer.Serialize(miyagiContext.Stocks),
            ["risk"] = miyagiContext.UserInfo.RiskLevel ?? defaultRiskLevel,
            ["fewShotExamples"] = fewShotExamples,
            ["voice"] = miyagiContext.UserInfo.FavoriteAdvisor,
            ["semanticQuery"] = $"Investment advise for {miyagiContext.UserInfo.RiskLevel} risk level",
            [TextMemoryPlugin.CollectionParam] = _kernelSettings.CollectionName,
            [TextMemoryPlugin.RelevanceParam] = "0.8"
        };

        _kernel.Plugins.AddFromType<UserProfilePlugin>();
        
        // Call LLM with function calling
        OpenAIPromptExecutionSettings settings = new() { ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions };
        var result = await _kernel.InvokeAsync(
            investmentAdvise,
            arguments
        );

        const int maxRetries = 2;
        for (var currentRetry = 0; currentRetry < maxRetries; currentRetry++)
            try
            {
                var jsonDocument = JsonDocument.Parse(result.GetValue<string>() ?? string.Empty);
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
    
        [HttpPost("/v2/investments")]
    public async Task<IActionResult> GetRecommendationsWithPlanner([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log.BeginScope("InvestmentController.GetRecommendationsAsync");
        // ========= Import Advisor skill from local filesystem =========

        return null;

    }
}