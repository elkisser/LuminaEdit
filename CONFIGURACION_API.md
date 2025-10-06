# 🔧 Configuración de API Key para Producción

## 🚨 Problema Identificado

La API key de Remove.bg no funciona en producción porque:

1. **Variable de entorno vacía**: En `netlify.toml` la variable está vacía
2. **Proceso de build incorrecto**: El build.js genera `'null'` en lugar de `null`
3. **Validación insuficiente**: No valida el string `'null'`
4. **Exposición de API key**: La API key se expone en el cliente

## ✅ Solución Implementada

### 1. Función de Netlify Segura
- ✅ Creada función `/netlify/functions/remove-bg.js`
- ✅ API key manejada de forma segura en el servidor
- ✅ No se expone en el cliente

### 2. Cliente Actualizado
- ✅ `app.js` actualizado para usar la función de Netlify
- ✅ Nuevas funciones auxiliares para base64
- ✅ Mejor manejo de errores

### 3. Dependencias Agregadas
- ✅ `node-fetch` para peticiones HTTP
- ✅ `form-data` para FormData en Node.js

## 🛠️ Pasos para Configurar en Producción

### Paso 1: Configurar API Key en Netlify

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio
3. Ve a **Site settings** > **Environment variables**
4. Agrega una nueva variable:
   - **Key**: `REMOVE_BG_API_KEY`
   - **Value**: Tu API key real de Remove.bg
   - **Scopes**: Production, Deploy previews, Branch deploys

### Paso 2: Obtener API Key de Remove.bg

1. Ve a [https://www.remove.bg/api](https://www.remove.bg/api)
2. Crea una cuenta o inicia sesión
3. Ve a la sección de API
4. Copia tu API key

### Paso 3: Desplegar

1. Haz commit de los cambios
2. Push a tu repositorio
3. Netlify desplegará automáticamente
4. La función estará disponible en `/.netlify/functions/remove-bg`

## 🔍 Verificación

### En el navegador (F12 > Console):
```javascript
// Verificar que la función funciona
fetch('/.netlify/functions/remove-bg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData: 'data:image/jpeg;base64,test' })
})
.then(r => r.json())
.then(console.log)
```

### Logs de Netlify:
- Ve a **Functions** en tu dashboard
- Revisa los logs de la función `remove-bg`
- Deberías ver mensajes de éxito o error

## 🚨 Troubleshooting

### Error: "API key no configurada"
- ✅ Verifica que la variable esté configurada en Netlify
- ✅ Asegúrate de que el scope incluya "Production"
- ✅ Reinicia el deploy después de agregar la variable

### Error: "CORS"
- ✅ La función ya incluye headers CORS
- ✅ Verifica que la URL sea correcta

### Error: "Function not found"
- ✅ Verifica que el archivo esté en `/netlify/functions/remove-bg.js`
- ✅ Verifica que las dependencias estén en `package.json`

## 📊 Ventajas de la Nueva Implementación

1. **Seguridad**: API key nunca se expone al cliente
2. **Confiabilidad**: Manejo de errores mejorado
3. **Debugging**: Logs detallados en Netlify
4. **Escalabilidad**: Fácil de mantener y actualizar
5. **CORS**: Configurado correctamente

## 🔄 Rollback (si es necesario)

Si necesitas volver al método anterior:

1. Revertir cambios en `app.js`
2. Eliminar `/netlify/functions/remove-bg.js`
3. Configurar la API key en el build process
4. Actualizar `build.js` para manejar valores vacíos correctamente
