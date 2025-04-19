using DotNetEnv;
using glass.Server.Services;
using glass.Server.Settings; // Added for MongoDbSettings

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
Env.Load();  // This will read variables from a .env file in the root of your project

// Get MongoDB credentials from environment variables
var mongoUser = Environment.GetEnvironmentVariable("MONGODB_ADMIN");
var mongoPass = Environment.GetEnvironmentVariable("MONGODB_ADMIN_PASSWORD");

// Build MongoDB connection string
var mongoConnection = $"mongodb+srv://{mongoUser}:{mongoPass}@cluster0.r2xx6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Set up MongoDB settings object
var mongoSettings = new MongoDbSettings
{
    ConnectionString = mongoConnection,
    DatabaseName = "glass"
};

// Register MongoDB settings in DI container
builder.Services.AddSingleton(mongoSettings);

// Register MongoDbService
builder.Services.AddSingleton<MongoDbService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:62009",
            "https://localhost:62009",
            "http://localhost:5253",
            "https://localhost:7117"
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

builder.Services.AddHttpClient();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
