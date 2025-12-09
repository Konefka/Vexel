using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Vexel.tables;

namespace Vexel
{
    public class AuthHub : Hub
    {
        private readonly AuthService _authService;

        public AuthHub(AuthService authService)
        {
            _authService = authService;
        }

        public async Task<object> Register(string email, string password)
        {
            if (email.IsNullOrEmpty() || password.IsNullOrEmpty())
            {
                return new { error = "Niepoprawne dane rejestracji." };
            }

            string registerResult = await _authService.Register(new AccountDto { Email = email, Password = password });

            if (registerResult!.StartsWith("ey"))
                return new { token = registerResult };

            return new { error = registerResult };
        }

        public async Task<object> Login(string email, string password)
        {
            string loginResult = await _authService.Login(new AccountDto { Email = email, Password = password });

            if (loginResult.StartsWith("ey"))
                return new { token = loginResult };

            return new { error = loginResult };
        }
    }
}