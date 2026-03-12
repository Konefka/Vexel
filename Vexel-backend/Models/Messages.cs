using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Vexel.Models
{
    [Table("Messages")]
    internal class Messages : BaseModel
    {
        [PrimaryKey("id", shouldInsert: false)]
        public Guid Id { get; set; }

        [Column("conversation_id")]
        public Guid ConversationId { get; set; }

        [Column("sender_account_id")]
        public Guid? SenderId { get; set; }

        [Column("created_at", ignoreOnInsert: true, ignoreOnUpdate: true)]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("value")]
        public string Value { get; set; } = string.Empty;
    }
}