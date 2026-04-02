using Microsoft.AspNetCore.Mvc;
using SkillMap.Models;
using System.Diagnostics;

namespace SkillMap.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            ViewBag.UserName = User.Identity.Name;
            ViewBag.UserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
     
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
