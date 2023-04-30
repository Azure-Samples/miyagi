using System.Text.Json;

namespace GBB.Miyagi.RecommendationService.Models;

public class Stock
{
    public String? Symbol { get; set; }
    public Double? Allocation { get; set; }
}