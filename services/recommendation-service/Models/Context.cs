namespace GBB.Miyagi.RecommendationService.Models;

public class Context
{
    public string Input { get; set; }
    public string UserId { get; set; }
    public string FirstName { get; set; }
    public string? LastName { get; set; }
    public int? Age { get; set; }
    public string? RiskLevel { get; set; }
    public string? FavoriteSubReddit { get; set; }
    public List<string>? Portfolio { get; set; }
}
