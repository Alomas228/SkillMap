// src/main.js

import { renderLoginPage } from "./pages/login.js";
import { renderMatrixPage } from "./pages/matrix.js";

import "./styles/main.scss";
import "./styles/profile.scss";
import "./styles/matrix.scss";

async function checkAuth() {
    try {
        const response = await fetch("/api/auth/me", {
            credentials: "include",
        });

        return response.ok;
    } catch {
        return false;
    }
}

async function router() {
    const path = window.location.pathname;

    if (path === "/" || path === "/login") {
        renderLoginPage();
        return;
    }

    const isAuth = await checkAuth();

    if (!isAuth) {
        window.location.href = "/";
        return;
    }

    if (path === "/dashboard") {
        renderMatrixPage();
        return;
    }

    if (path === "/matrix") {
        renderMatrixPage();
        return;
    }

    if (path === "/profile") {
        renderMatrixPage();
        return;
    }

    renderMatrixPage();
}

document.addEventListener("DOMContentLoaded", router);