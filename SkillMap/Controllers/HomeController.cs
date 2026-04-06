using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using SkillMap.Data;
using SkillMap.Models;
using System.Security.Claims;

namespace SkillMap.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly AppDbContext _context;

        public HomeController(ILogger<HomeController> logger, AppDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index(string search = "")
        {
            // Получаем ID текущего пользователя
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return RedirectToAction("Login", "Account");
            }

            // Загружаем пользователя из БД
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            // Получаем навыки пользователя
            var userSkills = await _context.UserSkills
                .Include(us => us.Skill)
                .Where(us => us.UserId == userId)
                .ToListAsync();

            // Фильтр по поиску
            if (!string.IsNullOrEmpty(search))
            {
                userSkills = userSkills.Where(us => us.Skill != null && us.Skill.Name.Contains(search, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Статистика по уровням
            ViewBag.TotalSkills = userSkills.Count;
            ViewBag.SeniorCount = userSkills.Count(us => us.Level == "Senior");
            ViewBag.MiddleCount = userSkills.Count(us => us.Level == "Middle");
            ViewBag.JuniorCount = userSkills.Count(us => us.Level == "Junior");
            ViewBag.InternCount = userSkills.Count(us => us.Level == "Intern");

            
            // Информация о сотруднике
            ViewBag.UserName = user.FullName;
            ViewBag.UserPosition = user.Position;
            ViewBag.UserDepartment = user.Department;
            ViewBag.UserRole = user.Role;

            ViewBag.UserSkills = userSkills;

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}