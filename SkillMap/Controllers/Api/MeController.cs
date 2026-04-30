using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using System.Security.Claims;

namespace SkillMap.Controllers.Api
{
    [ApiController]
    [Route("api/me")]
    [Authorize]
    public class MeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard([FromQuery] string search = "")
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId.Value);

            if (user == null)
                return Unauthorized();

            var query = _context.UserSkills
                .Include(us => us.Skill)
                .Where(us => us.UserId == userId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();

                query = query.Where(us =>
                    us.Skill != null &&
                    us.Skill.Name.ToLower().Contains(normalizedSearch));
            }

            var userSkills = await query
                .OrderBy(us => us.Skill != null ? us.Skill.Name : "")
                .ToListAsync();

            return Ok(new
            {
                user = new
                {
                    user.PublicId,
                    user.Email,
                    user.FullName,
                    user.Position,
                    user.Department,
                    user.Role
                },
                stats = new
                {
                    totalSkills = userSkills.Count,
                    seniorCount = userSkills.Count(us => us.Level == "Senior"),
                    middleCount = userSkills.Count(us => us.Level == "Middle"),
                    juniorCount = userSkills.Count(us => us.Level == "Junior"),
                    internCount = userSkills.Count(us => us.Level == "Intern")
                },
                skills = userSkills.Select(us => new
                {
                    userSkillId = us.Id,
                    skillId = us.SkillId,
                    name = us.Skill?.Name ?? "",
                    category = us.Skill?.Category ?? "",
                    level = us.Level,
                    createdAt = us.CreatedAt,
                    updatedAt = us.UpdatedAt
                })
            });
        }

        [HttpGet("skills")]
        public async Task<IActionResult> GetMySkills([FromQuery] string search = "")
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            var query = _context.UserSkills
                .Include(us => us.Skill)
                .Where(us => us.UserId == userId.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();

                query = query.Where(us =>
                    us.Skill != null &&
                    us.Skill.Name.ToLower().Contains(normalizedSearch));
            }

            var skills = await query
                .OrderBy(us => us.Skill != null ? us.Skill.Name : "")
                .Select(us => new
                {
                    userSkillId = us.Id,
                    skillId = us.SkillId,
                    name = us.Skill != null ? us.Skill.Name : "",
                    category = us.Skill != null ? us.Skill.Category : "",
                    level = us.Level,
                    createdAt = us.CreatedAt,
                    updatedAt = us.UpdatedAt
                })
                .ToListAsync();

            return Ok(skills);
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return null;

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return null;

            return userId;
        }
    }
}