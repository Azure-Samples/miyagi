using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Text;

namespace GBB.Miyagi.RecommendationService.Controllers;

/// <summary>
/// Controller for hydrating vector database with proprietary datasets
/// </summary>
[ApiController]
[Route("memory")]
public class MemoryController : ControllerBase
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IKernel _kernel;
    private const int MaxTokensPerParagraph = 100;
    private const int MaxTokensPerLine = 30;
    
    public MemoryController(IKernel kernel, BlobServiceClient blobServiceClient)
    {
        _kernel = kernel;
        _blobServiceClient = blobServiceClient;
    }
    
    [HttpGet("/datasets/{containerName?}")]
    public async Task<IActionResult> ListDatasets(string containerName = null)
    {
        if (string.IsNullOrEmpty(containerName))
        {
            // Read files from local file system
            var directoryPath = Path.Combine("resources", "sample-datasets");
            if (Directory.Exists(directoryPath))
            {
                var files = Directory.GetFiles(directoryPath, "*.txt");
                return Ok(files);
            }

            return NotFound($"Directory {directoryPath} not found.");
        }

        // Read files from Azure Blob Storage
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobs = new List<string>();

        await foreach (var blob in containerClient.GetBlobsAsync()) blobs.Add(blob.Name);

        return Ok(blobs);
    }


    [HttpPost("/datasets")]
    public async Task<IActionResult> SaveDatasetAsync([FromBody] DatasetInfo datasetInfo)
    {
        string text;
        if (string.IsNullOrEmpty(datasetInfo.BlobContainerName))
        {
            // Read file from local file system
            var filePath = Path.Combine("resources", "sample-datasets", $"{datasetInfo.DataSetName}.txt");
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"File {filePath} not found.");
            }
            using var streamReader = new StreamReader(filePath);
            text = await streamReader.ReadToEndAsync();
        }
        else
        {
            // Read file from Azure Blob Storage
            var containerClient = _blobServiceClient.GetBlobContainerClient(datasetInfo.BlobContainerName);
            var blobClient = containerClient.GetBlobClient(datasetInfo.DataSetName);

            var response = await blobClient.DownloadAsync();
            using var streamReader = new StreamReader(response.Value.Content);
            text = await streamReader.ReadToEndAsync();
        }

        // Chunk, generate embeddings, and persist to vectordb
        var memoryCollectionName = Env.Var("MEMORY_COLLECTION");
        
        var lines = TextChunker.SplitPlainTextLines(text, MaxTokensPerLine);
        var chunks = TextChunker.SplitPlainTextParagraphs(lines, MaxTokensPerParagraph);

        for (var i = 0; i < chunks.Count; i++)
        {
            var chunk = chunks[i];
            await _kernel.Memory.SaveInformationAsync(
                collection: memoryCollectionName,
                text: chunk,
                id: $"{datasetInfo.DataSetName}-{i}",
                description: $"Dataset: {datasetInfo.DataSetName}");
        }

        return Ok(new { Id = datasetInfo.DataSetName });
    }

}