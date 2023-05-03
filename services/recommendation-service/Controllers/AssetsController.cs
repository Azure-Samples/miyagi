using GBB.Miyagi.RecommendationService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.KernelExtensions;
using Microsoft.SemanticKernel.Orchestration;
using System.Text.Json;
using GBB.Miyagi.RecommendationService.Skills;

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
            
            var userProfileSkill = _kernel.ImportSkill(new UserProfileSkill(), "UserProfileSkill");
            
            var context = new ContextVariables();
            context.Set("userId", miyagiContext.UserInfo.UserId);
            context.Set("portfolio", JsonSerializer.Serialize(miyagiContext.Portfolio));
            context.Set("risk", miyagiContext.UserInfo.RiskLevel);
            
            _kernel.Log.LogDebug("Context: {0}", context.ToString());
            
            var result = await _kernel.RunAsync(
                context,
                userProfileSkill["GetUserAge"],
                userProfileSkill["GetAnnualHouseholdIncome"],
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
