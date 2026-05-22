using System.Collections;
using System.Text.Json;
using Clerk.BackendAPI.Models.Components;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader();
                      });
});


// Globals
const int LENGTH = 5;

// Azure SQL Connection
string connectionString = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")!;
builder.Services.AddDbContext<ShortLinkContext>(options => options.UseSqlServer(connectionString));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);



// Logic
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";


app.MapGet("/code", () =>
{
    return getCode();
});

app.MapPost("/addCode", async (AddCodeRequest req, ShortLinkContext db) =>
{
    var link = req.Link;
    var userId = req.UserId;

    var code = getCode();

    try
    {
        Console.WriteLine("Adding short link");
        db.ShortLinks.Add(new ShortLink { Code = code, DateCreated = DateTime.UtcNow, Link = link, UserId = userId });
        Console.WriteLine("Saving changes...");
        await db.SaveChangesAsync();
        Console.WriteLine("Saved!");
        return Results.Ok();
    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        return Results.BadRequest();
    }

});

// map code and link
app.MapPost("/addCode/v1", async (AddCodeRequest req) =>
{
    var link = req.Link;
    var userId = req.UserId;


    using var conn = new SqlConnection(connectionString);
    // conn.Open();
    var code = getCode();

    try
    {
        var command = new SqlCommand(
        $"INSERT INTO short_link (code, link, userId, dateCreated) VALUES ('{code}', '{link}', '{userId}', SYSDATETIME());", conn);
        command.Connection.Open();
        command.ExecuteNonQuery();
        return Results.Ok();
    }
    catch
    {
        return Results.BadRequest();
    }

});

// deletes an entry based on the code
app.MapPost("/deleteCode/{code}", (string code) =>
{
    using var conn = new SqlConnection(connectionString);
    // conn.Open();

    try
    {
        var command = new SqlCommand(
        $"DELETE FROM short_link WHERE code = '{code}'", conn);
        command.Connection.Open();
        command.ExecuteNonQuery();
        return Results.Ok();
    }
    catch
    {
        return Results.NotFound();
    }

});

// get link from code
// unused
app.MapGet("/{code}", (string code) =>
{
    using var conn = new SqlConnection(connectionString);

    var cmd = new SqlCommand(
        $"SELECT link FROM short_link WHERE code = '{code}';",
        conn
        );
    cmd.Connection.Open();

    // returns the result, there should only be one result as searching by pk
    var reader = cmd.ExecuteReader();
    reader.Read();
    return $"http://{reader[0]}";
});

// get all links
app.MapGet("/all", () =>
{
    using var conn = new SqlConnection(connectionString);

    var cmd = new SqlCommand(
        $"SELECT * FROM short_link WHERE userId IS NULL ORDER BY dateCreated DESC;",
        conn
        );
    cmd.Connection.Open();

    // returns the results
    ArrayList results = new ArrayList();
    using (SqlDataReader reader = cmd.ExecuteReader())
    {
        while (reader.Read())
        {
            var record = new ShortLink
            {
                Link = reader[1].ToString(),
                Code = reader[0].ToString()

            };
            results.Add(record);
        }
        string jsonString = JsonSerializer.Serialize(results);
    }

    return Results.Ok(results.ToArray());
});

// get links for current user
app.MapGet("/getLinks/{userId}", async (string userId, HttpContext context) =>
{
    using var conn = new SqlConnection(connectionString);

    var userAuth = await UserAuthentication.IsAuthenticatedAsync(context.Request);

    if (!userAuth)
    {
        return Results.Unauthorized();
    }

    Console.WriteLine(userId);

    var cmd = new SqlCommand(
        $"SELECT * FROM short_link WHERE userId='{userId}' ORDER BY dateCreated DESC;",
        conn
        );
    cmd.Connection.Open();

    // returns the results
    ArrayList results = new ArrayList();
    using (SqlDataReader reader = cmd.ExecuteReader())
    {
        while (reader.Read())
        {
            var record = new ShortLink
            {
                Link = reader[1].ToString(),
                Code = reader[0].ToString()

            };
            results.Add(record);
        }
        string jsonString = JsonSerializer.Serialize(results);
    }

    return Results.Ok(results.ToArray());
});

string getCode()
{
    var code = Enumerable.Repeat(chars, LENGTH).Select(s => s[Random.Shared.Next(s.Length)]);

    return string.Join("", code);
}


app.Run();

public class AddCodeRequest
{
    public string? Link { get; set; }
    public string? UserId { get; set; }
}