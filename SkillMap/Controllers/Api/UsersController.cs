using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using SkillMap.Models;
using SkillMap.Services;
using System.ComponentModel.DataAnnotations;

namespace SkillMap.Controllers.Api
{
    [ApiController]
    [Route("api/users")]
    [Authorize(Roles = "HR")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public UsersController(AppDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .OrderBy(u => u.FullName)
                .Select(u => new
                {
                    u.PublicId,
                    u.Email,
                    u.FullName,
                    u.Position,
                    u.Department,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserApiRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new
                {
                    message = "Пароли не совпадают"
                });
            }

            var email = request.Email.Trim().ToLower();

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (existingUser != null)
            {
                return Conflict(new
                {
                    message = "Пользователь с таким email уже существует"
                });
            }

            var user = new User
            {
                PublicId = Guid.NewGuid(),
                Email = email,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                FullName = request.FullName.Trim(),
                Position = request.Position?.Trim() ?? "",
                Department = request.Department?.Trim() ?? "",
                Role = request.Role.Trim()
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.PublicId,
                user.Email,
                user.FullName,
                user.Position,
                user.Department,
                user.Role
            });
        }

        [HttpGet("{publicId:guid}")]
        public async Task<IActionResult> GetUserByPublicId(Guid publicId)
        {
            var user = await _context.Users
                .Where(u => u.PublicId == publicId)
                .Select(u => new
                {
                    u.PublicId,
                    u.Email,
                    u.FullName,
                    u.Position,
                    u.Department,
                    u.Role
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "Пользователь не найден" });

            return Ok(user);
        }
    }

    public class CreateUserApiRequest
    {
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Неверный формат email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        [MinLength(3, ErrorMessage = "Пароль должен быть не менее 3 символов")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Подтверждение пароля обязательно")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "ФИО обязательно")]
        public string FullName { get; set; } = string.Empty;

        public string? Position { get; set; }

        public string? Department { get; set; }

        [Required(ErrorMessage = "Роль обязательна")]
        public string Role { get; set; } = string.Empty;
    }
}