using Microsoft.AspNetCore.Mvc;

namespace GBB.Miyagi.RecommendationService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecommendationsController : ControllerBase
    {
        private static readonly string[] Questions = new[]
        {
            "Portfolio allocation", "Expenses reduction"
        };

        private readonly ILogger<RecommendationsController> _logger;

        public RecommendationsController(ILogger<RecommendationsController> logger)
        {
            _logger = logger;
        }

        [HttpPost(Name = "GetRecommendations")]
        public IEnumerable<Response> Post()
        {
            return Enumerable.Range(1, 5).Select(index => new Response
                {
                    Date = DateTime.Now.AddDays(index),
                    InteractionNum = Random.Shared.Next(-20, 55),
                    Summary = "Todo: SK to LLM flow"
                })
                .ToArray();
        }
    }
}