import arrowIcon from "../assets/Icon.svg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import statIcon1 from "../assets/1stat-card.svg";
import statIcon2 from "../assets/2stat-card.svg";
import statIcon3 from "../assets/3stat-card.svg";
import API_CONFIG from "../config.js";

let matrixData = {
    stats: {
        totalEmployees: 0,
        uniqueSkills: 0,
        experts: 0,
        seniorCount: 0,
        middleCount: 0,
        juniorCount: 0,
        internCount: 0,
    },
    departments: [],
    skills: [],
    employees: [],
};

let currentDepartment = "all";
let currentNameSearch = "";
let currentSkillSearch = "";
let currentCategoryFilter = "all";

const API_TO_UI_LEVEL = {
    Intern: "Новичок",
    Junior: "Опытный",
    Middle: "Продвинутый",
    Senior: "Эксперт",
};

const levelColorsMatrix = {
    Intern: "#C0E6BCC7",
    Junior: "#F4F3B5",
    Middle: "#EDC9AD",
    Senior: "#F2ACAC",
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
    return `https://ui-avatars.com/api/?background=7c5bb8&color=fff&name=${encodeURIComponent(name || "User")}`;
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

    if (response.status === 403) {
        showMatrixError("У вас нет доступа к матрице компетенций");
        return null;
    }

    return response;
}

async function getCurrentUser() {
    try {
        const response = await fetch(API_CONFIG.AUTH.ME, {
            credentials: "include",
        });

        if (!response.ok) return null;

        return await response.json();
    } catch {
        return null;
    }
}

export function renderMatrixPage() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <div class="matrix-container">
            <header class="header">
                <div class="header-left">
                    <div class="logo">SkillMap</div>
                    <nav>
                        <a href="/profile" data-page="profile">Главная</a>
                        <a href="/matrix" data-page="matrix">Матрица компетенций</a>
                        <a href="#" data-page="ask">Кого спросить?</a>
                    </nav>
                </div>

                <div class="container-avatar">
                    <div class="avatar" id="headerAvatar"></div>

                    <div class="arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="arrow-icon" id="dropdownArrow">

                        <div class="dropdown-menu" id="dropdownMenu">
                            <div class="dropdown-header">
                                <div class="dropdown-avatar" id="dropdownAvatar"></div>
                                <div class="dropdown-info">
                                    <div class="dropdown-name" id="dropdownName">Загрузка...</div>
                                    <div class="dropdown-role" id="dropdownRole">...</div>
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
                <div class="stats-cards">
                    <div class="stat-card">
                        <img src="${statIcon1}" alt="Иконка" class="stat-icon">
                        <div class="stat-label">Всего сотрудников:</div>
                        <div class="stat-value" id="totalEmployeesValue">0</div>
                    </div>

                    <div class="stat-card">
                        <img src="${statIcon2}" alt="Иконка" class="stat-icon">
                        <div class="stat-label">Уникальных навыков:</div>
                        <div class="stat-value" id="uniqueSkillsValue">0</div>
                    </div>

                    <div class="stat-card">
                        <img src="${statIcon3}" alt="Иконка" class="stat-icon">
                        <div class="stat-label">Экспертов:</div>
                        <div class="stat-value" id="expertsValue">0</div>
                    </div>
                </div>

                <div class="top-section">
                    <div class="chart-card">
                        <div class="all-emp">Распределение уровней сотрудников:</div>

                        <div class="chart-wrapper">
                            <canvas id="levelsChart"></canvas>

                            <div class="chart-legend">
                                <div><span class="dot expert"></span> Эксперт: <span id="seniorCount">0</span></div>
                                <div><span class="dot advanced"></span> Продвинутый: <span id="middleCount">0</span></div>
                                <div><span class="dot experienced"></span> Опытный: <span id="juniorCount">0</span></div>
                                <div><span class="dot novice"></span> Новичок: <span id="internCount">0</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="filters-card">
                        <div class="filter-text">Фильтры</div>

                        <div class="departament">
                            <label>Отдел:</label>
                            <select id="departmentFilter">
                                <option value="all">Все</option>
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

                <div class="matrix-section">
                    <div class="matrix-header">
                        <h3>Матрица компетенций:</h3>

                        <div class="filter-section">
                            <span class="filter-label">Категория:</span>
                            <select id="filterSelect" class="filter-select">
                                <option value="all">Все</option>
                            </select>
                        </div>
                    </div>

                    <div class="matrix-table-container">
                        <table class="matrix-table" id="matrixTable">
                            <thead id="matrixHead">
                                <tr>
                                    <th class="employee-col">Сотрудник</th>
                                </tr>
                            </thead>

                            <tbody id="matrixBody">
                                <tr>
                                    <td>Загрузка...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    `;

    initMatrixPage();
}

async function initMatrixPage() {
    initDropdown();
    initNavigation();
    initFilters();

    const user = await getCurrentUser();
    renderCurrentUser(user);

    await loadMatrixData();
}

function initDropdown() {
    const dropdownArrow = document.getElementById("dropdownArrow");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (dropdownArrow && dropdownMenu) {
        dropdownArrow.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (event) {
            if (!dropdownArrow.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener("click", function () {
            window.location.href = "/profile";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function () {
            try {
                await fetch(API_CONFIG.AUTH.LOGOUT, {
                    method: "POST",
                    credentials: "include",
                });
            } catch (error) {
                console.error("Ошибка выхода:", error);
            }

            window.location.href = "/";
        });
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = link.getAttribute("href");

            if (!href || href === "#") {
                event.preventDefault();
                return;
            }
        });
    });
}

function initFilters() {
    const applyBtn = document.getElementById("applyFilters");
    const resetBtn = document.getElementById("resetFilters");
    const departmentFilter = document.getElementById("departmentFilter");
    const nameSearch = document.getElementById("nameSearch");
    const skillSearch = document.getElementById("skillSearch");
    const categoryFilter = document.getElementById("filterSelect");

    applyBtn?.addEventListener("click", function () {
        currentDepartment = departmentFilter?.value || "all";
        currentNameSearch = nameSearch?.value || "";
        currentSkillSearch = skillSearch?.value || "";
        renderMatrix();
    });

    resetBtn?.addEventListener("click", function () {
        if (departmentFilter) departmentFilter.value = "all";
        if (nameSearch) nameSearch.value = "";
        if (skillSearch) skillSearch.value = "";
        if (categoryFilter) categoryFilter.value = "all";

        currentDepartment = "all";
        currentNameSearch = "";
        currentSkillSearch = "";
        currentCategoryFilter = "all";

        renderMatrix();
    });

    categoryFilter?.addEventListener("change", function () {
        currentCategoryFilter = categoryFilter.value;
        renderMatrix();
    });

    nameSearch?.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            currentNameSearch = nameSearch.value;
            renderMatrix();
        }
    });

    skillSearch?.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            currentSkillSearch = skillSearch.value;
            renderMatrix();
        }
    });
}

async function loadMatrixData() {
    const response = await apiFetch(API_CONFIG.MATRIX.GET);

    if (!response) return;

    if (!response.ok) {
        showMatrixError("Не удалось загрузить матрицу компетенций");
        return;
    }

    matrixData = await response.json();

    matrixData.stats = matrixData.stats || {};
    matrixData.departments = matrixData.departments || [];
    matrixData.skills = matrixData.skills || [];
    matrixData.employees = matrixData.employees || [];

    renderDepartmentOptions();
    renderCategoryOptions();
    renderMatrix();
}

function renderCurrentUser(user) {
    const fullName = user?.fullName || "Пользователь";
    const role = user?.role || "";

    const headerAvatar = document.getElementById("headerAvatar");
    const dropdownAvatar = document.getElementById("dropdownAvatar");
    const dropdownName = document.getElementById("dropdownName");
    const dropdownRole = document.getElementById("dropdownRole");

    const avatarUrl = getAvatarUrl(fullName);

    if (headerAvatar) {
        headerAvatar.style.backgroundImage = `url("${avatarUrl}")`;
        headerAvatar.style.backgroundSize = "cover";
        headerAvatar.style.backgroundPosition = "center";
    }

    if (dropdownAvatar) {
        dropdownAvatar.style.backgroundImage = `url("${avatarUrl}")`;
        dropdownAvatar.style.backgroundSize = "cover";
        dropdownAvatar.style.backgroundPosition = "center";
    }

    if (dropdownName) dropdownName.textContent = fullName;
    if (dropdownRole) dropdownRole.textContent = role;
}

function renderDepartmentOptions() {
    const departmentFilter = document.getElementById("departmentFilter");
    if (!departmentFilter) return;

    departmentFilter.innerHTML = `<option value="all">Все</option>`;

    matrixData.departments.forEach((department) => {
        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;
        departmentFilter.appendChild(option);
    });
}

function renderCategoryOptions() {
    const categoryFilter = document.getElementById("filterSelect");
    if (!categoryFilter) return;

    const categories = [...new Set(
        matrixData.skills
            .map((skill) => skill.category)
            .filter(Boolean)
    )].sort();

    categoryFilter.innerHTML = `<option value="all">Все</option>`;

    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function getFilteredSkills() {
    let skills = [...matrixData.skills];

    if (currentCategoryFilter !== "all") {
        skills = skills.filter((skill) => skill.category === currentCategoryFilter);
    }

    if (currentSkillSearch.trim()) {
        const search = currentSkillSearch.trim().toLowerCase();

        skills = skills.filter((skill) => {
            return (
                skill.name.toLowerCase().includes(search) ||
                String(skill.category || "").toLowerCase().includes(search)
            );
        });
    }

    return skills;
}

function getFilteredEmployees(filteredSkills) {
    let employees = [...matrixData.employees];

    if (currentDepartment !== "all") {
        employees = employees.filter((employee) => employee.department === currentDepartment);
    }

    if (currentNameSearch.trim()) {
        const search = currentNameSearch.trim().toLowerCase();

        employees = employees.filter((employee) => {
            return String(employee.fullName || "").toLowerCase().includes(search);
        });
    }

    if (currentSkillSearch.trim()) {
        const skillIds = new Set(filteredSkills.map((skill) => skill.id));

        employees = employees.filter((employee) => {
            return (employee.skills || []).some((skill) => skillIds.has(skill.skillId));
        });
    }

    return employees;
}

function renderMatrix() {
    const filteredSkills = getFilteredSkills();
    const filteredEmployees = getFilteredEmployees(filteredSkills);

    renderStats(filteredEmployees, filteredSkills);
    renderChart(filteredEmployees);
    renderMatrixTable(filteredEmployees, filteredSkills);
}

function renderStats(employees, skills) {
    const totalEmployeesValue = document.getElementById("totalEmployeesValue");
    const uniqueSkillsValue = document.getElementById("uniqueSkillsValue");
    const expertsValue = document.getElementById("expertsValue");

    const expertsCount = employees.filter((employee) => {
        return (employee.skills || []).some((skill) => skill.level === "Senior");
    }).length;

    if (totalEmployeesValue) totalEmployeesValue.textContent = employees.length;
    if (uniqueSkillsValue) uniqueSkillsValue.textContent = skills.length;
    if (expertsValue) expertsValue.textContent = expertsCount;
}

function getLevelDistribution(employees) {
    const result = {
        Senior: 0,
        Middle: 0,
        Junior: 0,
        Intern: 0,
    };

    employees.forEach((employee) => {
        (employee.skills || []).forEach((skill) => {
            if (result[skill.level] !== undefined) {
                result[skill.level] += 1;
            }
        });
    });

    return result;
}

function renderChart(employees) {
    const distribution = getLevelDistribution(employees);

    const seniorCount = document.getElementById("seniorCount");
    const middleCount = document.getElementById("middleCount");
    const juniorCount = document.getElementById("juniorCount");
    const internCount = document.getElementById("internCount");

    if (seniorCount) seniorCount.textContent = distribution.Senior;
    if (middleCount) middleCount.textContent = distribution.Middle;
    if (juniorCount) juniorCount.textContent = distribution.Junior;
    if (internCount) internCount.textContent = distribution.Intern;

    const ctx = document.getElementById("levelsChart");

    if (!ctx || typeof Chart === "undefined") {
        return;
    }

    if (window.skillMapLevelsChart) {
        window.skillMapLevelsChart.destroy();
    }

    window.skillMapLevelsChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Эксперт", "Продвинутый", "Опытный", "Новичок"],
            datasets: [
                {
                    data: [
                        distribution.Senior,
                        distribution.Middle,
                        distribution.Junior,
                        distribution.Intern,
                    ],
                    backgroundColor: [
                        "#F2ACAC",
                        "#EDC9AD",
                        "#F4F3B5",
                        "#C0E6BCC7",
                    ],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

function renderMatrixTable(employees, skills) {
    const matrixHead = document.getElementById("matrixHead");
    const matrixBody = document.getElementById("matrixBody");

    if (!matrixHead || !matrixBody) return;

    matrixHead.innerHTML = `
        <tr>
            <th class="employee-col">Сотрудник</th>
            ${skills.map((skill) => `<th>${escapeHtml(skill.name)}</th>`).join("")}
        </tr>
    `;

    if (employees.length === 0) {
        matrixBody.innerHTML = `
            <tr>
                <td colspan="${skills.length + 1}">Сотрудники не найдены</td>
            </tr>
        `;
        return;
    }

    if (skills.length === 0) {
        matrixBody.innerHTML = employees
            .map((employee) => {
                return `
                    <tr>
                        <td class="employee-name">${escapeHtml(employee.fullName)}</td>
                    </tr>
                `;
            })
            .join("");
        return;
    }

    matrixBody.innerHTML = employees
        .map((employee) => {
            return `
                <tr>
                    <td class="employee-name">
                        ${escapeHtml(employee.fullName)}
                    </td>

                    ${skills.map((skill) => renderSkillCell(employee, skill)).join("")}
                </tr>
            `;
        })
        .join("");
}

function renderSkillCell(employee, skill) {
    const userSkill = (employee.skills || []).find((item) => item.skillId === skill.id);

    if (!userSkill) {
        return `
            <td class="skill-cell">
                <div class="skill-square empty" title="Нет навыка"></div>
            </td>
        `;
    }

    const color = levelColorsMatrix[userSkill.level] || "#C0E6BCC7";
    const title = API_TO_UI_LEVEL[userSkill.level] || userSkill.level;

    return `
        <td class="skill-cell">
            <div
                class="skill-square"
                style="background-color: ${color}"
                title="${escapeHtml(title)}"
            ></div>
        </td>
    `;
}

function showMatrixError(message) {
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
        window.location.href = "/";
    });
}