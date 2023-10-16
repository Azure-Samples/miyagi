namespace GBB.Miyagi.RecommendationService.Models;

public class DatasetInfo
{
    public string DataSetName { get; set; }
    public string? BlobContainerName { get; set; }

    public UserInfo? Metadata { get; set; }
}