// src/pages/matrix.js
import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import statIcon1 from "../assets/1stat-card.svg";
import statIcon2 from "../assets/2stat-card.svg";
import statIcon3 from "../assets/3stat-card.svg";

export function renderMatrixPage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    app.innerHTML = `
        <div class="matrix-page">
            <!-- Хедер -->
            <header class="matrix-header">
                <div class="matrix-header-left">
                    <div class="matrix-logo">SkillMap</div>
                    <nav class="matrix-nav">
                        <a href="#" data-page="home">Главная</a>
                        <a href="#" data-page="matrix">Матрица компетенций</a>
                        <a href="#" data-page="ask">Кого спросить?</a>
                    </nav>
                </div>
                <div class="matrix-container-avatar">
                    <div class="matrix-avatar"></div>
                    <div class="matrix-arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="matrix-arrow-icon" id="dropdownArrow">
                        <div class="matrix-dropdown-menu" id="dropdownMenu">
                            <div class="matrix-dropdown-header">
                                <div class="matrix-dropdown-avatar"></div>
                                <div class="matrix-dropdown-info">
                                    <div class="matrix-dropdown-name">Дарья Федорова</div>
                                    <div class="matrix-dropdown-role">Руководитель</div>
                                </div>
                            </div>
                            <div class="matrix-dropdown-divider"></div>
                            <button class="matrix-dropdown-item" id="profileBtn">
                                <img src="${menuIcon1}" alt="Профиль" class="matrix-dropdown-icon">
                                Мой профиль
                            </button>
                            <button class="matrix-dropdown-item matrix-logout" id="logoutBtn">
                                <img src="${menuIcon2}" alt="Выйти" class="matrix-dropdown-icon">
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="matrix-main">
                <!-- Карточки статистики -->
                <div class="matrix-stats-cards">
                    <div class="matrix-stat-card">
                        <img src="${statIcon1}" alt="Иконка" class="matrix-stat-icon">
                        <div class="matrix-stat-label">Всего в отделе:</div>
                        <div class="matrix-stat-value">20</div>
                    </div>
                    <div class="matrix-stat-card">
                        <img src="${statIcon2}" alt="Иконка" class="matrix-stat-icon">
                        <div class="matrix-stat-label">Уникальных навыков:</div>
                        <div class="matrix-stat-value">47</div>
                    </div>
                    <div class="matrix-stat-card">
                        <img src="${statIcon3}" alt="Иконка" class="matrix-stat-icon">
                        <div class="matrix-stat-label">Экспертов:</div>
                        <div class="matrix-stat-value">8</div>
                    </div>
                </div>

                <!-- Распределение уровней -->
                <div class="matrix-top-section">
                    <div class="matrix-chart-card">
                        <div class="matrix-all-emp">Распределение уровней сотрудников:</div>
                        <div class="matrix-chart-wrapper">
                            <canvas id="levelsChart"></canvas>
                            <div class="matrix-chart-legend">
                                <div><span class="matrix-dot expert"></span> Эксперт: 4</div>
                                <div><span class="matrix-dot advanced"></span> Продвинутый: 3</div>
                                <div><span class="matrix-dot experienced"></span> Опытный: 3</div>
                                <div><span class="matrix-dot novice"></span> Новичок: 1</div>
                            </div>
                        </div>
                    </div>

                    <div class="matrix-filters-card">
                        <div class="matrix-filter-text">Фильтры</div>
                        <div class="matrix-departament">
                            <label>Отдел:</label>
                            <select id="departmentFilter">
                                <option value="all">Все</option>
                                <option value="backend">Backend-разработка</option>
                                <option value="frontend">Frontend-разработка</option>
                                <option value="mobile">Мобильная разработка</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>
                        <input type="text" id="nameSearch" placeholder="Поиск по имени">
                        <input type="text" id="skillSearch" placeholder="Поиск по навыку">
                        <div class="matrix-buttons">
                            <button id="applyFilters">Применить</button>
                            <button id="resetFilters">Сбросить</button>
                        </div>
                    </div>
                </div>

                <!-- Матрица компетенций -->
                <div class="matrix-section">
                    <div class="matrix-table-header">
                        <h3>Матрица компетенций:</h3>
                        <div class="matrix-filter-section">
                            <span class="matrix-filter-label">Навык:</span>
                            <select id="filterSelect" class="matrix-filter-select">
                                <option value="all">Все</option>
                                <option value="backend">Backend-разработка</option>
                                <option value="frontend">Frontend-разработка</option>
                                <option value="mobile">Мобильная разработка</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>
                    </div>
                    <div class="matrix-table-container">
                        <table class="matrix-table" id="matrixTable">
                            <thead>
                                <tr>
                                    <th class="matrix-employee-col">Сотрудник</th>
                                    <th>PostgreSQL</th>
                                    <th>Redis</th>
                                    <th>MySQL</th>
                                    <th>ClickHouse</th>
                                </tr>
                            </thead>
                            <tbody id="matrixBody"></tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;
    
    initMatrixPage();
}

// Данные сотрудников
const employeesData = [
    { id: 1, name: "Иванов Иван", department: "backend", mainSkill: "backend", skills: { postgresql: "expert", redis: "advanced", mysql: "expert", clickhouse: "advanced" } },
    { id: 2, name: "Сергеев Евгений", department: "backend", mainSkill: "backend", skills: { postgresql: "experienced", redis: "expert", mysql: "advanced", clickhouse: "experienced" } },
    { id: 3, name: "Федорова Дарья", department: "web", mainSkill: "frontend", skills: { postgresql: "advanced", redis: "experienced", mysql: "novice", clickhouse: "advanced" } },
    { id: 4, name: "Егоров Илья", department: "frontend", mainSkill: "frontend", skills: { postgresql: "novice", redis: "novice", mysql: "experienced", clickhouse: "novice" } },
    { id: 5, name: "Черников Сергей", department: "backend", mainSkill: "devops", skills: { postgresql: "expert", redis: "expert", mysql: "expert", clickhouse: "expert" } },
    { id: 6, name: "Лобанова Анастасия", department: "mobile", mainSkill: "mobile", skills: { postgresql: "experienced", redis: "advanced", mysql: "advanced", clickhouse: "experienced" } },
];

function initMatrixPage() {
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
            window.navigateTo('/');
        });
    }
    
    // ========== ФИЛЬТРАЦИЯ ==========
    let currentDepartment = "all";
    let currentNameSearch = "";
    let currentSkillFilter = "all";
    
    function renderSkillCell(level) {
        if (!level || level === "novice") {
            return '<div class="matrix-skill-square empty"></div>';
        }
        let color = "";
        switch(level) {
            case "expert": color = "#F2ACAC"; break;
            case "advanced": color = "#EDC9AD"; break;
            case "experienced": color = "#F4F3B5"; break;
            default: color = "#C0E6BCC7";
        }
        return `<div class="matrix-skill-square" style="background-color: ${color}"></div>`;
    }
    
    function renderMatrix() {
        const tbody = document.getElementById("matrixBody");
        if (!tbody) return;
        
        let filteredEmployees = [...employeesData];
        if (currentDepartment !== "all") {
            filteredEmployees = filteredEmployees.filter(emp => emp.department === currentDepartment);
        }
        if (currentNameSearch) {
            filteredEmployees = filteredEmployees.filter(emp => emp.name.toLowerCase().includes(currentNameSearch.toLowerCase()));
        }
        if (currentSkillFilter !== "all") {
            filteredEmployees = filteredEmployees.filter(emp => emp.mainSkill === currentSkillFilter);
        }
        
        let html = "";
        for (let emp of filteredEmployees) {
            html += `
                <tr>
                    <td class="matrix-employee-name">${emp.name}</td>
                    <td class="matrix-skill-cell">${renderSkillCell(emp.skills.postgresql)}</td>
                    <td class="matrix-skill-cell">${renderSkillCell(emp.skills.redis)}</td>
                    <td class="matrix-skill-cell">${renderSkillCell(emp.skills.mysql)}</td>
                    <td class="matrix-skill-cell">${renderSkillCell(emp.skills.clickhouse)}</td>
                </tr>
            `;
        }
        tbody.innerHTML = html;
    }
    
    // Фильтр по навыку в матрице
    const skillFilterSelect = document.getElementById("filterSelect");
    if (skillFilterSelect) {
        skillFilterSelect.addEventListener("change", function() {
            currentSkillFilter = this.value;
            renderMatrix();
        });
    }
    
    // Применение фильтров
    const applyBtn = document.getElementById("applyFilters");
    const resetBtn = document.getElementById("resetFilters");
    const departmentFilter = document.getElementById("departmentFilter");
    const nameSearch = document.getElementById("nameSearch");
    
    if (applyBtn) {
        applyBtn.addEventListener("click", function() {
            currentDepartment = departmentFilter ? departmentFilter.value : "all";
            currentNameSearch = nameSearch ? nameSearch.value : "";
            renderMatrix();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            if (departmentFilter) departmentFilter.value = "all";
            if (nameSearch) nameSearch.value = "";
            currentDepartment = "all";
            currentNameSearch = "";
            currentSkillFilter = "all";
            if (skillFilterSelect) skillFilterSelect.value = "all";
            renderMatrix();
        });
    }
    
    // График
    const ctx = document.getElementById("levelsChart");
    if (ctx) {
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Эксперт", "Продвинутый", "Опытный", "Новичок"],
                datasets: [{ data: [4, 3, 3, 1], backgroundColor: ["#F2ACAC", "#EDC9AD", "#F4F3B5", "#C0E6BCC7"], borderWidth: 0 }]
            },
            options: { plugins: { legend: { display: false } } }
        });
    }
    
    renderMatrix();
}