using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace Vexel.tables
{
    [Table("Users")]
    public class Users : BaseModel
    {
        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = null!;
    }

    public class UserDto // Data Transfer Obcject
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
