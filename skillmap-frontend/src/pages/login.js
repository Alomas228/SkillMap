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
        
        // Проверка пароля (не пустой и минимум 3 символа)
        if (!password || password.length < 3) {
            showError(passwordInput, 'Неверная почта или пароль');
            hasError = true;
        }
        
        // Если есть ошибки - не отправляем
        if (hasError) return;
        
        try {
            // Используем API_CONFIG из config.js
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                    rememberMe: false,
                }),
            });

            let data = null;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (response.ok) {
            console.log("Успешный вход:", data);

            const role = String(data?.user?.role || "").trim().toLowerCase();

            if (role === "employee") {
                window.location.href = "/profile";
                return;
            }

            if (role === "manager") {
                window.location.href = "/matrix";
                return;
            }

            if (role === "hr") {
                // Пока HR-страницы нет.
                // Можешь заменить на "/hr", когда сделаешь HR-страницу.
                window.location.href = "/matrix";
                return;
            }

            window.location.href = "/profile";
        } else {
            showGeneralError(
                form,
                data?.message || "Неверная почта или пароль"
            );
        }
        } catch (error) {
            console.error('Ошибка:', error);
            showGeneralError(form, 'Ошибка соединения с сервером');
        }
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