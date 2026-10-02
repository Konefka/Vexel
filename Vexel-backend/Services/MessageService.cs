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

        public async Task EnsureSessionDB(string accessToken, string refreshToken)
        {
            await _client.Auth.SetSession(accessToken, refreshToken);
        }

        public record MessageResult(Guid Id, string Text, string? SenderName, DateTimeOffset DateStamp);
        public record MessageBatch(Guid ConversationId, List<MessageResult> Messages, bool hasMore);

        public async Task<MessageBatch> GetMessagesDB(Guid userId, Guid conversationId, int take, DateTimeOffset? before = null)
        {
            before ??= DateTimeOffset.Now.AddMinutes(5);

            ModeledResponse<Messages> query = await _client.From<Messages>()
                .Select(x => new object[] { x.Id, x.Content, x.SenderAccountId!, x.CreatedAt })
                .Where(x => x.ConversationId == conversationId && x.CreatedAt < before)
                .Order(x => x.CreatedAt, Constants.Ordering.Descending)
                .Limit(take + 1)
                .Get();

            List<Guid?> senderIds = query.Models
                .Select(x => x.SenderAccountId)
                .Distinct()
                .ToList();

            ModeledResponse<Accounts> names = await _client.From<Accounts>()
                .Select(x => new object[] { x.Id, x.Name! })
                .Filter(x => x.Id, Constants.Operator.In, senderIds)
                .Get();

            Dictionary<Guid, string?> nameDict = names.Models.ToDictionary(x => x.Id, x => x.Name);

            List<MessageResult> allMessages = query.Models
                .Select(x => new MessageResult(
                    x.Id,
                    x.Content,
                    x.SenderAccountId == null ? "deleted user" : (nameDict.TryGetValue(x.SenderAccountId.Value, out var name) ? name : "unknown user"),
                    x.CreatedAt.DateTime))
                .ToList();

            bool hasMore = allMessages.Count > take;

            List<MessageResult> messages = allMessages
                .Take(take)
                .Reverse()
                .ToList();

            return new MessageBatch(conversationId, messages, hasMore);
        }

        public async Task<MessageResult> SaveMessageDB(Guid senderId, Guid conversationId, string text)
        {
            Messages newMessage = new Messages
            {
                ConversationId = conversationId,
                SenderAccountId = senderId,
                Content = text,
            };

            ModeledResponse<Messages> response = await _client
                .From<Messages>()
                .Insert(newMessage, new QueryOptions { Returning = QueryOptions.ReturnType.Representation });

            Messages? saved = response.Models.First();

            ModeledResponse<Accounts> accountResponse = await _client
                .From<Accounts>()
                .Select(x => new object[] { x.Id, x.Name! })
                .Where(x => x.Id == senderId)
                .Get();

            var senderName = accountResponse.Models.FirstOrDefault()?.Name ?? "unknown user";

            return new MessageResult(
                saved.Id,
                saved.Content,
                senderName,
                saved.CreatedAt
            );
        }
    }
}