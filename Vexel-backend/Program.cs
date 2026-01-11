using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Vexel.Account;
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

        InitializeClient(await InitializeSupabase());
    }

    static async Task<Supabase.Client> InitializeSupabase()
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
    static void InitializeClient(Supabase.Client client)
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

        //IdentityModelEventSource.ShowPII = true;

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Supabase:Url"] + "/auth/v1",
                    ValidateAudience = true,
                    ValidAudience = "authenticated",
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Supabase:JwtSecret"]!)
                    ),

                    ClockSkew = TimeSpan.FromSeconds(30)
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.TryGetValue("access_token", out var token))
                            context.Token = token;

                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine("JWT walidacja nie przesz³a: " + context.Exception.Message);
                        return Task.CompletedTask;
                    }
                };
            });

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