using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillMap.Models
{
    public class User
    {
        [Key]
        // ID юза 
        public int Id { get; set; }

        // TODO: Подключить к бд к одной из следующих итерации
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid PublicId { get; set; } = Guid.NewGuid(); // Для API и URL

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty; // затычка под хеш

        // ФИО
        public string FullName { get; set; } = string.Empty;

        // Должность
        // TODO: В следующей итерации заменить на отдельную таблицу UserPositions
        public string Position { get; set; } = string.Empty;

        // Отдел
        public string Department { get; set; } = string.Empty;

        // Роль. Employee, Manager, HR
        public string Role {  get; set; } = string.Empty;

        public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();

    }
}
