using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using System.Net.Http.Headers;
using System.Text.Json;
using TickerTokApi.Models;
using TickerTokApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Adding CORS policy to simplify development and allow all origins, headers, and methods
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSingleton<SubmissionService>();

// Initializing Firebase Admin SDK
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromFile("firebase-service-account.json")
});

var app = builder.Build();

// Use CORS
app.UseCors();

// Firebase Auth Middleware
app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
    if (authHeader != null && authHeader.StartsWith("Bearer "))
    {
        var token = authHeader.Substring("Bearer ".Length).Trim();
        try
        {
            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
            context.Items["FirebaseUser"] = decodedToken;
            await next();
            return;
        }
        catch
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized: Invalid Firebase token");
            return;
        }
    }
    // If no token, reject
    context.Response.StatusCode = 401;
    await context.Response.WriteAsync("Unauthorized: No token provided");
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Get the opening price of a stock using the Finnhub API
app.MapGet("/stock/opening-price", async (HttpContext context, SubmissionService submissionService) =>
{
    var ticker = context.Request.Query["ticker"].ToString();
    if (!ticker.All(char.IsLetter) || ticker.Length > 5)
    {
        context.Response.StatusCode = 400;
        await context.Response.WriteAsync("Invalid ticker symbol.");
        return;
    }

    var config = context.RequestServices.GetRequiredService<IConfiguration>();
    var apiKey = config["Finnhub:ApiKey"];
    if (string.IsNullOrEmpty(apiKey))
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("Finnhub API key not configured.");
        return;
    }

    using var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    var url = $"https://finnhub.io/api/v1/quote?symbol={ticker.ToUpper()}&token={apiKey}";
    try
    {
        var response = await httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            context.Response.StatusCode = 502;
            await context.Response.WriteAsync($"Error from Finnhub: {response.StatusCode}");
            return;
        }
        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("o", out var openProp))
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsync("Opening price not found for ticker.");
            return;
        }
        var openingPrice = openProp.GetDecimal();

        // Save the response data to MongoDB if the user is authenticated
        if (context.Items.TryGetValue("FirebaseUser", out var firebaseUserObj) && firebaseUserObj is FirebaseToken firebaseUser)
        {
            var submission = new Submission
            {
                Uid = firebaseUser.Uid,
                Email = firebaseUser.Claims.TryGetValue("email", out var emailObj) ? emailObj?.ToString() : null,
                Ticker = ticker.ToUpper(),
                OpeningPrice = openingPrice,
                Timestamp = DateTime.UtcNow
            };
            await submissionService.AddSubmissionAsync(submission);
        }

        context.Response.Headers["Cache-Control"] = "no-store";
        await context.Response.WriteAsJsonAsync(new { ticker = ticker.ToUpper(), openingPrice });
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Error: {ex.Message}");
    }
});

app.Run();