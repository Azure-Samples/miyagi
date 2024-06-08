using System.Text.Json;
using GBB.Miyagi.RecommendationService.Models;
using GBB.Miyagi.RecommendationService.Resources;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Microsoft.SemanticKernel.PromptTemplates.Handlebars;

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
    ///     Returns the recommended asset allocation for the user.
    /// </summary>
    /// <param name="miyagiContext">User preferences.</param>
    /// <returns>JSON object of LLM response with asset allocation</returns>
    [HttpPost("/assets")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log.BeginScope("AssetsController.GetRecommendations");
        log.LogDebug("*************************************");
        
        // Load prompts
        var prompts = _kernel.CreatePluginFromPromptDirectory("Prompts");

        // Load prompt from YAML
        var promptYaml = EmbeddedResource.Read("Prompts.AssetAllocationAdvise.prompt.yaml");
        
        // Add arguments for context
        const string defaultRiskLevel = "Conservative";
        var arguments = new KernelArguments(new OpenAIPromptExecutionSettings
        {
            ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions,
            ResponseFormat = "json_object"
        })
        {
            ["userId"] = miyagiContext.UserInfo.UserId,
            ["portfolio"] = JsonSerializer.Serialize(miyagiContext.Portfolio),
            ["risk"] = miyagiContext.UserInfo.RiskLevel ?? defaultRiskLevel
        };
        
        KernelFunction investmentAdvise = _kernel.CreateFunctionFromPromptYaml(
            promptYaml,
            new HandlebarsPromptTemplateFactory()
        );
        
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
                    return BadRequest(new { error = "Failed to parse JSON data after retrying asset allocation" });
                }

                // Log the error and proceed to the next iteration to retry
                log.LogError(ex, "Failed to parse JSON data, retry attempt {CurrentRetry}", currentRetry + 1);
            }

        log.LogError("Failed to parse JSON data, returning 400");
        return BadRequest(new { error = "Unexpected error occurred during processing asset allocation" });
    }
}
