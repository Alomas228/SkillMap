using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using SkillMap.Models;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace SkillMap.Controllers.Api
{
    [ApiController]
    [Route("api/skills")]
    [Authorize]
    public class ApiSkillsController : ControllerBase
    {
        private readonly AppDbContext _context;

        private static readonly string[] AllowedLevels =
        [
            "Intern",
            "Junior",
            "Middle",
            "Senior"
        ];

        public ApiSkillsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableSkills()
        {
            var skills = await _context.Skills
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Category
                })
                .ToListAsync();

            return Ok(skills);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSkills()
        {
            var skills = await _context.Skills
                .OrderBy(s => s.Name)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Category,
                    s.IsActive
                })
                .ToListAsync();

            return Ok(skills);
        }

        [Authorize(Roles = "HR")]
        [HttpPost]
        public async Task<IActionResult> CreateSkill([FromBody] CreateSkillRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var skillName = request.Name.Trim();

            var exists = await _context.Skills
                .AnyAsync(s => s.Name.ToLower() == skillName.ToLower());

            if (exists)
            {
                return Conflict(new
                {
                    message = "Навык с таким названием уже существует"
                });
            }

            var skill = new Skill
            {
                Name = skillName,
                Category = request.Category?.Trim() ?? "",
                IsActive = true
            };

            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllSkills), new { id = skill.Id }, new
            {
                skill.Id,
                skill.Name,
                skill.Category,
                skill.IsActive
            });
        }

        [HttpPost("my")]
        public async Task<IActionResult> AddSkillToCurrentUser([FromBody] AddUserSkillRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            if (!AllowedLevels.Contains(request.Level))
            {
                return BadRequest(new
                {
                    message = "Недопустимый уровень навыка"
                });
            }

            var skill = await _context.Skills
                .FirstOrDefaultAsync(s => s.Id == request.SkillId && s.IsActive);

            if (skill == null)
            {
                return NotFound(new
                {
                    message = "Навык не найден"
                });
            }

            var alreadyExists = await _context.UserSkills
                .AnyAsync(us => us.UserId == userId.Value && us.SkillId == request.SkillId);

            if (alreadyExists)
            {
                return Conflict(new
                {
                    message = "Этот навык уже добавлен"
                });
            }

            var userSkill = new UserSkill
            {
                UserId = userId.Value,
                SkillId = request.SkillId,
                Level = request.Level,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserSkills.Add(userSkill);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                userSkill.Id,
                userSkill.SkillId,
                skill.Name,
                skill.Category,
                userSkill.Level,
                userSkill.CreatedAt,
                userSkill.UpdatedAt
            });
        }

        [HttpDelete("my/{skillId:int}")]
        public async Task<IActionResult> RemoveSkillFromCurrentUser(int skillId)
        {
            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            var userSkill = await _context.UserSkills
                .FirstOrDefaultAsync(us => us.UserId == userId.Value && us.SkillId == skillId);

            if (userSkill == null)
            {
                return NotFound(new
                {
                    message = "Навык у пользователя не найден"
                });
            }

            _context.UserSkills.Remove(userSkill);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true
            });
        }

        [HttpPatch("my/{skillId:int}/level")]
        public async Task<IActionResult> UpdateCurrentUserSkillLevel(
            int skillId,
            [FromBody] UpdateSkillLevelRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();

            if (userId == null)
                return Unauthorized();

            if (!AllowedLevels.Contains(request.Level))
            {
                return BadRequest(new
                {
                    message = "Недопустимый уровень навыка"
                });
            }

            var userSkill = await _context.UserSkills
                .Include(us => us.Skill)
                .FirstOrDefaultAsync(us => us.UserId == userId.Value && us.SkillId == skillId);

            if (userSkill == null)
            {
                return NotFound(new
                {
                    message = "Навык у пользователя не найден"
                });
            }

            userSkill.Level = request.Level;
            userSkill.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                userSkill.Id,
                userSkill.SkillId,
                name = userSkill.Skill?.Name ?? "",
                category = userSkill.Skill?.Category ?? "",
                userSkill.Level,
                userSkill.CreatedAt,
                userSkill.UpdatedAt
            });
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

    public class AddUserSkillRequest
    {
        [Required]
        public int SkillId { get; set; }

        [Required]
        public string Level { get; set; } = string.Empty;
    }

    public class UpdateSkillLevelRequest
    {
        [Required]
        public string Level { get; set; } = string.Empty;
    }

    public class CreateSkillRequest
    {
        [Required(ErrorMessage = "Название навыка обязательно")]
        public string Name { get; set; } = string.Empty;

        public string? Category { get; set; }
    }
}