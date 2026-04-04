using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using SkillMap.Models;
using SkillMap.Services;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Security.Principal;

namespace SkillMap.Controllers
{
    public class AccountController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public AccountController(AppDbContext context, IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Login(string returnUrl = "/")
        {
            if (User.Identity?.IsAuthenticated ==true)
                return Redirect(returnUrl);

            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = "/")
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            Console.WriteLine($"Trying to login with email: {model.Email}");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == model.Email.ToLower());

            if (user == null)
            {
                Console.WriteLine($"User not found: {model.Email}");
                ModelState.AddModelError("", "Неверная почта или пароль");
                return View(model);
            }

            // Проверка пароля
            var isValid = _passwordHasher.VerifyPassword(model.Password, user.PasswordHash);
            Console.WriteLine($"Password valid: {isValid}");

            if (!isValid)
            {
                ModelState.AddModelError("", "Неверная почта или пароль");
                return View(model);
            }


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = model.RememberMe,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);

            return RedirectToAction("Index", "Home");
        }

        [Authorize(Roles = "HR")]
        [HttpGet]
        public IActionResult HashPassword(string password)
        {
            var hash = _passwordHasher.HashPassword(password);
            return Ok(new { password, hash  });
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> MigratePasswords()
        {
            var users = await _context.Users.ToListAsync();
            int updatedCount = 0;

            foreach (var user in users)
            {
                // Проверяем, является ли пароль уже хешем BCrypt
                // BCrypt хеши всегда начинаются с "$2"
                if (!user.PasswordHash.StartsWith("$2"))
                {
                    // Хешируем текущий пароль (который хранится в открытом виде)
                    var hashedPassword = _passwordHasher.HashPassword(user.PasswordHash);
                    user.PasswordHash = hashedPassword;
                    updatedCount++;
                    Console.WriteLine($"Migrated password for user: {user.Email}");
                }
            }

            await _context.SaveChangesAsync();
            return Ok($"Мигрировано паролей: {updatedCount} из {users.Count} пользователей");
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult TestBcrypt()
        {
            var hash = "$2a$12$uDVF1sP0LxBVFtbVAfF03.tJTFh1VrsT0zX3/.ZtKyTkJgtrbCoJa";
            var password = "111";

            var isValid = BCrypt.Net.BCrypt.Verify(password, hash);

            return Ok(new
            {
                hash,
                password,
                isValid,
                message = isValid ? "Пароль верный" : "Пароль неверный"
            });
        }
    }
}
