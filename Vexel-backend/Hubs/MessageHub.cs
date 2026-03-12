using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Vexel.Services;

namespace Vexel.Hubs
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly MessageService _messageService;
        private readonly ConversationService _conversationService;

        public MessageHub(MessageService messageService, ConversationService conversationService)
        {
            _messageService = messageService;
            _conversationService = conversationService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                await base.OnConnectedAsync();
                return;
            }

            var conversations = await _conversationService.GetUserConversations(userId.Value);

            foreach (var conversation in conversations)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"conv-{conversation.Id}");
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(Guid conversationId, string text)
        {
            var userId = GetUserId();
            if (userId == null) return;

            bool isParticipant = await _messageService.IsUserInConversation(userId.Value, conversationId);
            if (!isParticipant) return;

            var savedMessage = await _messageService.SaveMessageDB(userId.Value, conversationId, text);

            await Clients
                .Group($"conv-{conversationId}")
                .SendAsync("ReceiveMessage", conversationId, savedMessage);
        }

        private Guid? GetUserId()
        {
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claim == null) return null;
            return Guid.Parse(claim);
        }
    }
}