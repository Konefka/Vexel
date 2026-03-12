using Vexel.Models;
using Supabase.Postgrest;
using Supabase.Postgrest.Responses;

namespace Vexel.Services
{
    public class MessageService
    {
        private readonly Supabase.Client _client;

        public MessageService(Supabase.Client client)
        {
            _client = client;
        }

        public record MessageResult(Guid Id, string Text, string? SenderName, DateTimeOffset DateStamp);
        public record MessageBatch(Guid ConversationId, List<MessageResult> Messages, bool hasMore);

        public async Task<bool> IsUserInConversation(Guid userId, Guid conversationId)
        {
            var response = await _client
                .From<ConversationParticipants>()
                .Where(x => x.ConversationId == conversationId && x.AccountId == userId)
                .Get();

            return response.Models.Any();
        }

        public async Task<MessageBatch> GetMessagesDB(Guid userId, Guid conversationId, int take, DateTimeOffset? before = null)
        {
            before ??= DateTimeOffset.Now;

            ModeledResponse<Messages> query = await _client.From<Messages>()
                .Select(x => new object[] { x.Id, x.Value, x.SenderId!, x.CreatedAt })
                .Where(x => x.ConversationId == conversationId && x.CreatedAt < before)
                .Order(x => x.CreatedAt, Constants.Ordering.Descending)
                .Limit(take + 1)
                .Get();

            var senderIds = query.Models
                .Select(m => m.SenderId)
                .Distinct()
                .ToList();

            ModeledResponse<Accounts> names = await _client.From<Accounts>()
                .Select(x => new object[] { x.Id, x.Name })
                .Filter(x => x.Id, Constants.Operator.In, senderIds)
                .Get();

            var nameDict = names.Models.ToDictionary(a => a.Id, a => a.Name);

            var allMessages = query.Models
                .Select(m => new MessageResult(
                    m.Id,
                    m.Value,
                    m.SenderId == null ? "deleted user" : (nameDict.TryGetValue(m.SenderId.Value, out var name) ? name : "unknown user"),
                    m.CreatedAt.DateTime))
                .Reverse()
                .ToList();

            bool hasMore = allMessages.Count > take;
            var messages = allMessages.Take(take).ToList();

            return new MessageBatch(conversationId, messages, hasMore);
        }

        public async Task<MessageResult> SaveMessageDB(Guid senderId, Guid conversationId, string text)
        {
            Messages newMessage = new Messages
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Value = text,
            };

            ModeledResponse<Messages> response = await _client
                .From<Messages>()
                .Insert(newMessage, new QueryOptions { Returning = QueryOptions.ReturnType.Representation });

            var saved = response.Models.First();

            var accountResponse = await _client
                .From<Accounts>()
                .Select(x => new object[] { x.Id, x.Name })
                .Where(x => x.Id == senderId)
                .Get();

            var senderName = accountResponse.Models.FirstOrDefault()?.Name ?? "unknown user";

            return new MessageResult(
                saved.Id,
                saved.Value,
                senderName,
                saved.CreatedAt
            );
        }
    }
}