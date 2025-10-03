// Script de build para Netlify
// Este script reemplaza las variables de entorno en config.js

const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando build para Netlify...');

// Leer el archivo de configuración
const configPath = path.join(__dirname, 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');

// Reemplazar la API key con la variable de entorno
const apiKey = process.env.REMOVE_BG_API_KEY || 'null';
configContent = configContent.replace(
    'REMOVE_BG_API_KEY: null,',
    `REMOVE_BG_API_KEY: '${apiKey}',`
);

// Escribir el archivo actualizado
fs.writeFileSync(configPath, configContent);

console.log('✅ Build completado. API key configurada:', !!process.env.REMOVE_BG_API_KEY);
