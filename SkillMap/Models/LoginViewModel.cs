using System.ComponentModel.DataAnnotations;

namespace SkillMap.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Введите корпоративную почту")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = " Введите пароль")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; }
    }
}
