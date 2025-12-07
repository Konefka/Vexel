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

        InitializeSwagger(await InitializeClient());
    }

    static async Task<Supabase.Client> InitializeClient()
    {
        string url = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase URL is missing");
        string key = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing");

        Supabase.SupabaseOptions options = new Supabase.SupabaseOptions { AutoConnectRealtime = true };

        Supabase.Client client = new Supabase.Client(url, key, options);
        await client.InitializeAsync();
        return client;
    }

    static void InitializeSwagger(Supabase.Client client)
    {
        builder.Services.AddSingleton(client);

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();

        //await client.AdminAuth("tutaj service key").DeleteUser("tu user id");
    }
}