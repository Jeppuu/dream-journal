using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DreamJournal.Api.Models;

namespace DreamJournal.Api.Services
{
    /// <summary>
    /// Minimal in-memory user service. Replace with a persistence-backed implementation later.
    /// </summary>
    public class UserService
    {
        private static readonly List<User> Users = new();
        private static readonly object Sync = new();

        public Task<bool> EmailExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return Task.FromResult(false);
            var exists = Users.Any(u => u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(exists);
        }

        public Task CreateUser(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            lock (Sync)
            {
                if (Users.Any(u => u.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)))
                    throw new InvalidOperationException("Email already registered.");

                Users.Add(user);
            }
            return Task.CompletedTask;
        }

        public Task<User?> GetUserByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return Task.FromResult<User?>(null);
            var user = Users.FirstOrDefault(u => u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(user);
        }

        public Task<User?> GetUserById(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return Task.FromResult<User?>(null);
            var user = Users.FirstOrDefault(u => u.Id == id);
            return Task.FromResult(user);
        }

        /// <summary>
        /// Verifies credentials using the stored PasswordHash (BCrypt).
        /// Returns the user on success, null on failure.
        /// </summary>
        public Task<User?> ValidateCredentialsAsync(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return Task.FromResult<User?>(null);

            var user = Users.FirstOrDefault(u => u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase));
            if (user == null) return Task.FromResult<User?>(null);

            var valid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return Task.FromResult(valid ? user : null);
        }
    }
}