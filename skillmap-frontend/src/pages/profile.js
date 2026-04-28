// src/pages/profile.js

import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import plusIcon from "../assets/plus.svg";
import searchIcon from "../assets/search.svg";
import trashIcon from "../assets/trash.svg";
import editIcon from "../assets/edit.svg";
import API_CONFIG from "../config.js";

let skillsData = [];
let availableSkills = [];
let currentLevelFilter = "all";
let searchQuery = "";
let currentEditSkillId = null;

const API_TO_UI_LEVEL = {
    Intern: "Новичок",
    Junior: "Опытный",
    Middle: "Продвинутый",
    Senior: "Эксперт",
};

const UI_TO_API_LEVEL = {
    Новичок: "Intern",
    Опытный: "Junior",
    Продвинутый: "Middle",
    Эксперт: "Senior",
};

const levelColors = {
    Новичок: { circle: "#C0E6BC8C" },
    Опытный: { circle: "#F4F3B59E" },
    Продвинутый: { circle: "#EDC9AD9E" },
    Эксперт: { circle: "#F2ACAC85" },
};

function toUiLevel(level) {
    if (!level) return "Новичок";

    if (API_TO_UI_LEVEL[level]) {
        return API_TO_UI_LEVEL[level];
    }

    if (UI_TO_API_LEVEL[level]) {
        return level;
    }

    return level;
}

function toApiLevel(level) {
    if (!level) return "Intern";

    if (UI_TO_API_LEVEL[level]) {
        return UI_TO_API_LEVEL[level];
    }

    if (API_TO_UI_LEVEL[level]) {
        return level;
    }

    return "Intern";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getAvatarUrl(name) {
    return `https://ui-avatars.com/api/?background=2c7da0&color=fff&name=${encodeURIComponent(name || "User")}`;
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
    const response = await apiFetch(API_CONFIG.ME.DASHBOARD);

    if (!response) return;

    if (!response.ok) {
        console.error("Ошибка загрузки профиля:", response.status);
        showPageError("Не удалось загрузить профиль");
        return;
    }

    const dashboard = await response.json();

    renderUserInfo(dashboard.user);

    skillsData = (dashboard.skills || []).map((skill) => ({
        userSkillId: skill.userSkillId,
        skillId: skill.skillId,
        name: skill.category || "Без категории",
        category: skill.category || "",
        tool: skill.name || "Без названия",
        level: toUiLevel(skill.level),
        createdAt: skill.createdAt,
        updatedAt: skill.updatedAt,
    }));

    renderTable();
}

async function loadAvailableSkills() {
    const response = await apiFetch(API_CONFIG.SKILLS.AVAILABLE);

    if (!response) return;

    if (!response.ok) {
        console.error("Ошибка загрузки доступных навыков:", response.status);
        return;
    }

    availableSkills = await response.json();

    const select = document.getElementById("skillSelect");
    if (!select) return;

    select.innerHTML = `<option value="" disabled selected>Выберите навык</option>`;

    availableSkills.forEach((skill) => {
        const option = document.createElement("option");
        option.value = skill.id;
        option.textContent = skill.category
            ? `${skill.name} (${skill.category})`
            : skill.name;

        select.appendChild(option);
    });
}

function renderUserInfo(user) {
    const fullName = user?.fullName || "Пользователь";
    const position = user?.position || "Должность не указана";
    const department = user?.department || "Отдел не указан";
    const role = user?.role || "";

    const profileImg = document.getElementById("profileAvatar");
    const profileFullName = document.getElementById("profileFullName");
    const profilePosition = document.getElementById("profilePosition");
    const profileDepartment = document.getElementById("profileDepartment");

    const headerAvatar = document.getElementById("headerAvatar");
    const dropdownName = document.getElementById("dropdownName");
    const dropdownRole = document.getElementById("dropdownRole");

    if (profileImg) {
        profileImg.src = getAvatarUrl(fullName);
        profileImg.onerror = () => {
            profileImg.src = avatarIcon;
        };
    }

    if (profileFullName) profileFullName.textContent = fullName;
    if (profilePosition) profilePosition.textContent = position;
    if (profileDepartment) profileDepartment.textContent = `• ${department}`;

    if (headerAvatar) {
        headerAvatar.style.backgroundImage = `url("${getAvatarUrl(fullName)}")`;
        headerAvatar.style.backgroundSize = "cover";
        headerAvatar.style.backgroundPosition = "center";
    }

    if (dropdownName) dropdownName.textContent = fullName;
    if (dropdownRole) dropdownRole.textContent = role;
}

function showPageError(message) {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif;">
            <h2>Ошибка</h2>
            <p>${escapeHtml(message)}</p>
            <button id="backToLoginBtn">На страницу входа</button>
        </div>
    `;

    document.getElementById("backToLoginBtn")?.addEventListener("click", () => {
        window.location.href = "/";
    });
}

export function renderProfilePage() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
        <div class="main-container-profile">
            <header class="header">
                <div class="header-left">
                    <div class="logo">SkillMap</div>
                    <nav>
                        <a href="/profile">Главная</a>
                        <a href="/matrix">Матрица компетенций</a>
                        <a href="#">Кого спросить?</a>
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

                            <button class="dropdown-item" id="editProfileBtn">
                                <img src="${menuIcon1}" alt="Редактировать" class="dropdown-icon">
                                Редактировать профиль
                            </button>

                            <button class="dropdown-item logout" id="logoutBtn">
                                <img src="${menuIcon2}" alt="Выйти" class="dropdown-icon">
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="container">
                <aside class="profile-card">
                    <img src="${avatarIcon}" class="profile-img" id="profileAvatar" alt="Аватар">
                    <h2 class="fio" id="profileFullName">Загрузка...</h2>
                    <p id="profilePosition">...</p>
                    <span id="profileDepartment">...</span>
                </aside>

                <section class="content">
                    <div class="stats">
                        <div class="stat-total">
                            Всего навыков: <span id="totalSkills">0</span>
                        </div>

                        <div class="stat-item expert">
                            <span class="stat-circle"></span>
                            <span class="stat-label">Эксперт:</span>
                            <span class="stat-count" id="expertCount">0</span>
                        </div>

                        <div class="stat-item advanced">
                            <span class="stat-circle"></span>
                            <span class="stat-label">Продвинутый:</span>
                            <span class="stat-count" id="advancedCount">0</span>
                        </div>

                        <div class="stat-item experienced">
                            <span class="stat-circle"></span>
                            <span class="stat-label">Опытный:</span>
                            <span class="stat-count" id="experiencedCount">0</span>
                        </div>

                        <div class="stat-item novice">
                            <span class="stat-circle"></span>
                            <span class="stat-label">Новичок:</span>
                            <span class="stat-count" id="noviceCount">0</span>
                        </div>
                    </div>

                    <button class="add-btn" id="addSkillBtn">
                        Добавить навык
                        <img src="${plusIcon}" alt="Плюс" class="plus-icon">
                    </button>

                    <div class="skills">
                        <div class="skills-controls">
                            <div class="skills-title-section">
                                <h3>Мои навыки:</h3>

                                <button class="search-toggle-btn" id="searchToggleBtn">
                                    <img src="${searchIcon}" alt="Поиск" class="search-icon">
                                </button>

                                <input
                                    type="text"
                                    id="searchInput"
                                    class="search-input hidden"
                                    placeholder="Поиск..."
                                >
                            </div>

                            <div class="filter-section">
                                <span class="filter-label">Фильтр:</span>

                                <select id="filterSelect" class="filter-select">
                                    <option value="all">Все</option>
                                    <option value="Эксперт">Эксперт</option>
                                    <option value="Продвинутый">Продвинутый</option>
                                    <option value="Опытный">Опытный</option>
                                    <option value="Новичок">Новичок</option>
                                </select>
                            </div>
                        </div>

                        <div class="skills-table-container">
                            <table class="skills-table">
                                <thead>
                                    <tr>
                                        <th>Навык</th>
                                        <th>Инструмент</th>
                                        <th>Уровень</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody id="skills-table-body">
                                    <tr>
                                        <td colspan="4" class="empty-row">Загрузка...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>

        <div class="modal" id="addSkillModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Добавить навык</h3>
                </div>

                <form id="addSkillForm">
                    <div class="form-group">
                        <label>Навык:</label>
                        <select id="skillSelect">
                            <option value="" disabled selected>Загрузка...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Уровень владения:</label>
                        <select id="levelSelect">
                            <option value="Intern">Новичок</option>
                            <option value="Junior">Опытный</option>
                            <option value="Middle">Продвинутый</option>
                            <option value="Senior">Эксперт</option>
                        </select>
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="btn-submit">Сохранить</button>
                        <button type="button" class="btn-cancel add-cancel">Отмена</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="modal" id="editSkillModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Редактировать уровень навыка</h3>
                </div>

                <form id="editSkillForm">
                    <div class="form-group">
                        <label>Навык:</label>
                        <input type="text" id="editSkillName" disabled>
                    </div>

                    <div class="form-group">
                        <label>Уровень владения:</label>
                        <select id="editSkillLevelSelect">
                            <option value="Intern">Новичок</option>
                            <option value="Junior">Опытный</option>
                            <option value="Middle">Продвинутый</option>
                            <option value="Senior">Эксперт</option>
                        </select>
                    </div>

                    <div class="form-buttons">
                        <button type="submit" class="btn-submit">Сохранить</button>
                        <button type="button" class="btn-cancel edit-cancel">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    initProfilePage();
}

function initProfilePage() {
    initDropdown();
    initSearch();
    initFilter();
    initAddModal();
    initEditModal();

    loadProfileData();
}

function initDropdown() {
    const dropdownArrow = document.getElementById("dropdownArrow");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (dropdownArrow && dropdownMenu) {
        dropdownArrow.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        document.addEventListener("click", (event) => {
            if (!dropdownArrow.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", () => {
            dropdownMenu?.classList.remove("show");
            alert("Редактирование профиля пока в разработке");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            dropdownMenu?.classList.remove("show");

            try {
                await apiFetch(API_CONFIG.AUTH.LOGOUT, {
                    method: "POST",
                });
            } catch (error) {
                console.error("Ошибка выхода:", error);
            }

            window.location.href = "/";
        });
    }
}

function initSearch() {
    const searchToggleBtn = document.getElementById("searchToggleBtn");
    const searchInput = document.getElementById("searchInput");

    if (!searchToggleBtn || !searchInput) return;

    searchToggleBtn.addEventListener("click", () => {
        searchInput.classList.toggle("hidden");

        if (!searchInput.classList.contains("hidden")) {
            searchInput.focus();
            return;
        }

        searchInput.value = "";
        searchQuery = "";
        renderTable();
    });

    searchInput.addEventListener("input", (event) => {
        searchQuery = event.target.value;
        renderTable();
    });
}

function initFilter() {
    const filterSelect = document.getElementById("filterSelect");

    if (!filterSelect) return;

    filterSelect.addEventListener("change", (event) => {
        currentLevelFilter = event.target.value;
        renderTable();
    });
}

function initAddModal() {
    const addModal = document.getElementById("addSkillModal");
    const addBtn = document.getElementById("addSkillBtn");
    const addCancelBtn = document.querySelector(".add-cancel");
    const addForm = document.getElementById("addSkillForm");

    function openAddModal() {
        addModal?.classList.add("show");
        loadAvailableSkills();
    }

    function closeAddModal() {
        addModal?.classList.remove("show");
        addForm?.reset();
    }

    addBtn?.addEventListener("click", openAddModal);
    addCancelBtn?.addEventListener("click", closeAddModal);

    addModal?.addEventListener("click", (event) => {
        if (event.target === addModal) {
            closeAddModal();
        }
    });

    addForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const skillSelect = document.getElementById("skillSelect");
        const levelSelect = document.getElementById("levelSelect");

        const skillId = Number(skillSelect?.value);
        const level = levelSelect?.value;

        if (!skillId || !level) {
            alert("Выберите навык и уровень");
            return;
        }

        const response = await apiFetch(API_CONFIG.SKILLS.ADD_TO_ME, {
            method: "POST",
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({
                skillId,
                level,
            }),
        });

        if (!response) return;

        if (!response.ok) {
            const error = await safeReadJson(response);
            alert(error?.message || "Не удалось добавить навык");
            return;
        }

        closeAddModal();
        await loadProfileData();
    });
}

function initEditModal() {
    const editModal = document.getElementById("editSkillModal");
    const editCancelBtn = document.querySelector(".edit-cancel");
    const editForm = document.getElementById("editSkillForm");

    function closeEditModal() {
        editModal?.classList.remove("show");
        currentEditSkillId = null;
        editForm?.reset();
    }

    editCancelBtn?.addEventListener("click", closeEditModal);

    editModal?.addEventListener("click", (event) => {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    editForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!currentEditSkillId) {
            closeEditModal();
            return;
        }

        const levelSelect = document.getElementById("editSkillLevelSelect");
        const level = levelSelect?.value;

        if (!level) {
            alert("Выберите уровень");
            return;
        }

        const response = await apiFetch(
            `${API_CONFIG.SKILLS.UPDATE_MY_LEVEL}/${currentEditSkillId}/level`,
            {
                method: "PATCH",
                headers: API_CONFIG.HEADERS,
                body: JSON.stringify({
                    level,
                }),
            }
        );

        if (!response) return;

        if (!response.ok) {
            const error = await safeReadJson(response);
            alert(error?.message || "Не удалось обновить уровень");
            return;
        }

        closeEditModal();
        await loadProfileData();
    });
}

function openEditModal(skill) {
    currentEditSkillId = skill.skillId;

    const editModal = document.getElementById("editSkillModal");
    const editSkillName = document.getElementById("editSkillName");
    const editSkillLevelSelect = document.getElementById("editSkillLevelSelect");

    if (editSkillName) {
        editSkillName.value = `${skill.tool}${skill.category ? ` (${skill.category})` : ""}`;
    }

    if (editSkillLevelSelect) {
        editSkillLevelSelect.value = toApiLevel(skill.level);
    }

    editModal?.classList.add("show");
}

function renderTable() {
    const tbody = document.getElementById("skills-table-body");
    if (!tbody) return;

    let filteredSkills = [...skillsData];

    if (currentLevelFilter !== "all") {
        filteredSkills = filteredSkills.filter((skill) => skill.level === currentLevelFilter);
    }

    if (searchQuery.trim()) {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        filteredSkills = filteredSkills.filter((skill) => {
            return (
                skill.tool.toLowerCase().includes(normalizedSearch) ||
                skill.name.toLowerCase().includes(normalizedSearch) ||
                skill.category.toLowerCase().includes(normalizedSearch)
            );
        });
    }

    if (filteredSkills.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-row">Навыки не найдены</td>
            </tr>
        `;

        updateStats();
        return;
    }

    tbody.innerHTML = filteredSkills
        .map((skill) => {
            const levelColor = levelColors[skill.level]?.circle || "#ccc";

            return `
                <tr data-skill-id="${skill.skillId}">
                    <td class="skill-cell">
                        <span
                            class="skill-circle"
                            style="background: ${levelColor}"
                        ></span>

                        <span class="skill-name-text">
                            ${escapeHtml(skill.name || "Без категории")}
                        </span>
                    </td>

                    <td class="tool-cell">
                        ${escapeHtml(skill.tool)}
                    </td>

                    <td class="level-cell">
                        <span class="level-badge">
                            ${escapeHtml(skill.level)}
                        </span>
                    </td>

                    <td class="actions-cell">
                        <button
                            class="edit-skill"
                            data-skill-id="${skill.skillId}"
                            title="Редактировать"
                        >
                            <img src="${editIcon}" alt="Редактировать" class="action-icon">
                        </button>

                        <button
                            class="delete-skill"
                            data-skill-id="${skill.skillId}"
                            title="Удалить"
                        >
                            <img src="${trashIcon}" alt="Удалить" class="action-icon">
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");

    updateStats();
    attachTableEvents();
}

function attachTableEvents() {
    document.querySelectorAll(".delete-skill").forEach((button) => {
        button.addEventListener("click", async () => {
            const skillId = Number(button.dataset.skillId);

            if (!skillId) return;

            const confirmed = confirm("Удалить навык?");
            if (!confirmed) return;

            const response = await apiFetch(`${API_CONFIG.SKILLS.REMOVE_FROM_ME}/${skillId}`, {
                method: "DELETE",
            });

            if (!response) return;

            if (!response.ok) {
                const error = await safeReadJson(response);
                alert(error?.message || "Не удалось удалить навык");
                return;
            }

            await loadProfileData();
        });
    });

    document.querySelectorAll(".edit-skill").forEach((button) => {
        button.addEventListener("click", () => {
            const skillId = Number(button.dataset.skillId);
            const skill = skillsData.find((item) => item.skillId === skillId);

            if (!skill) return;

            openEditModal(skill);
        });
    });
}

function updateStats() {
    const total = skillsData.length;
    const expert = skillsData.filter((skill) => skill.level === "Эксперт").length;
    const advanced = skillsData.filter((skill) => skill.level === "Продвинутый").length;
    const experienced = skillsData.filter((skill) => skill.level === "Опытный").length;
    const novice = skillsData.filter((skill) => skill.level === "Новичок").length;

    const totalEl = document.getElementById("totalSkills");
    const expertEl = document.getElementById("expertCount");
    const advancedEl = document.getElementById("advancedCount");
    const experiencedEl = document.getElementById("experiencedCount");
    const noviceEl = document.getElementById("noviceCount");

    if (totalEl) totalEl.textContent = total;
    if (expertEl) expertEl.textContent = expert;
    if (advancedEl) advancedEl.textContent = advanced;
    if (experiencedEl) experiencedEl.textContent = experienced;
    if (noviceEl) noviceEl.textContent = novice;
}

async function safeReadJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}