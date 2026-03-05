using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Vexel.Models
{
    [Table("Conversations")]
    internal class Conversations : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }
    }

    public record ConversationDto(Guid Id, string Name);
}