using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;

namespace GBB.Miyagi.RecommendationService.Controllers;

[ApiController]
[Route("memory")]
public class MemoryController : ControllerBase
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IKernel _kernel;
    
    public MemoryController(IKernel kernel, BlobServiceClient blobServiceClient)
    {
        _kernel = kernel;
        _blobServiceClient = blobServiceClient;
    }
    
    [HttpGet("/collections/{containerName}")]
    public async Task<IActionResult> ListBlobsAsync(string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobs = new List<string>();

        await foreach (var blob in containerClient.GetBlobsAsync()) blobs.Add(blob.Name);

        return Ok(blobs);
    }

    [HttpPost("/collections")]
    public async Task<IActionResult> SendBlobToQdrantAsync([FromBody] SubRedditBlobInfo subRedditBlobInfo)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(subRedditBlobInfo.ContainerName);
        var blobClient = containerClient.GetBlobClient(subRedditBlobInfo.BlobName);

        var response = await blobClient.DownloadAsync();
        using var streamReader = new StreamReader(response.Value.Content);
        var text = await streamReader.ReadToEndAsync();

        // Save the text to Qdrant
        var memoryCollectionName = Env.Var("MEMORY_COLLECTION");
        var key = await _kernel.Memory.SaveInformationAsync(memoryCollectionName, id: subRedditBlobInfo.BlobName,
            text: text);

        return Ok(new { Id = key });
    }
}