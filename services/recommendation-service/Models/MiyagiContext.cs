namespace GBB.Miyagi.RecommendationService.Models;

public class MiyagiContext
{
    public MiyagiContext()
    {
        UserInfo = new UserInfo();
        Portfolio = new List<Portfolio>();
        Stocks = new List<Stock>();
    }

    public UserInfo UserInfo { get; set; }
    public List<Portfolio>? Portfolio { get; set; }
    public List<Stock>? Stocks { get; set; }
}