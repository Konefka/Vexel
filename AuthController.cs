using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Vexel.tables;
using static Supabase.Postgrest.Constants;

namespace Vexel
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly Supabase.Client _client;
        private readonly PasswordHasher<Users> _hasher = new PasswordHasher<Users>();

        public AuthController(Supabase.Client client)
        {
            _client = client;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto dto)
        {
            if (dto.Name == "" || dto.Email == "" || dto.Password == "")
            {
                return NoContent();
            }

            var user = new Users
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = _hasher.HashPassword(null!, dto.Password)
            };

            var response = await _client.From<Users>().Insert(user);

            if (response.Models.Count == 0)
                return BadRequest("Nie udało się zarejestrować");

            return Ok(new { message = "Zarejestrowano!"});
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto dto)
        {
            var response = await _client.From<Users>().Filter("email", Operator.Equals, dto.Email).Get();

            var dbUser = response.Models.FirstOrDefault();
            if (dbUser == null) return Unauthorized("Nie znaleziono użytkownika");

            var result = _hasher.VerifyHashedPassword(dbUser, dbUser.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Success)
            {
                // Here will be JWT generating or Supabase Auth Session
                return Ok(new { message = "Zalogowano!" });
            }

            return Unauthorized("Błędne hasło");
        }
    }
}
