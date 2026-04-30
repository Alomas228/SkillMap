import arrowIcon from "../assets/Icon.svg";
import avatarIcon from "../assets/icon-avatar.jpg";
import menuIcon1 from "../assets/image-menu1.svg";
import menuIcon2 from "../assets/image-menu2.svg";
import plusIcon from "../assets/plus.svg";
import searchIcon from "../assets/search.svg";
import trashIcon from "../assets/trash.svg";
import editIcon from "../assets/edit.svg";
import API_CONFIG from "../config.js";

let currentUser = null;
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
    return API_TO_UI_LEVEL[level] || level || "Новичок";
}

function toApiLevel(level) {
    return UI_TO_API_LEVEL[level] || level || "Intern";
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

async function safeReadJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function loadProfileData() {
    const response = await apiFetch(API_CONFIG.ME.DASHBOARD);

    if (!response) return;

    if (!response.ok) {
        showPageError("Не удалось загрузить профиль");
        return;
    }

    const dashboard = await response.json();

    currentUser = dashboard.user;
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

    if (!response || !response.ok) {
        alert("Не удалось загрузить список навыков");
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

    const avatarUrl = getAvatarUrl(fullName);

    const profileAvatar = document.getElementById("profileAvatar");
    const profileFullName = document.getElementById("profileFullName");
    const profilePosition = document.getElementById("profilePosition");
    const profileDepartment = document.getElementById("profileDepartment");

    const headerAvatar = document.getElementById("headerAvatar");
    const dropdownName = document.getElementById("dropdownName");
    const dropdownRole = document.getElementById("dropdownRole");
    const askLink = document.getElementById("askLink");

    if (profileAvatar) {
        profileAvatar.src = avatarUrl;
        profileAvatar.onerror = () => {
            profileAvatar.src = avatarIcon;
        };
    }

    if (profileFullName) profileFullName.textContent = fullName;
    if (profilePosition) profilePosition.textContent = position;
    if (profileDepartment) profileDepartment.textContent = `• ${department}`;

    if (headerAvatar) {
        headerAvatar.style.backgroundImage = `url("${avatarUrl}")`;
        headerAvatar.style.backgroundSize = "cover";
        headerAvatar.style.backgroundPosition = "center";
    }

    if (dropdownName) dropdownName.textContent = fullName;
    if (dropdownRole) dropdownRole.textContent = role;

    if (askLink && user?.publicId) {
        askLink.href = `/public-profile/${user.publicId}`;
    }
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
        <div class="profile-page">
            <header class="profile-header">
                <div class="profile-header-left">
                    <div class="profile-logo">SkillMap</div>
                    <nav class="profile-nav">
                        <a href="/profile">Главная</a>
                        <a href="/matrix">Матрица компетенций</a>
                        <a href="/public-profile" id="askLink">Кого спросить?</a>
                    </nav>
                </div>

                <div class="profile-container-avatar">
                    <div class="profile-avatar" id="headerAvatar"></div>
                    <div class="profile-arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="profile-arrow-icon" id="dropdownArrow">
                        <div class="profile-dropdown-menu" id="dropdownMenu">
                            <div class="profile-dropdown-header">
                                <div class="profile-dropdown-avatar" id="dropdownAvatar"></div>
                                <div class="profile-dropdown-info">
                                    <div class="profile-dropdown-name" id="dropdownName">Загрузка...</div>
                                    <div class="profile-dropdown-role" id="dropdownRole">...</div>
                                </div>
                            </div>

                            <div class="profile-dropdown-divider"></div>

                            <button class="profile-dropdown-item" id="editProfileBtn">
                                <img src="${menuIcon1}" alt="Редактировать" class="profile-dropdown-icon">
                                Редактировать профиль
                            </button>

                            <button class="profile-dropdown-item profile-logout" id="logoutBtn">
                                <img src="${menuIcon2}" alt="Выйти" class="profile-dropdown-icon">
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="profile-container">
                <aside class="profile-card">
                    <img src="${avatarIcon}" class="profile-card-img" id="profileAvatar" alt="Аватар">
                    <h2 class="profile-fio" id="profileFullName">Загрузка...</h2>
                    <p id="profilePosition">...</p>
                    <span id="profileDepartment">...</span>
                </aside>

                <section class="profile-content">
                    <div class="profile-stats">
                        <div class="profile-stat-total">
                            Всего навыков: <span id="totalSkills">0</span>
                        </div>
                        <div class="profile-stat-item profile-expert">
                            <span class="profile-stat-circle"></span>
                            <span class="profile-stat-label">Эксперт:</span>
                            <span class="profile-stat-count" id="expertCount">0</span>
                        </div>
                        <div class="profile-stat-item profile-advanced">
                            <span class="profile-stat-circle"></span>
                            <span class="profile-stat-label">Продвинутый:</span>
                            <span class="profile-stat-count" id="advancedCount">0</span>
                        </div>
                        <div class="profile-stat-item profile-experienced">
                            <span class="profile-stat-circle"></span>
                            <span class="profile-stat-label">Опытный:</span>
                            <span class="profile-stat-count" id="experiencedCount">0</span>
                        </div>
                        <div class="profile-stat-item profile-novice">
                            <span class="profile-stat-circle"></span>
                            <span class="profile-stat-label">Новичок:</span>
                            <span class="profile-stat-count" id="noviceCount">0</span>
                        </div>
                    </div>

                    <button class="profile-add-btn" id="addSkillBtn">
                        Добавить навык
                        <img src="${plusIcon}" alt="Плюс" class="profile-plus-icon">
                    </button>

                    <div class="profile-skills">
                        <div class="profile-skills-controls">
                            <div class="profile-skills-title-section">
                                <h3>Мои навыки:</h3>
                                <button class="profile-search-toggle-btn" id="searchToggleBtn">
                                    <img src="${searchIcon}" alt="Поиск" class="profile-search-icon">
                                </button>
                                <input type="text" id="searchInput" class="profile-search-input hidden" placeholder="Поиск...">
                            </div>

                            <div class="profile-filter-section">
                                <span class="profile-filter-label">Фильтр:</span>
                                <select id="filterSelect" class="profile-filter-select">
                                    <option value="all">Все</option>
                                    <option value="Эксперт">Эксперт</option>
                                    <option value="Продвинутый">Продвинутый</option>
                                    <option value="Опытный">Опытный</option>
                                    <option value="Новичок">Новичок</option>
                                </select>
                            </div>
                        </div>

                        <div class="profile-skills-table-container">
                            <table class="profile-skills-table">
                                <thead>
                                    <tr>
                                        <th>Категория</th>
                                        <th>Навык</th>
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

            <div class="profile-modal" id="addSkillModal">
                <div class="profile-modal-content">
                    <div class="profile-modal-header">
                        <h3>Добавить навык</h3>
                        <button class="profile-modal-close add-modal-close" type="button">&times;</button>
                    </div>

                    <form id="addSkillForm">
                        <div class="profile-form-group">
                            <label>Навык:</label>
                            <select id="skillSelect">
                                <option value="" disabled selected>Загрузка...</option>
                            </select>
                        </div>

                        <div class="profile-form-group">
                            <label>Уровень владения:</label>
                            <select id="levelSelect">
                                <option value="Intern">Новичок</option>
                                <option value="Junior">Опытный</option>
                                <option value="Middle">Продвинутый</option>
                                <option value="Senior">Эксперт</option>
                            </select>
                        </div>

                        <div class="profile-form-buttons">
                            <button type="submit" class="profile-btn-submit">Сохранить</button>
                            <button type="button" class="profile-btn-cancel add-cancel">Отмена</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="profile-modal" id="editSkillModal">
                <div class="profile-modal-content">
                    <div class="profile-modal-header">
                        <h3>Редактировать уровень навыка</h3>
                        <button class="profile-modal-close edit-modal-close" type="button">&times;</button>
                    </div>

                    <form id="editSkillForm">
                        <div class="profile-form-group">
                            <label>Навык:</label>
                            <input type="text" id="editSkillName" disabled>
                        </div>

                        <div class="profile-form-group">
                            <label>Уровень владения:</label>
                            <select id="editSkillLevelSelect">
                                <option value="Intern">Новичок</option>
                                <option value="Junior">Опытный</option>
                                <option value="Middle">Продвинутый</option>
                                <option value="Senior">Эксперт</option>
                            </select>
                        </div>

                        <div class="profile-form-buttons">
                            <button type="submit" class="profile-btn-submit">Сохранить</button>
                            <button type="button" class="profile-btn-cancel edit-cancel">Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    initProfilePage();
}

function initProfilePage() {
    initDropdown();
    initNavigation();
    initSearch();
    initFilter();
    initAddModal();
    initEditModal();

    loadProfileData();
}

function initNavigation() {
    document.querySelectorAll(".profile-nav a").forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href === "#") {
                event.preventDefault();
            }
        });
    });
}

function initDropdown() {
    const dropdownArrow = document.getElementById("dropdownArrow");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const editProfileBtn = document.getElementById("editProfileBtn");
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

    editProfileBtn?.addEventListener("click", () => {
        dropdownMenu?.classList.remove("show");
        alert("Редактирование профиля пока в разработке");
    });

    logoutBtn?.addEventListener("click", async () => {
        await apiFetch(API_CONFIG.AUTH.LOGOUT, { method: "POST" });
        window.location.href = "/";
    });
}

function initSearch() {
    const searchToggleBtn = document.getElementById("searchToggleBtn");
    const searchInput = document.getElementById("searchInput");

    searchToggleBtn?.addEventListener("click", () => {
        searchInput?.classList.toggle("hidden");

        if (searchInput && !searchInput.classList.contains("hidden")) {
            searchInput.focus();
            return;
        }

        if (searchInput) searchInput.value = "";
        searchQuery = "";
        renderTable();
    });

    searchInput?.addEventListener("input", (event) => {
        searchQuery = event.target.value;
        renderTable();
    });
}

function initFilter() {
    const filterSelect = document.getElementById("filterSelect");

    filterSelect?.addEventListener("change", (event) => {
        currentLevelFilter = event.target.value;
        renderTable();
    });
}

function initAddModal() {
    const addModal = document.getElementById("addSkillModal");
    const addBtn = document.getElementById("addSkillBtn");
    const addCancelBtn = document.querySelector(".add-cancel");
    const addCloseBtn = document.querySelector(".add-modal-close");
    const addForm = document.getElementById("addSkillForm");

    async function openAddModal() {
        addModal?.classList.add("show");
        await loadAvailableSkills();
    }

    function closeAddModal() {
        addModal?.classList.remove("show");
        addForm?.reset();
    }

    addBtn?.addEventListener("click", openAddModal);
    addCancelBtn?.addEventListener("click", closeAddModal);
    addCloseBtn?.addEventListener("click", closeAddModal);

    addModal?.addEventListener("click", (event) => {
        if (event.target === addModal) {
            closeAddModal();
        }
    });

    addForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const skillId = Number(document.getElementById("skillSelect")?.value);
        const level = document.getElementById("levelSelect")?.value;

        if (!skillId || !level) {
            alert("Выберите навык и уровень");
            return;
        }

        const response = await apiFetch(API_CONFIG.SKILLS.ADD_TO_ME, {
            method: "POST",
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ skillId, level }),
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
    const editCloseBtn = document.querySelector(".edit-modal-close");
    const editForm = document.getElementById("editSkillForm");

    function closeEditModal() {
        editModal?.classList.remove("show");
        currentEditSkillId = null;
        editForm?.reset();
    }

    editCancelBtn?.addEventListener("click", closeEditModal);
    editCloseBtn?.addEventListener("click", closeEditModal);

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

        const level = document.getElementById("editSkillLevelSelect")?.value;

        const response = await apiFetch(`${API_CONFIG.SKILLS.UPDATE_MY_LEVEL}/${currentEditSkillId}/level`, {
            method: "PATCH",
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ level }),
        });

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

    const editSkillName = document.getElementById("editSkillName");
    const editSkillLevelSelect = document.getElementById("editSkillLevelSelect");

    if (editSkillName) {
        editSkillName.value = `${skill.tool}${skill.category ? ` (${skill.category})` : ""}`;
    }

    if (editSkillLevelSelect) {
        editSkillLevelSelect.value = toApiLevel(skill.level);
    }

    document.getElementById("editSkillModal")?.classList.add("show");
}

function renderTable() {
    const tbody = document.getElementById("skills-table-body");
    if (!tbody) return;

    let filteredSkills = [...skillsData];

    if (currentLevelFilter !== "all") {
        filteredSkills = filteredSkills.filter((skill) => skill.level === currentLevelFilter);
    }

    if (searchQuery.trim()) {
        const search = searchQuery.trim().toLowerCase();

        filteredSkills = filteredSkills.filter((skill) => {
            return (
                skill.tool.toLowerCase().includes(search) ||
                skill.name.toLowerCase().includes(search) ||
                skill.category.toLowerCase().includes(search)
            );
        });
    }

    if (filteredSkills.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-row">Навыки не найдены</td></tr>`;
        updateStats();
        return;
    }

    tbody.innerHTML = filteredSkills.map((skill) => {
        const levelColor = levelColors[skill.level]?.circle || "#ccc";

        return `
            <tr data-skill-id="${skill.skillId}">
                <td class="skill-cell">
                    <span class="skill-circle" style="background: ${levelColor}"></span>
                    <span class="skill-name-text">${escapeHtml(skill.name)}</span>
                </td>

                <td class="tool-cell">${escapeHtml(skill.tool)}</td>

                <td class="level-cell">
                    <span class="level-badge">${escapeHtml(skill.level)}</span>
                </td>

                <td class="actions-cell">
                    <button class="edit-skill" data-skill-id="${skill.skillId}" title="Редактировать">
                        <img src="${editIcon}" alt="Редактировать" class="action-icon">
                    </button>

                    <button class="delete-skill" data-skill-id="${skill.skillId}" title="Удалить">
                        <img src="${trashIcon}" alt="Удалить" class="action-icon">
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    updateStats();
    attachTableEvents();
}

function attachTableEvents() {
    document.querySelectorAll(".delete-skill").forEach((button) => {
        button.addEventListener("click", async () => {
            const skillId = Number(button.dataset.skillId);

            if (!skillId) return;
            if (!confirm("Удалить навык?")) return;

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

            if (skill) {
                openEditModal(skill);
            }
        });
    });
}

function updateStats() {
    const total = skillsData.length;
    const expert = skillsData.filter((skill) => skill.level === "Эксперт").length;
    const advanced = skillsData.filter((skill) => skill.level === "Продвинутый").length;
    const experienced = skillsData.filter((skill) => skill.level === "Опытный").length;
    const novice = skillsData.filter((skill) => skill.level === "Новичок").length;

    document.getElementById("totalSkills").textContent = total;
    document.getElementById("expertCount").textContent = expert;
    document.getElementById("advancedCount").textContent = advanced;
    document.getElementById("experiencedCount").textContent = experienced;
    document.getElementById("noviceCount").textContent = novice;
}