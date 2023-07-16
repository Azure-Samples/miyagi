namespace GBB.Miyagi.RecommendationService.models;

public class DatasetInfo
{
    public string DataSetName { get; set; }
    public string? BlobContainerName { get; set; }

    public UserInfo? Metadata { get; set; }
}