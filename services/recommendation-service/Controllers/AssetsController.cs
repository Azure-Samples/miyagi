using GBB.Miyagi.RecommendationService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.KernelExtensions;
using Microsoft.SemanticKernel.Orchestration;
using System.Text.Json;

namespace GBB.Miyagi.RecommendationService.Controllers
{
    [ApiController]
    [Route("recommendations")]
    public class AssetsController : ControllerBase
    {
        private readonly IKernel _kernel;

        public AssetsController(IKernel kernel)
        {
            _kernel = kernel;
        }

        [HttpPost("/assets")]
        public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
        {

            var skillsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Skills");

            var advisorSkill = _kernel.ImportSemanticSkillFromDirectory(skillsDirectory, "AdvisorSkill");
            
            var context = new ContextVariables();
            //context.Set("portfolio", "\"portfolio\":[{\"name\":\"Stocks\",\"allocation\":0.6},{\"name\":\"Bonds\",\"allocation\":0.2},{\"name\":\"Cash\",\"allocation\":0.1},{\"name\":\"HomeEquity\",\"allocation\":0.1}]");
            //context.Set("user", "\"user\":{\"age\":50,\"income\":100000,\"risk\":0.5}");
            
            context.Set("portfolio", JsonSerializer.Serialize(miyagiContext.Portfolio));
            context.Set("age", miyagiContext.Age.ToString());
            context.Set("income", miyagiContext.AnnualHouseholdIncome.ToString());
            context.Set("risk", miyagiContext.RiskLevel);
            
            _kernel.Log.LogDebug("Context: {0}", context.ToString());
            
            var result = await _kernel.RunAsync(
                context,
                advisorSkill["PortfolioAllocation"]);

            _kernel.Log.LogDebug("Result: {0}", result.Result);
            
            var output = result.Result.Replace("\n", "").Replace("\r", "").Replace(" ", "");

            /*// Deserialize the result JSON string into a PortfolioRecommendations object
            var recommendations = JsonConvert.DeserializeObject<PortfolioRecommendations>(result.Result);

            // You can now access and manipulate the recommendations object as needed
            // For example, you can print the name and recommendation for each asset in the portfolio
            foreach (var asset in recommendations.Portfolio)
            {
                Console.WriteLine($"Name: {asset.Name}, GPT Recommendation: {asset.GptRecommendation}");
            }*/
            
            return Content(output, "application/json");
        }

    }
}
