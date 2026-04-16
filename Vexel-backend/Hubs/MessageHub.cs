using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using Vexel.Models;
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

            await EnsureSession();

            var conversations = await _conversationService.GetUserConversationsDB(userId.Value);

            foreach (var conversation in conversations)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"conv-{conversation.Id}");
            }

            await base.OnConnectedAsync();
        }

        private Guid? GetUserId()
        {
            var claim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claim == null) return null;
            return Guid.Parse(claim);
        }

        private async Task EnsureSession()
        {
            var httpContext = Context.GetHttpContext();
            string? accessToken = httpContext?.Request.Cookies["access_token"];
            string? refreshToken = httpContext?.Request.Cookies["refresh_token"];

            if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(refreshToken))
            {
                await _messageService.EnsureSessionDB(accessToken, refreshToken);
            }
        }

        public async Task SendMessage(Guid conversationId, string text)
        {
            var userId = GetUserId();
            if (userId == null) return;

            await EnsureSession();

            MessageService.MessageResult? savedMessage = await _messageService.SaveMessageDB(userId.Value, conversationId, text);

            await Clients
                .Group($"conv-{conversationId}")
                .SendAsync("ReceiveMessage", conversationId, savedMessage);
        }
    }
}