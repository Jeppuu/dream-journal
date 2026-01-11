using Microsoft.EntityFrameworkCore;
using DreamJournal.Api.Models;

namespace DreamJournal.Api.Data
{
    public class DreamJournalDbContext : DbContext
    {
        public DreamJournalDbContext(DbContextOptions<DreamJournalDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<DreamEntry> DreamEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure DreamEntry entity
            modelBuilder.Entity<DreamEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.Description).IsRequired().HasMaxLength(5000);
                entity.Property(e => e.Mood).IsRequired().HasMaxLength(50);
                entity.Property(e => e.UserId).IsRequired();

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
