using System.ComponentModel.DataAnnotations;

namespace SkillMap.Models
{
    public class Skill
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}