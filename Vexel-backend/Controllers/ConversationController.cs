using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vexel.Services;
using static Vexel.Services.MessageService;

namespace Vexel.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/conversation")]
    public class ConversationController : ControllerBase
    {
        private readonly MessageService _messageService;
        private readonly ConversationService _conversationService;

        public ConversationController(MessageService messageService, ConversationService conversationService)
        {
            _messageService = messageService;
            _conversationService = conversationService;
        }

        [HttpPost("list")]
        public async Task<ActionResult> GetConversationsList()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userIdClaim == null)
                    return Unauthorized("Unauthorized");

                Guid userId = Guid.Parse(userIdClaim);

                var conversations = await _conversationService.GetUserConversationsDB(userId);

                return Ok(new { conversations });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetConversationsList: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpPost("{conversationId}/messages")]
        public async Task<ActionResult<MessageBatch>> GetConversationMessages(
            Guid conversationId,
            [FromQuery] int take = 30,
            [FromQuery] DateTime? before = null)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("Unauthorized");

            Guid userId = Guid.Parse(userIdClaim);

            MessageBatch result = await _messageService.GetMessagesDB(userId, conversationId, take, before);

            return Ok(result);
        }
    }
}