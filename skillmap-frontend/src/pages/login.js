import yandexIcon from "../assets/photo-yandex.png";
import API_CONFIG from "../config.js";

function initLoginForm() {
    const form = document.getElementById("login-form");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        removeErrors(form);

        let hasError = false;

        if (!email || !email.includes("@")) {
            showError(emailInput, "Неверная почта или пароль");
            hasError = true;
        }

        if (!password || password.length < 3) {
            showError(passwordInput, "Неверная почта или пароль");
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`, {
                method: "POST",
                headers: API_CONFIG.HEADERS,
                credentials: "include",
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

            if (!response.ok) {
                showGeneralError(form, data?.message || "Неверная почта или пароль");
                return;
            }

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
                window.location.href = "/hr";
                return;
            }

            window.location.href = "/profile";
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            showGeneralError(form, "Ошибка соединения с сервером");
        }
    });
}

function showGeneralError(form, message) {
    const oldError = form.querySelector(".general-error");
    if (oldError) oldError.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message general-error";
    errorDiv.style.marginBottom = "15px";
    errorDiv.style.textAlign = "center";
    errorDiv.textContent = message;

    form.insertBefore(errorDiv, form.firstChild);
}

function showError(inputElement, message) {
    inputElement.classList.add("error");

    const parent = inputElement.parentElement;
    const oldMessage = parent?.querySelector(".error-message:not(.general-error)");
    if (oldMessage) oldMessage.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    inputElement.insertAdjacentElement("afterend", errorDiv);
}

function removeErrors(form) {
    form.querySelectorAll(".error").forEach((input) => input.classList.remove("error"));
    form.querySelectorAll(".error-message").forEach((message) => message.remove());
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
        </div>
    `;

    initLoginForm();
}