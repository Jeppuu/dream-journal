using Microsoft.EntityFrameworkCore;
using DreamJournal.Api.Data;
using DreamJournal.Api.Models;

namespace DreamJournal.Api.Repositories
{
    public interface IDreamEntryRepository : IRepository<DreamEntry>
    {
        Task<IEnumerable<DreamEntry>> GetByMoodAsync(string userId, string mood);
        Task<IEnumerable<DreamEntry>> GetByDateRangeAsync(string userId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<DreamEntry>> SearchAsync(string userId, string query);
        Task<IEnumerable<DreamEntry>> GetAllForUserAsync(string userId);
    }

    public class DreamEntryRepository : GenericRepository<DreamEntry>, IDreamEntryRepository
    {
        public DreamEntryRepository(DreamJournalDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DreamEntry>> GetByMoodAsync(string userId, string mood)
        {
            return await _dbSet.Where(d => d.UserId == userId && d.Mood == mood).OrderByDescending(d => d.Date).ToListAsync();
        }

        public async Task<IEnumerable<DreamEntry>> GetByDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(d => d.UserId == userId && d.Date >= startDate && d.Date <= endDate)
                .OrderByDescending(d => d.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<DreamEntry>> SearchAsync(string userId, string query)
        {
            var lowerQuery = query.ToLower();
            return await _dbSet
                .Where(d => d.UserId == userId && (d.Description.ToLower().Contains(lowerQuery) || d.Mood.ToLower().Contains(lowerQuery)))
                .OrderByDescending(d => d.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<DreamEntry>> GetAllForUserAsync(string userId)
        {
            return await _dbSet.Where(d => d.UserId == userId).OrderByDescending(d => d.Date).ToListAsync();
        }
    }
}
