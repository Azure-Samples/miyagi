using System.Text.Json;
using GBB.Miyagi.RecommendationService.config;
using GBB.Miyagi.RecommendationService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Memory;
using ConsoleLogger = GBB.Miyagi.RecommendationService.Utils.ConsoleLogger;

namespace GBB.Miyagi.RecommendationService.Controllers;

[ApiController]
[Route("recommendations")]
public class RecommendationsController : ControllerBase
{
    private readonly AssetsController _assetsController;

    private readonly InvestmentsController _investmentsController;
    private readonly CosmosDbService _cosmosDbService;

    public RecommendationsController(Kernel kernel,
        SemanticTextMemory memory,
        CosmosDbService cosmosDbService)
    {
        _assetsController = new AssetsController(kernel);
        _investmentsController = new InvestmentsController(kernel, memory);
        _cosmosDbService = cosmosDbService;
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
                var assetsResult = await _assetsController.GetRecommendations(miyagiContext) as JsonResult;
                var investmentsResult = await _investmentsController.GetRecommendations(miyagiContext) as JsonResult;

                if (assetsResult == null || investmentsResult == null)
                {
                    return StatusCode(500, "Failed to get recommendations");
                }
                
                var assetsJson = assetsResult.Value as JsonDocument;
                var investmentsJson = investmentsResult.Value as JsonDocument;

                if (investmentsJson == null) continue;
                var aggregatedResult = new Dictionary<string, JsonElement>
                {
                    { "assets", assetsJson.RootElement },
                    { "investments", investmentsJson.RootElement }
                };

                // Save result to CosmosDB
                await _cosmosDbService.AddItemAsync(
                    new { Request = miyagiContext, Response = aggregatedResult },
                    miyagiContext.UserInfo.UserId);
                
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
    
}