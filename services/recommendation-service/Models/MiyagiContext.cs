namespace GBB.Miyagi.RecommendationService.Models;

public class MiyagiContext
{
    public string UserId { get; set; }
    public int? Age { get; set; }
    public string? RiskLevel { get; set; }
    public double? AnnualHouseholdIncome { get; set; }
    public string? FavoriteSubReddit { get; set; }
    public string? FavoriteAdvisor { get; set; }
    public List<Portfolio>? Portfolio { get; set; }
    public List<Stock>? Stocks { get; set; }
}
