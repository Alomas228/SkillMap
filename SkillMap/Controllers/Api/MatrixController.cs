using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;

namespace SkillMap.Controllers.Api
{
    [ApiController]
    [Route("api/matrix")]
    [Authorize(Roles = "Manager,HR")]
    public class MatrixController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MatrixController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetMatrix()
        {
            var users = await _context.Users
                .Include(u => u.UserSkills)
                    .ThenInclude(us => us.Skill)
                .OrderBy(u => u.FullName)
                .ToListAsync();

            var skills = await _context.Skills
                .Where(s => s.IsActive)
                .OrderBy(s => s.Category)
                .ThenBy(s => s.Name)
                .ToListAsync();

            var departments = users
                .Select(u => u.Department)
                .Where(d => !string.IsNullOrWhiteSpace(d))
                .Distinct()
                .OrderBy(d => d)
                .ToList();

            var employees = users.Select(u => new
            {
                u.PublicId,
                u.FullName,
                u.Position,
                u.Department,
                u.Role,
                Skills = u.UserSkills
                    .Where(us => us.Skill != null)
                    .Select(us => new
                    {
                        SkillId = us.SkillId,
                        SkillName = us.Skill!.Name,
                        SkillCategory = us.Skill.Category,
                        Level = us.Level,
                        us.CreatedAt,
                        us.UpdatedAt
                    })
                    .OrderBy(s => s.SkillCategory)
                    .ThenBy(s => s.SkillName)
                    .ToList()
            }).ToList();

            var allUserSkills = users
                .SelectMany(u => u.UserSkills)
                .Where(us => us.Skill != null)
                .ToList();

            var stats = new
            {
                TotalEmployees = users.Count,
                UniqueSkills = skills.Count,
                Experts = users.Count(u => u.UserSkills.Any(us => us.Level == "Senior")),
                SeniorCount = allUserSkills.Count(us => us.Level == "Senior"),
                MiddleCount = allUserSkills.Count(us => us.Level == "Middle"),
                JuniorCount = allUserSkills.Count(us => us.Level == "Junior"),
                InternCount = allUserSkills.Count(us => us.Level == "Intern")
            };

            return Ok(new
            {
                Stats = stats,
                Departments = departments,
                Skills = skills.Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Category
                }),
                Employees = employees
            });
        }
    }
}