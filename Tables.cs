using Microsoft.AspNetCore.Mvc;
using Npgsql;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Data;
using System.Reflection;

namespace Vexel
{
    [Table("Users")]
    public class Users : BaseModel
    {
        [PrimaryKey("id", true)]
        int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("password_hash")]
        public string Password { get; set; } = null!;
    }
}
