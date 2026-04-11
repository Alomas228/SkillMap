// src/pages/login.js
import yandexIcon from "../assets/photo-yandex.png";

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
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
            showError(passwordInput, '• Неверная почта или пароль');
            hasError = true;
        }
        
    });
}

// Показать ошибку для конкретного поля
function showError(inputElement, message) {
    // Добавляем класс красной рамки
    inputElement.classList.add('error');
    
    // Удаляем старое сообщение, если оно уже есть
    const parent = inputElement.parentElement;
    const oldMessage = parent?.querySelector('.error-message');
    if (oldMessage) oldMessage.remove();
    
    // Создаём элемент сообщения
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Вставляем после input
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
    </div>`;
    
    initLoginForm();
}