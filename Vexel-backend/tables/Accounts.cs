using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Diagnostics.CodeAnalysis;
using System.Reactive;

namespace Vexel.tables
{
    [Table("Accounts")]
    public class Account : BaseModel
    {
        [Column("id")]
        public Guid Id { get; set; }

        [Column("username")]
        public string Name { get; set; } = null!;

        [Column("display_name")]
        public string? Display_name { get; set; }

        [Column("bio")]
        public string? Bio { get; set; }

        [Column("profile_avatar_url")]
        public string? Avatar_url { get; set; }

        [Column("status")]
        public string Status { get; set; } = null!;

        [Column("last_seen_at")]
        public DateTimeOffset? LastSeenAt { get; set; }

        [Column("created_at")]
        public DateTimeOffset CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTimeOffset? UpdatedAt { get; set; }
    }

    public class AccountDto // Data Transfer Object
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}