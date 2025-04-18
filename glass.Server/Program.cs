var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:62009",  // Allow frontend on HTTP
                "https://localhost:62009", // Allow frontend on HTTPS
                "http://localhost:5253",   // Allow API on HTTP
                "https://localhost:7117"   // Allow API on HTTPS
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

builder.Services.AddHttpClient();

// Add services to the container.
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

// app.UseHttpsRedirection(); // disabled for now

// **Apply CORS Middleware Here**
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
