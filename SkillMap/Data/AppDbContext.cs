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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // base.OnModelCreating(modelBuilder); // Пока закомментируем

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Временно удалите или закомментируйте HasData
            /*
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Email = "ivanov@company.com", ... }
            );
            */
        }
    }
}