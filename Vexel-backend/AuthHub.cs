using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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

        public async Task<object> Register(string username, string email, string password)
        {
            AccountDto dto = new AccountDto { Username = username, Email = email, Password = password };
            var result = await _authService.Register(dto);

            if (string.IsNullOrEmpty(result))
                return new { error = "Nieznany błąd podczas rejestracji" };

            if (result.StartsWith("ey"))
                return new { token = result };

            return new { error = result };
        }

        public async Task<object> Login(string email, string password)
        {
            AccountDto dto = new AccountDto { Email = email, Password = password };
            var result = await _authService.Login(dto);

            if (string.IsNullOrEmpty(result))
                return new { error = "Nieznany błąd podczas logowania" };

            if (result.StartsWith("ey"))
                return new { token = result };

            return new { error = result };
        }
    }
}