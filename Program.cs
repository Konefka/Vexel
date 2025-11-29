using Npgsql;
using Supabase.Gotrue;
using Vexel;

class Program
{
    static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        //builder.Configuration
        //    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
        //    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
        //    .AddUserSecrets<Program>()
        //    .AddEnvironmentVariables(); - for servers

        builder.Configuration.AddUserSecrets<Program>();

        string url = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase URL is missing");
        string key = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing");

        var options = new Supabase.SupabaseOptions
        {
            AutoConnectRealtime = true
        };

        Supabase.Client supabase = new Supabase.Client(url, key, options);
        await supabase.InitializeAsync();

        var model = new Users
        {
            Name = "The_Chair_Almighty",
            Email = "chair@gmail.com",
            Password = "123"
        };
        try{ await supabase.From<Users>().Insert(model); } catch (Exception ex) { Console.WriteLine(ex.ToString()); }

        return;
    }
}