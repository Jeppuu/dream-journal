using Microsoft.EntityFrameworkCore;
using DreamJournal.Api.Data;
using DreamJournal.Api.Models;

namespace DreamJournal.Api.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByEmailAsync(string email);
    }

    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(DreamJournalDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
