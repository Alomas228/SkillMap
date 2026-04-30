import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import phoneIcon from "../assets/phone.svg";
import emailIcon from "../assets/email.svg";
import cityIcon from "../assets/city.svg";

import projectIcon1 from "../assets/Component-1.svg";
import projectIcon2 from "../assets/Component-2.svg";
import projectIcon3 from "../assets/Component-3.svg";
import projectIcon4 from "../assets/Component-4.svg";
import projectIcon5 from "../assets/Component-5.svg";

import API_CONFIG from "../config.js";

const projectIcons = [projectIcon1, projectIcon2, projectIcon3, projectIcon4, projectIcon5];

const API_TO_UI_LEVEL = {
    Intern: "Новичок",
    Junior: "Опытный",
    Middle: "Продвинутый",
    Senior: "Эксперт",
};

const LEVEL_CLASS = {
    Intern: "novice",
    Junior: "experienced",
    Middle: "advanced",
    Senior: "expert",
};

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getAvatarUrl(name) {
    return `https://ui-avatars.com/api/?background=C02BFF&color=fff&name=${encodeURIComponent(name || "User")}`;
}

async function apiFetch(url, options = {}) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.headers || {}),
        },
    });

    if (response.status === 401) {
        window.location.href = "/";
        return null;
    }

    return response;
}

async function loadProfileData() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const publicId = parts[1];

    if (publicId) {
        const response = await apiFetch(`/api/public-profiles/${publicId}`);

        if (response && response.ok) {
            return await response.json();
        }
    }

    const response = await apiFetch(API_CONFIG.ME.DASHBOARD);

    if (!response || !response.ok) {
        throw new Error("Не удалось загрузить профиль");
    }

    return await response.json();
}

export function renderPublicProfilePage() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <div class="public-profile-page">
            <div style="padding: 40px; font-family: Arial, sans-serif;">
                Загрузка профиля...
            </div>
        </div>
    `;

    initPublicProfilePage();
}

async function initPublicProfilePage() {
    try {
        const data = await loadProfileData();
        renderPublicProfile(data);
    } catch (error) {
        console.error(error);
        showPublicProfileError("Не удалось загрузить публичный профиль");
    }
}

function renderPublicProfile(data) {
    const app = document.getElementById("app");
    if (!app) return;

    const user = data.user || {};
    const skills = data.skills || [];

    const fullName = user.fullName || "Пользователь";
    const position = user.position || "Должность не указана";
    const department = user.department || "Отдел не указан";
    const email = user.email || "Почта не указана";
    const role = user.role || "";
    const avatar = getAvatarUrl(fullName);

    const projects = buildProjectsFromSkills(skills);

    app.innerHTML = `
        <div class="public-profile-page">
            <header class="public-header">
                <div class="public-header-left">
                    <div class="public-logo">SkillMap</div>

                    <nav class="public-nav">
                        <a href="/profile">Главная</a>
                        <a href="/matrix">Матрица компетенций</a>
                        <a href="/public-profile">Кого спросить?</a>
                    </nav>
                </div>

                <div class="public-container-avatar">
                    <div class="public-avatar" id="publicHeaderAvatar"></div>

                    <div class="public-arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="public-arrow-icon" id="dropdownArrow">

                        <div class="public-dropdown-menu" id="dropdownMenu">
                            <div class="public-dropdown-header">
                                <div class="public-dropdown-avatar" id="publicDropdownAvatar"></div>

                                <div class="public-dropdown-info">
                                    <div class="public-dropdown-name">${escapeHtml(fullName)}</div>
                                    <div class="public-dropdown-role">${escapeHtml(role)}</div>
                                </div>
                            </div>

                            <button class="public-dropdown-item" id="profileBtn">
                                <img src="${menuIcon1}" alt="Профиль" class="public-dropdown-icon">
                                Мой профиль
                            </button>

                            <button class="public-dropdown-item public-logout" id="logoutBtn">
                                <img src="${menuIcon2}" alt="Выйти" class="public-dropdown-icon">
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="public-main">
                <div class="public-profile-wrapper">
                    <div class="public-profile-card">
                        <div class="public-top">
                            <div class="public-avatar-large">
                                <img src="${avatar}" onerror="this.src='${avatarIcon}'">
                            </div>

                            <div class="public-user-info">
                                <h2 class="public-name">${escapeHtml(fullName)}</h2>

                                <div class="public-title-row">
                                    <span>${escapeHtml(position)}</span>
                                    <span>• ${escapeHtml(department)}</span>
                                </div>

                                <div class="public-info-items">
                                    <div class="public-info-item">
                                        <img src="${cityIcon}" class="public-info-icon" alt="город">
                                        <span>${escapeHtml(department)}</span>
                                    </div>

                                    <div class="public-info-item">
                                        <img src="${phoneIcon}" class="public-info-icon" alt="телефон">
                                        <span>Телефон не указан</span>
                                    </div>

                                    <div class="public-info-item">
                                        <img src="${emailIcon}" class="public-info-icon" alt="почта">
                                        <span>${escapeHtml(email)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="public-bottom">
                            <div class="public-left">
                                <div class="public-about">
                                    <h3>Обо мне</h3>
                                    <p>
                                        Профиль сотрудника SkillMap. Здесь отображаются данные из базы:
                                        должность, отдел, контакты и навыки.
                                    </p>
                                </div>

                                <div class="public-skills-section">
                                    <h3>Навыки</h3>
                                    ${renderSkills(skills)}
                                </div>
                            </div>

                            <div class="public-projects-section">
                                <h3>Проекты</h3>
                                ${renderProjects(projects)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    initDropdown();

    const headerAvatar = document.getElementById("publicHeaderAvatar");
    const dropdownAvatar = document.getElementById("publicDropdownAvatar");

    if (headerAvatar) {
        headerAvatar.style.backgroundImage = `url("${avatar}")`;
        headerAvatar.style.backgroundSize = "cover";
        headerAvatar.style.backgroundPosition = "center";
    }

    if (dropdownAvatar) {
        dropdownAvatar.style.backgroundImage = `url("${avatar}")`;
        dropdownAvatar.style.backgroundSize = "cover";
        dropdownAvatar.style.backgroundPosition = "center";
    }
}

function renderSkills(skills) {
    if (!skills || skills.length === 0) {
        return `<div class="skill-row">Навыки пока не добавлены</div>`;
    }

    return skills.map((skill) => {
        const level = skill.level || "Intern";
        const levelText = API_TO_UI_LEVEL[level] || level;
        const levelClass = LEVEL_CLASS[level] || "novice";
        const name = skill.name || skill.skillName || "Навык";
        const category = skill.category || skill.skillCategory || "";

        return `
            <div class="skill-row">
                <span class="badge ${levelClass}">${escapeHtml(levelText)}</span>
                <span>${escapeHtml(category ? `${category} (${name})` : name)}</span>
            </div>
        `;
    }).join("");
}

function buildProjectsFromSkills(skills) {
    if (!skills || skills.length === 0) {
        return [
            {
                title: "Проекты не указаны",
                description: "У сотрудника пока нет связанных проектов в профиле.",
            },
        ];
    }

    return skills.slice(0, 5).map((skill) => ({
        title: skill.category || skill.skillCategory || "Навык",
        description: skill.name || skill.skillName || "Описание отсутствует",
    }));
}

function renderProjects(projects) {
    return projects.map((project, index) => {
        const icon = projectIcons[index % projectIcons.length];

        return `
            <div class="project">
                <div class="project-header">
                    <img src="${icon}" alt="иконка" class="project-icon">
                    <div class="project-title">${escapeHtml(project.title)}</div>
                </div>

                <div class="project-desc">${escapeHtml(project.description)}</div>
            </div>
        `;
    }).join("");
}

function initDropdown() {
    const dropdownArrow = document.getElementById("dropdownArrow");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    dropdownArrow?.addEventListener("click", (event) => {
        event.stopPropagation();
        dropdownMenu?.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        if (
            dropdownArrow &&
            dropdownMenu &&
            !dropdownArrow.contains(event.target) &&
            !dropdownMenu.contains(event.target)
        ) {
            dropdownMenu.classList.remove("show");
        }
    });

    profileBtn?.addEventListener("click", () => {
        window.location.href = "/profile";
    });

    logoutBtn?.addEventListener("click", async () => {
        await apiFetch(API_CONFIG.AUTH.LOGOUT, { method: "POST" });
        window.location.href = "/";
    });
}

function showPublicProfileError(message) {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif;">
            <h2>Ошибка</h2>
            <p>${escapeHtml(message)}</p>
            <button id="goBackBtn">Вернуться</button>
        </div>
    `;

    document.getElementById("goBackBtn")?.addEventListener("click", () => {
        window.location.href = "/profile";
    });
}