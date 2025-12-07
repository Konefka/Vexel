using Supabase.Gotrue;
using Vexel;
using Vexel.tables;
class Program
{
    static WebApplicationBuilder builder = null!;
    static async Task Main(string[] args)
    {
        builder = WebApplication.CreateBuilder(args);

        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
            .AddUserSecrets<Program>()
            .AddEnvironmentVariables();

        InitializeSignalR(await InitializeClient());
    }

    static async Task<Supabase.Client> InitializeClient()
    {
        string url = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase URL is missing");
        string key = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing");

        Supabase.SupabaseOptions options = new Supabase.SupabaseOptions { AutoConnectRealtime = true };

        Supabase.Client client = new Supabase.Client(url, key, options);
        await client.InitializeAsync();

        builder.Services.AddSingleton(client);

        //await client.AdminAuth("service key").DeleteUser("user id");

        return client;
    }
    static void InitializeSignalR(Supabase.Client client)
    {
        builder.Services.AddSingleton<AuthService>();
        builder.Services.AddControllers();
        builder.Services.AddSignalR();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("cors", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        var app = builder.Build();

        app.UseCors("cors");

        app.MapControllers();
        app.MapHub<AuthHub>("/AuthHub");

        app.Run();
    }
}