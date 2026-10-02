using Supabase.Postgrest;
using System.Security.Principal;
using Vexel.Models;

namespace Vexel.Services
{
    public class ConversationService
    {
        private readonly Supabase.Client _client;

        public ConversationService(Supabase.Client client)
        {
            _client = client;
        }

        public async Task<List<ConversationDto>> GetUserConversationsDB(Guid userId)
        {
            try
            {
                // Get user chats
                var participations = await _client
                    .From<ConversationParticipants>()
                    .Filter(x => x.AccountId, Constants.Operator.Equals, userId.ToString())
                    .Get();

                if (!participations.Models.Any())
                    return new List<ConversationDto>();

                // Mapping for Constants.Operator.In
                var conversationIds = participations.Models
                    .Select(x => x.ConversationId.ToString())
                    .ToList();

                // Get id's + names of chats
                var conversations = await _client
                    .From<Conversations>()
                    .Filter(x => x.Id, Constants.Operator.In, conversationIds)
                    .Order(x => x.CreatedAt, Constants.Ordering.Descending)
                    .Get();

                return conversations.Models
                    .Select(c => new ConversationDto
                    {
                        Id = c.Id,
                        Name = c.Name
                    })
                    .ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in GetUserConversations: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                throw;
            }
        }
    }
}