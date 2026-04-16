using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Vexel.Models
{
    [Table("Conversations")]
    public class Conversations : BaseModel
    {
        [PrimaryKey("id", shouldInsert: false)]
        public Guid Id { get; set; }

        [Column("type")]
        public string Type { get; set; } = "direct";

        [Column("name")]
        public string? Name { get; set; }

        [Column("created_by")]
        public Guid? CreatedBy { get; set; }

        [Column("last_message_id")]
        public Guid? LastMessageId { get; set; }

        [Column("last_message_at")]
        public DateTimeOffset? LastMessageAt { get; set; }

        [Column("created_at", ignoreOnInsert: true, ignoreOnUpdate: true)]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("updated_at", ignoreOnInsert: true)]
        public DateTimeOffset? UpdatedAt { get; set; }
    }

    public class ConversationDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
    }
}