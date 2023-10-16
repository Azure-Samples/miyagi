using Microsoft.Azure.Cosmos;

namespace GBB.Miyagi.RecommendationService.config;

public class CosmosDbService
{
    private readonly Container _container;

    public CosmosDbService(CosmosClient cosmosClient)
    {
        var kernelSettings = KernelSettings.LoadSettings();
        _container = cosmosClient.GetContainer(
            kernelSettings.CosmosDbName, 
            kernelSettings.CosmosDbContainerName);
    }

    public async Task AddItemAsync<T>(T item, string partitionKeyValue)
    {
        var itemWithPartitionKey = new
        {
            id = Guid.NewGuid().ToString(),
            partitionKey = partitionKeyValue,
            data = item
        };
        await _container.CreateItemAsync(itemWithPartitionKey, new PartitionKey(partitionKeyValue));
    }
    
}
