using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Supabase;
using Supabase.Gotrue;
using System.IdentityModel.Tokens.Jwt;
using Vexel.tables;

namespace Vexel
{
    internal class AuthHub : Hub
    {
        private readonly AccountService _accountService;

        public AuthHub(AccountService accountService)
        {
            _accountService = accountService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (userId == null)
            {
                await base.OnConnectedAsync();
                return;
            }
            Console.WriteLine(userId);
            await Clients.Caller.SendAsync("Welcome", userId);

            await base.OnConnectedAsync();
        }

        public async Task<object> Register(string email, string password)
        {
            if (email.IsNullOrEmpty() || password.IsNullOrEmpty() || email.Contains(' ') || password.Contains(' '))
            {
                return new { error = "Niepoprawne dane rejestracji." };
            }

            string registerResult = await _accountService.Register(new AccountDto { Email = email, Password = password });

            if (registerResult!.StartsWith("ey"))
                return new { token = registerResult };

            return new { error = registerResult };
        }

        public async Task<object> Login(string email, string password)
        {
            string loginResult = await _accountService.Login(new AccountDto { Email = email, Password = password });

            if (loginResult.StartsWith("ey"))
            {
                Console.WriteLine(loginResult);
                int waitingCounter = 0;
                do
                {
                    Console.WriteLine(waitingCounter);
                    waitingCounter++;
                    // I can't do it in a different thread, and JS waits for something to return
                    try
                    {
                        Context.GetHttpContext()!.Response.Cookies.Append(
                            "access_token",
                            loginResult,
                            new CookieOptions
                            {
                                HttpOnly = true,
                                Secure = true,
                                SameSite = SameSiteMode.None,
                                Expires = DateTimeOffset.UtcNow.AddDays(1)
                            }
                        );

                        break;
                    }
                    catch (Exception ex) { }
                } while (waitingCounter <= 10);
                return new { success = "yes" };
            }

            return new { error = loginResult };
        }

        public string? Logout()
        {
            string? logoutResult = _accountService.Logout();

            return logoutResult;
        }
    }
}