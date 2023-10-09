// Copyright (c) Microsoft. All rights reserved.

using System.Reflection;
using Microsoft.ML.Tokenizers;
using Microsoft.SemanticKernel.Text;

namespace GBB.Miyagi.RecommendationService.utils;

public static class RepoUtils
{
    /// <summary>
    ///     Scan the local folders from the repo, looking for "plugins" folder.
    /// </summary>
    /// <returns>The full path to samples/skills</returns>
    public static string GetSamplePluginsPath()
    {
        const string Parent = "";
        const string Folder = "plugins";

        bool SearchPath(string pathToFind, out string result, int maxAttempts = 10)
        {
            var currDir = Path.GetFullPath(Assembly.GetExecutingAssembly().Location);
            bool found;
            do
            {
                result = Path.Join(currDir, pathToFind);
                found = Directory.Exists(result);
                currDir = Path.GetFullPath(Path.Combine(currDir, ".."));
            } while (maxAttempts-- > 0 && !found);

            return found;
        }

        if (!SearchPath(Parent + Path.DirectorySeparatorChar + Folder, out var path)
            && !SearchPath(Folder, out path))
            throw new Exception("Plugins directory not found. Miyagi needs plugins from the repo to work.");

        return path;
    }
    
    /// <summary>
    /// MicrosoftML token counter implementation.
    /// </summary>
    private static TextChunker.TokenCounter MicrosoftMLTokenCounter => (string input) =>
    {
        Tokenizer tokenizer = new(new Bpe());
        var tokens = tokenizer.Encode(input).Tokens;

        return tokens.Count;
    };
}