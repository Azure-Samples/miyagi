using Azure.Storage.Blobs;
using GBB.Miyagi.RecommendationService.models;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Text;

namespace GBB.Miyagi.RecommendationService.Controllers;

/// <summary>
///     Controller for hydrating vector database with proprietary datasets
/// </summary>
[ApiController]
[Route("memory")]
public class MemoryController : ControllerBase
{
    private const int MaxTokensPerParagraph = 160;
    private const int MaxTokensPerLine = 60;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly IKernel _kernel;

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
        var log = ConsoleLogger.Log;
        log?.BeginScope("MemoryController.SaveDatasetAsync");
        log?.LogInformation($"DatasetInfo: {datasetInfo}");
        string text;
        if (string.IsNullOrEmpty(datasetInfo.BlobContainerName))
        {
            // Read file from local file system
            var filePath = Path.Combine("resources", "sample-datasets", $"{datasetInfo.DataSetName}.txt");
            if (!System.IO.File.Exists(filePath)) return NotFound($"File {filePath} not found.");
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
        log?.LogInformation($"Saving dataset {datasetInfo.DataSetName} to memory collection {memoryCollectionName}");

        var lines = TextChunker.SplitPlainTextLines(text, MaxTokensPerLine);
        var chunks = TextChunker.SplitPlainTextParagraphs(lines, MaxTokensPerParagraph);

        for (var i = 0; i < chunks.Count; i++)
        {
            var chunk = chunks[i];
            var key = await _kernel.Memory.SaveInformationAsync(
                memoryCollectionName,
                chunk,
                $"{datasetInfo.DataSetName}-{i}",
                $"Dataset: {datasetInfo.DataSetName}",
                datasetInfo.Metadata?.ToString());
            log?.LogInformation($"Saved chunk {i} with text {chunk}");
        }

        return Ok(new { datasetInfo.DataSetName, chunks.Count });
    }
}