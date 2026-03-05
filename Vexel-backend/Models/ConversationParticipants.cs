using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json.Serialization;

namespace Vexel.Models
{
    [Table("ConversationParticipants")]
    internal class ConversationParticipants : BaseModel
    {
        [Column("conversation_id")]
        public Guid ConversationId { get; set; }

        [Column("account_id")]
        public Guid AccountId { get; set; }

        [JsonPropertyName("Conversations")]
        public Conversations? Conversation { get; set; }
    }
}