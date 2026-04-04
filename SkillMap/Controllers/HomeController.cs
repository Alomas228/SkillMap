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

        public async Task<IActionResult> Index()
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

            // Здесь позже будут навыки пользователя
            // Пока заглушка
            ViewBag.UserName = user.FullName;
            ViewBag.UserPosition = user.Position;
            ViewBag.UserDepartment = user.Department;
            ViewBag.UserRole = user.Role;

            // Статистика навыков (позже добавим)
            ViewBag.TotalSkills = 0;
            ViewBag.ExpertCount = 0;
            ViewBag.AdvancedCount = 0;
            ViewBag.IntermediateCount = 0;
            ViewBag.BeginnerCount = 0;

            // Список навыков (позже добавим)
            ViewBag.UserSkills = new List<dynamic>();

            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}