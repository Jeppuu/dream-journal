using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using DreamJournal.Api.Services;
using DreamJournal.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace DreamJournal.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;

        public AuthController(IConfiguration configuration, UserService userService)
        {
            _configuration = configuration;
            _userService = userService;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<AuthResponse>> SignUp(SignUpRequest request)
        {
            if (await _userService.EmailExists(request.Email))
            {
                return BadRequest("Email already registered");
            }

            var user = new User
            {
                Email = request.Email,
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            await _userService.CreateUser(user);
            var token = GenerateJwtToken(user);

            return new AuthResponse(token, user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _userService.GetUserByEmail(request.Email);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials");
            }

            var token = GenerateJwtToken(user);
            return new AuthResponse(token, user);
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userService.GetUserById(userId);
            if (user == null)
            {
                return NotFound();
            }

            var response = new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };

            return response;
        }

        private string GenerateJwtToken(User user)
        {
            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured.");

            byte[] keyBytes;
            try
            {
                // allow storing the key as base64 in configuration/user-secrets
                keyBytes = Convert.FromBase64String(keyString);
            }
            catch (FormatException)
            {
                // fallback to UTF8 bytes (legacy/plain string keys)
                keyBytes = Encoding.UTF8.GetBytes(keyString);
            }

            if (keyBytes.Length < 32)
            {
                throw new InvalidOperationException($"Jwt:Key is too short ({keyBytes.Length} bytes). Provide at least 32 bytes (256 bits) for HS256.");
            }

            var key = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}