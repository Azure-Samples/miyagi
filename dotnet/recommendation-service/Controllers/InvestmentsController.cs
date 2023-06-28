using System.Text.Json;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.plugins;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AI.OpenAI.Tokenizers;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.Skills.Core;
using Microsoft.SemanticKernel.Skills.Web;

namespace GBB.Miyagi.RecommendationService.Controllers;

/// <summary>
/// The static plan below is meant to emulate a plan generated from the following request:
///   "Summarize the content of cheese.txt and send me an email with the summary and a link to the file.
///    Then add a reminder to follow-up next week."
/// </summary>
[ApiController]
[Route("recommendations")]
public class InvestmentsController : ControllerBase
{
    private const string MemoryCollectionName = "miyagi_subreddits";
    private const string DefaultSubReddit = "wallstreetbets";
    private readonly IKernel _kernel;
    private readonly WebSearchEngineSkill _webSearchEngineSkill;

    public InvestmentsController(IKernel kernel, WebSearchEngineSkill webSearchEngineSkill)
    {
        _kernel = kernel;
        _webSearchEngineSkill = webSearchEngineSkill;
    }

    [HttpPost("/investments")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        // ========= Import Advisor skill from local filesystem =========

        // TODO: Replace local filesystem with Azure Blob Storage
        var skillsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Skills");
        var advisorSkill = _kernel.ImportSemanticSkillFromDirectory(skillsDirectory, "AdvisorSkill");
        var userProfileSkill = _kernel.ImportSkill(new UserProfilePlugin(), "UserProfileSkill");

        // ========= Fetch memory from vector store using recall =========
        
        var memorySkill = new TextMemorySkill();
        _kernel.ImportSkill(new TextMemorySkill());
        
        // ========= Set context variables for Advisor skill =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
        context.Set("voice", miyagiContext.UserInfo.FavoriteAdvisor);
        context.Set("risk", miyagiContext.UserInfo.RiskLevel);
        
        context[TextMemorySkill.CollectionParam] = MemoryCollectionName;
        context[TextMemorySkill.KeyParam] = miyagiContext.UserInfo.FavoriteSubReddit ?? DefaultSubReddit;
        context[TextMemorySkill.RelevanceParam] = "0.8";
        context[TextMemorySkill.LimitParam] = "3";
        context.Set("tickers", miyagiContext.Stocks?.Select(s => s.Symbol).ToList().ToString());

        // ========= Log token count, which determines cost =========
        var numTokens = GPT3Tokenizer.Encode(context.ToString()).Count;
        _kernel.Log.LogDebug("Number of Tokens: {N}", numTokens);
        _kernel.Log.LogDebug("Context: {S}", context.ToString());
        
        // ========= Prometheus - RaG with current data =========
        // // TODO: Swap Bing Web Search with News Search.
        var search = _kernel.ImportSkill(_webSearchEngineSkill, "bing");
        var bingResult = await _kernel.RunAsync(
            "Inflation and mortgage interest rates",
            search["SearchAsync"]
        );
        context.Set("bingResult", bingResult.Result);
        _kernel.Log.LogDebug("Bing Result: {S}", bingResult.Result);

        // ========= Orchestrate with LLM using context, connector, and memory =========
        var result = await _kernel.RunAsync(
            context,
            userProfileSkill["GetUserAge"],
            userProfileSkill["GetAnnualHouseholdIncome"],
            advisorSkill["InvestmentAdvise"]);
        _kernel.Log.LogDebug("Result: {S}", result.Result);
        numTokens = GPT3Tokenizer.Encode(result.Result).Count;
        _kernel.Log.LogDebug("Number of Tokens: {N}", numTokens);
        var output = result.Result.Replace("\n", "");

        return Content(output, "application/json");
    }
}