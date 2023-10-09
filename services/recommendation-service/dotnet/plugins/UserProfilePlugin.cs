// Copyright (c) Microsoft. All rights reserved.

using System.ComponentModel;
using GBB.Miyagi.RecommendationService.Utils;
using Microsoft.Extensions.FileSystemGlobbing.Internal.PatternContexts;
using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.SkillDefinition;

namespace GBB.Miyagi.RecommendationService.plugins;

/// <summary>
///     UserProfilePlugin shows a native skill example to look user info given userId.
/// </summary>
/// <example>
///     Usage: kernel.ImportSkill("UserProfilePlugin", new UserProfilePlugin());
///     Examples:
///     SKContext["userId"] = "000"
///     {{UserProfilePlugin.GetUserAge $userId }} => {userProfile}
/// </example>
public class UserProfilePlugin
{
    /// <summary>
    ///     Name of the context variable used for UserId.
    /// </summary>
    public const string UserId = "UserId";

    private const string DefaultUserId = "40";
    private const int DefaultAnnualHouseholdIncome = 150000;
    private const int Normalize = 81;

    /// <summary>
    ///     Lookup User's age for a given UserId.
    /// </summary>
    /// <example>
    ///     SKContext[UserProfilePlugin.UserId] = "000"
    /// </example>
    /// <param name="context">Contains the context variables.</param>
    [SKFunction]
    [SKName("GetUserAge")]
    [Description("Given a userId, get user age")]
    public string GetUserAge(
        [Description("Unique identifier of a user")]
        string userId,
        SKContext context)
    {
        var log = ConsoleLogger.Log;
        log?.BeginScope("UserProfilePlugin.GetUserAge");
        
        // userId = context.Variables.ContainsKey(UserId) ? context[UserId] : DefaultUserId;
        userId = string.IsNullOrEmpty(userId) ? DefaultUserId : userId;
        
        log?.LogDebug("Returning hard coded age for {S}", userId);

        int age;

        if (int.TryParse(userId, out var parsedUserId))
            age = parsedUserId > 100 ? parsedUserId % Normalize : parsedUserId;
        else
            age = int.Parse(DefaultUserId);

        // invoke a service to get the age of the user, given the userId
        return age.ToString();
    }

    /// <summary>
    ///     Lookup User's annual income given UserId.
    /// </summary>
    /// <example>
    ///     SKContext[UserProfilePlugin.UserId] = "000"
    /// </example>
    /// <param name="context">Contains the context variables.</param>
    [SKFunction]
    [SKName("GetAnnualHouseholdIncome")]
    [Description("Given a userId, get user annual household income")]
    public string GetAnnualHouseholdIncome(
        [Description("Unique identifier of a user")]
        string userId,
        SKContext context)
    {
        var log = ConsoleLogger.Log;
        log?.BeginScope("UserProfilePlugin.GetAnnualHouseholdIncome");
        
        // userId = context.Variables.ContainsKey(UserId) ? context[UserId] : DefaultUserId;
        userId = string.IsNullOrEmpty(userId) ? DefaultUserId : userId;
        log?.LogDebug("Returning userId * randomMultiplier for {S}", userId);

        var random = new Random();
        var randomMultiplier = random.Next(1000, 8000);

        // invoke a service to get the annual household income of the user, given the userId
        var annualHouseholdIncome = int.TryParse(userId, out var parsedUserId)
            ? parsedUserId * randomMultiplier
            : DefaultAnnualHouseholdIncome;

        return annualHouseholdIncome.ToString();
    }
}