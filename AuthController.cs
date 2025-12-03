using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Supabase;
using Supabase.Functions;
using Supabase.Postgrest;
using Supabase.Postgrest.Responses;
using System;
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
                return BadRequest("Nie wpisano poprawnych danych");

            var user = new Users
            {
                Name = dto.Name,
                Email = dto.Email.ToLower(),
                PasswordHash = _hasher.HashPassword(null!, dto.Password)
            };

            try
            {
                ModeledResponse<Users>  response = await _client.From<Users>().Insert(user);
                if (response.Models.Count == 0)
                    return BadRequest("Nie udało się zarejestrować");

            } catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
            {
                if (ex.Message.Contains("\"code\":\"23505\""))
                    return Ok(Login(dto).Result);
            }

            return Ok(new { message = "Zarejestrowano!"});
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto dto)
        {
            var response = await _client.From<Users>().Filter("email", Operator.Equals, dto.Email.ToLower()).Get();

            var dbUser = response.Models.FirstOrDefault();
            if (dbUser == null)
                return BadRequest("Zły email");

            var result = _hasher.VerifyHashedPassword(null!, dbUser.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Success)
            {
                // Here will be JWT generating or Supabase Auth Session
                return Ok("Zalogowano!");
            }

            return BadRequest("Błędne hasło");
        }
    }
}
