// Copyright (c) Microsoft. All rights reserved.

using Microsoft.SemanticKernel.Orchestration;
using Microsoft.SemanticKernel.SkillDefinition;

namespace GBB.Miyagi.RecommendationService.Skills;

internal sealed class UserProfileSkill
{
    [SKFunction("Given a userId, find user age")]
    [SKFunctionName("GetUserAge")]
    [SKFunctionInput(Description = "The age of a user to tailor financial advice.")]
    public Task<SKContext> GetUserAge(string userId, SKContext context)
    {
        context.Log.LogDebug("Returning hard coded age for {0}", userId);
        // invoke a service to get the age of the user, given the userId
        context.Variables.Update("50");
        return Task.FromResult(context);
    }
}
