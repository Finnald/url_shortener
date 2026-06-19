using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.Data.SqlClient;

namespace UrlShortener.RemoveLinks;

public class RemoveLinks
{
    private readonly ILogger _logger;

    public RemoveLinks(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<RemoveLinks>();
    }

    [Function("RemoveLinks")]
    public async Task Run([TimerTrigger("0 0 * * * *")] TimerInfo myTimer)
    {
        Console.WriteLine("Hola worldo");
        _logger.LogInformation("C# Timer trigger function executed at: {executionTime}", DateTime.Now);

        // delete entries older than 24 hours
        string? connStr = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

        using var conn = new SqlConnection(connStr);
        await conn.OpenAsync();

        if (myTimer.ScheduleStatus is not null)
        {
            _logger.LogInformation("Next timer schedule at: {nextSchedule}", myTimer.ScheduleStatus.Next);
        }
    }
}