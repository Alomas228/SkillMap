// src/pages/login.js
import yandexIcon from "../assets/photo-yandex.png";
import API_CONFIG from "../config.js"; 

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Удаляем предыдущие ошибки
        removeErrors(form);
        
        let hasError = false;
        
        // Проверка email (должен содержать @)
        if (!email || !email.includes('@')) {
            showError(emailInput, 'Неверная почта или пароль');
            hasError = true;
        }
        
        // Проверка пароля (не пустой и минимум 4 символа)
        if (!password || password.length < 4) {
            showError(passwordInput, 'Неверная почта или пароль');
            hasError = true;
        }
        
        if (!hasError) {
            // ← ИСПОЛЬЗУЕМ API_CONFIG вместо прямого URL
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`, {
                    method: 'POST',
                    headers: API_CONFIG.HEADERS,
                    body: JSON.stringify({ email, password }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    console.log('Успешный вход:', data);
                    // Сохраняем токен
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }
                    // Перенаправляем на страницу профиля
                    window.location.href = '/profile';
                } else {
                    showError(emailInput, data.message || 'Неверная почта или пароль');
                    showError(passwordInput, data.message || 'Неверная почта или пароль');
                }
            } catch (error) {
                console.error('Ошибка запроса:', error);
                showError(emailInput, 'Ошибка сервера. Попробуйте позже');
            }
        }
    });
}

// Показать ошибку для конкретного поля
function showError(inputElement, message) {
    inputElement.classList.add('error');
    
    const parent = inputElement.parentElement;
    const oldMessage = parent?.querySelector('.error-message');
    if (oldMessage) oldMessage.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    inputElement.insertAdjacentElement('afterend', errorDiv);
}

// Удалить все ошибки в форме
function removeErrors(form) {
    const errorInputs = form.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
    
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
}

export function renderLoginPage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    app.innerHTML = `
    <div class="main-container">
        <div class="auth-container">
            <h1 class="title">SkillMap</h1>
            <label class="subtitle">Введите данные для авторизации</label>

            <form id="login-form" class="login-form">
                <label>Корпоративная почта</label>
                <input type="email" placeholder="examplemail@gmail.com">

                <label>Пароль</label>
                <input type="password" placeholder="********">

                <button type="submit" class="btn-primary">Войти</button>

                <div class="divider">
                    <span>или</span>
                </div>
                
                <button type="button" class="btn-google">
                    <img src="${yandexIcon}" alt="Yandex" class="google-icon">
                    Войти через Яндекс
                </button>
            </form>

            <a href="#" class="forgot">Забыли пароль?</a>

            <div class="info-auth">
                <span>Нет аккаунта?</span>
                <a href="#">Обратитесь к HR</a>
            </div>
        </div>
    </div>`;
    
    initLoginForm();
}