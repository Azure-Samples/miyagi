using System.Text.Json;
using GBB.Miyagi.RecommendationService.Models;
using GBB.Miyagi.RecommendationService.Skills;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.CoreSkills;
using Microsoft.SemanticKernel.KernelExtensions;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.Skills.Web;

namespace GBB.Miyagi.RecommendationService.Controllers;

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
        var userProfileSkill = _kernel.ImportSkill(new UserProfileSkill(), "UserProfileSkill");

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

        _kernel.Log.LogDebug("Context: {0}", context.ToString());

        // ========= Orchestrate with LLM using context, connector, and memory =========
        var result = await _kernel.RunAsync(
            context,
            userProfileSkill["GetUserAge"],
            userProfileSkill["GetAnnualHouseholdIncome"],
            advisorSkill["InvestmentAdvise"]);
        _kernel.Log.LogDebug("Result: {0}", result.Result);

        var output = result.Result.Replace("\n", "");

        // TODO: Swap Bing Web Search with News Search.
        var search = _kernel.ImportSkill(_webSearchEngineSkill, "bing");
        var bingResult = await _kernel.RunAsync(
            "MSFT news",
            search["SearchAsync"]
        );
        _kernel.Log.LogDebug("Bing result: {0}", bingResult.Result);

        return Content(output, "application/json");
    }
}