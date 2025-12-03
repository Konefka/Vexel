using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Reactive;

namespace Vexel.tables
{
    [Table("Users")]
    public class Users : BaseModel
    {
        [Column("username")]
        public string Name { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password_hash")]
        public string PasswordHash { get; set; } = null!;
    }

    public class UserDto // Data Transfer Object
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
