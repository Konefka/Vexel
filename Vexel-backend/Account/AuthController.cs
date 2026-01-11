using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
        [HttpPost("status")]
        public object CheckStatus()
        {
            return new { success = true };
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

        [Authorize]
        [HttpPost("logout")]
        public object Logout()
        {
            return HandleAuthResult(
                _accountService.SignOut()
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
            {
                Response.Cookies.Delete("access_token");
                return new { error = tokenOrError.Error };
            }
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
                    Expires = DateTimeOffset.UtcNow.AddMinutes(30)
                }
            );

            return new { success = true };
        }
    }
}