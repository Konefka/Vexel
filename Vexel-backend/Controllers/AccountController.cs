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

            if (user == null) return NotFound();

            return Ok(new { id = user.Id, name = user.Name, displayName = user.DisplayName });
        }
    }
}