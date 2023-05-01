using System.Text.Json;

namespace GBB.Miyagi.RecommendationService.Models;

public class Portfolio
{
    public String? Name { get; set; }
    public Double? Allocation { get; set; }
}