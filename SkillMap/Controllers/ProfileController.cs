using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace SkillMap.Controllers
{
    [Authorize]
    public class ProfileController : Controller
    {
        public IActionResult Index()
        {
            // Получаем данные из Claims
            ViewBag.UserName = User.Identity?.Name;
            ViewBag.UserEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            ViewBag.UserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            ViewBag.Department = User.FindFirst("Department")?.Value;
            ViewBag.Position = User.FindFirst("Position")?.Value;

            return View();
        }

    }
}
