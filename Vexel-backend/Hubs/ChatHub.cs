//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.SignalR;
//using System.Text.RegularExpressions;
//using Vexel.Account;
//using Vexel.Services;
//using Vexel.tables;

//namespace Vexel.Hubs
//{
//    [Authorize]
//    internal class ChatHub : Hub
//    {
//        private readonly MessageService _messageService;

//        public ChatHub(MessageService messageService)
//        {
//            _messageService = messageService;
//        }

//        public async Task JoinConversation(string conversationId)
//        {
//            await Groups.AddToGroupAsync(
//                Context.ConnectionId,
//                $"conv-{conversationId}"
//            );
//        }


//        public async Task SendMessage(string conversationId, string content)
//        {
//            var userId = Context.UserIdentifier;

//            // zapis do DB
//            var message = new Message
//            {
//                ConversationId = conversationId,
//                SenderId = userId,
//                Content = content,
//                CreatedAt = DateTime.UtcNow
//            };

//            // _db.Messages.Add(message);
//            // await _db.SaveChangesAsync();

//            await Clients.Group($"conv-{conversationId}")
//                .SendAsync("ReceiveMessage", new
//                {
//                    message.ConversationId,
//                    message.SenderId,
//                    message.Content,
//                    message.CreatedAt
//                });
//        }
//    }
//}