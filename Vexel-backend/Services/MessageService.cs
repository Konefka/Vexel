using Vexel.Models;
using Supabase.Postgrest;

namespace Vexel.Services
{
    public class MessageService
    {
        private readonly Supabase.Client _client;

        public MessageService(Supabase.Client client)
        {
            _client = client;
        }

        public record MessageResult(Guid Id, string Text, string? SenderID, DateTime DateStamp);
        public record MessageBatch(Guid ConversationId, List<MessageResult> Messages, bool hasMore);

        public async Task<bool> IsUserInConversation(Guid userId, Guid conversationId)
        {
            var response = await _client
                .From<ConversationParticipants>()
                .Where(x => x.ConversationId == conversationId && x.AccountId == userId)
                .Get();

            return response.Models.Any();
        }

        public async Task<MessageBatch> GetMessagesDB(Guid conversationId, int take = 20, DateTimeOffset? before = null)
        {
            if (!before.HasValue)
            {
                before = DateTimeOffset.Now;
            }

            var query = await _client.From<Messages>()
                .Select(x => new object[] { x.Id, x.Value, x.SenderId!, x.CreatedAt })
                .Where(x => x.ConversationId == conversationId && x.CreatedAt < before)
                .Order(x => x.CreatedAt, Constants.Ordering.Descending)
                .Limit(take + 1)
                .Get();

            var allMessages = query.Models
                .Select(m => new MessageResult(
                    m.Id,
                    m.Value,
                    m.SenderId.ToString() ?? "deleted user",
                    m.CreatedAt.DateTime))
                .ToList();

            bool hasMore = allMessages.Count > take;

            var messages = allMessages.Take(take).ToList();

            return new MessageBatch(conversationId, messages, hasMore);
        }
    }
}