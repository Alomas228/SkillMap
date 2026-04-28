// src/main.js

import { renderLoginPage } from "./pages/login.js";
import { renderMatrixPage } from "./pages/matrix.js";
import { renderProfilePage } from "./pages/profile.js";

import "./styles/main.scss";
import "./styles/profile.scss";
import "./styles/matrix.scss";

async function getCurrentUser() {
    try {
        const response = await fetch("/api/auth/me", {
            credentials: "include",
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка проверки авторизации:", error);
        return null;
    }
}

function normalizeRole(role) {
    return String(role || "").trim().toLowerCase();
}

function redirectByRole(user) {
    const role = normalizeRole(user?.role);

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
        // Временно отправляем HR на matrix.
        window.location.href = "/matrix";
        return;
    }

    window.location.href = "/profile";
}

function renderHrPlaceholder(user) {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif;">
            <h1>SkillMap</h1>
            <h2>HR-панель пока в разработке</h2>
            <p>Пользователь: ${user?.fullName || user?.email || "HR"}</p>
            <p>Роль: ${user?.role || "HR"}</p>

            <button id="goMatrixBtn" style="margin-right: 12px;">
                Открыть матрицу
            </button>

            <button id="logoutBtn">
                Выйти
            </button>
        </div>
    `;

    document.getElementById("goMatrixBtn")?.addEventListener("click", () => {
        window.location.href = "/matrix";
    });

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        window.location.href = "/";
    });
}

async function router() {
    const path = window.location.pathname;

    // Страница логина
    if (path === "/" || path === "/index.html" || path === "/login") {
        const user = await getCurrentUser();

        // Если пользователь уже авторизован и открыл /,
        // отправляем его на страницу по роли.
        if (user) {
            redirectByRole(user);
            return;
        }

        renderLoginPage();
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "/";
        return;
    }

    const role = normalizeRole(user.role);

    // Универсальный вход после авторизации
    if (path === "/dashboard") {
        redirectByRole(user);
        return;
    }

    // Employee page
    if (path === "/profile") {
        if (role !== "employee") {
            redirectByRole(user);
            return;
        }

        renderProfilePage();
        return;
    }

    // Manager page
    if (path === "/matrix") {
        if (role !== "manager" && role !== "hr") {
            redirectByRole(user);
            return;
        }

        renderMatrixPage();
        return;
    }

    // HR page-заглушка
    if (path === "/hr") {
        if (role !== "hr") {
            redirectByRole(user);
            return;
        }

        renderHrPlaceholder(user);
        return;
    }

    redirectByRole(user);
}

document.addEventListener("DOMContentLoaded", router);