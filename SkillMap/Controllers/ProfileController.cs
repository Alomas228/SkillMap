using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using System.Security.Claims;


namespace SkillMap.Controllers
{
    [Authorize]
    public class ProfileController : Controller
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {

            // Получаем ID юзера из claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return RedirectToAction("Login", "Account");
            }

            // Загружаем пользователя из базы данных
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            // Передаём данные в представление
            ViewBag.UserName = user.FullName;
            ViewBag.UserEmail = user.Email;
            ViewBag.UserRole = user.Role;
            ViewBag.Department = user.Department;
            ViewBag.Position = user.Position;
            
            return View();
        }
        
        

        public IActionResult DebugClaims()
        {
            var allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Json(allClaims);
        }

    }
}
