using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
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
                return new { token = loginResult };

            return new { error = loginResult };
        }
    }
}