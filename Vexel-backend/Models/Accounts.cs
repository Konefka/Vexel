using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Vexel.Models
{
    [Table("Accounts")]
    public class Accounts : BaseModel
    {
        [PrimaryKey("id", shouldInsert: false)]
        public Guid Id { get; set; }

        [Column("username")]
        public string Name { get; set; } = string.Empty;

        [Column("display_name")]
        public string? DisplayName { get; set; }

        [Column("bio")]
        public string? Bio { get; set; }

        [Column("profile_avatar_url")]
        public string? AvatarUrl { get; set; }

        [Column("status")]
        public string Status { get; set; } = "offline";

        [Column("last_seen_at", ignoreOnInsert: true)]
        public DateTimeOffset? LastSeenAt { get; set; }

        [Column("created_at", ignoreOnInsert: true, ignoreOnUpdate: true)]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("updated_at", ignoreOnInsert: true)]
        public DateTimeOffset? UpdatedAt { get; set; }
    }

    public record AccountDto(string Email, string Password);
}