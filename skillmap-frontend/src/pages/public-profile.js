// src/pages/public-profile.js
import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import phone from "../assets/phone.svg";
import email from "../assets/email.svg";
import city from "../assets/city.svg";

// Импорт иконок для проектов
import projectIcon1 from "../assets/Component-1.svg";
import projectIcon2 from "../assets/Component-2.svg";
import projectIcon3 from "../assets/Component-3.svg";
import projectIcon4 from "../assets/Component-4.svg";
import projectIcon5 from "../assets/Component-5.svg";

// Массив иконок для проектов
const projectIcons = [projectIcon1, projectIcon2, projectIcon3, projectIcon4, projectIcon5];

// Данные пользователя
const userData = {
    name: "Федорова Дарья Викторовна",
    role: "UI/UX дизайнер",
    department: "Отдел UI/UX",
    city: "г. Екатеринбург",
    phone: "+7 919 470 0936",
    email: "darafedorova790@gmail.com",
    avatar: "https://ui-avatars.com/api/?background=C02BFF&color=fff&name=Дарья+Федорова"
};

// Данные проектов
const projectsData = [
    { title: "Платформа деплоя", description: "Разработка макетов платформы для автоматического деплоя сервисов" },
    { title: "Веб-сайт учета мероприятий", description: "UX сценарии и макеты" },
    { title: "Платформа трассировки", description: "Интеграция базы данных" },
    { title: "SkillMap", description: "UI Kit и главная страница" },
    { title: "Обучающая игра", description: "Динамические макеты" }
];

// Функция для получения случайной иконки
function getRandomIcon() {
    const randomIndex = Math.floor(Math.random() * projectIcons.length);
    return projectIcons[randomIndex];
}

// Функция для получения иконки по порядку (циклически)
let currentIconIndex = 0;
function getNextIcon() {
    const icon = projectIcons[currentIconIndex];
    currentIconIndex = (currentIconIndex + 1) % projectIcons.length;
    return icon;
}

export function renderPublicProfilePage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    // Генерируем HTML для проектов с иконками
    let projectsHtml = '';
    for (let i = 0; i < projectsData.length; i++) {
        const project = projectsData[i];
        // Используем случайную иконку (или можно заменить на getNextIcon() для циклической)
        const icon = getRandomIcon();
        projectsHtml += `
            <div class="project">
                <div class="project-header">
                    <img src="${icon}" alt="иконка" class="project-icon">
                    <div class="project-title">${project.title}</div>
                </div>
                <div class="project-desc">${project.description}</div>
            </div>
        `;
    }
    
    app.innerHTML = `
<div class="public-profile-page">

    <!-- ХЕДЕР -->
    <header class="public-header">
        <div class="public-header-left">
            <div class="public-logo">SkillMap</div>
            <nav class="public-nav">
                <a href="#">Главная</a>
                <a href="#">Матрица компетенций</a>
                <a href="#">Кого спросить?</a>
            </nav>
        </div>
        <div class="public-container-avatar">
            <div class="public-avatar"></div>
            <div class="public-arrow-wrapper">
                <img src="${arrowIcon}" alt="Стрелка" class="public-arrow-icon" id="dropdownArrow">
                <div class="public-dropdown-menu" id="dropdownMenu">
                    <div class="public-dropdown-header">
                        <div class="public-dropdown-avatar"></div>
                        <div class="public-dropdown-info">
                            <div class="public-dropdown-name">${userData.name.split(' ')[0]} ${userData.name.split(' ')[1]}</div>
                            <div class="public-dropdown-role">${userData.role}</div>
                        </div>
                    </div>
                    <div class="public-dropdown-divider"></div>
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

    <!-- ОСНОВНОЙ КОНТЕНТ -->
    <main class="public-main">
        <div class="public-profile-wrapper">

            <div class="public-profile-card">

                <!-- TOP -->
                <div class="public-top">
                    <div class="public-avatar-large">
                        <img src="${userData.avatar}">
                    </div>

                    <div class="public-user-info">
                        <h2 class="public-name">${userData.name}</h2>

                        <div class="public-title-row">
                            <span>${userData.role}</span>
                            <span> • ${userData.department}</span>
                        </div>

                        <div class="public-info-items">
                            <div class="public-info-item">
                                <img src="${city}" class="public-info-icon" alt="город">
                                <span>${userData.city}</span>
                            </div>
                            <div class="public-info-item">
                                <img src="${phone}" class="public-info-icon" alt="телефон">
                                <span>${userData.phone}</span>
                            </div>
                            <div class="public-info-item">
                                <img src="${email}" class="public-info-icon" alt="почта">
                                <span>${userData.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM -->
                <div class="public-bottom">

                    <!-- LEFT -->
                    <div class="public-left">

                        <div class="public-about">
                            <h3>Обо мне</h3>
                            <p>
                                Занимаюсь UI/UX дизайном более 4 лет. Есть опыт работы продуктовым аналитиком.
                                Всегда рада делиться опытом и помогать коллегам.
                            </p>
                        </div>

                        <div class="public-skills-section">
                            <h3>Навыки</h3>

                            <div class="skill-row">
                                <span class="badge expert">Эксперт</span>
                                <span>Работа с диаграммами (Miro)</span>
                            </div>

                            <div class="skill-row">
                                <span class="badge advanced">Продвинутый</span>
                                <span>Работа с Figma</span>
                            </div>

                            <div class="skill-row">
                                <span class="badge advanced">Продвинутый</span>
                                <span>Работа с Webflow</span>
                            </div>

                            <div class="skill-row">
                                <span class="badge novice">Новичок</span>
                                <span>Базы данных (Redis)</span>
                            </div>

                            <div class="skill-row">
                                <span class="badge novice">Новичок</span>
                                <span>Базы данных (MySQL)</span>
                            </div>

                            <div class="skill-row">
                                <span class="badge experienced">Опытный</span>
                                <span>Python</span>
                            </div>

                            <div class="skill-row">
                                <span class="badge novice">Новичок</span>
                                <span>Golang</span>
                            </div>

                        </div>

                    </div>

                    <!-- RIGHT -->
                    <div class="public-projects-section">
                        <h3>Проекты</h3>
                        ${projectsHtml}
                    </div>

                </div>

            </div>

        </div>
    </main>
</div>
`;
    
    initPublicProfilePage();
}

function initPublicProfilePage() {
    // ========== ВЫПАДАЮЩЕЕ МЕНЮ ==========
    const dropdownArrow = document.getElementById("dropdownArrow");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    
    if (dropdownArrow && dropdownMenu) {
        dropdownArrow.addEventListener("click", function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });
        
        document.addEventListener("click", function(e) {
            if (!dropdownArrow.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    }
    
    if (profileBtn) {
        profileBtn.addEventListener("click", function() {
            window.navigateTo('/profile');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.navigateTo('/login');
        });
    }
    
    // Навигация по хедеру
    const navLinks = document.querySelectorAll('.public-nav a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('onclick');
            if (href) {
                eval(href);
            }
        });
    });
}