using Microsoft.EntityFrameworkCore;
using SkillMap.Models;

namespace SkillMap.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // У одного пользователя не может быть дважды один навык
            modelBuilder.Entity<UserSkill>()
                .HasIndex(us => new { us.UserId, us.SkillId })
                .IsUnique();

        }
    }
}