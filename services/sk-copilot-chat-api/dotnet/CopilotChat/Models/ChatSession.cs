﻿// Copyright (c) Microsoft. All rights reserved.

using System;
using System.Text.Json.Serialization;
using SemanticKernel.Service.CopilotChat.Storage;

namespace SemanticKernel.Service.CopilotChat.Models;

/// <summary>
/// A chat session
/// </summary>
public class ChatSession : IStorageEntity
{
    /// <summary>
    /// Chat ID that is persistent and unique.
    /// </summary>
    [JsonPropertyName("id")]
    public string Id { get; set; }

    /// <summary>
    /// Title of the chat.
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; }

    /// <summary>
    /// Timestamp of the chat creation.
    /// </summary>
    [JsonPropertyName("createdOn")]
    public DateTimeOffset CreatedOn { get; set; }

    public ChatSession(string title)
    {
        this.Id = Guid.NewGuid().ToString();
        this.Title = title;
        this.CreatedOn = DateTimeOffset.Now;
    }
}
