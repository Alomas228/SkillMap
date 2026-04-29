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

export function renderProfilePage() {
    const app = document.getElementById("app");
    if (!app) return;
    
    app.innerHTML = `
        <div class="profile-page">
            <!-- Хедер -->
            <header class="profile-header">
                <div class="profile-header-left">
                    <div class="profile-logo">SkillMap</div>
                    <nav class="profile-nav">
                        <a href="#">Главная</a>
                        <a href="#">Матрица компетенций</a>
                        <a href="#">Кого спросить?</a>
                    </nav>
                </div>
                <div class="profile-container-avatar">
                    <div class="profile-avatar"></div>
                    <div class="profile-arrow-wrapper">
                        <img src="${arrowIcon}" alt="Стрелка" class="profile-arrow-icon" id="dropdownArrow">
                        <div class="profile-dropdown-menu" id="dropdownMenu">
                            <div class="profile-dropdown-header">
                                <div class="profile-dropdown-avatar"></div>
                                <div class="profile-dropdown-info">
                                    <div class="profile-dropdown-name">Дарья Федорова</div>
                                    <div class="profile-dropdown-role">Дизайнер</div>
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
                    <img src="${avatarIcon}" class="profile-card-img">
                    <h2 class="profile-fio">Федорова Дарья Викторовна</h2>
                    <p>Дизайнер</p>
                    <span>• Отдел веб-дизайна</span>
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
                                        <th>Навык</th>
                                        <th>Инструмент</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="skills-table-body"></tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Модальное окно для ДОБАВЛЕНИЯ навыка -->
            <div class="profile-modal" id="addSkillModal">
                <div class="profile-modal-content">
                    <div class="profile-modal-header">
                        <h3>Добавить навык</h3>
                        <button class="profile-modal-close add-modal-close">&times;</button>
                    </div>
                    <form id="addSkillForm">
                        <div class="profile-form-group">
                            <label>Выберите название:</label>
                            <select id="skillCategorySelect">
                                <option value="" disabled selected>Название</option>
                                <option value="backend_lang">Backend-разработка (Языки программирования)</option>
                                <option value="backend_db">Backend-разработка (Базы данных)</option>
                                <option value="backend_infra">Backend-разработка (Инфраструктура)</option>
                                <option value="mobile_lang">Мобильная разработка (Языки программирования)</option>
                                <option value="mobile_framework">Мобильная разработка (Фреймворки)</option>
                                <option value="frontend_lang">Frontend-разработка (Языки программирования)</option>
                                <option value="frontend_framework">Frontend-разработка (Фреймворки)</option>
                            </select>
                        </div>
                        <div class="profile-form-group">
                            <label>Инструмент:</label>
                            <input type="text" id="skillTool" placeholder="Пример: Python, Java, Git">
                        </div>
                        <div class="profile-form-group">
                            <label>Уровень владения:</label>
                            <select id="skillLevel">
                                <option value="" disabled selected>Выберите уровень</option>
                                <option value="Новичок">Новичок</option>
                                <option value="Опытный">Опытный</option>
                                <option value="Продвинутый">Продвинутый</option>
                                <option value="Эксперт">Эксперт</option>
                            </select>
                        </div>
                        <div class="profile-form-buttons">
                            <button type="submit" class="profile-btn-submit">Сохранить</button>
                            <button type="button" class="profile-btn-cancel add-cancel">Отмена</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Модальное окно для РЕДАКТИРОВАНИЯ навыка -->
            <div class="profile-modal" id="editSkillModal">
                <div class="profile-modal-content">
                    <div class="profile-modal-header">
                        <h3>Редактировать навык</h3>
                        <button class="profile-modal-close edit-modal-close">&times;</button>
                    </div>
                    <form id="editSkillForm">
                        <div class="profile-form-group">
                            <label>Выберите название:</label>
                            <select id="editSkillCategorySelect">
                                <option value="" disabled selected>Название</option>
                                <option value="backend_lang">Backend-разработка (Языки программирования)</option>
                                <option value="backend_db">Backend-разработка (Базы данных)</option>
                                <option value="backend_infra">Backend-разработка (Инфраструктура)</option>
                                <option value="mobile_lang">Мобильная разработка (Языки программирования)</option>
                                <option value="mobile_framework">Мобильная разработка (Фреймворки)</option>
                                <option value="frontend_lang">Frontend-разработка (Языки программирования)</option>
                                <option value="frontend_framework">Frontend-разработка (Фреймворки)</option>
                            </select>
                        </div>
                        <div class="profile-form-group">
                            <label>Инструмент:</label>
                            <select id="editSkillToolSelect">
                                <option value="" disabled selected>Выберите инструмент</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="C++">C++</option>
                                <option value="Git">Git</option>
                                <option value="PostgreSQL">PostgreSQL</option>
                                <option value="RabbitMQ">RabbitMQ</option>
                                <option value="Kotlin">Kotlin</option>
                                <option value="Jetpack Compose">Jetpack Compose</option>
                            </select>
                        </div>
                        <div class="profile-form-group">
                            <label>Уровень владения:</label>
                            <select id="editSkillLevelSelect">
                                <option value="" disabled selected>Выберите уровень</option>
                                <option value="Новичок">Новичок</option>
                                <option value="Опытный">Опытный</option>
                                <option value="Продвинутый">Продвинутый</option>
                                <option value="Эксперт">Эксперт</option>
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

// Данные навыков
let skillsData = [
    { id: 1, category: "backend", name: "Backend-разработка", subcategory: "Языки программирования", tool: "Python (Django/FastAPI)", level: "Продвинутый" },
    { id: 2, category: "backend", name: "Backend-разработка", subcategory: "Языки программирования", tool: "Java (Spring Boot)", level: "Эксперт" },
    { id: 3, category: "backend", name: "Backend-разработка", subcategory: "Языки программирования", tool: "Golang", level: "Новичок" },
    { id: 4, category: "database", name: "Backend-разработка", subcategory: "Базы данных", tool: "PostgreSQL", level: "Эксперт" },
    { id: 5, category: "infrastructure", name: "Backend-разработка", subcategory: "Инфраструктура", tool: "Git", level: "Опытный" },
    { id: 6, category: "infrastructure", name: "Backend-разработка", subcategory: "Инфраструктура", tool: "RabbitMQ", level: "Новичок" },
    { id: 7, category: "mobile", name: "Мобильная разработка", subcategory: "Языки программирования", tool: "Kotlin", level: "Продвинутый" },
    { id: 8, category: "mobile", name: "Мобильная разработка", subcategory: "Фреймворки", tool: "Jetpack Compose", level: "Опытный" },
];

const levelColors = {
    "Новичок": { circle: "#C0E6BC8C" },
    "Опытный": { circle: "#F4F3B59E" },
    "Продвинутый": { circle: "#EDC9AD9E" },
    "Эксперт": { circle: "#F2ACAC85" }
};

function initProfilePage() {
    let currentLevelFilter = "all";
    let searchQuery = "";
    let currentEditId = null;
    
    // ========== ВЫПАДАЮЩЕЕ МЕНЮ ==========
    const dropdownArrow = document.getElementById("dropdownArrow");
    const dropdownMenu = document.getElementById("dropdownMenu");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    
    if (dropdownArrow && dropdownMenu) {
        dropdownArrow.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });
        
        document.addEventListener("click", (e) => {
            if (!dropdownArrow.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    }
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", () => {
            dropdownMenu.classList.remove("show");
            alert("Редактирование профиля (в разработке)");
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            dropdownMenu.classList.remove("show");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        });
    }
    
    // ========== ПОИСК ==========
    const searchToggleBtn = document.getElementById("searchToggleBtn");
    const searchInput = document.getElementById("searchInput");
    
    if (searchToggleBtn && searchInput) {
        searchToggleBtn.addEventListener("click", () => {
            searchInput.classList.toggle("hidden");
            if (!searchInput.classList.contains("hidden")) {
                searchInput.focus();
            } else {
                searchInput.value = "";
                searchQuery = "";
                renderTable();
            }
        });
        
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderTable();
        });
    }
    
    // ========== ФИЛЬТР ==========
    const filterSelect = document.getElementById("filterSelect");
    if (filterSelect) {
        filterSelect.addEventListener("change", (e) => {
            currentLevelFilter = e.target.value;
            renderTable();
        });
    }
    
    // ========== ТАБЛИЦА ==========
    function renderTable() {
        const tbody = document.getElementById("skills-table-body");
        if (!tbody) return;
        
        let filteredSkills = [...skillsData];
        
        if (currentLevelFilter !== "all") {
            filteredSkills = filteredSkills.filter(skill => skill.level === currentLevelFilter);
        }
        
        if (searchQuery) {
            filteredSkills = filteredSkills.filter(skill => 
                skill.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
                skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (skill.subcategory && skill.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        
        if (filteredSkills.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-row">Навыки не найдены</td></tr>`;
        } else {
            tbody.innerHTML = filteredSkills.map(skill => `
                <tr data-id="${skill.id}">
                    <td class="skill-cell">
                        <span class="skill-circle" style="background: ${levelColors[skill.level]?.circle || '#ccc'}"></span>
                        <span class="skill-name-text">
                            ${skill.name}
                            ${skill.subcategory ? `<span class="skill-subcategory">(${skill.subcategory})</span>` : ''}
                        </span>
                    </td>
                    <td class="tool-cell">${skill.tool}</td>
                    <td class="level-cell">
                        <span class="level-badge">${skill.level}</span>
                    </td>
                    <td class="actions-cell">
                        <button class="edit-skill" data-id="${skill.id}" title="Редактировать">
                            <img src="${editIcon}" alt="Редактировать" class="action-icon">
                        </button>
                        <button class="delete-skill" data-id="${skill.id}" title="Удалить">
                            <img src="${trashIcon}" alt="Удалить" class="action-icon">
                        </button>
                    </td>
                </tr>
            `).join("");
        }
        
        updateStats();
        
        document.querySelectorAll(".delete-skill").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                skillsData = skillsData.filter(skill => skill.id !== id);
                renderTable();
            });
        });
        
        document.querySelectorAll(".edit-skill").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                const skill = skillsData.find(s => s.id === id);
                if (skill) {
                    openEditModal(skill);
                }
            });
        });
    }
    
    function updateStats() {
        const total = skillsData.length;
        const expert = skillsData.filter(s => s.level === "Эксперт").length;
        const advanced = skillsData.filter(s => s.level === "Продвинутый").length;
        const experienced = skillsData.filter(s => s.level === "Опытный").length;
        const novice = skillsData.filter(s => s.level === "Новичок").length;
        
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
    
    // ========== МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ ==========
    const addModal = document.getElementById("addSkillModal");
    const addBtn = document.getElementById("addSkillBtn");
    const addCancelBtn = document.querySelector(".add-cancel");
    const addForm = document.getElementById("addSkillForm");
    
    function openAddModal() {
        addModal.classList.add("show");
    }
    
    function closeAddModal() {
        addModal.classList.remove("show");
        if (addForm) addForm.reset();
    }
    
    if (addBtn) addBtn.addEventListener("click", openAddModal);
    if (addCancelBtn) addCancelBtn.addEventListener("click", closeAddModal);
    
    if (addModal) {
        addModal.addEventListener("click", (e) => {
            if (e.target === addModal) closeAddModal();
        });
    }
    
    if (addForm) {
        addForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const categorySelect = document.getElementById("skillCategorySelect");
            const selectedValue = categorySelect?.value;
            const tool = document.getElementById("skillTool")?.value.trim();
            const level = document.getElementById("skillLevel")?.value;
            
            if (!selectedValue || !tool || !level) {
                closeAddModal();
                return;
            }
            
            let category = "", name = "", subcategory = "";
            
            switch(selectedValue) {
                case "backend_lang": category = "backend"; name = "Backend-разработка"; subcategory = "Языки программирования"; break;
                case "backend_db": category = "backend"; name = "Backend-разработка"; subcategory = "Базы данных"; break;
                case "backend_infra": category = "backend"; name = "Backend-разработка"; subcategory = "Инфраструктура"; break;
                case "mobile_lang": category = "mobile"; name = "Мобильная разработка"; subcategory = "Языки программирования"; break;
                case "mobile_framework": category = "mobile"; name = "Мобильная разработка"; subcategory = "Фреймворки"; break;
                case "frontend_lang": category = "frontend"; name = "Frontend-разработка"; subcategory = "Языки программирования"; break;
                case "frontend_framework": category = "frontend"; name = "Frontend-разработка"; subcategory = "Фреймворки"; break;
                default: closeAddModal(); return;
            }
            
            const newId = Math.max(...skillsData.map(s => s.id), 0) + 1;
            skillsData.push({ id: newId, category, name, subcategory, tool, level });
            closeAddModal();
            renderTable();
        });
    }
    
    // ========== МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ ==========
    const editModal = document.getElementById("editSkillModal");
    const editCloseBtn = document.querySelector(".edit-modal-close");
    const editCancelBtn = document.querySelector(".edit-cancel");
    const editForm = document.getElementById("editSkillForm");
    
    function openEditModal(skill) {
        currentEditId = skill.id;
        const categorySelect = document.getElementById("editSkillCategorySelect");
        const toolSelect = document.getElementById("editSkillToolSelect");
        const levelSelect = document.getElementById("editSkillLevelSelect");
        
        let categoryValue = "";
        switch(skill.subcategory) {
            case "Языки программирования": categoryValue = "backend_lang"; break;
            case "Базы данных": categoryValue = "backend_db"; break;
            case "Инфраструктура": categoryValue = "backend_infra"; break;
            case "Фреймворки": categoryValue = skill.name === "Мобильная разработка" ? "mobile_framework" : "frontend_framework"; break;
            default:
                if (skill.name === "Мобильная разработка" && skill.subcategory === "Языки программирования") categoryValue = "mobile_lang";
                else if (skill.name === "Frontend-разработка") categoryValue = skill.subcategory === "Языки программирования" ? "frontend_lang" : "frontend_framework";
                else if (skill.name === "Backend-разработка") {
                    if (skill.subcategory === "Языки программирования") categoryValue = "backend_lang";
                    else if (skill.subcategory === "Базы данных") categoryValue = "backend_db";
                    else if (skill.subcategory === "Инфраструктура") categoryValue = "backend_infra";
                }
        }
        
        if (categorySelect) categorySelect.value = categoryValue;
        if (toolSelect) toolSelect.value = skill.tool.split(" (")[0];
        if (levelSelect) levelSelect.value = skill.level;
        editModal.classList.add("show");
    }
    
    function closeEditModal() {
        editModal.classList.remove("show");
        currentEditId = null;
        if (editForm) editForm.reset();
    }
    
    if (editCloseBtn) editCloseBtn.addEventListener("click", closeEditModal);
    if (editCancelBtn) editCancelBtn.addEventListener("click", closeEditModal);
    
    if (editModal) {
        editModal.addEventListener("click", (e) => {
            if (e.target === editModal) closeEditModal();
        });
    }
    
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const categorySelect = document.getElementById("editSkillCategorySelect");
            const selectedValue = categorySelect?.value;
            const tool = document.getElementById("editSkillToolSelect")?.value;
            const level = document.getElementById("editSkillLevelSelect")?.value;
            
            if (!selectedValue || !tool || !level) { closeEditModal(); return; }
            
            let category = "", name = "", subcategory = "";
            switch(selectedValue) {
                case "backend_lang": category = "backend"; name = "Backend-разработка"; subcategory = "Языки программирования"; break;
                case "backend_db": category = "backend"; name = "Backend-разработка"; subcategory = "Базы данных"; break;
                case "backend_infra": category = "backend"; name = "Backend-разработка"; subcategory = "Инфраструктура"; break;
                case "mobile_lang": category = "mobile"; name = "Мобильная разработка"; subcategory = "Языки программирования"; break;
                case "mobile_framework": category = "mobile"; name = "Мобильная разработка"; subcategory = "Фреймворки"; break;
                case "frontend_lang": category = "frontend"; name = "Frontend-разработка"; subcategory = "Языки программирования"; break;
                case "frontend_framework": category = "frontend"; name = "Frontend-разработка"; subcategory = "Фреймворки"; break;
                default: closeEditModal(); return;
            }
            
            if (currentEditId) {
                const skillIndex = skillsData.findIndex(s => s.id === currentEditId);
                if (skillIndex !== -1) {
                    skillsData[skillIndex].category = category;
                    skillsData[skillIndex].name = name;
                    skillsData[skillIndex].subcategory = subcategory;
                    skillsData[skillIndex].tool = tool;
                    skillsData[skillIndex].level = level;
                    renderTable();
                }
            }
            closeEditModal();
        });
    }
    
    renderTable();
}