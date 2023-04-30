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
    public class InvestmentsController : ControllerBase
    {
        private readonly IKernel _kernel;

        public InvestmentsController(IKernel kernel)
        {
            _kernel = kernel;
        }

        [HttpPost("/investments")]
        public async Task<IActionResult> GetRecommendations([FromBody] MiyagiContext miyagiContext)
        {

            var skillsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Skills");
            var userProfileSkill = _kernel.ImportSkill(new UserProfileSkill(), "UserProfileSkill");
            var advisorSkill = _kernel.ImportSemanticSkillFromDirectory(skillsDirectory, "AdvisorSkill");
            
            var context = new ContextVariables();

            context.Set("stocks", JsonSerializer.Serialize(miyagiContext.Stocks));
            context.Set("voice", miyagiContext.FavoriteAdvisor);
            context.Set("userId", miyagiContext.UserId);
            context.Set("income", miyagiContext.AnnualHouseholdIncome.ToString());
            context.Set("risk", miyagiContext.RiskLevel);
            
            _kernel.Log.LogDebug("Context: {0}", context.ToString());
            
            var result = await _kernel.RunAsync(
                context,
                advisorSkill["InvestmentAdvise"]);

            _kernel.Log.LogDebug("Result: {0}", result.Result);
            
            var output = result.Result.Replace("\n", "");
            
            return Content(output, "application/json");
        }

    }
}
