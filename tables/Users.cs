using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Reactive;

namespace Vexel.tables
{
    [Table("Accounts")]
    public class Accounts : BaseModel
    {
        [Column("id")]
        public string Id { get; set; } = null!;

        [Column("username")]
        public string Name { get; set; } = null!;

        //[Column("display_name")]
        //public string Display_name { get; set; } = null!;

        //[Column("bio")]
        //public string Bio { get; set; } = null!;

        //[Column("profile_avatar_url")]
        //public string Avatar_url { get; set; } = null!;

        //[Column("status")]
        //public string Status { get; set; } = null!;
    }

    public class UserDto // Data Transfer Object
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}