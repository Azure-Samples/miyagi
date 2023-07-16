namespace GBB.Miyagi.RecommendationService.models;

public class UserInfo
{
    public string UserId { get; set; }
    public int? Age { get; set; }
    public string? RiskLevel { get; set; }
    public double? AnnualHouseholdIncome { get; set; }
    public string? FavoriteBook { get; set; }
    public string? FavoriteAdvisor { get; set; }

    public override string ToString()
    {
        var ageString = Age.HasValue ? $"Age: {Age.Value}" : "Age: N/A";
        var riskLevelString = RiskLevel != null ? $"Risk Level: {RiskLevel}" : "Risk Level: N/A";
        var incomeString = AnnualHouseholdIncome.HasValue
            ? $"Annual Household Income: {AnnualHouseholdIncome.Value}"
            : "Annual Household Income: N/A";
        var favoriteBook = FavoriteBook != null ? $"Favorite Book: {FavoriteBook}" : "Favorite Book: N/A";
        var advisorString = FavoriteAdvisor != null ? $"Favorite Advisor: {FavoriteAdvisor}" : "Favorite Advisor: N/A";

        return $"User Id: {UserId}, {ageString}, {riskLevelString}, {incomeString}, {favoriteBook}, {advisorString}";
    }
}