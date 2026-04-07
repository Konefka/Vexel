using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Vexel.Hubs;
using System.Text;
using Vexel.Services;
internal class Program
{
    static WebApplicationBuilder builder = null!;
    static void Main(string[] args)
    {
        builder = WebApplication.CreateBuilder(args);

        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
            .AddUserSecrets<Program>()
            .AddEnvironmentVariables();

        InitializeSupabase();
        InitializeServices();
    }

    static void InitializeSupabase()
    {
        string? url = builder.Configuration["Supabase:Url"];
        if (string.IsNullOrEmpty(url)) throw new Exception("Supabase URL is missing");

        string? key = builder.Configuration["Supabase:Key"];
        if (string.IsNullOrEmpty(key)) throw new Exception("Supabase Key is missing");

        builder.Services.AddScoped(provider =>
        {
            Supabase.SupabaseOptions options = new Supabase.SupabaseOptions
            {
                AutoConnectRealtime = false
            };
            var client = new Supabase.Client(url, key, options);

            client.InitializeAsync().GetAwaiter().GetResult();

            return client;
        });

        //builder.Services.AddSingleton(client);

        //await client.AdminAuth("service key").DeleteUser("user id");
    }
    static void InitializeServices()
    {
        builder.Services.AddScoped<AccountService>();
        builder.Services.AddScoped<ConversationService>();
        builder.Services.AddScoped<MessageService>();
        builder.Services.AddControllers();
        builder.Services.AddSignalR();

        var frontendUrl = builder.Configuration["Frontend_Url"] ?? throw new Exception("Frontend URL is missing");

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("cors", policy =>
            {
                policy.WithOrigins(frontendUrl)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        IdentityModelEventSource.ShowPII = true;

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
                    OnMessageReceived = async context =>
                    {
                        if (context.Request.Cookies.TryGetValue("access_token", out var token))
                        {
                            context.Token = token;

                            var client = context.HttpContext.RequestServices
                                .GetRequiredService<Supabase.Client>();

                            await client.Auth.SetSession(token, "not-needed");
                        }
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine("JWT walidacja nie przesz�a: " + context.Exception.Message);
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
        app.MapHub<MessageHub>("/messageHub");

        app.Run();
    }
}