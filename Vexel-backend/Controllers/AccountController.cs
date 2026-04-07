using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vexel.Services;

namespace Vexel.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/account")]
    public class AccountController : ControllerBase
    {
        private readonly AccountService _accountService;

        public AccountController(AccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("me")]
        public async Task<ActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            Guid userId = Guid.Parse(userIdClaim);
            var user = await _accountService.GetUserByIdDB(userId);

            if (user == null) return NotFound("No user found");

            if (user.Name == null) return Conflict("No username found");

            return Ok(new { id = user.Id, name = user.Name, displayName = user.DisplayName });
        }

        [HttpPost("setUsername")]
        public async Task<ActionResult> SetUsername([FromBody] UsernameDto dto)
        {
            var username = dto.Username;

            if (string.IsNullOrEmpty(username))
                return BadRequest(new { error = "Username cannot be empty" });

            if (username.Length < 5)
                return BadRequest(new { error = "Username has to have at least 5 characters" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized(new { error = "You are not qualified to do this action" });

            Guid userId = Guid.Parse(userIdClaim);

            var result = await _accountService.SetUsernameDB(userId, username);

            if (result.Success)
                return Ok();
            else
                return BadRequest(new { error = result.Error });
        }

        public class UsernameDto
        {
            public required string Username { get; set; }
        }
    }
}