using GBB.Miyagi.RecommendationService.config;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Load user secrets
builder.Configuration.AddUserSecrets<Program>();

// Load kernel settings from configuration
var kernelSettings = KernelSettings.LoadSettings();
builder.Services.AddSingleton(kernelSettings);

// Add Azure services
builder.Services.AddAzureServices();

// Add Semantic Kernel services
builder.Services.AddSkServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
// app.UseHttpsRedirection(); // Issue with Next.js to use https redirection

app.Map("/", () => Results.Redirect("/swagger"));

// app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=AssetsController}/{action=Index}/{id?}");

app.Run();