﻿namespace GBB.Miyagi.RecommendationService.Utils;

/// <summary>
///     Basic logger printing to console
/// </summary>
internal static class ConsoleLogger
{
    private static readonly Lazy<ILoggerFactory> s_loggerFactory = new(LogBuilder);
    internal static ILogger Log => LogFactory.CreateLogger<object>();

    private static ILoggerFactory LogFactory => s_loggerFactory.Value;

    private static ILoggerFactory LogBuilder()
    {
        return LoggerFactory.Create(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Trace);

            // builder.AddFilter("Microsoft", LogLevel.Trace);
            // builder.AddFilter("Microsoft", LogLevel.Debug);
            // builder.AddFilter("Microsoft", LogLevel.Information);
            // builder.AddFilter("Microsoft", LogLevel.Warning);
            // builder.AddFilter("Microsoft", LogLevel.Error);

            builder.AddFilter("Microsoft", LogLevel.Trace);
            builder.AddFilter("System", LogLevel.Trace);

            builder.AddConsole();
        });
    }
}