using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Vexel.Models;
using Vexel.Services;
using static Vexel.Services.AccountService;

namespace Vexel.Controllers
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
                await _accountService.SignUpDB(
                    new AccountDto(request.Email, request.Password)
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
                await _accountService.SignInDB(
                    new AccountDto(request.Email, request.Password)
                )
            );
        }

        [Authorize]
        [HttpPost("logout")]
        public object Logout()
        {
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return new { success = _accountService.SignOutDB()};
        }

        private bool CheckForEmptyValues(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) ||
                email.Contains(' ') || password.Contains(' '))
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
            else return SetAuthCookies(tokenOrError.accessToken!, tokenOrError.refreshToken!);
        }

        private object SetAuthCookies(string accessToken, string refreshToken)
        {
            Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddHours(1),
                Path = "/"
            });

            Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(14),
                Path = "/"
            });

            return new { success = true };
        }
    }
}