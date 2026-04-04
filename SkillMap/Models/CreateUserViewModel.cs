using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace SkillMap.Models
{
    public class CreateUserViewModel
    {
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage ="Неверный формат email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        [DataType(DataType.Password)]
        [MinLength(3, ErrorMessage = "Пароль должен быть не менее 3 символов")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Подтвержение пароля обязательно")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Пароли не совпадают")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "ФИО обязательно")]
        [Display(Name = "ФИО")]
        public string FullName { get; set; } = string.Empty;

        [Display(Name = "Должность")]
        public string Position { get; set; } = string.Empty;

        [Display(Name = "Отдел")]
        public string Department { get; set; } = string.Empty;

        [Required(ErrorMessage = "Роль обязательна")]
        public string Role { get; set; } = string.Empty;
    }
}
