using Supabase.Gotrue;
using System.Reflection.Metadata;
using Vexel;
using Vexel.tables;
internal class Program
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

        await InitializeSupabase();
        InitializeClient();
    }

    static async Task InitializeSupabase()
    {
        string url = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase URL is missing");
        string key = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing");

        Supabase.SupabaseOptions options = new Supabase.SupabaseOptions { AutoConnectRealtime = true };

        Supabase.Client client = new Supabase.Client(url, key, options);
        await client.InitializeAsync();

        builder.Services.AddSingleton(client);

        //await client.AdminAuth("service key").DeleteUser("user id");
    }
    static void InitializeClient()
    {
        builder.Services.AddSingleton<AccountService>();
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

        builder.Services
            .AddAuthentication("Cookies")
            .AddCookie("Cookies", options =>
            {
                options.Cookie.Name = "access_token";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            });

        builder.Services.AddAuthorization();

        builder.Services.AddAuthorization();

        var app = builder.Build();

        app.UseCors("cors");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        //app.MapHub<AuthHub>("/AuthHub");

        app.Run();
    }
}