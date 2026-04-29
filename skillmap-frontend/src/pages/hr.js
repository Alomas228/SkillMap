// src/pages/hr.js
import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import statIcon1 from "../assets/1stat-card.svg";
import statIconHR2 from "../assets/hr-plus.svg";
import statIconHR3 from "../assets/active.svg";

export function renderHrPage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    app.innerHTML = `
        <div class="hr-page">
            <!-- Хедер -->
            <header class="hr-header">
                <div class="hr-header-left">
                    <div class="hr-logo">SkillMap</div>
                    <nav class="hr-nav">
                        <a href="#" onclick="event.preventDefault(); window.navigateTo('/'); return false;">Главная</a>
                        <a href="#" onclick="event.preventDefault(); window.navigateTo('/matrix'); return false;">Матрица компетенций</a>
                        <a href="#" onclick="event.preventDefault(); window.navigateTo('/profile'); return false;">Кого спросить?</a>
                    </nav>
                </div>
                <div class="hr-container-avatar">
                    <div class="hr-avatar"></div>
                    <div class="hr-arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="hr-arrow-icon" id="dropdownArrow">
                        <div class="hr-dropdown-menu" id="dropdownMenu">
                            <div class="hr-dropdown-header">
                                <div class="hr-dropdown-avatar"></div>
                                <div class="hr-dropdown-info">
                                    <div class="hr-dropdown-name">HR Директор</div>
                                    <div class="hr-dropdown-role">HR</div>
                                </div>
                            </div>
                            <div class="hr-dropdown-divider"></div>
                            <button class="hr-dropdown-item" id="profileBtn">
                                <img src="${menuIcon1}" alt="Профиль" class="hr-dropdown-icon">
                                Мой профиль
                            </button>
                            <button class="hr-dropdown-item hr-logout" id="logoutBtn">
                                <img src="${menuIcon2}" alt="Выйти" class="hr-dropdown-icon">
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="hr-main">
                <!-- Карточки статистики -->
                <div class="hr-stats-cards">
                    <div class="hr-stat-card">
                        <img src="${statIcon1}" alt="Иконка" class="hr-stat-icon">
                        <div class="hr-stat-label">Сотрудников:</div>
                        <div class="hr-stat-value">124</div>
                    </div>
                    <div class="hr-stat-card">
                        <img src="${statIconHR2}" alt="Иконка" class="hr-stat-icon">
                        <div class="hr-stat-label">Навыков в каталоге:</div>
                        <div class="hr-stat-value">89</div>
                    </div>
                    <div class="hr-stat-card">
                        <img src="${statIconHR3}" alt="Иконка" class="hr-stat-icon">
                        <div class="hr-stat-label">Активных профилей:</div>
                        <div class="hr-stat-value">98%</div>
                    </div>
                </div>

                <!-- 4 блока в ряд -->
                <div class="hr-top-row">
                    <div class="hr-blocks">
                        <div class="hr-block">
                            <h3>Топ-10 навыков компании</h3>
                            <ol class="hr-list">
                                <li>Языки программирования</li><li>Базы данных</li><li>Анализ данных</li>
                                <li>IaC</li><li>Облачная инфраструктура</li><li>Python</li>
                                <li>Python</li><li>Python</li><li>Python</li><li>Python</li>
                            </ol>
                        </div>
                        <div class="hr-block">
                            <h3>Топ-5 редких навыков</h3>
                            <ol class="hr-list">
                                <li>Инструменты тестирования</li><li>BI-инструменты</li>
                                <li>Облачная инфраструктура</li><li>IaC</li><li>Операционные системы</li>
                            </ol>
                        </div>
                        <div class="hr-block">
                            <h3>Навыки с разрывом</h3>
                            <div class="hr-gap-list">
                                <div class="hr-gap-item">
                                    <div class="hr-gap-name">BI-инструменты</div>
                                    <div class="hr-gap-stats"><span>Новичков: 33</span><span>Эксперт: 2</span></div>
                                    <div class="hr-gap-deficit high">Дефицит: высокий</div>
                                </div>
                                <div class="hr-gap-item">
                                    <div class="hr-gap-name">Мониторинг</div>
                                    <div class="hr-gap-stats"><span>Новичков: 21</span><span>Эксперт: 9</span></div>
                                    <div class="hr-gap-deficit high">Дефицит: высокий</div>
                                </div>
                                <div class="hr-gap-item">
                                    <div class="hr-gap-name">IaC</div>
                                    <div class="hr-gap-stats"><span>Новичков: 27</span><span>Эксперт: 14</span></div>
                                    <div class="hr-gap-deficit medium">Дефицит: средний</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Фильтры -->
                    <div class="hr-filters-block">
                        <div class="hr-filter-text">Фильтры</div>
                        <div class="hr-filter-item">
                            <label>Отдел:</label>
                            <select id="departmentFilterHr">
                                <option value="all">Все</option>
                                <option value="backend">Backend-разработка</option>
                                <option value="frontend">Frontend-разработка</option>
                                <option value="mobile">Мобильная разработка</option>
                                <option value="datascience">Data Science / ML / DE</option>
                                <option value="qa">QA</option>
                                <option value="analytics">Аналитика</option>
                                <option value="uiux">UI/UX</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>
                        <div class="hr-filter-item">
                            <label>Категория навыков:</label>
                            <select id="categoryFilterHr">
                                <option value="all">Все</option>
                                <option value="languages">Языки программирования</option>
                                <option value="databases">Базы данных</option>
                                <option value="cloud">Облачные технологии</option>
                                <option value="testing">Тестирование</option>
                            </select>
                        </div>
                        <div class="hr-filter-item">
                            <label>Уровень:</label>
                            <select id="levelFilterHr">
                                <option value="all">Все</option>
                                <option value="expert">Эксперт</option>
                                <option value="advanced">Продвинутый</option>
                                <option value="experienced">Опытный</option>
                                <option value="novice">Новичок</option>
                            </select>
                        </div>
                        <div class="hr-buttons">
                            <button id="applyFiltersHr">Применить</button>
                            <button id="resetFiltersHr">Сбросить</button>
                        </div>
                    </div>
                </div>

                <!-- Матрица компетенций по отделам -->
                <div class="hr-matrix-section">
                    <div class="hr-matrix-header">
                        <h3>Матрица компетенций по отделам:</h3>
                        <div class="hr-matrix-actions">
                            <button class="hr-btn-outline" id="exportReportBtn">Экспорт отчета</button>
                            <button class="hr-btn-outline" id="createSurveyBtn">Создать опрос</button>
                        </div>
                    </div>
                    <div class="hr-matrix-filter">
                        <span class="hr-filter-label">Фильтр по навыкам:</span>
                        <select id="skillMatrixFilter" class="hr-filter-select">
                            <option value="all">Все навыки</option>
                            <option value="python">Python</option>
                            <option value="kotlin">Kotlin</option>
                            <option value="csharp">C#</option>
                            <option value="golang">Golang</option>
                        </select>
                    </div>
                    <div class="hr-matrix-table-container">
                        <table class="hr-matrix-table" id="departmentMatrixTable">
                            <thead>
                                <tr>
                                    <th class="hr-employee-col">Отдел</th>
                                    <th>Python</th>
                                    <th>Kotlin</th>
                                    <th>C#</th>
                                    <th>Golang</th>
                                </tr>
                            </thead>
                            <tbody id="departmentMatrixBody"></tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
    
    initHrPage();
}

// Данные для матрицы по отделам
const departmentMatrixData = [
    { name: "Backend-разработка", skills: { python: "expert", kotlin: "advanced", csharp: "expert", golang: "advanced" } },
    { name: "Frontend-разработка", skills: { python: "advanced", kotlin: "novice", csharp: "experienced", golang: "novice" } },
    { name: "Мобильная разработка", skills: { python: "experienced", kotlin: "expert", csharp: "novice", golang: "advanced" } },
    { name: "Data Science / ML / DE", skills: { python: "expert", kotlin: "novice", csharp: "advanced", golang: "novice" } },
    { name: "QA", skills: { python: "experienced", kotlin: "novice", csharp: "novice", golang: "novice" } },
    { name: "Аналитика", skills: { python: "advanced", kotlin: "novice", csharp: "novice", golang: "novice" } },
    { name: "UI/UX", skills: { python: "novice", kotlin: "novice", csharp: "novice", golang: "novice" } },
    { name: "DevOps", skills: { python: "expert", kotlin: "advanced", csharp: "expert", golang: "expert" } }
];

function initHrPage() {
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
        profileBtn.addEventListener("click", function() { window.navigateTo('/profile'); });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.navigateTo('/');
        });
    }
    
    // ========== ОТРИСОВКА КВАДРАТИКОВ ==========
    function renderSkillSquare(level) {
        if (!level || level === "novice") return '<div class="hr-skill-square empty"></div>';
        let color = "";
        switch(level) {
            case "expert": color = "#F2ACAC"; break;
            case "advanced": color = "#EDC9AD"; break;
            case "experienced": color = "#F4F3B5"; break;
            default: color = "#C0E6BCC7";
        }
        return `<div class="hr-skill-square" style="background-color: ${color}"></div>`;
    }
    
    function renderDepartmentMatrix() {
        const tbody = document.getElementById("departmentMatrixBody");
        if (!tbody) return;
        
        let html = "";
        for (let dept of departmentMatrixData) {
            html += `
                <tr>
                    <td class="hr-employee-name">${dept.name}</td>
                    <td>${renderSkillSquare(dept.skills.python)}</td>
                    <td>${renderSkillSquare(dept.skills.kotlin)}</td>
                    <td>${renderSkillSquare(dept.skills.csharp)}</td>
                    <td>${renderSkillSquare(dept.skills.golang)}</td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
    }
    
    renderDepartmentMatrix();
    
    // ========== ФИЛЬТРЫ ==========
    const applyBtn = document.getElementById("applyFiltersHr");
    const resetBtn = document.getElementById("resetFiltersHr");
    
    if (applyBtn) {
        applyBtn.addEventListener("click", function() { console.log("Фильтры применены"); });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            const deptFilter = document.getElementById("departmentFilterHr");
            const catFilter = document.getElementById("categoryFilterHr");
            const levelFilter = document.getElementById("levelFilterHr");
            if (deptFilter) deptFilter.value = "all";
            if (catFilter) catFilter.value = "all";
            if (levelFilter) levelFilter.value = "all";
            console.log("Фильтры сброшены");
        });
    }
    
    // Фильтр матрицы
    const skillMatrixFilter = document.getElementById("skillMatrixFilter");
    if (skillMatrixFilter) {
        skillMatrixFilter.addEventListener("change", function() { console.log("Фильтр матрицы:", this.value); });
    }
    
    // Кнопки
    const exportBtn = document.getElementById("exportReportBtn");
    const surveyBtn = document.getElementById("createSurveyBtn");
    
    if (exportBtn) exportBtn.addEventListener("click", function() { alert("Экспорт отчета в разработке"); });
    if (surveyBtn) surveyBtn.addEventListener("click", function() { alert("Создание опроса в разработке"); });
}