using System.Text.Json;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.plugins;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AI.OpenAI.Tokenizers;
using Microsoft.SemanticKernel.Orchestration;

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
    /// Returns the recommended asset allocation for the user.
    /// </summary>
    /// <param name="miyagiContext">User preferences.</param>
    /// <returns>JSON object of LLM response with asset allocation</returns>
    [HttpPost("/assets")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
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

        // ========= Log token count, which determines cost =========
        var numTokens = GPT3Tokenizer.Encode(context.ToString()).Count;
        _kernel.Log.LogDebug("Number of Tokens: {N}", numTokens);
        _kernel.Log.LogDebug("Context: {S}", context.ToString());

        // ========= Chain and orchestrate with LLM =========
        var result = await _kernel.RunAsync(
            context,
            userProfilePlugin["GetUserAge"],
            userProfilePlugin["GetAnnualHouseholdIncome"],
            advisorPlugin["PortfolioAllocation"]);

        _kernel.Log.LogDebug("Result: {0}", result.Result);

        var output = result.Result.Replace("\n", "").Replace("\r", "").Replace(" ", "");

        return Content(output, "application/json");
    }
}