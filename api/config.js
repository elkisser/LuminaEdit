// Netlify Function para exponer la API key de forma segura
exports.handler = async (event, context) => {
    console.log('🔧 Config endpoint llamado:', event.httpMethod, event.path);
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Solo permitir GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('🔑 API Key disponible:', !!process.env.REMOVE_BG_API_KEY);
        
        // Retornar la configuración
        const config = {
            hasApiKey: !!process.env.REMOVE_BG_API_KEY,
            apiKey: process.env.REMOVE_BG_API_KEY || null,
            timestamp: new Date().toISOString()
        };

        console.log('📤 Enviando configuración:', { hasApiKey: config.hasApiKey, timestamp: config.timestamp });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(config)
        };
    } catch (error) {
        console.error('❌ Error en config endpoint:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};
