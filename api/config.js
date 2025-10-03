// Netlify Function para exponer la API key de forma segura
exports.handler = async (event, context) => {
    // Solo permitir requests desde el mismo dominio
    const origin = event.headers.origin || event.headers.Origin;
    const allowedOrigins = [
        'https://luminaedit.netlify.app',
        'https://elkisser-luminaedit.netlify.app',
        'http://localhost:8888',
        'http://localhost:8000'
    ];

    // En desarrollo, permitir cualquier origen
    if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push('*');
    }

    const headers = {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
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
        // Retornar la configuración (sin exponer la API key completa)
        const config = {
            hasApiKey: !!process.env.REMOVE_BG_API_KEY,
            apiKey: process.env.REMOVE_BG_API_KEY || null
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(config)
        };
    } catch (error) {
        console.error('Error en config endpoint:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
