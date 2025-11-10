using System;
using System.ComponentModel.DataAnnotations;

namespace DreamJournal.Api.Models
{
    public class SignUpRequest
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    /// <summary>
    /// Safe user information returned to clients (does not contain password hash).
    /// </summary>
    public class UserResponse
    {
        public string Id { get; init; } = string.Empty;
        public string Username { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public DateTime CreatedAt { get; init; }
    }

    public class AuthResponse
    {
        public string Token { get; init; } = string.Empty;
        public UserResponse User { get; init; } = new UserResponse();

        public AuthResponse() { }

        public AuthResponse(string token, User user)
        {
            Token = token ?? string.Empty;
            User = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }
    }
}