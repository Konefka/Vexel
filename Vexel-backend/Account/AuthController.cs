using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Vexel.tables;
using static Vexel.Account.AccountService;

namespace Vexel.Account
{
    [ApiController]
    [Route("/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AccountService _accountService;

        public AuthController(AccountService accountService)
        {
            _accountService = accountService;
        }

        [Authorize]
        [HttpPost("test")]
        public object Test([FromBody] LoginRequest request)
        {
            Console.WriteLine("UDAŁO SIĘ! " + request.Email + request.Password);

            return new { success = "UDAŁO SIĘ!" + request.Email + request.Password };
        }

        [HttpPost("register")]
        public async Task<object> Register([FromBody] RegisterRequest request)
        {
            if (CheckForEmptyValues(request.Email, request.Password))
            {
                return new { error = "Błędne dane rejestracji" };
            }

            return HandleAuthResult(
                await _accountService.SignUp(
                    new AccountDto { Email = request.Email, Password = request.Password }
                )
            );
        }

        [HttpPost("login")]
        public async Task<object> Login([FromBody] LoginRequest request)
        {
            if (CheckForEmptyValues(request.Email, request.Password))
            {
                return new { error = "Błędne dane loginu" };
            }

            return HandleAuthResult(
                await _accountService.SignIn(
                    new AccountDto { Email = request.Email, Password = request.Password }
                )
            );
        }
        private bool CheckForEmptyValues(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || email.Contains(' ') || password.Contains(' '))
            {
                return true;
            }

            return false;
        }


        private object HandleAuthResult(AuthResult tokenOrError)
        {
            if (!tokenOrError.Success)
                return new { error = tokenOrError.Error };
            else
                return SetAuthCookie(tokenOrError.Token!);
        }

        private object SetAuthCookie(string token)
        {
            Response.Cookies.Append(
                "access_token",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddDays(1)
                }
            );

            return new { success = true };
        }
    }
}