// src/config.js

const API_CONFIG = {
    // Базовый URL бэкенда (замените на реальный, когда даст бекендер)
    BASE_URL: 'https://localhost:7020',
    
    // Эндпоинты для авторизации
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
    },
    
    // Эндпоинты для пользователей
    USERS: {
        PROFILE: '/users/profile',
        UPDATE: '/users/update',
    },
    
    // Эндпоинты для навыков
    SKILLS: {
        LIST: '/skills',
        CREATE: '/skills/create',
        UPDATE: '/skills/update',
        DELETE: '/skills/delete',
    },
    
    // Настройки запросов
    HEADERS: {
        'Content-Type': 'application/json',
    },
    
    // Таймаут запроса (в миллисекундах)
    TIMEOUT: 10000,
};

export default API_CONFIG;