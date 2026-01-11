using DreamJournal.Api.Data;
using DreamJournal.Api.Models;
using DreamJournal.Api.Repositories;
using DreamJournal.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add services to the container
builder.Services.AddControllers();

// Configure JSON camel case serialization
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// Add Entity Framework Core DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in configuration.");

builder.Services.AddDbContext<DreamJournalDbContext>(options =>
    options.UseSqlite(connectionString));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDreamEntryRepository, DreamEntryRepository>();

// Get and validate JWT key
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("JWT configuration missing: set 'Jwt:Key' in appsettings.json or as an environment variable.");
}

// Decode JWT key using the same logic as GenerateJwtToken
byte[] keyBytes;
try
{
    // Try to decode as base64 first (recommended for stored secrets)
    keyBytes = Convert.FromBase64String(jwtKey);
}
catch (FormatException)
{
    // Fallback to UTF-8 bytes for plain string keys
    keyBytes = Encoding.UTF8.GetBytes(jwtKey);
}

if (keyBytes.Length < 32)
{
    throw new InvalidOperationException($"Jwt:Key is too short ({keyBytes.Length} bytes). Provide at least 32 bytes (256 bits) for HS256.");
}

var signingKey = new SymmetricSecurityKey(keyBytes);

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = signingKey
        };
    });

// Add authorization
builder.Services.AddAuthorization();

// Add services
builder.Services.AddScoped<UserService>();


var app = builder.Build();

// Ensure database is created on startup (useful for local development without dotnet-ef)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DreamJournalDbContext>();
    db.Database.EnsureCreated();
}

// Use CORS BEFORE routing
app.UseCors("AllowFrontend");

// Use authentication & authorization
app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
