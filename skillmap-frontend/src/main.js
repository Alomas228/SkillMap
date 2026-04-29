// src/main.js
import { renderLoginPage } from "./pages/login.js";
import { renderProfilePage } from "./pages/profile.js";
import { renderMatrixPage } from "./pages/matrix.js";
import { renderHrPage } from "./pages/hr.js";
import "./styles/main.scss";
import "./styles/profile.scss";
import "./styles/matrix.scss";
import "./styles/hr.scss";

function renderPage() {
    const path = window.location.pathname;
    
    if (path === '/profile') {
        renderProfilePage();
    } else if (path === '/matrix') {
        renderMatrixPage();
    } else if (path === '/login') {
        renderLoginPage();
    } else {
        renderHrPage();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderPage();
});

window.addEventListener('popstate', renderPage);

window.navigateTo = function(path) {
    window.history.pushState({}, '', path);
    renderPage();
};