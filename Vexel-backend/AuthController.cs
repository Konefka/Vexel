using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Supabase;
using Supabase.Functions;
using Supabase.Gotrue;
using Supabase.Postgrest;
using Supabase.Postgrest.Responses;
using System;
using System.ComponentModel.DataAnnotations;
using System.Reactive;
using System.Text.Json;
using Vexel.tables;
using static Supabase.Postgrest.Constants;

namespace Vexel
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly Supabase.Client _client;
        protected string jwt_token = null!;

        public AuthController(Supabase.Client client)
        {
            _client = client;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto dto)
        {
            try
            {
                var passwords = await _client.From<Accounts>()
                    .Where(x => x.Name == dto.Username)
                    .Get();

                if (passwords.Model != null)
                {
                    return BadRequest("Już ktoś ma takie username");
                }

                Session? signUpResponse = await _client.Auth.SignUp(dto.Email, dto.Password);

                var account = new Accounts { Id = signUpResponse!.User!.Id!, Name = dto.Username };

                ModeledResponse<Accounts> response = await _client.From<Accounts>().Insert(account);
            }
            catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
            {
                if (ex.Message.Contains("\"code\":\"23505\""))
                {
                    return Ok(Login(dto).Result);
                }

                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


            jwt_token = _client.Auth.CurrentSession!.AccessToken!;
            return Ok("Zarejestrowano!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto dto)
        {
            try
            {
                var signInResponse = await _client.Auth.SignInWithPassword(dto.Email, dto.Password);

                if (signInResponse!.User == null)
                    return NotFound("Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            jwt_token = _client.Auth.CurrentSession!.AccessToken!;
            return Ok("Zalogowano!");
        }
    }
}