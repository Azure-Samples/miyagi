﻿// Copyright (c) Microsoft. All rights reserved.

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.AI.TextCompletion;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.SkillDefinition;
using Microsoft.SemanticKernel.TemplateEngine;
using SemanticKernel.Service.CopilotChat.Models;
using SemanticKernel.Service.CopilotChat.Options;
using SemanticKernel.Service.CopilotChat.Storage;

namespace SemanticKernel.Service.CopilotChat.Skills.ChatSkills;

/// <summary>
/// ChatSkill offers a more coherent chat experience by using memories
/// to extract conversation history and user intentions.
/// </summary>
public class ChatSkill
{
    /// <summary>
    /// A kernel instance to create a completion function since each invocation
    /// of the <see cref="ChatAsync"/> function will generate a new prompt dynamically.
    /// </summary>
    private readonly IKernel _kernel;

    /// <summary>
    /// A repository to save and retrieve chat messages.
    /// </summary>
    private readonly ChatMessageRepository _chatMessageRepository;

    /// <summary>
    /// A repository to save and retrieve chat sessions.
    /// </summary>
    private readonly ChatSessionRepository _chatSessionRepository;

    /// <summary>
    /// Settings containing prompt texts.
    /// </summary>
    private readonly PromptsOptions _promptOptions;

    /// <summary>
    /// A semantic chat memory skill instance to query semantic memories.
    /// </summary>
    private readonly SemanticChatMemorySkill _semanticChatMemorySkill;

    /// <summary>
    /// A document memory skill instance to query document memories.
    /// </summary>
    private readonly DocumentMemorySkill _documentMemorySkill;

    /// <summary>
    /// A skill instance to acquire external information.
    /// </summary>
    private readonly ExternalInformationSkill _externalInformationSkill;

    /// <summary>
    /// Create a new instance of <see cref="ChatSkill"/>.
    /// </summary>
    public ChatSkill(
        IKernel kernel,
        ChatMessageRepository chatMessageRepository,
        ChatSessionRepository chatSessionRepository,
        IOptions<PromptsOptions> promptOptions,
        IOptions<DocumentMemoryOptions> documentImportOptions,
        CopilotChatPlanner planner,
        ILogger logger)
    {
        this._kernel = kernel;
        this._chatMessageRepository = chatMessageRepository;
        this._chatSessionRepository = chatSessionRepository;
        this._promptOptions = promptOptions.Value;

        this._semanticChatMemorySkill = new SemanticChatMemorySkill(
            promptOptions);
        this._documentMemorySkill = new DocumentMemorySkill(
            promptOptions,
            documentImportOptions);
        this._externalInformationSkill = new ExternalInformationSkill(
            promptOptions,
            planner);
    }

    /// <summary>
    /// Extract user intent from the conversation history.
    /// </summary>
    /// <param name="context">The SKContext.</param>
    [SKFunction("Extract user intent")]
    [SKFunctionName("ExtractUserIntent")]
    [SKFunctionContextParameter(Name = "chatId", Description = "Chat ID to extract history from")]
    [SKFunctionContextParameter(Name = "audience", Description = "The audience the chat bot is interacting with.")]
    public async Task<string> ExtractUserIntentAsync(SKContext context)
    {
        var tokenLimit = this._promptOptions.CompletionTokenLimit;
        var historyTokenBudget =
            tokenLimit -
            this._promptOptions.ResponseTokenLimit -
            Utilities.TokenCount(string.Join("\n", new string[]
                {
                    this._promptOptions.SystemDescription,
                    this._promptOptions.SystemIntent,
                    this._promptOptions.SystemIntentContinuation
                })
            );

        // Clone the context to avoid modifying the original context variables.
        var intentExtractionContext = Utilities.CopyContextWithVariablesClone(context);
        intentExtractionContext.Variables.Set("tokenLimit", historyTokenBudget.ToString(new NumberFormatInfo()));
        intentExtractionContext.Variables.Set("knowledgeCutoff", this._promptOptions.KnowledgeCutoffDate);

        var completionFunction = this._kernel.CreateSemanticFunction(
            this._promptOptions.SystemIntentExtraction,
            skillName: nameof(ChatSkill),
            description: "Complete the prompt.");

        var result = await completionFunction.InvokeAsync(
            intentExtractionContext,
            settings: this.CreateIntentCompletionSettings()
        );

        if (result.ErrorOccurred)
        {
            context.Log.LogError("{0}: {1}", result.LastErrorDescription, result.LastException);
            context.Fail(result.LastErrorDescription);
            return string.Empty;
        }

        return $"User intent: {result}";
    }

    /// <summary>
    /// Extract the list of participants from the conversation history.
    /// Note that only those who have spoken will be included.
    /// </summary>
    [SKFunction("Extract audience list")]
    [SKFunctionName("ExtractAudience")]
    [SKFunctionContextParameter(Name = "chatId", Description = "Chat ID to extract history from")]
    public async Task<string> ExtractAudienceAsync(SKContext context)
    {
        var tokenLimit = this._promptOptions.CompletionTokenLimit;
        var historyTokenBudget =
            tokenLimit -
            this._promptOptions.ResponseTokenLimit -
            Utilities.TokenCount(string.Join("\n", new string[]
                {
                    this._promptOptions.SystemAudience,
                    this._promptOptions.SystemAudienceContinuation,
                })
            );

        // Clone the context to avoid modifying the original context variables.
        var audienceExtractionContext = Utilities.CopyContextWithVariablesClone(context);
        audienceExtractionContext.Variables.Set("tokenLimit", historyTokenBudget.ToString(new NumberFormatInfo()));

        var completionFunction = this._kernel.CreateSemanticFunction(
            this._promptOptions.SystemAudienceExtraction,
            skillName: nameof(ChatSkill),
            description: "Complete the prompt.");

        var result = await completionFunction.InvokeAsync(
            audienceExtractionContext,
            settings: this.CreateIntentCompletionSettings()
        );

        if (result.ErrorOccurred)
        {
            context.Log.LogError("{0}: {1}", result.LastErrorDescription, result.LastException);
            context.Fail(result.LastErrorDescription);
            return string.Empty;
        }

        return $"List of participants: {result}";
    }

    /// <summary>
    /// Extract chat history.
    /// </summary>
    /// <param name="context">Contains the 'tokenLimit' controlling the length of the prompt.</param>
    [SKFunction("Extract chat history")]
    [SKFunctionName("ExtractChatHistory")]
    [SKFunctionContextParameter(Name = "chatId", Description = "Chat ID to extract history from")]
    [SKFunctionContextParameter(Name = "tokenLimit", Description = "Maximum number of tokens")]
    public async Task<string> ExtractChatHistoryAsync(SKContext context)
    {
        var chatId = context["chatId"];
        var tokenLimit = int.Parse(context["tokenLimit"], new NumberFormatInfo());

        var messages = await this._chatMessageRepository.FindByChatIdAsync(chatId);
        var sortedMessages = messages.OrderByDescending(m => m.Timestamp);

        var remainingToken = tokenLimit;

        string historyText = "";
        foreach (var chatMessage in sortedMessages)
        {
            var formattedMessage = chatMessage.ToFormattedString();

            // Plan object is not meaningful content in generating bot response, so shorten to intent only to save on tokens
            if (formattedMessage.Contains("proposedPlan\":", StringComparison.InvariantCultureIgnoreCase))
            {
                string pattern = @"(\[.*?\]).*User Intent:User intent: (.*)(?=""}})";
                Match match = Regex.Match(formattedMessage, pattern);
                if (match.Success)
                {
                    string timestamp = match.Groups[1].Value.Trim();
                    string userIntent = match.Groups[2].Value.Trim();

                    formattedMessage = $"{timestamp} Bot proposed plan to fulfill user intent: {userIntent}";
                }
                else
                {
                    formattedMessage = "Bot proposed plan";
                }
            }

            var tokenCount = Utilities.TokenCount(formattedMessage);

            if (remainingToken - tokenCount >= 0)
            {
                historyText = $"{formattedMessage}\n{historyText}";
                remainingToken -= tokenCount;
            }
            else
            {
                break;
            }
        }

        return $"Chat history:\n{historyText.Trim()}";
    }

    /// <summary>
    /// This is the entry point for getting a chat response. It manages the token limit, saves
    /// messages to memory, and fill in the necessary context variables for completing the
    /// prompt that will be rendered by the template engine.
    /// </summary>
    /// <param name="message"></param>
    /// <param name="context">Contains the 'tokenLimit' and the 'contextTokenLimit' controlling the length of the prompt.</param>
    [SKFunction("Get chat response")]
    [SKFunctionName("Chat")]
    [SKFunctionInput(Description = "The new message")]
    [SKFunctionContextParameter(Name = "userId", Description = "Unique and persistent identifier for the user")]
    [SKFunctionContextParameter(Name = "userName", Description = "Name of the user")]
    [SKFunctionContextParameter(Name = "chatId", Description = "Unique and persistent identifier for the chat")]
    [SKFunctionContextParameter(Name = "proposedPlan", Description = "Previously proposed plan that is approved")]
    [SKFunctionContextParameter(Name = "messageType", Description = "Type of the message")]
    [SKFunctionContextParameter(Name = "responseMessageId", Description = "ID of the response message for planner")]
    public async Task<SKContext> ChatAsync(string message, SKContext context)
    {
        // TODO: check if user has access to the chat
        var userId = context["userId"];
        var userName = context["userName"];
        var chatId = context["chatId"];
        var messageType = context["messageType"];

        // Save this new message to memory such that subsequent chat responses can use it
        try
        {
            await this.SaveNewMessageAsync(message, userId, userName, chatId, messageType);
        }
        catch (Exception ex) when (!ex.IsCriticalException())
        {
            context.Log.LogError("Unable to save new message: {0}", ex.Message);
            context.Fail($"Unable to save new message: {ex.Message}", ex);
            return context;
        }

        // Clone the context to avoid modifying the original context variables.
        var chatContext = Utilities.CopyContextWithVariablesClone(context);
        chatContext.Variables.Set("knowledgeCutoff", this._promptOptions.KnowledgeCutoffDate);

        // Check if plan exists in ask's context variables.
        // If plan was returned at this point, that means it was approved or cancelled.
        // Update the response previously saved in chat history with state
        if (context.Variables.TryGetValue("proposedPlan", out string? planJson)
            && !string.IsNullOrWhiteSpace(planJson)
            && context.Variables.TryGetValue("responseMessageId", out string? messageId))
        {
            await this.UpdateResponseAsync(planJson, messageId);
        }

        var response = chatContext.Variables.ContainsKey("userCancelledPlan")
            ? "I am sorry the plan did not meet your goals."
            : await this.GetChatResponseAsync(chatContext);

        if (chatContext.ErrorOccurred)
        {
            context.Fail(chatContext.LastErrorDescription);
            return context;
        }

        // Retrieve the prompt used to generate the response
        // and return it to the caller via the context variables.
        var prompt = chatContext.Variables.ContainsKey("prompt")
            ? chatContext.Variables["prompt"]
            : string.Empty;
        context.Variables.Set("prompt", prompt);

        // Save this response to memory such that subsequent chat responses can use it
        try
        {
            ChatMessage botMessage = await this.SaveNewResponseAsync(response, prompt, chatId);
            context.Variables.Set("messageId", botMessage.Id);
            context.Variables.Set("messageType", ((int)botMessage.Type).ToString(CultureInfo.InvariantCulture));
        }
        catch (Exception ex) when (!ex.IsCriticalException())
        {
            context.Log.LogError("Unable to save new response: {0}", ex.Message);
            context.Fail($"Unable to save new response: {ex.Message}");
            return context;
        }

        // Extract semantic chat memory
        await SemanticChatMemoryExtractor.ExtractSemanticChatMemoryAsync(
            chatId,
            this._kernel,
            chatContext,
            this._promptOptions);

        context.Variables.Update(response);
        return context;
    }

    #region Private

    /// <summary>
    /// Generate the necessary chat context to create a prompt then invoke the model to get a response.
    /// </summary>
    /// <param name="chatContext">The SKContext.</param>
    /// <returns>A response from the model.</returns>
    private async Task<string> GetChatResponseAsync(SKContext chatContext)
    {
        // 0. Get the audience
        var audience = await this.GetAudienceAsync(chatContext);
        if (chatContext.ErrorOccurred)
        {
            return string.Empty;
        }

        // 1. Extract user intent from the conversation history.
        var userIntent = await this.GetUserIntentAsync(chatContext);
        if (chatContext.ErrorOccurred)
        {
            return string.Empty;
        }

        // 2. Calculate the remaining token budget.
        var remainingToken = this.GetChatContextTokenLimit(userIntent);

        // 3. Acquire external information from planner
        var externalInformationTokenLimit = (int)(remainingToken * this._promptOptions.ExternalInformationContextWeight);
        var planResult = await this.AcquireExternalInformationAsync(chatContext, userIntent, externalInformationTokenLimit);
        if (chatContext.ErrorOccurred)
        {
            return string.Empty;
        }

        // If plan is suggested, send back to user for approval before running
        if (this._externalInformationSkill.ProposedPlan != null)
        {
            return JsonSerializer.Serialize<ProposedPlan>(this._externalInformationSkill.ProposedPlan);
        }

        // 4. Query relevant semantic memories
        var chatMemoriesTokenLimit = (int)(remainingToken * this._promptOptions.MemoriesResponseContextWeight);
        var chatMemories = await this.QueryChatMemoriesAsync(chatContext, userIntent, chatMemoriesTokenLimit);
        if (chatContext.ErrorOccurred)
        {
            return string.Empty;
        }

        // 5. Query relevant document memories
        var documentContextTokenLimit = (int)(remainingToken * this._promptOptions.DocumentContextWeight);
        var documentMemories = await this.QueryDocumentsAsync(chatContext, userIntent, documentContextTokenLimit);
        if (chatContext.ErrorOccurred)
        {
            return string.Empty;
        }

        // 6. Fill in the chat history if there is any token budget left
        var chatContextComponents = new List<string>() { chatMemories, documentMemories, planResult };
        var chatContextText = string.Join("\n\n", chatContextComponents.Where(c => !string.IsNullOrEmpty(c)));
        var chatContextTextTokenCount = remainingToken - Utilities.TokenCount(chatContextText);
        if (chatContextTextTokenCount > 0)
        {
            var chatHistory = await this.GetChatHistoryAsync(chatContext, chatContextTextTokenCount);
            if (chatContext.ErrorOccurred)
            {
                return string.Empty;
            }
            chatContextText = $"{chatContextText}\n{chatHistory}";
        }

        // Invoke the model
        chatContext.Variables.Set("audience", audience);
        chatContext.Variables.Set("UserIntent", userIntent);
        chatContext.Variables.Set("ChatContext", chatContextText);

        var promptRenderer = new PromptTemplateEngine();
        var renderedPrompt = await promptRenderer.RenderAsync(
            this._promptOptions.SystemChatPrompt,
            chatContext);

        var completionFunction = this._kernel.CreateSemanticFunction(
            renderedPrompt,
            skillName: nameof(ChatSkill),
            description: "Complete the prompt.");

        chatContext = await completionFunction.InvokeAsync(
            context: chatContext,
            settings: this.CreateChatResponseCompletionSettings()
        );

        // Allow the caller to view the prompt used to generate the response
        chatContext.Variables.Set("prompt", renderedPrompt);

        if (chatContext.ErrorOccurred)
        {
            return string.Empty;
        }

        return chatContext.Result;
    }

    /// <summary>
    /// Helper function create the correct context variables to
    /// extract audience from the conversation history.
    /// </summary>
    private async Task<string> GetAudienceAsync(SKContext context)
    {
        var contextVariables = new ContextVariables();
        contextVariables.Set("chatId", context["chatId"]);

        var audienceContext = new SKContext(
            contextVariables,
            context.Memory,
            context.Skills,
            context.Log,
            context.CancellationToken
        );

        var audience = await this.ExtractAudienceAsync(audienceContext);

        // Propagate the error
        if (audienceContext.ErrorOccurred)
        {
            context.Fail(audienceContext.LastErrorDescription);
        }

        return audience;
    }

    /// <summary>
    /// Helper function create the correct context variables to
    /// extract user intent from the conversation history.
    /// </summary>
    private async Task<string> GetUserIntentAsync(SKContext context)
    {
        // TODO: Regenerate user intent if plan was modified
        if (!context.Variables.TryGetValue("planUserIntent", out string? userIntent))
        {
            var contextVariables = new ContextVariables();
            contextVariables.Set("chatId", context["chatId"]);
            contextVariables.Set("audience", context["userName"]);

            var intentContext = new SKContext(
                contextVariables,
                context.Memory,
                context.Skills,
                context.Log,
                context.CancellationToken
            );

            userIntent = await this.ExtractUserIntentAsync(intentContext);
            // Propagate the error
            if (intentContext.ErrorOccurred)
            {
                context.Fail(intentContext.LastErrorDescription);
            }
        }

        return userIntent;
    }

    /// <summary>
    /// Helper function create the correct context variables to
    /// extract chat history messages from the conversation history.
    /// </summary>
    private Task<string> GetChatHistoryAsync(SKContext context, int tokenLimit)
    {
        var contextVariables = new ContextVariables();
        contextVariables.Set("chatId", context["chatId"]);
        contextVariables.Set("tokenLimit", tokenLimit.ToString(new NumberFormatInfo()));

        var chatHistoryContext = new SKContext(
            contextVariables,
            context.Memory,
            context.Skills,
            context.Log,
            context.CancellationToken
        );

        var chatHistory = this.ExtractChatHistoryAsync(chatHistoryContext);

        // Propagate the error
        if (chatHistoryContext.ErrorOccurred)
        {
            context.Fail(chatHistoryContext.LastErrorDescription);
        }

        return chatHistory;
    }

    /// <summary>
    /// Helper function create the correct context variables to
    /// query chat memories from the chat memory store.
    /// </summary>
    private Task<string> QueryChatMemoriesAsync(SKContext context, string userIntent, int tokenLimit)
    {
        var contextVariables = new ContextVariables();
        contextVariables.Set("chatId", context["chatId"]);
        contextVariables.Set("tokenLimit", tokenLimit.ToString(new NumberFormatInfo()));

        var chatMemoriesContext = new SKContext(
            contextVariables,
            context.Memory,
            context.Skills,
            context.Log,
            context.CancellationToken
        );

        var chatMemories = this._semanticChatMemorySkill.QueryMemoriesAsync(userIntent, chatMemoriesContext);

        // Propagate the error
        if (chatMemoriesContext.ErrorOccurred)
        {
            context.Fail(chatMemoriesContext.LastErrorDescription);
        }

        return chatMemories;
    }

    /// <summary>
    /// Helper function create the correct context variables to
    /// query document memories from the document memory store.
    /// </summary>
    private Task<string> QueryDocumentsAsync(SKContext context, string userIntent, int tokenLimit)
    {
        var contextVariables = new ContextVariables();
        contextVariables.Set("chatId", context["chatId"]);
        contextVariables.Set("tokenLimit", tokenLimit.ToString(new NumberFormatInfo()));

        var documentMemoriesContext = new SKContext(
            contextVariables,
            context.Memory,
            context.Skills,
            context.Log,
            context.CancellationToken
        );

        var documentMemories = this._documentMemorySkill.QueryDocumentsAsync(userIntent, documentMemoriesContext);

        // Propagate the error
        if (documentMemoriesContext.ErrorOccurred)
        {
            context.Fail(documentMemoriesContext.LastErrorDescription);
        }

        return documentMemories;
    }

    /// <summary>
    /// Helper function create the correct context variables to acquire external information.
    /// </summary>
    private async Task<string> AcquireExternalInformationAsync(SKContext context, string userIntent, int tokenLimit)
    {
        var contextVariables = context.Variables.Clone();
        contextVariables.Set("tokenLimit", tokenLimit.ToString(new NumberFormatInfo()));

        var planContext = new SKContext(
            contextVariables,
            context.Memory,
            context.Skills,
            context.Log,
            context.CancellationToken
        );

        var plan = await this._externalInformationSkill.AcquireExternalInformationAsync(userIntent, planContext);

        // Propagate the error
        if (planContext.ErrorOccurred)
        {
            context.Fail(planContext.LastErrorDescription);
        }

        return plan;
    }

    /// <summary>
    /// Save a new message to the chat history.
    /// </summary>
    /// <param name="message">The message</param>
    /// <param name="userId">The user ID</param>
    /// <param name="userName"></param>
    /// <param name="chatId">The chat ID</param>
    /// <param name="type">Type of the message</param>
    private async Task<ChatMessage> SaveNewMessageAsync(string message, string userId, string userName, string chatId, string type)
    {
        // Make sure the chat exists.
        if (!await this._chatSessionRepository.TryFindByIdAsync(chatId, v => _ = v))
        {
            throw new ArgumentException("Chat session does not exist.");
        }

        var chatMessage = new ChatMessage(
            userId,
            userName,
            chatId,
            message,
            "",
            ChatMessage.AuthorRoles.User,
            // Default to a standard message if the `type` is not recognized
            Enum.TryParse(type, out ChatMessage.ChatMessageType typeAsEnum) && Enum.IsDefined(typeof(ChatMessage.ChatMessageType), typeAsEnum)
                ? typeAsEnum
                : ChatMessage.ChatMessageType.Message);

        await this._chatMessageRepository.CreateAsync(chatMessage);
        return chatMessage;
    }

    /// <summary>
    /// Save a new response to the chat history.
    /// </summary>
    /// <param name="response">Response from the chat.</param>
    /// <param name="prompt">Prompt used to generate the response.</param>
    /// <param name="chatId">The chat ID</param>
    /// <returns>The created chat message.</returns>
    private async Task<ChatMessage> SaveNewResponseAsync(string response, string prompt, string chatId)
    {
        // Make sure the chat exists.
        if (!await this._chatSessionRepository.TryFindByIdAsync(chatId, v => _ = v))
        {
            throw new ArgumentException("Chat session does not exist.");
        }

        var chatMessage = ChatMessage.CreateBotResponseMessage(chatId, response, prompt);
        await this._chatMessageRepository.CreateAsync(chatMessage);

        return chatMessage;
    }

    /// <summary>
    /// Updates previously saved response in the chat history.
    /// </summary>
    /// <param name="updatedResponse">Updated response from the chat.</param>
    /// <param name="messageId">The chat message ID</param>
    private async Task UpdateResponseAsync(string updatedResponse, string messageId)
    {
        // Make sure the chat exists.
        var chatMessage = await this._chatMessageRepository.FindByIdAsync(messageId);
        chatMessage.Content = updatedResponse;

        await this._chatMessageRepository.UpsertAsync(chatMessage);
    }

    /// <summary>
    /// Create a completion settings object for chat response. Parameters are read from the PromptSettings class.
    /// </summary>
    private CompleteRequestSettings CreateChatResponseCompletionSettings()
    {
        var completionSettings = new CompleteRequestSettings
        {
            MaxTokens = this._promptOptions.ResponseTokenLimit,
            Temperature = this._promptOptions.ResponseTemperature,
            TopP = this._promptOptions.ResponseTopP,
            FrequencyPenalty = this._promptOptions.ResponseFrequencyPenalty,
            PresencePenalty = this._promptOptions.ResponsePresencePenalty
        };

        return completionSettings;
    }

    /// <summary>
    /// Create a completion settings object for intent response. Parameters are read from the PromptSettings class.
    /// </summary>
    private CompleteRequestSettings CreateIntentCompletionSettings()
    {
        var completionSettings = new CompleteRequestSettings
        {
            MaxTokens = this._promptOptions.ResponseTokenLimit,
            Temperature = this._promptOptions.IntentTemperature,
            TopP = this._promptOptions.IntentTopP,
            FrequencyPenalty = this._promptOptions.IntentFrequencyPenalty,
            PresencePenalty = this._promptOptions.IntentPresencePenalty,
            StopSequences = new string[] { "] bot:" }
        };

        return completionSettings;
    }

    /// <summary>
    /// Calculate the remaining token budget for the chat response prompt.
    /// This is the token limit minus the token count of the user intent and the system commands.
    /// </summary>
    /// <param name="userIntent">The user intent returned by the model.</param>
    /// <returns>The remaining token limit.</returns>
    private int GetChatContextTokenLimit(string userIntent)
    {
        var tokenLimit = this._promptOptions.CompletionTokenLimit;
        var remainingToken =
            tokenLimit -
            Utilities.TokenCount(userIntent) -
            this._promptOptions.ResponseTokenLimit -
            Utilities.TokenCount(string.Join("\n", new string[]
                {
                            this._promptOptions.SystemDescription,
                            this._promptOptions.SystemResponse,
                            this._promptOptions.SystemChatContinuation
                })
            );

        return remainingToken;
    }

    # endregion
}
