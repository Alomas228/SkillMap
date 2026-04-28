import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
// Импорт иконок для stat-card
import statIcon1 from "../assets/1stat-card.svg";
import statIcon2 from "../assets/2stat-card.svg";
import statIcon3 from "../assets/3stat-card.svg";


export function renderMatrixPage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    app.innerHTML = `
        <div class="matrix-container">
            <!-- Хедер (такой же как в профиле) -->
            <header class="header">
                <div class="header-left">
                    <div class="logo">SkillMap</div>
                    <nav>
                        <a href="#" data-page="home">Главная</a>
                        <a href="#" data-page="matrix">Матрица компетенций</a>
                        <a href="#" data-page="ask">Кого спросить?</a>
                    </nav>
                </div>
                <div class="container-avatar">
                    <div class="avatar"></div>
                    <div class="arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="arrow-icon" id="dropdownArrow">
                        <div class="dropdown-menu" id="dropdownMenu">
                            <div class="dropdown-header">
                                <div class="dropdown-avatar"></div>
                                <div class="dropdown-info">
                                    <div class="dropdown-name">Дарья Федорова</div>
                                    <div class="dropdown-role">Руководитель</div>
                                </div>
                            </div>
                            <div class="dropdown-divider"></div>
                            <button class="dropdown-item" id="profileBtn">
                                <img src="${menuIcon1}" alt="Профиль" class="dropdown-icon">
                                Мой профиль
                            </button>
                            <button class="dropdown-item logout" id="logoutBtn">
                                <img src="${menuIcon2}" alt="Выйти" class="dropdown-icon">
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="matrix-main">
                <!-- Карточки статистики -->
                <div class="stats-cards">
                    <div class="stat-card">
                    <img src="${statIcon1}" alt="Иконка" class="stat-icon">
                        <div class="stat-label">Всего в отделе:</div>
                        <div class="stat-value">20</div>
                    </div>
                    <div class="stat-card">
                    <img src="${statIcon2}" alt="Иконка" class="stat-icon">
                        <div class="stat-label">Уникальных навыков:</div>
                        <div class="stat-value">47</div>
                    </div>
                    <div class="stat-card">
                    <img src="${statIcon3}" alt="Иконка" class="stat-icon">
                        <div class="stat-label">Экспертов:</div>
                        <div class="stat-value">8</div>
                    </div>
                </div>

                <!-- Распределение уровней -->
                <div class="top-section">
  
  <!-- ГРАФИК -->
  <div class="chart-card">
    <div class="all-emp">Распределение уровней сотрудников:</div>

    <div class="chart-wrapper">
      <canvas id="levelsChart"></canvas>

      <div class="chart-legend">
        <div><span class="dot expert"></span> Эксперт: 4</div>
        <div><span class="dot advanced"></span> Продвинутый: 3</div>
        <div><span class="dot experienced"></span> Опытный: 3</div>
        <div><span class="dot novice"></span> Новичок: 1</div>
      </div>
    </div>
  </div>

  <!-- ФИЛЬТРЫ -->
   <div class="filters-card">
        <div class="filter-text">Фильтры</div>
    <div class="departament">
        <label>Отдел:</label>
        <select id="departmentFilter">
        <option value="all">Все</option>
            <option value="backend">Backend-разработка</option>
            <option value="frontend">Frontend-разработка</option>
            <option value="frontend">Мобильная верстка</option>
            <option value="frontend">DevOps</option>
        </select>
    </div>

    <input type="text" id="nameSearch" placeholder="Поиск по имени">
    <input type="text" id="skillSearch" placeholder="Поиск по навыку">

    <div class="buttons">
      <button id="applyFilters">Применить</button>
      <button id="resetFilters">Сбросить</button>
    </div>
  </div>

</div>

             <!-- Матрица компетенций -->
<div class="matrix-section">
    <div class="matrix-header">
        <h3>Матрица компетенций:</h3>
        <div class="filter-section">
            <span class="filter-label">Навык:</span>
            <select id="filterSelect" class="filter-select">
                <option value="all">Все</option>
                <option value="backend">Backend-разработка</option>
                <option value="frontend">Frontend-разработка</option>
                <option value="mobile">Мобильная верстка</option>
                <option value="devops">DevOps</option>
            </select>
        </div>
    </div>
    <div class="matrix-table-container">
        <table class="matrix-table" id="matrixTable">
            <thead>
                <tr>
                    <th class="employee-col">Сотрудник</th>
                    <th>PostgreSQL</th>
                    <th>Redis</th>
                    <th>MySQL</th>
                    <th>ClickHouse</th>
                </tr>
            </thead>
            <tbody id="matrixBody">
                <!-- Данные будут загружены через JS -->
            </tbody>
        </table>
    </div>
</div>
            </main>
        </div>
    `;
    
    initMatrixPage();
}

// Данные сотрудников и их навыков
const employeesData = [
    { id: 1, name: "Иванов Иван", department: "backend", mainSkill: "backend", skills: { postgresql: "expert", redis: "advanced", mysql: "expert", clickhouse: "advanced" } },
    { id: 2, name: "Сергеев Евгений", department: "backend", mainSkill: "backend", skills: { postgresql: "experienced", redis: "expert", mysql: "advanced", clickhouse: "experienced" } },
    { id: 3, name: "Федорова Дарья", department: "web", mainSkill: "frontend", skills: { postgresql: "advanced", redis: "experienced", mysql: "novice", clickhouse: "advanced" } },
    { id: 4, name: "Егоров Илья", department: "frontend", mainSkill: "frontend", skills: { postgresql: "novice", redis: "novice", mysql: "experienced", clickhouse: "novice" } },
    { id: 5, name: "Черников Сергей", department: "backend", mainSkill: "devops", skills: { postgresql: "expert", redis: "expert", mysql: "expert", clickhouse: "expert" } },
    { id: 6, name: "Лобанова Анастасия", department: "mobile", mainSkill: "mobile", skills: { postgresql: "experienced", redis: "advanced", mysql: "advanced", clickhouse: "experienced" } },
];

// Цвета для уровней
const levelColorsMatrix = {
    "novice": { bg: "#C0E6BC8C", color: "#4CAF50" },
    "experienced": { bg: "#F4F3B59E", color: "#FF9800" },
    "advanced": { bg: "#EDC9AD9E", color: "#FF9800" },
    "expert": { bg: "#F2ACAC85", color: "#f44336" }
};


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
            window.location.href = "/profile";
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function() {
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include",
                });
            } catch (error) {
                console.error("Ошибка выхода:", error);
            }

            window.location.href = "/";
        });
    }
    
    // ========== ФИЛЬТРАЦИЯ ==========
    let currentDepartment = "all";
    let currentNameSearch = "";
    let currentSkillSearch = "";
    let currentSkillFilter = "all";

    function filterBySkill(employees, skillName) {
    if (skillName === "all") return employees;
    return employees.filter(function(emp) {
        return emp.skills[skillName] && emp.skills[skillName] !== "novice";
    });
}

    
    function renderSkillCell(level) {
    if (!level || level === "novice") {
        return '<div class="skill-square empty"></div>';
    }
    
    let color = "";
    switch(level) {
        case "expert":
            color = "#F2ACAC";  // розовый/красный
            break;
        case "advanced":
            color = "#EDC9AD";  // бежевый/оранжевый
            break;
        case "experienced":
            color = "#F4F3B5";  // жёлтый
            break;
        default:
            color = "#C0E6BCC7";  // зелёный
    }
    
    return `<div class="skill-square" style="background-color: ${color}"></div>`;
}
    
function renderMatrix() {
    const tbody = document.getElementById("matrixBody");
    if (!tbody) return;
    
    let filteredEmployees = [...employeesData];
    
    // Фильтр по отделу
    if (currentDepartment !== "all") {
        filteredEmployees = filteredEmployees.filter(function(emp) {
            return emp.department === currentDepartment;
        });
    }
    
    // Фильтр по имени
    if (currentNameSearch) {
        filteredEmployees = filteredEmployees.filter(function(emp) {
            return emp.name.toLowerCase().includes(currentNameSearch.toLowerCase());
        });
    }
    
    // Фильтр по навыку (по mainSkill)
    if (currentSkillFilter !== "all") {
        filteredEmployees = filteredEmployees.filter(function(emp) {
            return emp.mainSkill === currentSkillFilter;
        });
    }
    
    let html = "";
    for (let i = 0; i < filteredEmployees.length; i++) {
        const emp = filteredEmployees[i];
        html += `
            <tr>
                <td class="employee-name">${emp.name}</td>
                <td class="skill-cell">${renderSkillCell(emp.skills.postgresql)}</td>
                <td class="skill-cell">${renderSkillCell(emp.skills.redis)}</td>
                <td class="skill-cell">${renderSkillCell(emp.skills.mysql)}</td>
                <td class="skill-cell">${renderSkillCell(emp.skills.clickhouse)}</td>
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
    const skillSearch = document.getElementById("skillSearch");
    const skillFilterBottom = document.getElementById("skillFilterBottom");
    
    if (applyBtn) {
        applyBtn.addEventListener("click", function() {
            currentDepartment = departmentFilter ? departmentFilter.value : "all";
            currentNameSearch = nameSearch ? nameSearch.value : "";
            currentSkillSearch = skillSearch ? skillSearch.value : "";
            renderMatrix();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            if (departmentFilter) departmentFilter.value = "all";
            if (nameSearch) nameSearch.value = "";
            if (skillSearch) skillSearch.value = "";
            if (skillFilterBottom) skillFilterBottom.value = "all";
            currentDepartment = "all";
            currentNameSearch = "";
            currentSkillSearch = "";
            renderMatrix();
        });
    }
    
    // Фильтр по навыку снизу
    if (skillFilterBottom) {
        skillFilterBottom.addEventListener("change", function() {
            renderMatrix();
        });
    }
    
    // Навигация по хедеру
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page === 'matrix') {
                window.location.href = '/matrix';
            } else if (page === 'profile') {
                window.location.href = '/profile';
            }
        });
    });
    const ctx = document.getElementById("levelsChart");

if (ctx) {
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Эксперт", "Продвинутый", "Опытный", "Новичок"],
            datasets: [{
                data: [4, 3, 3, 1],
                backgroundColor: [
                    "#F2ACAC",
                    "#EDC9AD",
                    "#F4F3B5",
                    "#C0E6BCC7"
                ],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            }
        }
    });
}
    
    // Начальная отрисовка
    renderMatrix();
}