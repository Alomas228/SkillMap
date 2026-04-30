using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillMap.Data;
using SkillMap.Models;
using System.Security.Claims;


namespace SkillMap.Controllers
{
    [Authorize]
    public class SkillsController : Controller
    {
        private readonly AppDbContext _context;

        public SkillsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAvailableSKills()
        {
            var skills = await _context.Skills
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .Select(s => new { s.Id, s.Name, s.Category })
                .ToListAsync();

            return Ok(skills);
        }

        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> AddSkill(int skillId, string level)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            // Проверка данных
            if (skillId <= 0)
            {
                return BadRequest($"Неверный ID навыка: {skillId}");
            }

            if (string.IsNullOrWhiteSpace(level))
            {
                return BadRequest($"Не указан уровень: '{level}'");
            }

            // Существует ли навык?
            var skill = await _context.Skills.FindAsync(skillId);
            if (skill == null)
            {
                return BadRequest($"Навык с ID {skillId} не найден");
            }

            // Уже есть такой навык?
            var existing = await _context.UserSkills
                .FirstOrDefaultAsync(us => us.UserId == userId && us.SkillId == skillId);

            if (existing != null)
            {
                return BadRequest("Этот навык уже добавлен");
            }

            var userSkill = new UserSkill
            {
                UserId = userId,
                SkillId = skillId,
                Level = level,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserSkills.Add(userSkill);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveSkill(int skillId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var userSkill = await _context.UserSkills
                .FirstOrDefaultAsync(us => us.UserId == userId && us.SkillId == skillId);

            if (userSkill != null)
            {
                _context.UserSkills.Remove(userSkill);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateLevel(int skillId, string level)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var userSkill = await _context.UserSkills
                .FirstOrDefaultAsync(us => us.UserId == userId && us.SkillId == skillId);

            if (userSkill != null)
            {
                userSkill.Level = level;
                userSkill.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
