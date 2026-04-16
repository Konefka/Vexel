using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json.Serialization;

namespace Vexel.Models
{
    [Table("ConversationParticipants")]
    public class ConversationParticipants : BaseModel
    {
        [PrimaryKey("conversation_id")]
        public Guid ConversationId { get; set; }

        [PrimaryKey("account_id")]
        public Guid AccountId { get; set; }

        [Column("role")]
        public string Role { get; set; } = "member";

        [Column("joined_at", ignoreOnInsert: true)]
        public DateTimeOffset? JoinedAt { get; set; }
    }
}