# 🎨 LuminaEdit - Removedor de Fondos con IA

<div align="center">
  <img src="https://img.shields.io/badge/IA-2025-yellow?style=for-the-badge&logo=artificial-intelligence" alt="IA 2025">
  <img src="https://img.shields.io/badge/WebGL-Acelerado-green?style=for-the-badge&logo=webgl" alt="WebGL Acelerado">
  <img src="https://img.shields.io/badge/Responsive-Mobile-blue?style=for-the-badge&logo=mobile" alt="Responsive Mobile">
</div>

<br>

**LuminaEdit** es una aplicación web avanzada de eliminación de fondos potenciada por inteligencia artificial. Utiliza algoritmos de vanguardia y APIs profesionales para ofrecer resultados de calidad profesional directamente en tu navegador.

## ✨ Características Principales

### 🎯 **Eliminación de Fondos Inteligente**
- **IA Profesional**: Integración con Remove.bg API para resultados perfectos
- **Algoritmo Local Mejorado**: Fallback robusto con detección de objetos principales
- **Preservación de Objetos**: Identifica y preserva automáticamente objetos principales
- **Suavizado Inteligente**: Aplicación de máscaras con suavizado gaussiano

### 📱 **Experiencia Móvil Completa**
- **Captura de Cámara**: Acceso directo a la cámara del dispositivo móvil
- **Diseño Responsive**: Adaptación perfecta a cualquier tamaño de pantalla
- **Interfaz Táctil**: Optimizada para dispositivos móviles
- **Detección Automática**: Solo muestra opciones de cámara en dispositivos móviles

### 🚀 **Tecnologías Avanzadas**
- **TensorFlow.js**: Procesamiento de IA en el navegador
- **WebGL**: Aceleración por hardware para máximo rendimiento
- **Tesseract.js**: OCR para futuras funcionalidades de texto
- **Canvas API**: Manipulación avanzada de imágenes

## 🛠️ Instalación y Uso

### Requisitos
- Navegador moderno con soporte para WebGL
- Conexión a internet (para API profesional)
- Dispositivo con cámara (opcional, para captura móvil)

### Instalación Local

#### Opción 1: Servidor Simple (Sin API)
```bash
# Clonar el repositorio
git clone https://github.com/elkisser/LuminaEdit.git

# Navegar al directorio
cd LuminaEdit

# Servir archivos (usando Python)
python -m http.server 8000
```

#### Opción 2: Con API Key (Recomendado)
```bash
# Clonar el repositorio
git clone https://github.com/elkisser/LuminaEdit.git

# Navegar al directorio
cd LuminaEdit

# Instalar dependencias
npm install

# Configurar API key en .env
echo "REMOVE_BG_API_KEY=tu_api_key_aqui" > .env

# Ejecutar servidor de desarrollo
npm run dev
```

## 🚀 Despliegue en Netlify

### Configuración de Variables de Entorno

1. **Crear cuenta en Netlify** y conectar tu repositorio
2. **Ir a Site Settings** → **Environment Variables**
3. **Agregar variable:**
   - **Key**: `REMOVE_BG_API_KEY`
   - **Value**: Tu API key de Remove.bg

### Pasos de Despliegue

```bash
# 1. Subir código a GitHub/GitLab
git add .
git commit -m "Preparar para despliegue en Netlify"
git push origin main

# 2. En Netlify:
# - Conectar repositorio
# - Configurar variables de entorno
# - Desplegar automáticamente
```

### Seguridad

- ✅ **API Key protegida**: Se usa variable de entorno
- ✅ **Archivos sensibles**: Incluidos en `.gitignore`
- ✅ **Headers de seguridad**: Configurados en `netlify.toml`

# O usando Node.js
npx serve .

# Abrir en navegador
# http://localhost:8000
```

### Uso en Producción
Simplemente sube los archivos a tu servidor web y accede a través de tu dominio.

## 🎮 Cómo Usar

### 1. **Cargar Imagen**
- **Subir Archivo**: Haz clic en "Subir Archivo" y selecciona tu imagen
- **Arrastrar y Soltar**: Arrastra tu imagen directamente a la zona designada
- **Capturar Foto** (Móviles): Usa la cámara de tu dispositivo móvil

### 2. **Procesar Imagen**
- La aplicación detecta automáticamente el modo "Eliminación de Fondo"
- Haz clic en "Procesar" para iniciar el análisis
- El sistema intentará usar la API profesional primero, luego el algoritmo local

### 3. **Descargar Resultado**
- Una vez procesada, puedes descargar la imagen sin fondo
- El resultado mantiene la transparencia (formato PNG)

## ⚙️ Configuración de API

Para obtener resultados de calidad profesional, configura la API de Remove.bg:

### 1. **Obtener API Key**
1. Visita [Remove.bg](https://www.remove.bg/api)
2. Crea una cuenta gratuita
3. Obtén tu API key

### 2. **Configurar en la Aplicación**
```javascript
// En app.js, línea ~2000, reemplaza:
const apiKey = 'TU_API_KEY_AQUI';

// Con tu API key real:
const apiKey = 'tu_api_key_real_aqui';
```

### 3. **Límites de la API Gratuita**
- **50 imágenes/mes** gratis
- **Resolución máxima**: 0.25 megapíxeles
- **Formato**: PNG con transparencia

## 🏗️ Arquitectura del Proyecto

```
FondoFuera/
├── index.html          # Interfaz principal
├── app.js             # Lógica de la aplicación
├── style.css          # Estilos personalizados
└── README.md          # Este archivo
```

### Componentes Principales

#### **LuminaEditEngine** (app.js)
- **Gestión de Imágenes**: Carga, procesamiento y descarga
- **Integración API**: Comunicación con Remove.bg
- **Algoritmos Locales**: Fallback para procesamiento sin API
- **Interfaz de Usuario**: Manejo de eventos y notificaciones

#### **Funcionalidades de Cámara**
- **Detección de Dispositivo**: Identifica móviles automáticamente
- **Acceso a Cámara**: getUserMedia API para captura
- **Modal Interactivo**: Interfaz para captura de fotos
- **Procesamiento**: Conversión de video a imagen

## 🔧 Algoritmos Implementados

### **Eliminación de Fondo Local**

#### 1. **Detección de Objetos Principales**
```javascript
// Identifica el objeto principal usando centro de masa
const centroMasa = this.calcularCentroMasaMejorado(data, width, height);
const regionInteres = this.crearRegionInteresInteligente(centroMasa, width, height);
```

#### 2. **Análisis de Colores**
```javascript
// Detecta colores dominantes del objeto
const coloresObjeto = this.detectarColoresObjetoMejorado(data, regionInteres);
```

#### 3. **Creación de Máscara**
```javascript
// Crea máscara basada en múltiples criterios
const mascara = this.crearMascaraInteligente(data, coloresObjeto, regionInteres);
```

#### 4. **Suavizado Final**
```javascript
// Aplica suavizado gaussiano para transiciones naturales
this.aplicarMascaraConSuavizado(data, mascara, width, height);
```

## 📱 Compatibilidad

### **Navegadores Soportados**
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### **Dispositivos**
- ✅ **Desktop**: Windows, macOS, Linux
- ✅ **Móviles**: iOS Safari, Android Chrome
- ✅ **Tablets**: iPad, Android tablets

### **Características Requeridas**
- WebGL 2.0
- Canvas API
- File API
- MediaDevices API (para cámara)

## 🚀 Rendimiento

### **Optimizaciones Implementadas**
- **Procesamiento Asíncrono**: No bloquea la interfaz
- **WebGL Acelerado**: Utiliza GPU para cálculos intensivos
- **Lazy Loading**: Carga de recursos bajo demanda
- **Compresión Inteligente**: Optimización automática de imágenes

### **Límites de Rendimiento**
- **Imágenes**: Hasta 10MB
- **Resolución**: Recomendado hasta 4K
- **Formato**: JPG, PNG, WebP, AVIF

## 🔒 Privacidad y Seguridad

### **Procesamiento Local**
- Las imágenes se procesan localmente cuando es posible
- No se almacenan en servidores externos
- Algoritmos locales funcionan sin conexión a internet

### **API Externa**
- Solo se envía a Remove.bg cuando se configura la API
- Remove.bg cumple con GDPR y políticas de privacidad
- Las imágenes se eliminan automáticamente después del procesamiento

## 🐛 Solución de Problemas

### **Problemas Comunes**

#### **"Error al procesar imagen"**
- Verifica que la imagen no exceda 10MB
- Asegúrate de que el formato sea compatible
- Intenta con una imagen más simple

#### **"API no disponible"**
- Verifica tu conexión a internet
- Confirma que la API key esté configurada correctamente
- El algoritmo local se activará automáticamente

#### **"Cámara no funciona"**
- Asegúrate de estar en un dispositivo móvil
- Permite el acceso a la cámara en tu navegador
- Verifica que tu navegador soporte getUserMedia

#### **"Resultado no es perfecto"**
- Para mejores resultados, configura la API de Remove.bg
- El algoritmo local es un fallback, no reemplaza la IA profesional
- Prueba con imágenes de mayor contraste

## 🤝 Contribuir

### **Cómo Contribuir**
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Áreas de Mejora**
- [ ] Mejorar algoritmo local de eliminación de fondo
- [ ] Implementar detección de texto (actualmente comentada)
- [ ] Añadir más opciones de procesamiento
- [ ] Optimizar rendimiento para imágenes grandes
- [ ] Añadir soporte para más formatos de imagen

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Remove.bg** por su API profesional de eliminación de fondos
- **TensorFlow.js** por el framework de IA en el navegador
- **Tesseract.js** por las capacidades de OCR
- **Tailwind CSS** por el framework de estilos

## 📞 Soporte

Si tienes problemas o preguntas:

1. **Revisa la documentación** en este README
2. **Consulta los issues** en GitHub
3. **Crea un nuevo issue** si no encuentras solución

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad de desarrolladores</p>
  <p>© 2025 LuminaEdit - Potenciado por IA</p>
</div>
