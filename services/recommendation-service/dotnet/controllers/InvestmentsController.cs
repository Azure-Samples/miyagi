using System.Text.Json;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.plugins;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.AI.OpenAI.Tokenizers;
using Microsoft.SemanticKernel.Orchestration;
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
    private readonly WebSearchEngineSkill _webSearchEngineSkill;
    private readonly string _memoryCollection = Env.Var("MEMORY_COLLECTION");

    public InvestmentsController(IKernel kernel, WebSearchEngineSkill webSearchEngineSkill)
    {
        _kernel = kernel;
        _webSearchEngineSkill = webSearchEngineSkill;
    }

    [HttpPost("/investments")]
    public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
    {
        var log = ConsoleLogger.Log;
        log?.BeginScope("MemoryController.SaveDatasetAsync");
        // ========= Import Advisor skill from local filesystem =========
        var pluginsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Plugins");
        var advisorPlugin = _kernel.ImportSemanticSkillFromDirectory(pluginsDirectory, "AdvisorPlugin");
        var userProfilePlugin = _kernel.ImportSkill(new UserProfilePlugin(), "UserProfilePlugin");

        // ========= Fetch memory from vector store using recall =========
        _kernel.ImportSkill(new TextMemorySkill());

        // ========= Set context variables for Advisor skill =========
        var context = new ContextVariables();
        context.Set("userId", miyagiContext.UserInfo.UserId);
        context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
        context.Set("voice", miyagiContext.UserInfo.FavoriteAdvisor);
        context.Set("risk", miyagiContext.UserInfo.RiskLevel);

        context[TextMemorySkill.CollectionParam] = _memoryCollection;
        //context[TextMemorySkill.KeyParam] = miyagiContext.UserInfo.FavoriteBook;
        context[TextMemorySkill.RelevanceParam] = "0.8";
        context[TextMemorySkill.LimitParam] = "3";
        context.Set("tickers", miyagiContext.Stocks?.Select(s => s.Symbol).ToList().ToString());

        // ========= Log token count, which determines cost =========
        var numTokens = GPT3Tokenizer.Encode(context.ToString()).Count;
        log?.LogDebug("Number of Tokens: {N}", numTokens);
        log?.LogDebug("Context: {S}", context.ToString());

        // ========= Prometheus - RaG with current data =========
        // // TODO: Swap Bing Web Search with News Search.
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
        numTokens = GPT3Tokenizer.Encode(result.Result).Count;
        log?.LogDebug("Number of Tokens: {N}", numTokens);
        var output = result.Result.Replace("\n", "");

        return Content(output, "application/json");
    }
}