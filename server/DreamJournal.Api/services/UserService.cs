using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DreamJournal.Api.Models;
using DreamJournal.Api.Repositories;

namespace DreamJournal.Api.Services
{
    /// <summary>
    /// User service backed by database persistence using the repository pattern.
    /// </summary>
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> EmailExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            var user = await _userRepository.GetByEmailAsync(email.Trim());
            return user != null;
        }

        public async Task CreateUser(User user)
        {
            if (user == null) throw new ArgumentNullException(nameof(user));
            
            var existingUser = await _userRepository.GetByEmailAsync(user.Email);
            if (existingUser != null)
                throw new InvalidOperationException("Email already registered.");

            await _userRepository.AddAsync(user);
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;
            return await _userRepository.GetByEmailAsync(email.Trim());
        }

        public async Task<User?> GetUserById(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return null;
            return await _userRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// Verifies credentials using the stored PasswordHash (BCrypt).
        /// Returns the user on success, null on failure.
        /// </summary>
        public async Task<User?> ValidateCredentialsAsync(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return null;

            var user = await _userRepository.GetByEmailAsync(email.Trim());
            if (user == null) return null;

            var valid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return valid ? user : null;
        }
    }
}