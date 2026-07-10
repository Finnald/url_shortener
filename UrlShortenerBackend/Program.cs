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
                          policy.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
                      });
});


// Globals
const int LENGTH = 5;

// Azure SQL Connection
string connectionString = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTIONSTRING")!;
builder.Services.AddDbContext<ShortLinkContext>(options => options.UseSqlServer(connectionString));

Console.WriteLine(string.IsNullOrWhiteSpace(connectionString)
    ? "Connection string missing"
    : "Connection string loaded");


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



var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

// Endpoints
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


// deletes an entry based on the code
app.MapPost("/deleteCode/{code}", async (string code, ShortLinkContext db) =>
{


    try
    {
        db.ShortLinks.Remove(new ShortLink { Code = code });
        await db.SaveChangesAsync();
        return Results.Ok();
    }
    catch
    {
        return Results.NotFound();
    }

});

// get link from code
// currently unused
app.MapGet("/{code}", async (string code, ShortLinkContext db) =>
{
    try
    {
        var shortLink = await db.ShortLinks.SingleAsync(l => l.Code == code);
        var link = shortLink.Link;
        return Results.Ok(link);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e);
    }

});

// get all links
app.MapGet("/all", async (ShortLinkContext db) =>
{
    try
    {
        var publicLinks = await db.ShortLinks.OrderByDescending(s => s.DateCreated).ToListAsync();
        return Results.Ok(publicLinks);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e);
    }
});

// get links for current user
app.MapGet("/getLinks/{userId}", async (string userId, HttpContext context, ShortLinkContext db) =>
{

    // Checks if the user is properly authenticated using clerk before continuing
    var userAuth = await UserAuthentication.IsAuthenticatedAsync(context.Request);
    if (!userAuth)
    {
        return Results.Unauthorized();
    }

    try
    {
        var userLinks = await db.ShortLinks.Where(l => l.UserId.Equals(userId)).ToListAsync();
        return Results.Ok(userLinks);
    }
    catch (Exception e)
    {
        return Results.BadRequest(e);
    }
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