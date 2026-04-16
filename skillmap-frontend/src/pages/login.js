import yandexIcon from "../assets/photo-yandex.png";

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
        
        // Проверка пароля (не пустой и минимум 3 символа)
        if (!password || password.length < 3) {
            showError(passwordInput, '• Неверная почта или пароль');
            hasError = true;
        }
        
        // Если есть ошибки - не отправляем
        if (hasError) return;
        
        try {
            const response = await fetch('/Account/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    rememberMe: false
                })
            });
            
            if (response.redirected) {
                // Если сервер вернул редирект - переходим по нему
                window.location.href = response.url;
            } else if (!response.ok) {
                // Если ошибка - показываем сообщение
                const errorData = await response.json();
                showGeneralError(form, errorData.message || 'Неверная почта или пароль');
            } else {
                // Если успех, но нет редиректа - идём на главную
                window.location.href = '/Home/Index';
            }
        } catch (error) {
            console.error('Ошибка:', error);
            showGeneralError(form, 'Ошибка соединения с сервером');
        }
        // ======================================
    });
}

// Функция для общей ошибки
function showGeneralError(form, message) {
    // Удаляем старую общую ошибку
    const oldError = form.querySelector('.general-error');
    if (oldError) oldError.remove();
    
    // Создаём новую
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message general-error';
    errorDiv.style.marginBottom = '15px';
    errorDiv.style.textAlign = 'center';
    errorDiv.textContent = message;
    
    // Вставляем в начало формы
    form.insertBefore(errorDiv, form.firstChild);
}

function showError(inputElement, message) {
    inputElement.classList.add('error');
    const parent = inputElement.parentElement;
    const oldMessage = parent?.querySelector('.error-message:not(.general-error)');
    if (oldMessage) oldMessage.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    inputElement.insertAdjacentElement('afterend', errorDiv);
}

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