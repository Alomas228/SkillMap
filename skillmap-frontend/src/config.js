// src/config.js

const API_CONFIG = {
    // Лучше оставить пустым.
    // Тогда запросы идут на тот же домен:
    // /api/auth/login, /api/me/dashboard и т.д.
    BASE_URL: "",

    AUTH: {
        LOGIN: "/api/auth/login",
        LOGOUT: "/api/auth/logout",
        ME: "/api/auth/me",
    },

    ME: {
        DASHBOARD: "/api/me/dashboard",
        SKILLS: "/api/me/skills",
    },

    USERS: {
        LIST: "/api/users",
        CREATE: "/api/users",
    },

    SKILLS: {
        LIST: "/api/skills",
        AVAILABLE: "/api/skills/available",
        CREATE: "/api/skills",
        ADD_TO_ME: "/api/skills/my",
        REMOVE_FROM_ME: "/api/skills/my",
        UPDATE_MY_LEVEL: "/api/skills/my",
    },

    HEADERS: {
        "Content-Type": "application/json",
    },
};

export default API_CONFIG;