// Copyright (c) Microsoft. All rights reserved.

using System.Text.Json.Serialization;

namespace SemanticKernel.Service.CopilotChat.Skills.OpenApiSkills.MiyagiSkill.Model;

/// <summary>
/// Represents a Response.
/// </summary>
public class Response
{
    /// <summary>
    /// Gets or sets the Response message.
    /// </summary>
    [JsonPropertyName("message")]
    public string Message { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="Response"/> class.
    /// </summary>
    /// <param name="message">Response message</param>
    public Response(string message)
    {
        this.Message = message;
    }
}
