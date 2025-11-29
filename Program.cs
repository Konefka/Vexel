using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using Vexel;
using static Supabase.Postgrest.Constants;

class Program
{
    static async Task Main(string[] args)
    {
        var hasher = new PasswordHasher<object>();
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

        Console.WriteLine("Hello User.\n Press l to login, r to register");
        while (true)
        {
            Console.Write("> ");
            ConsoleKey chosen = Console.ReadKey().Key;

            Console.WriteLine("");

            if (chosen == ConsoleKey.L)
            {
                await Login(hasher, supabase);
                break;
            }
            else if (chosen == ConsoleKey.R)
            {
                try {
                    await supabase.From<Users>().Insert(Register(hasher));
                    break;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }

        //Users model = new Users
        //{
        //    Name = "The_Chair_Almighty",
        //    Email = "chairs@gmail.com",
        //    Password = "123"
        //};
        //try { await supabase.From<Users>().Insert(model); } catch (Exception ex) { Console.WriteLine(ex.ToString()); }

        //var result = await supabase.From<Users>().Get();
        //Console.WriteLine(result.Content);
    }

    static async Task Login(PasswordHasher<object> hasher, Supabase.Client supabase)
    {
        Console.Write("Email: ");
        string? email = Console.ReadLine();
        Console.Write($"Password: ");
        string password = Console.ReadLine()!;

        var hashed = await supabase.From<Users>().Select("password_hash").Filter("email", Operator.Equals, email).Get();

        var result = hasher.VerifyHashedPassword(null!, hashed.Models.FirstOrDefault()!.Password, password);

        if (result == PasswordVerificationResult.Success)
        {
            Console.WriteLine("Pomyœlnie zalogowano!");
        }
        else {
            Console.WriteLine("Nope. Coœ posz³o nie tak :(");
        }
    }

    static Users Register(PasswordHasher<object> hasher)
    {
        Console.Write("Name: ");
        string name = Console.ReadLine()!;
        Console.Write("Email: ");
        string email = Console.ReadLine()!;
        Console.Write($"Password: ");
        string password = Console.ReadLine()!;

        var hashed = hasher.HashPassword(null!, password);

        Users model = new Users
        {
            Name = name,
            Email = email,
            Password = hashed
        };

        return model;
    }
}