// Configuración pública para la aplicación
// Este archivo se puede personalizar para diferentes entornos

window.APP_CONFIG = {
    // Configuración de la API
    API_CONFIG: {
        // En producción, esto se sobrescribe por Netlify
        REMOVE_BG_API_KEY: 'null',
        
        // URLs de la API
        REMOVE_BG_URL: 'https://api.remove.bg/v1.0/removebg',
        
        // Configuración de fallback
        USE_LOCAL_ALGORITHM: true,
        LOCAL_ALGORITHM_TIMEOUT: 30000
    },
    
    // Configuración de la aplicación
    APP_CONFIG: {
        VERSION: '1.0.0',
        DEBUG: false,
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    }
};

// Función para obtener la API key desde variables de entorno de Netlify
window.getApiKey = function() {
    // En Netlify, las variables de entorno se pueden acceder de esta manera
    // pero solo si están configuradas correctamente
    return window.APP_CONFIG.API_CONFIG.REMOVE_BG_API_KEY;
};

console.log('🔧 Configuración de la aplicación cargada:', window.APP_CONFIG);
