// Función de Netlify para manejar la API de Remove.bg de forma segura
exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    // Manejar preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' }),
        };
    }

    try {
        // Obtener la API key desde las variables de entorno de Netlify
        const apiKey = process.env.REMOVE_BG_API_KEY;
        
        if (!apiKey || apiKey === '') {
            console.error('❌ API key no configurada en Netlify');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'API key no configurada',
                    message: 'La API key de Remove.bg no está configurada en Netlify'
                }),
            };
        }

        // Parsear el body de la request
        const body = JSON.parse(event.body);
        
        if (!body.imageData) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Datos de imagen requeridos' }),
            };
        }

        // Convertir base64 a blob para la API
        const imageBuffer = Buffer.from(body.imageData.split(',')[1], 'base64');
        
        // Crear FormData para la API de Remove.bg
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image_file', imageBuffer, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });
        
        // Configurar opciones adicionales si se proporcionan
        if (body.options) {
            if (body.options.size) form.append('size', body.options.size);
            if (body.options.type) form.append('type', body.options.type);
            if (body.options.format) form.append('format', body.options.format);
        }

        // Hacer la petición a Remove.bg
        const fetch = require('node-fetch');
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey,
                ...form.getHeaders()
            },
            body: form
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error de Remove.bg API:', response.status, errorText);
            
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Error de la API de Remove.bg',
                    details: errorText,
                    status: response.status
                }),
            };
        }

        // Obtener la imagen procesada
        const resultBuffer = await response.buffer();
        const resultBase64 = resultBuffer.toString('base64');
        
        console.log('✅ Imagen procesada exitosamente');
        
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                imageData: `data:image/png;base64,${resultBase64}`,
                size: resultBuffer.length
            }),
        };

    } catch (error) {
        console.error('❌ Error en la función:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Error interno del servidor',
                message: error.message
            }),
        };
    }
};
