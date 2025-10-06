// LuminaEdit Pro 2025 - Motor IA Avanzado
class LuminaEditEngine {
    constructor() {
        this.imagenOriginal = null;
        this.imagenProcesada = null;
        this.modoActual = 'fondo';
        this.trabajadorTesseract = null;
        this.estaProcesando = false;
        this.iaInicializada = false;
        this.modeloIA = null;
        
        this.elementos = {
            // Elementos de UI
            inputImagen: document.getElementById('input-imagen'),
            btnCargarImagen: document.getElementById('btn-cargar-imagen'),
            btnCapturarImagen: document.getElementById('btn-capturar-imagen'),
            zonaArrastrar: document.getElementById('zona-arrastrar'),
            infoArchivo: document.getElementById('info-archivo'),
            nombreArchivo: document.getElementById('nombre-archivo'),
            tamanoArchivo: document.getElementById('tamano-archivo'),
            dimensionesArchivo: document.getElementById('dimensiones-archivo'),
            btnAnalizarImagen: document.getElementById('btn-analizar-imagen'),
            btnRemoverImagen: document.getElementById('btn-remover-imagen'),
            toggleModo: document.getElementById('toggle-modo'),
            tituloModo: document.getElementById('titulo-modo'),
            descripcionModo: document.getElementById('descripcion-modo'),
            btnProcesar: document.getElementById('btn-procesar'),
            textoProcesar: document.getElementById('texto-procesar'),
            cargandoProcesar: document.getElementById('cargando-procesar'),
            contenedorPreview: document.getElementById('contenedor-preview'),
            previewOriginal: document.getElementById('preview-original'),
            placeholderOriginal: document.getElementById('placeholder-original'),
            previewResultado: document.getElementById('preview-resultado'),
            placeholderResultado: document.getElementById('placeholder-resultado'),
            cargandoResultado: document.getElementById('cargando-resultado'),
            barraProgreso: document.getElementById('barra-progreso'),
            btnDescargar: document.getElementById('btn-descargar'),
            cargandoIA: document.getElementById('cargando-ia'),
            statusTensorflow: document.getElementById('status-tensorflow'),
            statusWebGL: document.getElementById('status-webgl'),
            statusTesseract: document.getElementById('status-tesseract')
        };

        this.inicializar();
    }

    async inicializar() {
        try {
            console.log('🚀 Inicializando LuminaEdit Pro 2025...');
            
            // Configurar TensorFlow.js con WebGL
            await this.inicializarTensorFlow();
            
            // Inicializar Tesseract con manejo robusto de errores
            await this.inicializarTesseractAvanzado();
            
            // Configurar eventos de UI
            this.configurarEventos();
            
            // Ocultar carga de IA
            setTimeout(() => {
                this.elementos.cargandoIA.style.display = 'none';
            }, 1000);
            
            this.iaInicializada = true;
            console.log('✅ LuminaEdit Pro 2025 inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error crítico en inicialización:', error);
            this.mostrarNotificacion('Error en inicialización del motor IA. Recarga la página.', 'error');
        }
    }

    async inicializarTensorFlow() {
        try {
            // Configurar backend WebGL
            await tf.setBackend('webgl');
            this.elementos.statusWebGL.textContent = 'GPU Activada';
            this.elementos.statusWebGL.className = 'text-green-400 font-bold';
            
            // Verificar capacidades WebGL
            const gl = tf.backend().gpgpu.gl;
            const extension = gl.getExtension('WEBGL_color_buffer_float');
            if (extension) {
                console.log('✅ WebGL avanzado activado');
            }
            
            this.elementos.statusTensorflow.textContent = 'Listo';
            this.elementos.statusTensorflow.className = 'text-green-400 font-bold';
            
        } catch (error) {
            console.warn('WebGL no disponible, usando CPU:', error);
            await tf.setBackend('cpu');
            this.elementos.statusWebGL.textContent = 'CPU';
            this.elementos.statusWebGL.className = 'text-yellow-400 font-bold';
        }
    }

    async inicializarTesseractAvanzado() {
        try {
            console.log('🔧 Inicializando Tesseract OCR...');
            
            // Crear worker con configuración optimizada
            this.trabajadorTesseract = await Tesseract.createWorker('eng+spa', 1, {
                logger: progress => {
                    if (progress.status === 'initializing tesseract') {
                        this.elementos.statusTesseract.textContent = 'Inicializando...';
                    } else if (progress.status === 'loading language traineddata') {
                        this.elementos.statusTesseract.textContent = 'Cargando idiomas...';
                    } else if (progress.status === 'initialized') {
                        this.elementos.statusTesseract.textContent = 'Listo';
                        this.elementos.statusTesseract.className = 'text-green-400 font-bold';
                    }
                },
                errorHandler: error => {
                    console.warn('Error en Tesseract:', error);
                    this.elementos.statusTesseract.textContent = 'Error';
                    this.elementos.statusTesseract.className = 'text-red-400 font-bold';
                }
            });

            // Configurar parámetros optimizados para 2025
            await this.trabajadorTesseract.setParameters({
                tessedit_pageseg_mode: Tesseract.PSM.AUTO,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%&*()_+-=[]{}|;:,.<>?/~`',
                preserve_interword_spaces: '1',
                tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
            });

            console.log('✅ Tesseract OCR inicializado correctamente');

        } catch (error) {
            console.error('❌ Error inicializando Tesseract:', error);
            this.elementos.statusTesseract.textContent = 'Falló';
            this.elementos.statusTesseract.className = 'text-red-400 font-bold';
            
            // Crear un worker simulado para permitir funcionalidad básica
            this.trabajadorTesseract = {
                recognize: async () => ({ data: { words: [] } }),
                terminate: async () => {}
            };
        }
    }

    configurarEventos() {
        // Eventos de carga de imagen
        this.elementos.btnCargarImagen.addEventListener('click', () => {
            this.elementos.inputImagen.removeAttribute('capture');
            this.elementos.inputImagen.click();
        });
        
        this.elementos.btnCapturarImagen.addEventListener('click', () => {
            this.capturarDesdeCamara();
        });
        
        this.elementos.inputImagen.addEventListener('change', (e) => this.manejarSeleccionImagen(e));
        
        // Drag & drop
        this.elementos.zonaArrastrar.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elementos.zonaArrastrar.classList.add('border-yellow-400', 'bg-gray-750');
        });
        
        this.elementos.zonaArrastrar.addEventListener('dragleave', () => {
            this.elementos.zonaArrastrar.classList.remove('border-yellow-400', 'bg-gray-750');
        });
        
        this.elementos.zonaArrastrar.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elementos.zonaArrastrar.classList.remove('border-yellow-400', 'bg-gray-750');
            if (e.dataTransfer.files.length > 0) {
                this.manejarArchivo(e.dataTransfer.files[0]);
            }
        });
        
        // Botones de acción
        this.elementos.btnAnalizarImagen.addEventListener('click', () => this.analizarImagen());
        this.elementos.btnRemoverImagen.addEventListener('click', () => this.removerImagen());
        this.elementos.toggleModo.addEventListener('change', () => this.cambiarModoProcesamiento());
        this.elementos.btnProcesar.addEventListener('click', () => this.procesarImagen());
        this.elementos.btnDescargar.addEventListener('click', () => this.descargarResultado());
    }

    async manejarSeleccionImagen(evento) {
        const archivo = evento.target.files[0];
        if (!archivo) return;
        await this.manejarArchivo(archivo);
    }

    async manejarArchivo(archivo) {
        try {
            // Validaciones mejoradas
            if (!archivo.type.startsWith('image/')) {
                this.mostrarNotificacion('❌ Solo se permiten archivos de imagen', 'error');
                return;
            }
            
            if (archivo.size > 10 * 1024 * 1024) {
                this.mostrarNotificacion('❌ La imagen no debe superar los 10MB', 'error');
                return;
            }
            
            // Mostrar información del archivo
            this.mostrarInfoArchivo(archivo);
            
            // Cargar imagen
            await this.cargarImagen(archivo);
            
        } catch (error) {
            console.error('Error manejando archivo:', error);
            this.mostrarNotificacion('❌ Error al cargar la imagen', 'error');
        }
    }

    mostrarInfoArchivo(archivo) {
        this.elementos.nombreArchivo.textContent = archivo.name;
        this.elementos.tamanoArchivo.textContent = this.formatearTamanoArchivo(archivo.size);
        this.elementos.infoArchivo.classList.remove('hidden');
    }

    async cargarImagen(archivo) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader();
            
            lector.onload = (e) => {
                this.imagenOriginal = new Image();
                
                this.imagenOriginal.onload = () => {
                    this.elementos.dimensionesArchivo.textContent = 
                        `${this.imagenOriginal.width} × ${this.imagenOriginal.height}px`;
                    this.mostrarImagenOriginal();
                    this.habilitarProcesamiento();
                    resolve();
                };
                
                this.imagenOriginal.onerror = () => {
                    reject(new Error('Error al cargar la imagen'));
                };
                
                this.imagenOriginal.src = e.target.result;
            };
            
            lector.onerror = () => {
                reject(new Error('Error al leer el archivo'));
            };
            
            lector.readAsDataURL(archivo);
        });
    }

    mostrarImagenOriginal() {
        this.elementos.previewOriginal.src = this.imagenOriginal.src;
        this.elementos.placeholderOriginal.classList.add('hidden');
        this.ajustarCanvasResultado();
        this.elementos.contenedorPreview.classList.remove('hidden');
    }

    ajustarCanvasResultado() {
        const maxSize = 1200;
        let { width, height } = this.imagenOriginal;
        
        // Mantener relación de aspecto
        if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
        }
        
        const canvas = this.elementos.previewResultado;
        canvas.width = width;
        canvas.height = height;
        
        // Configurar calidad de renderizado
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }

    habilitarProcesamiento() {
        this.elementos.btnProcesar.disabled = false;
    }

    cambiarModoProcesamiento() {
        const nuevoModo = this.elementos.toggleModo.checked ? 'fondo' : 'texto';
        
        // Si intenta cambiar a modo texto, mostrar alerta y revertir
        if (nuevoModo === 'texto') {
            this.mostrarAvisoModoTexto();
            return; // No cambiar el modo
        }
        
        // Solo permitir modo fondo
        this.modoActual = 'fondo';
        this.elementos.toggleModo.checked = true; // Forzar que esté activado
        
        this.elementos.tituloModo.textContent = 'Eliminación de Fondo IA';
        this.elementos.descripcionModo.textContent = 
            'Elimina fondos de forma inteligente preservando objetos principales con precisión profesional.';
    }

    async procesarImagen() {
        if (!this.imagenOriginal || this.estaProcesando || !this.iaInicializada) return;
        
        this.estaProcesando = true;
        this.mostrarInterfazProcesamiento();
        
        try {
            // Simular progreso
            this.simularProgreso();
            
            if (this.modoActual === 'fondo') {
                await this.procesarEliminacionFondo();
            } else {
                // Función de texto temporalmente deshabilitada
                this.mostrarAvisoModoTexto();
            }
            
            this.mostrarNotificacion('✅ Imagen procesada con éxito', 'exito');
            
        } catch (error) {
            console.error('Error en procesamiento:', error);
            this.mostrarNotificacion('❌ Error en procesamiento. Intenta con otra imagen.', 'error');
        } finally {
            this.ocultarInterfazProcesamiento();
            this.estaProcesando = false;
        }
    }

    mostrarInterfazProcesamiento() {
        this.elementos.textoProcesar.classList.add('hidden');
        this.elementos.cargandoProcesar.classList.remove('hidden');
        this.elementos.btnProcesar.disabled = true;
        this.elementos.cargandoResultado.classList.remove('hidden');
        this.elementos.placeholderResultado.classList.add('hidden');
    }

    ocultarInterfazProcesamiento() {
        this.elementos.textoProcesar.classList.remove('hidden');
        this.elementos.cargandoProcesar.classList.add('hidden');
        this.elementos.btnProcesar.disabled = false;
        this.elementos.cargandoResultado.classList.add('hidden');
    }

    simularProgreso() {
        let progreso = 0;
        const intervalo = setInterval(() => {
            if (progreso >= 100) {
                clearInterval(intervalo);
                return;
            }
            progreso += Math.random() * 15;
            if (progreso > 100) progreso = 100;
            this.elementos.barraProgreso.style.width = `${progreso}%`;
        }, 200);
    }

    async procesarEliminacionFondo() {
        console.log('🎨 Procesando eliminación de fondo con IA profesional...');
        
        try {
            // Intentar usar API profesional primero
            console.log('🚀 Intentando usar API profesional...');
            const resultadoAPI = await this.procesarConAPIProfesional();
            if (resultadoAPI) {
                console.log('✅ API profesional exitosa');
                this.imagenProcesada = resultadoAPI;
                return;
            } else {
                console.log('⚠️ API profesional falló, usando algoritmo local');
            }
        } catch (error) {
            console.warn('❌ API profesional no disponible, usando algoritmo local:', error);
        }
        
        // Fallback a algoritmo local mejorado
        console.log('🔄 Usando algoritmo local como fallback...');
        await this.procesarEliminacionFondoLocal();
    }

    async procesarConAPIProfesional() {
        console.log('🚀 Usando API profesional de eliminación de fondo...');
        
        // Convertir imagen a base64 para enviar a la función de Netlify
        const imageData = await this.convertirImagenABase64();
        
        try {
            console.log('📤 Enviando imagen a función de Netlify...');
            
            const response = await fetch('/.netlify/functions/remove-bg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: imageData,
                    options: {
                        size: 'auto',
                        format: 'png'
                    }
                })
            });
            
            console.log('📥 Respuesta de función:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error de función:', errorData);
                throw new Error(`Función error: ${response.status} - ${errorData.message || errorData.error}`);
            }
            
            const result = await response.json();
            console.log('📦 Imagen procesada recibida, tamaño:', result.size, 'bytes');
            
            // Convertir base64 a imagen
            const resultImage = await this.base64ToImage(result.imageData);
            console.log('🖼️ Imagen convertida, dimensiones:', resultImage.width, 'x', resultImage.height);
            
            // Dibujar resultado en canvas
            const canvas = this.elementos.previewResultado;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(resultImage, 0, 0, canvas.width, canvas.height);
            
            console.log('✅ Eliminación de fondo exitosa con API profesional');
            return canvas;
            
        } catch (error) {
            console.error('❌ Error con API profesional:', error);
            return null;
        }
    }

    async convertirImagenABlob() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.imagenOriginal.width;
            canvas.height = this.imagenOriginal.height;
            
            ctx.drawImage(this.imagenOriginal, 0, 0);
            
            canvas.toBlob(resolve, 'image/png');
        });
    }

    async blobToImage(blob) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = URL.createObjectURL(blob);
        });
    }

    async convertirImagenABase64() {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.imagenOriginal.width;
            canvas.height = this.imagenOriginal.height;
            
            ctx.drawImage(this.imagenOriginal, 0, 0);
            
            const base64 = canvas.toDataURL('image/jpeg', 0.9);
            resolve(base64);
        });
    }

    async base64ToImage(base64Data) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = base64Data;
        });
    }

    async procesarEliminacionFondoLocal() {
        console.log('🎨 Procesando eliminación de fondo con algoritmo local mejorado...');
        
        const canvas = this.elementos.previewResultado;
        const ctx = canvas.getContext('2d');
        
        // Dibujar imagen original
        ctx.drawImage(this.imagenOriginal, 0, 0, canvas.width, canvas.height);
        
        // Usar algoritmo local mejorado
        await this.aplicarAlgoritmoLocalMejorado(ctx, canvas.width, canvas.height);
        
        this.imagenProcesada = canvas;
    }

    async aplicarAlgoritmoLocalMejorado(ctx, width, height) {
        console.log('🔧 Aplicando algoritmo local simplificado...');
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Algoritmo simplificado y más efectivo
        this.aplicarEliminacionFondoSimple(data, width, height);
        
        ctx.putImageData(imageData, 0, 0);
    }

    aplicarEliminacionFondoSimple(data, width, height) {
        console.log('🎯 Aplicando eliminación de fondo simple...');
        
        // Encontrar el centro de la imagen
        const centroX = Math.floor(width / 2);
        const centroY = Math.floor(height / 2);
        const radioMaximo = Math.min(width, height) * 0.4;
        
        // Analizar colores en el centro
        const coloresObjeto = this.obtenerColoresCentro(data, width, height, centroX, centroY, radioMaximo);
        console.log('🎨 Colores del objeto encontrados:', coloresObjeto.length);
        
        // Aplicar eliminación basada en colores
        for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;
            const y = Math.floor(pixelIndex / width);
            const x = pixelIndex % width;
            
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calcular distancia al centro
            const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
            
            let esObjeto = false;
            
            // 1. Si está cerca del centro, probablemente es objeto
            if (distancia <= radioMaximo) {
                esObjeto = true;
            }
            
            // 2. Si coincide con colores del objeto, es objeto
            const coincideConObjeto = coloresObjeto.some(color => 
                this.esColorSimilar(r, g, b, color.r, color.g, color.b, 40)
            );
            if (coincideConObjeto) {
                esObjeto = true;
            }
            
            // 3. Si no es color de fondo típico, podría ser objeto
            if (!this.esColorTipicoFondo(r, g, b)) {
                const saturacion = this.calcularSaturacion(r, g, b);
                if (saturacion > 0.2) {
                    esObjeto = true;
                }
            }
            
            // Aplicar resultado
            if (esObjeto) {
                data[i + 3] = 255; // Mantener opaco
            } else {
                data[i + 3] = 0; // Hacer transparente
            }
        }
        
        console.log('✅ Eliminación de fondo simple completada');
    }

    obtenerColoresCentro(data, width, height, centroX, centroY, radio) {
        const colores = new Map();
        
        for (let y = Math.max(0, centroY - radio); y < Math.min(height, centroY + radio); y++) {
            for (let x = Math.max(0, centroX - radio); x < Math.min(width, centroX + radio); x++) {
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                
                if (distancia <= radio) {
                    const pixelIndex = (y * width + x) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    
                    // Solo considerar colores que no son fondo
                    if (!this.esColorTipicoFondo(r, g, b)) {
                        const colorKey = `${Math.floor(r/16)}-${Math.floor(g/16)}-${Math.floor(b/16)}`;
                        colores.set(colorKey, (colores.get(colorKey) || 0) + 1);
                    }
                }
            }
        }
        
        // Retornar los colores más frecuentes
        return Array.from(colores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([colorKey, frecuencia]) => {
                const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 16 + 8);
                return { r, g, b, frecuencia };
            });
    }

    async detectarObjetosPrincipalesMejorado(data, width, height) {
        console.log('👥 Detectando objetos principales (algoritmo mejorado)...');
        const mascara = new Uint8Array(data.length / 4);
        
        // 1. Encontrar centro de masa de colores no-fondo
        const centroMasa = this.calcularCentroMasaMejorado(data, width, height);
        console.log('📍 Centro de masa mejorado:', centroMasa);
        
        // 2. Crear región de interés más inteligente
        const regionInteres = this.crearRegionInteresInteligente(centroMasa, width, height);
        
        // 3. Detectar colores del objeto principal
        const coloresObjeto = this.detectarColoresObjetoMejorado(data, width, height, regionInteres);
        
        // 4. Crear máscara basada en colores y posición
        await this.crearMascaraInteligente(data, mascara, width, height, centroMasa, coloresObjeto, regionInteres);
        
        return mascara;
    }

    calcularCentroMasaMejorado(data, width, height) {
        let sumaX = 0, sumaY = 0, pesoTotal = 0;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                // Peso basado en características del objeto
                const luminancia = this.getLuminancia(data, pixelIndex);
                const saturacion = this.calcularSaturacion(r, g, b);
                
                // Píxeles que probablemente son objeto
                let peso = 0;
                
                // Colores vibrantes (como el naranja de Goku)
                if (saturacion > 0.3) peso += 100;
                
                // Luminancia media (no muy oscuro ni muy claro)
                if (luminancia > 40 && luminancia < 200) peso += 50;
                
                // No es color de fondo típico
                if (!this.esColorTipicoFondo(r, g, b)) peso += 30;
                
                // Bonus por estar en el centro de la imagen
                const distanciaAlCentro = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
                const distanciaMaxima = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
                const factorCentro = 1 - (distanciaAlCentro / distanciaMaxima);
                peso += factorCentro * 20;
                
                sumaX += x * peso;
                sumaY += y * peso;
                pesoTotal += peso;
            }
        }
        
        return {
            x: pesoTotal > 0 ? Math.round(sumaX / pesoTotal) : width / 2,
            y: pesoTotal > 0 ? Math.round(sumaY / pesoTotal) : height / 2
        };
    }

    crearRegionInteresInteligente(centroMasa, width, height) {
        // Crear región elíptica más natural que circular
        const radioX = Math.min(width, height) * 0.4;
        const radioY = Math.min(width, height) * 0.5; // Más alto que ancho para personas
        
        return {
            centroX: centroMasa.x,
            centroY: centroMasa.y,
            radioX: radioX,
            radioY: radioY
        };
    }

    detectarColoresObjetoMejorado(data, width, height, regionInteres) {
        const colores = new Map();
        const { centroX, centroY, radioX, radioY } = regionInteres;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Verificar si está en la región elíptica
                const distanciaX = Math.pow(x - centroX, 2) / Math.pow(radioX, 2);
                const distanciaY = Math.pow(y - centroY, 2) / Math.pow(radioY, 2);
                
                if (distanciaX + distanciaY <= 1) {
                    const pixelIndex = (y * width + x) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    
                    // Solo considerar colores que no son fondo
                    if (!this.esColorTipicoFondo(r, g, b)) {
                        const colorKey = `${Math.floor(r/8)}-${Math.floor(g/8)}-${Math.floor(b/8)}`;
                        colores.set(colorKey, (colores.get(colorKey) || 0) + 1);
                    }
                }
            }
        }
        
        // Retornar los colores más frecuentes
        return Array.from(colores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8) // Más colores para mejor detección
            .map(([colorKey, frecuencia]) => {
                const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 8 + 4);
                return { r, g, b, frecuencia };
            });
    }

    async crearMascaraInteligente(data, mascara, width, height, centroMasa, coloresObjeto, regionInteres) {
        const { centroX, centroY, radioX, radioY } = regionInteres;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                let puntuacion = 0;
                
                // 1. Distancia a la región de interés (elíptica)
                const distanciaX = Math.pow(x - centroX, 2) / Math.pow(radioX, 2);
                const distanciaY = Math.pow(y - centroY, 2) / Math.pow(radioY, 2);
                const enRegion = distanciaX + distanciaY <= 1.2; // Un poco más permisivo
                
                if (enRegion) {
                    puntuacion += 60;
                }
                
                // 2. Coincidencia con colores del objeto
                const coincideConObjeto = coloresObjeto.some(color => 
                    this.esColorSimilar(r, g, b, color.r, color.g, color.b, 35)
                );
                if (coincideConObjeto) {
                    puntuacion += 50;
                }
                
                // 3. No es color de fondo
                if (!this.esColorTipicoFondo(r, g, b)) {
                    puntuacion += 30;
                }
                
                // 4. Saturación apropiada
                const saturacion = this.calcularSaturacion(r, g, b);
                if (saturacion > 0.15) {
                    puntuacion += 25;
                }
                
                // 5. Luminancia apropiada
                const luminancia = this.getLuminancia(data, dataIndex);
                if (luminancia > 25 && luminancia < 235) {
                    puntuacion += 20;
                }
                
                mascara[pixelIndex] = Math.min(255, puntuacion);
            }
        }
    }

    aplicarMascaraConSuavizado(data, mascara, width, height) {
        console.log('🎨 Aplicando máscara con suavizado...');
        
        // Aplicar suavizado gaussiano a la máscara
        const mascaraSuavizada = this.suavizarMascara(mascara, width, height);
        
        // Aplicar máscara suavizada
        for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;
            const valorMascara = mascaraSuavizada[pixelIndex];
            
            if (valorMascara < 100) {
                // Píxeles con baja puntuación (probablemente fondo) se hacen transparentes
                data[i + 3] = 0;
            } else {
                // Píxeles del objeto se mantienen opacos
                data[i + 3] = 255;
            }
        }
        
        console.log('✅ Máscara aplicada correctamente');
    }

    suavizarMascara(mascara, width, height) {
        const mascaraSuavizada = new Uint8Array(mascara);
        const kernel = [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ];
        const divisor = 16;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pixelIndex = y * width + x;
                let suma = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const sampleIndex = (y + ky) * width + (x + kx);
                        suma += mascara[sampleIndex] * kernel[ky + 1][kx + 1];
                    }
                }
                
                mascaraSuavizada[pixelIndex] = Math.round(suma / divisor);
            }
        }
        
        return mascaraSuavizada;
    }

    esImagenCompleja(analisis) {
        // Detectar si la imagen es compleja (como la de Dragon Ball)
        const tieneMuchosColores = analisis.coloresFrecuentes.length > 3;
        const tieneAltoContraste = analisis.tieneAltoContraste;
        const tieneColoresVibrantes = analisis.coloresFrecuentes.some(([colorKey, frecuencia]) => {
            const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 32 + 16);
            const saturacion = this.calcularSaturacion(r, g, b);
            return saturacion > 0.6 && frecuencia > 1000;
        });
        
        return tieneMuchosColores && (tieneAltoContraste || tieneColoresVibrantes);
    }

    calcularSaturacion(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
    }

    async aplicarSegmentacionCompleja(ctx, width, height, analisis) {
        try {
            console.log('🎯 Aplicando segmentación compleja con detección de contornos...');
            
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // Usar el mismo algoritmo de detección de contornos pero con parámetros más permisivos
            const bordes = await this.detectarBordesReales(data, width, height);
            console.log('🔍 Bordes detectados (modo complejo)');
            
            // Encontrar objetos con criterios más permisivos
            const objetos = await this.encontrarObjetosPorBordesComplejo(data, width, height, bordes);
            console.log('👥 Objetos encontrados (modo complejo):', objetos.length);
            
            // Crear máscara con criterios más permisivos
            const mascaraObjeto = await this.crearMascaraPorContornosCompleja(data, width, height, objetos);
            
            // Aplicar máscara (preservar objeto, eliminar fondo)
            this.aplicarMascaraObjeto(data, mascaraObjeto);
            
            ctx.putImageData(imageData, 0, 0);
            
        } catch (error) {
            console.error('Error en segmentación compleja:', error);
            // Usar método de respaldo
            await this.aplicarSegmentacionSimple(ctx, width, height);
        }
    }

    async encontrarObjetosPorBordesComplejo(data, width, height, bordes) {
        console.log('👥 Encontrando objetos por bordes (modo complejo)...');
        const objetos = [];
        const visitado = new Array(width * height).fill(false);
        
        // Buscar regiones conectadas con umbral más permisivo
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                
                if (!visitado[pixelIndex] && bordes[pixelIndex] < 50) { // Umbral más permisivo
                    try {
                        const region = await this.encontrarRegionConectada(bordes, visitado, x, y, width, height, 50);
                        
                        if (region && region.length > 500) { // Umbral más bajo para regiones más pequeñas
                            objetos.push(region);
                            console.log(`📍 Objeto encontrado con ${region.length} píxeles`);
                        }
                    } catch (error) {
                        console.warn('Error en región conectada (complejo):', error);
                        continue;
                    }
                }
            }
        }
        
        // Si no se encontraron objetos, usar método de respaldo
        if (objetos.length === 0) {
            console.log('⚠️ No se encontraron objetos (complejo), usando método de respaldo...');
            return await this.encontrarObjetosRespaldo(data, width, height);
        }
        
        return objetos;
    }

    async crearMascaraPorContornosCompleja(data, width, height, objetos) {
        console.log('🎭 Creando máscara por contornos (modo complejo)...');
        const mascara = new Uint8Array(data.length / 4);
        
        // Verificar que hay objetos
        if (!objetos || objetos.length === 0) {
            console.log('⚠️ No hay objetos (complejo), usando método de respaldo...');
            return await this.crearMascaraRespaldo(data, width, height);
        }
        
        // Para cada objeto encontrado, crear una máscara más permisiva
        objetos.forEach(objeto => {
            try {
                if (!objeto || objeto.length === 0) return;
                
                const centroX = objeto.reduce((sum, p) => sum + p.x, 0) / objeto.length;
                const centroY = objeto.reduce((sum, p) => sum + p.y, 0) / objeto.length;
                
                // Región de interés más amplia
                const minX = Math.max(0, Math.min(...objeto.map(p => p.x)) - 40);
                const maxX = Math.min(width, Math.max(...objeto.map(p => p.x)) + 40);
                const minY = Math.max(0, Math.min(...objeto.map(p => p.y)) - 40);
                const maxY = Math.min(height, Math.max(...objeto.map(p => p.y)) + 40);
                
                const coloresObjeto = this.analizarColoresRegion(data, width, minX, minY, maxX, maxY);
                
                // Crear máscara más permisiva
                this.crearMascaraObjetoCompleja(data, mascara, width, height, centroX, centroY, coloresObjeto, minX, minY, maxX, maxY);
            } catch (error) {
                console.warn('Error procesando objeto (complejo):', error);
            }
        });
        
        return mascara;
    }

    crearMascaraObjetoCompleja(data, mascara, width, height, centroX, centroY, coloresObjeto, minX, minY, maxX, maxY) {
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                const radioMaximo = Math.max(maxX - minX, maxY - minY) / 2;
                
                let puntuacion = 0;
                
                // Criterios más permisivos para imágenes complejas
                if (distancia <= radioMaximo * 1.2) { // Más permisivo
                    puntuacion += 50;
                }
                
                const coincideConObjeto = coloresObjeto.some(color => 
                    this.esColorSimilar(r, g, b, color.r, color.g, color.b, 70) // Más tolerante
                );
                if (coincideConObjeto) {
                    puntuacion += 60;
                }
                
                if (!this.esColorTipicoFondo(r, g, b)) {
                    puntuacion += 40;
                }
                
                const saturacion = this.calcularSaturacion(r, g, b);
                if (saturacion > 0.1) { // Más permisivo
                    puntuacion += 30;
                }
                
                // Luminancia apropiada
                const luminancia = this.getLuminancia(data, dataIndex);
                if (luminancia > 15 && luminancia < 245) {
                    puntuacion += 20;
                }
                
                const nuevaPuntuacion = Math.min(255, puntuacion);
                if (nuevaPuntuacion > mascara[pixelIndex]) {
                    mascara[pixelIndex] = nuevaPuntuacion;
                }
            }
        }
    }

    async crearMascaraCompleja(data, width, height, objetoPrincipal) {
        console.log('🎭 Creando máscara compleja...');
        const mascara = new Uint8Array(data.length / 4);
        const { centroX, centroY, radio, colores } = objetoPrincipal;
        
        // Procesar en lotes más pequeños para imágenes complejas
        const loteSize = 500;
        let procesados = 0;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                // Calcular distancia al centro
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                
                // Criterios más permisivos para imágenes complejas
                let puntuacion = 0;
                
                // 1. Distancia al centro (más permisivo)
                if (distancia <= radio * 2) {
                    puntuacion += 40;
                }
                
                // 2. Coincidencia con colores del objeto (más tolerante)
                const coincideConObjeto = colores.some(color => 
                    this.esColorSimilar(r, g, b, color.r, color.g, color.b, 60)
                );
                if (coincideConObjeto) {
                    puntuacion += 50;
                }
                
                // 3. No es color de fondo
                if (!this.esColorTipicoFondo(r, g, b)) {
                    puntuacion += 30;
                }
                
                // 4. Tiene saturación (más permisivo)
                const saturacion = this.calcularSaturacion(r, g, b);
                if (saturacion > 0.1) {
                    puntuacion += 25;
                }
                
                // 5. Luminancia apropiada
                const luminancia = this.getLuminancia(data, dataIndex);
                if (luminancia > 20 && luminancia < 240) {
                    puntuacion += 20;
                }
                
                mascara[pixelIndex] = Math.min(255, puntuacion);
                
                // Pausa más frecuente para imágenes complejas
                procesados++;
                if (procesados % loteSize === 0) {
                    await this.dormir(2); // Pausa de 2ms
                }
            }
        }
        
        return mascara;
    }

    identificarObjetoPrincipalComplejo(data, mascaraObjeto, width, height, analisis) {
        console.log('🔍 Identificando objeto principal en imagen compleja...');
        
        // 1. Encontrar múltiples centros de interés
        const centrosInteres = this.encontrarCentrosInteres(data, width, height);
        console.log('📍 Centros de interés encontrados:', centrosInteres.length);
        
        // 2. Para cada centro, crear región de interés
        centrosInteres.forEach(centro => {
            const regionInteres = this.crearRegionInteres(centro, width, height);
            this.identificarPixelesObjetoComplejo(data, mascaraObjeto, width, height, regionInteres, analisis);
        });
        
        // 3. Expandir máscara usando crecimiento de región mejorado
        this.expandirMascaraObjetoComplejo(data, mascaraObjeto, width, height, analisis);
    }

    encontrarCentrosInteres(data, width, height) {
        const centros = [];
        const gridSize = 50; // Analizar en cuadrícula de 50x50 píxeles
        
        for (let y = gridSize; y < height - gridSize; y += gridSize) {
            for (let x = gridSize; x < width - gridSize; x += gridSize) {
                const centro = this.calcularCentroMasaRegion(data, x, y, gridSize, width, height);
                if (centro.peso > 1000) { // Solo centros con suficiente peso
                    centros.push(centro);
                }
            }
        }
        
        // Ordenar por peso y tomar los más importantes
        return centros.sort((a, b) => b.peso - a.peso).slice(0, 3);
    }

    calcularCentroMasaRegion(data, startX, startY, size, width, height) {
        let sumaX = 0, sumaY = 0, pesoTotal = 0;
        
        for (let y = startY; y < Math.min(startY + size, height); y++) {
            for (let x = startX; x < Math.min(startX + size, width); x++) {
                const pixelIndex = (y * width + x) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
                const saturacion = this.calcularSaturacion(r, g, b);
                
                // Peso más alto para colores vibrantes y luminancia media
                const peso = saturacion * 200 + (luminancia > 40 && luminancia < 210 ? 100 : 0);
                
                sumaX += x * peso;
                sumaY += y * peso;
                pesoTotal += peso;
            }
        }
        
        return {
            x: pesoTotal > 0 ? Math.round(sumaX / pesoTotal) : startX + size/2,
            y: pesoTotal > 0 ? Math.round(sumaY / pesoTotal) : startY + size/2,
            peso: pesoTotal
        };
    }

    identificarPixelesObjetoComplejo(data, mascaraObjeto, width, height, regionInteres, analisis) {
        const { centroX, centroY, radio } = regionInteres;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                // Calcular distancia al centro
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                
                // Criterios mejorados para imágenes complejas
                const estaEnRegion = distancia <= radio;
                const tieneAltaSaturacion = this.calcularSaturacion(r, g, b) > 0.25;
                const tieneLuminanciaApropiada = this.getLuminancia(data, dataIndex) > 25 && this.getLuminancia(data, dataIndex) < 230;
                const noEsColorFondo = !this.esColorTipicoFondo(r, g, b);
                const esColorVibrante = this.calcularSaturacion(r, g, b) > 0.4;
                
                // Puntuación más sofisticada
                let puntuacion = mascaraObjeto[pixelIndex] || 0;
                if (estaEnRegion) puntuacion += 50;
                if (tieneAltaSaturacion) puntuacion += 35;
                if (tieneLuminanciaApropiada) puntuacion += 25;
                if (noEsColorFondo) puntuacion += 15;
                if (esColorVibrante) puntuacion += 20;
                
                // Bonus para imágenes con alto contraste
                if (analisis.tieneAltoContraste && tieneAltaSaturacion) {
                    puntuacion += 10;
                }
                
                mascaraObjeto[pixelIndex] = Math.min(255, puntuacion);
            }
        }
    }

    expandirMascaraObjetoComplejo(data, mascaraObjeto, width, height, analisis) {
        console.log('🌱 Expandiendo máscara del objeto (modo complejo)...');
        
        // Umbrales más permisivos para imágenes complejas
        const umbralInicial = 80;
        const umbralExpansion = 40;
        
        // Encontrar semillas
        const semillas = [];
        for (let i = 0; i < mascaraObjeto.length; i++) {
            if (mascaraObjeto[i] >= umbralInicial) {
                const y = Math.floor(i / width);
                const x = i % width;
                semillas.push({ x, y, index: i });
            }
        }
        
        console.log(`🌰 Encontradas ${semillas.length} semillas en modo complejo`);
        
        // Expandir desde cada semilla con criterios más permisivos
        semillas.forEach(semilla => {
            this.expandirDesdeSemillaComplejo(data, mascaraObjeto, semilla, width, height, umbralExpansion, analisis);
        });
    }

    expandirDesdeSemillaComplejo(data, mascaraObjeto, semilla, width, height, umbral, analisis) {
        const visitado = new Set();
        const cola = [semilla];
        
        while (cola.length > 0) {
            const actual = cola.shift();
            const { x, y, index } = actual;
            
            if (visitado.has(index) || x < 0 || x >= width || y < 0 || y >= height) {
                continue;
            }
            
            visitado.add(index);
            
            const dataIndex = index * 4;
            const r = data[dataIndex];
            const g = data[dataIndex + 1];
            const b = data[dataIndex + 2];
            
            const luminancia = this.getLuminancia(data, dataIndex);
            const saturacion = this.calcularSaturacion(r, g, b);
            
            // Criterios más permisivos para expansión en imágenes complejas
            const puedeExpandir = 
                !this.esColorTipicoFondo(r, g, b) &&
                luminancia > 15 && luminancia < 245 &&
                (saturacion > 0.05 || luminancia > 40 || (analisis.tieneAltoContraste && luminancia > 30));
            
            if (puedeExpandir) {
                mascaraObjeto[index] = Math.max(mascaraObjeto[index], 200);
                
                // Agregar vecinos
                const vecinos = [
                    { x: x + 1, y, index: index + 1 },
                    { x: x - 1, y, index: index - 1 },
                    { x, y: y + 1, index: index + width },
                    { x, y: y - 1, index: index - width }
                ];
                
                vecinos.forEach(vecino => {
                    if (!visitado.has(vecino.index) && 
                        vecino.x >= 0 && vecino.x < width && 
                        vecino.y >= 0 && vecino.y < height) {
                        cola.push(vecino);
                    }
                });
            }
        }
    }

    refinarMascaraObjetoCompleja(mascaraObjeto, width, height) {
        console.log('🔧 Refinando máscara del objeto (modo complejo)...');
        
        // Aplicar operaciones morfológicas más suaves
        this.aplicarCierre(mascaraObjeto, width, height);
        this.aplicarApertura(mascaraObjeto, width, height);
        
        // Eliminar componentes pequeños pero con umbral más alto
        this.eliminarComponentesPequenos(mascaraObjeto, width, height, 200);
        
        // Aplicar suavizado adicional
        this.aplicarSuavizadoGaussiano(mascaraObjeto, width, height);
    }

    combinarMascarasInteligente(mascaraColor, mascaraTextura, mascaraBordes, mascaraFinal, width, height, analisis) {
        for (let i = 0; i < mascaraFinal.length; i++) {
            const pesoColor = 0.4;
            const pesoTextura = 0.3;
            const pesoBordes = 0.3;
            
            // Ajustar pesos según el análisis de la imagen
            let pesoColorAjustado = pesoColor;
            let pesoTexturaAjustado = pesoTextura;
            let pesoBordesAjustado = pesoBordes;
            
            if (analisis.tieneAltoContraste) {
                pesoBordesAjustado += 0.2;
                pesoColorAjustado -= 0.1;
                pesoTexturaAjustado -= 0.1;
            }
            
            if (analisis.esImagenClara || analisis.esImagenOscura) {
                pesoColorAjustado += 0.2;
                pesoTexturaAjustado -= 0.1;
                pesoBordesAjustado -= 0.1;
            }
            
            // Combinar con pesos ajustados
            const valorCombinado = 
                mascaraColor[i] * pesoColorAjustado +
                mascaraTextura[i] * pesoTexturaAjustado +
                mascaraBordes[i] * pesoBordesAjustado;
            
            mascaraFinal[i] = Math.min(255, Math.max(0, valorCombinado));
        }
    }

    refinarMascaraCompleja(mascara, width, height) {
        // Aplicar operaciones morfológicas más agresivas para imágenes complejas
        this.aplicarApertura(mascara, width, height);
        this.aplicarCierre(mascara, width, height);
        
        // Aplicar suavizado adicional
        this.aplicarSuavizadoGaussiano(mascara, width, height);
        
        // Eliminar pequeños componentes aislados
        this.eliminarComponentesPequenos(mascara, width, height);
    }

    aplicarSuavizadoGaussiano(mascara, width, height) {
        const mascaraTemp = new Uint8Array(mascara);
        const kernel = [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1]
        ];
        const divisor = 16;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pixelIndex = y * width + x;
                let suma = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const sampleIndex = (y + ky) * width + (x + kx);
                        suma += mascara[sampleIndex] * kernel[ky + 1][kx + 1];
                    }
                }
                
                mascaraTemp[pixelIndex] = Math.round(suma / divisor);
            }
        }
        
        mascara.set(mascaraTemp);
    }

    eliminarComponentesPequenos(mascara, width, height) {
        const umbralTamaño = 50; // Eliminar componentes menores a 50 píxeles
        const visitado = new Array(width * height).fill(false);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                
                if (!visitado[pixelIndex] && mascara[pixelIndex] > 128) {
                    const componente = this.encontrarComponente(mascara, visitado, x, y, width, height);
                    
                    if (componente.length < umbralTamaño) {
                        // Eliminar componente pequeño
                        componente.forEach(index => {
                            mascara[index] = 0;
                        });
                    }
                }
            }
        }
    }

    encontrarComponente(mascara, visitado, startX, startY, width, height) {
        const componente = [];
        const pila = [{ x: startX, y: startY }];
        
        while (pila.length > 0) {
            const { x, y } = pila.pop();
            const pixelIndex = y * width + x;
            
            if (x < 0 || x >= width || y < 0 || y >= height || visitado[pixelIndex]) {
                continue;
            }
            
            if (mascara[pixelIndex] > 128) {
                visitado[pixelIndex] = true;
                componente.push(pixelIndex);
                
                // Agregar vecinos
                pila.push({ x: x + 1, y });
                pila.push({ x: x - 1, y });
                pila.push({ x, y: y + 1 });
                pila.push({ x, y: y - 1 });
            }
        }
        
        return componente;
    }

    async aplicarSegmentacionAvanzada(ctx, width, height) {
        try {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            console.log('🎯 Aplicando detección de contornos reales...');
            
            // Paso 1: Detectar bordes reales de la imagen
            const bordes = await this.detectarBordesReales(data, width, height);
            console.log('🔍 Bordes detectados');
            
            // Paso 2: Encontrar objetos principales usando detección de bordes
            const objetos = await this.encontrarObjetosPorBordes(data, width, height, bordes);
            console.log('👥 Objetos encontrados:', objetos.length);
            
            // Paso 3: Crear máscara basada en contornos reales
            const mascaraObjeto = await this.crearMascaraPorContornos(data, width, height, objetos);
            
            // Paso 4: Aplicar máscara (preservar objeto, eliminar fondo)
            this.aplicarMascaraObjeto(data, mascaraObjeto);
            
            ctx.putImageData(imageData, 0, 0);
            
        } catch (error) {
            console.error('Error en segmentación avanzada:', error);
            // Usar método de respaldo simple
            await this.aplicarSegmentacionSimple(ctx, width, height);
        }
    }

    async aplicarSegmentacionSimple(ctx, width, height) {
        console.log('🔄 Usando método simple de respaldo...');
        
        try {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // Usar el método simple anterior
            const objetoPrincipal = await this.identificarObjetoPrincipalRapido(data, width, height);
            const mascaraObjeto = await this.crearMascaraSimple(data, width, height, objetoPrincipal);
            
            this.aplicarMascaraObjeto(data, mascaraObjeto);
            ctx.putImageData(imageData, 0, 0);
            
        } catch (error) {
            console.error('Error en método simple:', error);
            throw new Error('No se pudo procesar la imagen');
        }
    }

    detectarBorde(data, index, width) {
        // Algoritmo simple de detección de bordes
        const pixelActual = this.getLuminancia(data, index);
        const pixelDerecha = this.getLuminancia(data, index + 4);
        const pixelAbajo = this.getLuminancia(data, index + width * 4);
        
        const diffHorizontal = Math.abs(pixelActual - pixelDerecha);
        const diffVertical = Math.abs(pixelActual - pixelAbajo);
        
        return diffHorizontal > 30 || diffVertical > 30;
    }

    getLuminancia(data, index) {
        if (index < 0 || index >= data.length) return 0;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    esProbableFondo(r, g, b, index, data, width) {
        // Detectar colores comunes de fondo
        const esBlanco = r > 200 && g > 200 && b > 200;
        const esNegro = r < 50 && g < 50 && b < 50;
        const esGris = Math.abs(r - g) < 30 && Math.abs(g - b) < 30;
        
        // Verificar uniformidad en área circundante
        const esUniforme = this.esAreaUniforme(data, index, width);
        
        return (esBlanco || esNegro || esGris) && esUniforme;
    }

    esAreaUniforme(data, index, width) {
        let variacionTotal = 0;
        const muestras = 5;
        
        for (let i = -muestras; i <= muestras; i++) {
            for (let j = -muestras; j <= muestras; j++) {
                const sampleIndex = index + (i * width + j) * 4;
                if (sampleIndex >= 0 && sampleIndex < data.length) {
                    const lum = this.getLuminancia(data, sampleIndex);
                    const lumCentro = this.getLuminancia(data, index);
                    variacionTotal += Math.abs(lum - lumCentro);
                }
            }
        }
        
        return variacionTotal < 1000; // Umbral de uniformidad
    }

    // Nuevos métodos de segmentación avanzada
    analizarComposicionImagen(data, width, height) {
        let histogramaColor = new Array(256).fill(0);
        let histogramaLuminancia = new Array(256).fill(0);
        let coloresDominantes = new Map();
        let luminanciaTotal = 0;
        let contrasteTotal = 0;
        let pixelesAnalizados = 0;
        
        // Análisis de histogramas y colores dominantes
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = this.getLuminancia(data, i);
            
            histogramaLuminancia[Math.floor(lum)]++;
            luminanciaTotal += lum;
            pixelesAnalizados++;
            
            // Agrupar colores similares
            const colorKey = `${Math.floor(r/32)}-${Math.floor(g/32)}-${Math.floor(b/32)}`;
            coloresDominantes.set(colorKey, (coloresDominantes.get(colorKey) || 0) + 1);
        }
        
        // Calcular contraste
        for (let i = 0; i < data.length; i += 4) {
            const lum = this.getLuminancia(data, i);
            contrasteTotal += Math.abs(lum - (luminanciaTotal / pixelesAnalizados));
        }
        
        const luminanciaPromedio = luminanciaTotal / pixelesAnalizados;
        const contrastePromedio = contrasteTotal / pixelesAnalizados;
        
        // Encontrar colores más frecuentes
        const coloresFrecuentes = Array.from(coloresDominantes.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        return {
            luminanciaPromedio,
            contrastePromedio,
            coloresFrecuentes,
            esImagenOscura: luminanciaPromedio < 100,
            esImagenClara: luminanciaPromedio > 180,
            tieneAltoContraste: contrastePromedio > 50,
            histogramaLuminancia
        };
    }

    aplicarSegmentacionPorColor(data, mascara, width, height, analisis) {
        const coloresFondo = this.identificarColoresFondo(analisis);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const pixelIndex = i / 4;
            
            // Verificar si el pixel coincide con colores de fondo
            const esColorFondo = coloresFondo.some(colorFondo => 
                this.esColorSimilar(r, g, b, colorFondo.r, colorFondo.g, colorFondo.b, 30)
            );
            
            if (esColorFondo) {
                mascara[pixelIndex] = 255; // Marcar como fondo
            }
        }
    }

    identificarColoresFondo(analisis) {
        const coloresFondo = [];
        
        // Agregar colores de bordes (probablemente fondo)
        const bordes = this.obtenerColoresBordes(analisis);
        coloresFondo.push(...bordes);
        
        // Agregar colores más frecuentes si son uniformes
        analisis.coloresFrecuentes.forEach(([colorKey, frecuencia]) => {
            if (frecuencia > 1000) { // Color muy frecuente
                const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 32 + 16);
                coloresFondo.push({ r, g, b });
            }
        });
        
        return coloresFondo;
    }

    obtenerColoresBordes(analisis) {
        // Análisis más sofisticado de colores de bordes
        const coloresBorde = [];
        
        // Analizar colores más frecuentes en los bordes
        const coloresFrecuentes = analisis.coloresFrecuentes;
        
        // Si hay colores muy dominantes, probablemente son fondo
        coloresFrecuentes.forEach(([colorKey, frecuencia]) => {
            if (frecuencia > 5000) { // Color extremadamente frecuente
                const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 32 + 16);
                
                // Verificar si es un color típico de fondo
                if (this.esColorTipicoFondo(r, g, b)) {
                    coloresBorde.push({ r, g, b });
                }
            }
        });
        
        // Agregar colores típicos de fondo basados en el análisis
        if (analisis.esImagenClara) {
            coloresBorde.push({ r: 255, g: 255, b: 255 }); // Blanco
            coloresBorde.push({ r: 240, g: 240, b: 240 }); // Gris claro
        } else if (analisis.esImagenOscura) {
            coloresBorde.push({ r: 0, g: 0, b: 0 }); // Negro
            coloresBorde.push({ r: 20, g: 20, b: 20 }); // Gris oscuro
        }
        
        // Para imágenes con alto contraste, agregar colores intermedios
        if (analisis.tieneAltoContraste) {
            coloresBorde.push({ r: 128, g: 128, b: 128 }); // Gris medio
        }
        
        return coloresBorde;
    }

    esColorTipicoFondo(r, g, b) {
        // Detectar colores típicos de fondo
        const esBlanco = r > 200 && g > 200 && b > 200;
        const esNegro = r < 50 && g < 50 && b < 50;
        const esGris = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
        const esAzulCielo = b > r && b > g && b > 150 && r < 200 && g < 200;
        const esVerdeNaturaleza = g > r && g > b && g > 100 && r < 150 && b < 150;
        
        return esBlanco || esNegro || esGris || esAzulCielo || esVerdeNaturaleza;
    }

    esColorSimilar(r1, g1, b1, r2, g2, b2, umbral) {
        const distancia = Math.sqrt(
            Math.pow(r1 - r2, 2) + 
            Math.pow(g1 - g2, 2) + 
            Math.pow(b1 - b2, 2)
        );
        return distancia < umbral;
    }

    aplicarSegmentacionPorTextura(data, mascara, width, height) {
        const ventana = 3;
        
        for (let y = ventana; y < height - ventana; y++) {
            for (let x = ventana; x < width - ventana; x++) {
                const pixelIndex = y * width + x;
                const textura = this.calcularTextura(data, x, y, width, height, ventana);
                
                // Si la textura es muy uniforme, probablemente es fondo
                if (textura < 20) {
                    mascara[pixelIndex] = Math.max(mascara[pixelIndex], 200);
                }
            }
        }
    }

    calcularTextura(data, x, y, width, height, ventana) {
        let variacion = 0;
        let muestras = 0;
        const pixelCentral = this.getLuminancia(data, (y * width + x) * 4);
        
        for (let dy = -ventana; dy <= ventana; dy++) {
            for (let dx = -ventana; dx <= ventana; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const pixel = this.getLuminancia(data, (ny * width + nx) * 4);
                    variacion += Math.abs(pixel - pixelCentral);
                    muestras++;
                }
            }
        }
        
        return muestras > 0 ? variacion / muestras : 0;
    }

    aplicarSegmentacionPorBordes(data, mascara, width, height) {
        const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pixelIndex = y * width + x;
                
                let gx = 0, gy = 0;
                
                // Aplicar filtros Sobel
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const sampleIndex = ((y + ky) * width + (x + kx)) * 4;
                        const luminancia = this.getLuminancia(data, sampleIndex);
                        const kernelIndex = (ky + 1) * 3 + (kx + 1);
                        
                        gx += luminancia * sobelX[kernelIndex];
                        gy += luminancia * sobelY[kernelIndex];
                    }
                }
                
                const magnitud = Math.sqrt(gx * gx + gy * gy);
                
                // Si no hay borde fuerte, probablemente es fondo
                if (magnitud < 30) {
                    mascara[pixelIndex] = Math.max(mascara[pixelIndex], 150);
                }
            }
        }
    }

    aplicarSegmentacionPorGradiente(data, mascara, width, height) {
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pixelIndex = y * width + x;
                const currentIndex = pixelIndex * 4;
                
                // Calcular gradiente
                const gradienteX = Math.abs(
                    this.getLuminancia(data, currentIndex + 4) - 
                    this.getLuminancia(data, currentIndex - 4)
                );
                
                const gradienteY = Math.abs(
                    this.getLuminancia(data, currentIndex + width * 4) - 
                    this.getLuminancia(data, currentIndex - width * 4)
                );
                
                const gradienteTotal = gradienteX + gradienteY;
                
                // Áreas con gradiente bajo probablemente son fondo
                if (gradienteTotal < 20) {
                    mascara[pixelIndex] = Math.max(mascara[pixelIndex], 100);
                }
            }
        }
    }

    refinarMascara(mascara, width, height) {
        // Operaciones morfológicas para limpiar la máscara
        this.aplicarApertura(mascara, width, height);
        this.aplicarCierre(mascara, width, height);
    }

    aplicarApertura(mascara, width, height) {
        const mascaraTemp = new Uint8Array(mascara);
        const kernel = 2;
        
        for (let y = kernel; y < height - kernel; y++) {
            for (let x = kernel; x < width - kernel; x++) {
                const pixelIndex = y * width + x;
                let minValor = 255;
                
                // Erosión
                for (let ky = -kernel; ky <= kernel; ky++) {
                    for (let kx = -kernel; kx <= kernel; kx++) {
                        const sampleIndex = (y + ky) * width + (x + kx);
                        minValor = Math.min(minValor, mascara[sampleIndex]);
                    }
                }
                
                mascaraTemp[pixelIndex] = minValor;
            }
        }
        
        // Dilatación
        for (let y = kernel; y < height - kernel; y++) {
            for (let x = kernel; x < width - kernel; x++) {
                const pixelIndex = y * width + x;
                let maxValor = 0;
                
                for (let ky = -kernel; ky <= kernel; ky++) {
                    for (let kx = -kernel; kx <= kernel; kx++) {
                        const sampleIndex = (y + ky) * width + (x + kx);
                        maxValor = Math.max(maxValor, mascaraTemp[sampleIndex]);
                    }
                }
                
                mascara[pixelIndex] = maxValor;
            }
        }
    }

    aplicarCierre(mascara, width, height) {
        // Cierre = dilatación seguida de erosión
        this.aplicarDilatacion(mascara, width, height);
        this.aplicarErosion(mascara, width, height);
    }

    aplicarDilatacion(mascara, width, height) {
        const mascaraTemp = new Uint8Array(mascara);
        const kernel = 1;
        
        for (let y = kernel; y < height - kernel; y++) {
            for (let x = kernel; x < width - kernel; x++) {
                const pixelIndex = y * width + x;
                let maxValor = 0;
                
                for (let ky = -kernel; ky <= kernel; ky++) {
                    for (let kx = -kernel; kx <= kernel; kx++) {
                        const sampleIndex = (y + ky) * width + (x + kx);
                        maxValor = Math.max(maxValor, mascara[sampleIndex]);
                    }
                }
                
                mascaraTemp[pixelIndex] = maxValor;
            }
        }
        
        mascara.set(mascaraTemp);
    }

    aplicarErosion(mascara, width, height) {
        const mascaraTemp = new Uint8Array(mascara);
        const kernel = 1;
        
        for (let y = kernel; y < height - kernel; y++) {
            for (let x = kernel; x < width - kernel; x++) {
                const pixelIndex = y * width + x;
                let minValor = 255;
                
                for (let ky = -kernel; ky <= kernel; ky++) {
                    for (let kx = -kernel; kx <= kernel; kx++) {
                        const sampleIndex = (y + ky) * width + (x + kx);
                        minValor = Math.min(minValor, mascara[sampleIndex]);
                    }
                }
                
                mascaraTemp[pixelIndex] = minValor;
            }
        }
        
        mascara.set(mascaraTemp);
    }

    aplicarMascaraFinal(data, mascara) {
        for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;
            const valorMascara = mascara[pixelIndex];
            
            if (valorMascara > 128) {
                // Hacer transparente o semi-transparente
                data[i + 3] = Math.max(0, 255 - valorMascara);
            }
        }
    }

    // Algoritmo optimizado y rápido para identificar el objeto principal
    async identificarObjetoPrincipalRapido(data, width, height) {
        console.log('🔍 Identificando objeto principal (modo rápido)...');
        
        // 1. Encontrar el centro de la imagen (donde probablemente está el objeto)
        const centroX = Math.floor(width / 2);
        const centroY = Math.floor(height / 2);
        
        // 2. Analizar una muestra de píxeles alrededor del centro
        const radioMuestra = Math.min(width, height) * 0.2; // 20% del tamaño menor
        const coloresObjeto = this.obtenerColoresObjeto(data, width, height, centroX, centroY, radioMuestra);
        
        console.log('🎨 Colores del objeto identificados:', coloresObjeto.length);
        
        return {
            centroX,
            centroY,
            radio: radioMuestra,
            colores: coloresObjeto
        };
    }

    obtenerColoresObjeto(data, width, height, centroX, centroY, radio) {
        const colores = new Map();
        const muestras = 0;
        
        // Muestrear píxeles en un círculo alrededor del centro
        for (let y = Math.max(0, centroY - radio); y < Math.min(height, centroY + radio); y++) {
            for (let x = Math.max(0, centroX - radio); x < Math.min(width, centroX + radio); x++) {
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                
                if (distancia <= radio) {
                    const pixelIndex = (y * width + x) * 4;
                    const r = data[pixelIndex];
                    const g = data[pixelIndex + 1];
                    const b = data[pixelIndex + 2];
                    
                    // Solo considerar colores que no son típicos de fondo
                    if (!this.esColorTipicoFondo(r, g, b)) {
                        const colorKey = `${Math.floor(r/16)}-${Math.floor(g/16)}-${Math.floor(b/16)}`;
                        colores.set(colorKey, (colores.get(colorKey) || 0) + 1);
                    }
                }
            }
        }
        
        // Retornar los colores más frecuentes
        return Array.from(colores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([colorKey, frecuencia]) => {
                const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 16 + 8);
                return { r, g, b, frecuencia };
            });
    }

    async crearMascaraSimple(data, width, height, objetoPrincipal) {
        console.log('🎭 Creando máscara simple...');
        const mascara = new Uint8Array(data.length / 4);
        const { centroX, centroY, radio, colores } = objetoPrincipal;
        
        // Procesar en lotes para evitar bloqueos
        const loteSize = 1000;
        let procesados = 0;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                // Calcular distancia al centro
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                
                // Criterios simples y rápidos
                let puntuacion = 0;
                
                // 1. Distancia al centro (objetos suelen estar en el centro)
                if (distancia <= radio * 1.5) {
                    puntuacion += 50;
                }
                
                // 2. Coincidencia con colores del objeto
                const coincideConObjeto = colores.some(color => 
                    this.esColorSimilar(r, g, b, color.r, color.g, color.b, 40)
                );
                if (coincideConObjeto) {
                    puntuacion += 40;
                }
                
                // 3. No es color de fondo
                if (!this.esColorTipicoFondo(r, g, b)) {
                    puntuacion += 20;
                }
                
                // 4. Tiene saturación (colores vibrantes)
                const saturacion = this.calcularSaturacion(r, g, b);
                if (saturacion > 0.2) {
                    puntuacion += 30;
                }
                
                mascara[pixelIndex] = Math.min(255, puntuacion);
                
                // Permitir que el navegador respire cada cierto número de píxeles
                procesados++;
                if (procesados % loteSize === 0) {
                    await this.dormir(1); // Pausa de 1ms
                }
            }
        }
        
        return mascara;
    }

    dormir(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Nuevo algoritmo basado en detección de contornos reales
    async detectarBordesReales(data, width, height) {
        console.log('🔍 Detectando bordes reales...');
        const bordes = new Uint8Array(data.length / 4);
        
        // Usar filtro Sobel mejorado
        const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        
        let procesados = 0;
        const loteSize = 500;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pixelIndex = y * width + x;
                
                let gx = 0, gy = 0;
                
                // Aplicar filtros Sobel
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const sampleIndex = ((y + ky) * width + (x + kx)) * 4;
                        const luminancia = this.getLuminancia(data, sampleIndex);
                        const kernelIndex = (ky + 1) * 3 + (kx + 1);
                        
                        gx += luminancia * sobelX[kernelIndex];
                        gy += luminancia * sobelY[kernelIndex];
                    }
                }
                
                const magnitud = Math.sqrt(gx * gx + gy * gy);
                bordes[pixelIndex] = Math.min(255, magnitud);
                
                procesados++;
                if (procesados % loteSize === 0) {
                    await this.dormir(1);
                }
            }
        }
        
        return bordes;
    }

    async encontrarObjetosPorBordes(data, width, height, bordes) {
        console.log('👥 Encontrando objetos por bordes...');
        const objetos = [];
        const visitado = new Array(width * height).fill(false);
        
        // Buscar regiones conectadas de píxeles con bordes débiles (interior de objetos)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                
                if (!visitado[pixelIndex] && bordes[pixelIndex] < 30) {
                    try {
                        // Encontrar región conectada
                        const region = await this.encontrarRegionConectada(bordes, visitado, x, y, width, height, 30);
                        
                        if (region && region.length > 1000) { // Solo regiones grandes
                            objetos.push(region);
                            console.log(`📍 Objeto encontrado con ${region.length} píxeles`);
                        }
                    } catch (error) {
                        console.warn('Error en región conectada:', error);
                        continue;
                    }
                }
            }
        }
        
        // Si no se encontraron objetos, usar método de respaldo
        if (objetos.length === 0) {
            console.log('⚠️ No se encontraron objetos, usando método de respaldo...');
            return await this.encontrarObjetosRespaldo(data, width, height);
        }
        
        return objetos;
    }

    async encontrarRegionConectada(bordes, visitado, startX, startY, width, height, umbral) {
        const region = [];
        const cola = [{ x: startX, y: startY }];
        
        while (cola.length > 0) {
            const { x, y } = cola.shift();
            const pixelIndex = y * width + x;
            
            if (x < 0 || x >= width || y < 0 || y >= height || visitado[pixelIndex]) {
                continue;
            }
            
            if (bordes[pixelIndex] < umbral) {
                visitado[pixelIndex] = true;
                region.push({ x, y, index: pixelIndex });
                
                // Agregar vecinos
                cola.push({ x: x + 1, y });
                cola.push({ x: x - 1, y });
                cola.push({ x, y: y + 1 });
                cola.push({ x, y: y - 1 });
            }
        }
        
        return region;
    }

    async crearMascaraPorContornos(data, width, height, objetos) {
        console.log('🎭 Creando máscara por contornos...');
        const mascara = new Uint8Array(data.length / 4);
        
        // Verificar que hay objetos
        if (!objetos || objetos.length === 0) {
            console.log('⚠️ No hay objetos, usando método de respaldo...');
            return await this.crearMascaraRespaldo(data, width, height);
        }
        
        // Para cada objeto encontrado, crear una máscara
        objetos.forEach(objeto => {
            try {
                if (!objeto || objeto.length === 0) return;
                
                // Calcular centro del objeto
                const centroX = objeto.reduce((sum, p) => sum + p.x, 0) / objeto.length;
                const centroY = objeto.reduce((sum, p) => sum + p.y, 0) / objeto.length;
                
                // Crear región de interés alrededor del objeto
                const minX = Math.max(0, Math.min(...objeto.map(p => p.x)) - 20);
                const maxX = Math.min(width, Math.max(...objeto.map(p => p.x)) + 20);
                const minY = Math.max(0, Math.min(...objeto.map(p => p.y)) - 20);
                const maxY = Math.min(height, Math.max(...objeto.map(p => p.y)) + 20);
                
                // Analizar colores en la región del objeto
                const coloresObjeto = this.analizarColoresRegion(data, width, minX, minY, maxX, maxY);
                
                // Crear máscara para este objeto
                this.crearMascaraObjeto(data, mascara, width, height, centroX, centroY, coloresObjeto, minX, minY, maxX, maxY);
            } catch (error) {
                console.warn('Error procesando objeto:', error);
            }
        });
        
        return mascara;
    }

    // Método de respaldo cuando no se encuentran objetos
    async encontrarObjetosRespaldo(data, width, height) {
        console.log('🔄 Usando método de respaldo para encontrar objetos...');
        
        // Encontrar centro de la imagen
        const centroX = Math.floor(width / 2);
        const centroY = Math.floor(height / 2);
        const radio = Math.min(width, height) * 0.3;
        
        // Crear un objeto simulado en el centro
        const objeto = [];
        for (let y = Math.max(0, centroY - radio); y < Math.min(height, centroY + radio); y++) {
            for (let x = Math.max(0, centroX - radio); x < Math.min(width, centroX + radio); x++) {
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                if (distancia <= radio) {
                    objeto.push({ x, y, index: y * width + x });
                }
            }
        }
        
        return [objeto];
    }

    async crearMascaraRespaldo(data, width, height) {
        console.log('🔄 Creando máscara de respaldo...');
        const mascara = new Uint8Array(data.length / 4);
        
        // Usar el método simple anterior como respaldo
        const objetoPrincipal = await this.identificarObjetoPrincipalRapido(data, width, height);
        const mascaraSimple = await this.crearMascaraSimple(data, width, height, objetoPrincipal);
        
        return mascaraSimple;
    }

    analizarColoresRegion(data, width, minX, minY, maxX, maxY) {
        const colores = new Map();
        
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                const pixelIndex = (y * width + x) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                if (!this.esColorTipicoFondo(r, g, b)) {
                    const colorKey = `${Math.floor(r/16)}-${Math.floor(g/16)}-${Math.floor(b/16)}`;
                    colores.set(colorKey, (colores.get(colorKey) || 0) + 1);
                }
            }
        }
        
        return Array.from(colores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([colorKey, frecuencia]) => {
                const [r, g, b] = colorKey.split('-').map(x => parseInt(x) * 16 + 8);
                return { r, g, b, frecuencia };
            });
    }

    crearMascaraObjeto(data, mascara, width, height, centroX, centroY, coloresObjeto, minX, minY, maxX, maxY) {
        for (let y = minY; y < maxY; y++) {
            for (let x = minX; x < maxX; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                // Calcular distancia al centro del objeto
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                const radioMaximo = Math.max(maxX - minX, maxY - minY) / 2;
                
                let puntuacion = 0;
                
                // 1. Distancia al centro del objeto
                if (distancia <= radioMaximo) {
                    puntuacion += 60;
                }
                
                // 2. Coincidencia con colores del objeto
                const coincideConObjeto = coloresObjeto.some(color => 
                    this.esColorSimilar(r, g, b, color.r, color.g, color.b, 50)
                );
                if (coincideConObjeto) {
                    puntuacion += 50;
                }
                
                // 3. No es color de fondo
                if (!this.esColorTipicoFondo(r, g, b)) {
                    puntuacion += 30;
                }
                
                // 4. Tiene saturación
                const saturacion = this.calcularSaturacion(r, g, b);
                if (saturacion > 0.15) {
                    puntuacion += 25;
                }
                
                // Actualizar máscara solo si la puntuación es mayor
                const nuevaPuntuacion = Math.min(255, puntuacion);
                if (nuevaPuntuacion > mascara[pixelIndex]) {
                    mascara[pixelIndex] = nuevaPuntuacion;
                }
            }
        }
    }

    calcularCentroMasa(data, width, height) {
        let sumaX = 0, sumaY = 0, pesoTotal = 0;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = (y * width + x) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                // Calcular peso basado en contraste y saturación
                const luminancia = 0.299 * r + 0.587 * g + 0.114 * b;
                const saturacion = this.calcularSaturacion(r, g, b);
                
                // Píxeles con alta saturación y luminancia media son más probables de ser objeto
                const peso = saturacion * 100 + (luminancia > 50 && luminancia < 200 ? 50 : 0);
                
                sumaX += x * peso;
                sumaY += y * peso;
                pesoTotal += peso;
            }
        }
        
        return {
            x: pesoTotal > 0 ? Math.round(sumaX / pesoTotal) : width / 2,
            y: pesoTotal > 0 ? Math.round(sumaY / pesoTotal) : height / 2
        };
    }

    crearRegionInteres(centroMasa, width, height) {
        // Crear región circular alrededor del centro de masa
        const radio = Math.min(width, height) * 0.3; // 30% del tamaño menor
        
        return {
            centroX: centroMasa.x,
            centroY: centroMasa.y,
            radio: radio
        };
    }

    identificarPixelesObjeto(data, mascaraObjeto, width, height, regionInteres) {
        const { centroX, centroY, radio } = regionInteres;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                const dataIndex = pixelIndex * 4;
                
                const r = data[dataIndex];
                const g = data[dataIndex + 1];
                const b = data[dataIndex + 2];
                
                // Calcular distancia al centro
                const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
                
                // Criterios para identificar píxeles del objeto
                const estaEnRegion = distancia <= radio;
                const tieneAltaSaturacion = this.calcularSaturacion(r, g, b) > 0.3;
                const tieneLuminanciaMedia = this.getLuminancia(data, dataIndex) > 30 && this.getLuminancia(data, dataIndex) < 220;
                const noEsColorFondo = !this.esColorTipicoFondo(r, g, b);
                
                // Si cumple múltiples criterios, probablemente es parte del objeto
                let puntuacion = 0;
                if (estaEnRegion) puntuacion += 40;
                if (tieneAltaSaturacion) puntuacion += 30;
                if (tieneLuminanciaMedia) puntuacion += 20;
                if (noEsColorFondo) puntuacion += 10;
                
                mascaraObjeto[pixelIndex] = puntuacion;
            }
        }
    }

    expandirMascaraObjeto(data, mascaraObjeto, width, height) {
        console.log('🌱 Expandiendo máscara del objeto...');
        
        // Usar crecimiento de región para expandir la máscara
        const umbralInicial = 60; // Píxeles con puntuación alta
        const umbralExpansion = 30; // Píxeles que pueden ser agregados
        
        // Encontrar semillas (píxeles con alta puntuación)
        const semillas = [];
        for (let i = 0; i < mascaraObjeto.length; i++) {
            if (mascaraObjeto[i] >= umbralInicial) {
                const y = Math.floor(i / width);
                const x = i % width;
                semillas.push({ x, y, index: i });
            }
        }
        
        console.log(`🌰 Encontradas ${semillas.length} semillas`);
        
        // Expandir desde cada semilla
        semillas.forEach(semilla => {
            this.expandirDesdeSemilla(data, mascaraObjeto, semilla, width, height, umbralExpansion);
        });
    }

    expandirDesdeSemilla(data, mascaraObjeto, semilla, width, height, umbral) {
        const visitado = new Set();
        const cola = [semilla];
        
        while (cola.length > 0) {
            const actual = cola.shift();
            const { x, y, index } = actual;
            
            if (visitado.has(index) || x < 0 || x >= width || y < 0 || y >= height) {
                continue;
            }
            
            visitado.add(index);
            
            // Verificar si este píxel puede ser parte del objeto
            const dataIndex = index * 4;
            const r = data[dataIndex];
            const g = data[dataIndex + 1];
            const b = data[dataIndex + 2];
            
            const luminancia = this.getLuminancia(data, dataIndex);
            const saturacion = this.calcularSaturacion(r, g, b);
            
            // Criterios para expansión
            const puedeExpandir = 
                !this.esColorTipicoFondo(r, g, b) &&
                luminancia > 20 && luminancia < 240 &&
                (saturacion > 0.1 || luminancia > 50);
            
            if (puedeExpandir) {
                mascaraObjeto[index] = Math.max(mascaraObjeto[index], 200);
                
                // Agregar vecinos a la cola
                const vecinos = [
                    { x: x + 1, y, index: index + 1 },
                    { x: x - 1, y, index: index - 1 },
                    { x, y: y + 1, index: index + width },
                    { x, y: y - 1, index: index - width }
                ];
                
                vecinos.forEach(vecino => {
                    if (!visitado.has(vecino.index) && 
                        vecino.x >= 0 && vecino.x < width && 
                        vecino.y >= 0 && vecino.y < height) {
                        cola.push(vecino);
                    }
                });
            }
        }
    }

    refinarMascaraObjeto(mascaraObjeto, width, height) {
        console.log('🔧 Refinando máscara del objeto...');
        
        // Aplicar operaciones morfológicas para limpiar la máscara
        this.aplicarCierre(mascaraObjeto, width, height);
        this.aplicarApertura(mascaraObjeto, width, height);
        
        // Eliminar componentes pequeños que no son parte del objeto principal
        this.eliminarComponentesPequenos(mascaraObjeto, width, height, 100);
    }

    aplicarMascaraObjeto(data, mascaraObjeto) {
        console.log('🎨 Aplicando máscara final...');
        
        for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;
            const valorMascara = mascaraObjeto[pixelIndex];
            
            if (valorMascara < 150) {
                // Píxeles con baja puntuación (probablemente fondo) se hacen transparentes
                data[i + 3] = 0; // Completamente transparente
            } else {
                // Píxeles del objeto se mantienen opacos
                data[i + 3] = 255;
            }
        }
    }

    // ========================================
    // FUNCIÓN DE DETECCIÓN DE TEXTO COMENTADA
    // ========================================
    // Esta funcionalidad está temporalmente deshabilitada
    // Se puede reactivar en el futuro cuando se mejore el algoritmo

    mostrarAvisoModoTexto() {
        console.log('⚠️ Modo texto temporalmente deshabilitado');
        
        // Revertir inmediatamente el switch
        this.elementos.toggleModo.checked = true;
        
        // Mostrar notificación de advertencia
        this.mostrarNotificacion('⚠️ Próximamente... El modo texto estará disponible próximamente', 'advertencia');
    }

    async capturarDesdeCamara() {
        console.log('📷 Iniciando captura desde cámara...');
        
        // Verificar si estamos en un dispositivo móvil
        const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (!esMovil) {
            this.mostrarNotificacion('📱 La captura de cámara solo está disponible en dispositivos móviles', 'advertencia');
            return;
        }
        
        try {
            // Verificar si el navegador soporta getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.mostrarNotificacion('❌ Tu navegador no soporta acceso a la cámara', 'error');
                return;
            }
            
            this.mostrarNotificacion('📷 Accediendo a la cámara...', 'info');
            
            // Configurar la cámara trasera por defecto
            const constraints = {
                video: {
                    facingMode: 'environment', // Cámara trasera
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Crear modal para mostrar la cámara
            this.mostrarModalCamara(stream);
            
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            
            if (error.name === 'NotAllowedError') {
                this.mostrarNotificacion('❌ Permisos de cámara denegados. Por favor, permite el acceso a la cámara.', 'error');
            } else if (error.name === 'NotFoundError') {
                this.mostrarNotificacion('❌ No se encontró ninguna cámara en el dispositivo', 'error');
            } else {
                this.mostrarNotificacion('❌ Error al acceder a la cámara. Intenta con un archivo.', 'error');
            }
        }
    }

    mostrarModalCamara(stream) {
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-white mb-2">Capturar Foto</h3>
                    <p class="text-gray-300">Posiciona tu imagen y presiona capturar</p>
                </div>
                
                <div class="relative mb-6">
                    <video id="video-camara" autoplay playsinline class="w-full h-64 bg-gray-800 rounded-xl object-cover"></video>
                    <div class="absolute inset-0 border-2 border-yellow-400 rounded-xl pointer-events-none"></div>
                </div>
                
                <div class="flex space-x-4">
                    <button id="btn-capturar-foto" class="flex-1 bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition-colors">
                        <i class="fas fa-camera mr-2"></i>
                        Capturar
                    </button>
                    <button id="btn-cancelar-camara" class="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors">
                        <i class="fas fa-times mr-2"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar video
        const video = modal.querySelector('#video-camara');
        video.srcObject = stream;
        
        // Event listeners
        modal.querySelector('#btn-capturar-foto').addEventListener('click', () => {
            this.capturarFoto(video, stream, modal);
        });
        
        modal.querySelector('#btn-cancelar-camara').addEventListener('click', () => {
            this.cerrarModalCamara(stream, modal);
        });
        
        // Cerrar con ESC
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                this.cerrarModalCamara(stream, modal);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        
        // Guardar referencia para limpiar
        modal._handleKeyPress = handleKeyPress;
    }

    capturarFoto(video, stream, modal) {
        console.log('📸 Capturando foto...');
        
        // Crear canvas para capturar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar canvas con las dimensiones del video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujar el frame actual del video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir a blob
        canvas.toBlob((blob) => {
            if (blob) {
                // Crear archivo desde el blob
                const file = new File([blob], 'foto-capturada.jpg', { type: 'image/jpeg' });
                
                // Simular evento de selección de archivo
                const event = {
                    target: {
                        files: [file]
                    }
                };
                
                // Procesar la imagen capturada
                this.manejarSeleccionImagen(event);
                
                // Cerrar modal
                this.cerrarModalCamara(stream, modal);
                
                this.mostrarNotificacion('✅ Foto capturada exitosamente', 'exito');
            } else {
                this.mostrarNotificacion('❌ Error al capturar la foto', 'error');
            }
        }, 'image/jpeg', 0.9);
    }

    cerrarModalCamara(stream, modal) {
        console.log('🚪 Cerrando modal de cámara...');
        
        // Detener stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Remover event listener
        if (modal._handleKeyPress) {
            document.removeEventListener('keydown', modal._handleKeyPress);
        }
        
        // Remover modal
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }
    /*
    async procesarDeteccionTexto() {
        console.log('🔍 Procesando detección de texto mejorada...');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.imagenOriginal.width;
        canvas.height = this.imagenOriginal.height;
        
        // Dibujar imagen original
        ctx.drawImage(this.imagenOriginal, 0, 0);
        
        try {
            // Usar Tesseract para detección de texto
            console.log('📖 Iniciando reconocimiento OCR...');
            const { data: { words } } = await this.trabajadorTesseract.recognize(canvas);
            
            console.log('📝 Texto detectado:', words?.length || 0, 'elementos');
            
            if (words && words.length > 0) {
                // Filtrar texto que parece añadido (no natural)
                const textoAñadido = words.filter(palabra => 
                    this.esTextoAñadidoMejorado(palabra, canvas.width, canvas.height)
                );
                
                console.log(`🎯 Texto a eliminar: ${textoAñadido.length} elementos`);
                
                if (textoAñadido.length > 0) {
                    // Aplicar eliminación de texto mejorada
                    await this.eliminarTextoMejorado(ctx, textoAñadido);
                } else {
                    console.log('ℹ️ No se encontró texto añadido para eliminar');
                }
            } else {
                console.log('ℹ️ No se detectó texto en la imagen');
            }
            
        } catch (error) {
            console.warn('❌ Error en OCR, usando detección de texto alternativa:', error);
            // Usar detección de texto alternativa
            await this.detectarTextoAlternativo(ctx);
        }
        
        // Dibujar resultado
        const ctxResultado = this.elementos.previewResultado.getContext('2d');
        ctxResultado.drawImage(canvas, 0, 0, this.elementos.previewResultado.width, this.elementos.previewResultado.height);
        
        this.imagenProcesada = canvas;
    }
    */

    // ========================================
    // FUNCIONES DE TEXTO COMENTADAS
    // ========================================
    /*
    esTextoAñadidoMejorado(palabra, imageWidth, imageHeight) {
        // Heurística mejorada para detectar texto añadido vs texto natural
        
        const bbox = palabra.bbox;
        const area = (bbox.x1 - bbox.x0) * (bbox.y1 - bbox.y0);
        const areaTotal = imageWidth * imageHeight;
        const areaPorcentaje = area / areaTotal;
        
        // Criterios para detectar texto añadido
        let puntuacion = 0;
        
        // 1. Tamaño del texto (texto añadido suele ser más grande)
        if (areaPorcentaje > 0.001 && areaPorcentaje < 0.05) {
            puntuacion += 30;
        }
        
        // 2. Posición en bordes (texto añadido suele estar en bordes)
        const enBorde = bbox.x0 < imageWidth * 0.1 || bbox.x1 > imageWidth * 0.9 ||
                        bbox.y0 < imageHeight * 0.1 || bbox.y1 > imageHeight * 0.9;
        if (enBorde) {
            puntuacion += 40;
        }
        
        // 3. Confianza del OCR (texto añadido suele tener alta confianza)
        if (palabra.confidence > 70) {
            puntuacion += 25;
        }
        
        // 4. Contenido del texto (palabras comunes de texto añadido)
        const texto = palabra.text?.toLowerCase() || '';
        const palabrasAñadidas = ['logo', 'watermark', 'copyright', '©', '®', 'tm', 'www', 'http', '.com', '.org'];
        if (palabrasAñadidas.some(palabra => texto.includes(palabra))) {
            puntuacion += 50;
        }
        
        // 5. Formato del texto (números, símbolos especiales)
        if (/[0-9@#$%&*()_+\-=\[\]{}|;:,.<>?/~`]/.test(texto)) {
            puntuacion += 20;
        }
        
        // 6. Posición en esquinas (muy probable que sea añadido)
        const enEsquina = (bbox.x0 < imageWidth * 0.05 && bbox.y0 < imageHeight * 0.05) ||
                         (bbox.x1 > imageWidth * 0.95 && bbox.y0 < imageHeight * 0.05) ||
                         (bbox.x0 < imageWidth * 0.05 && bbox.y1 > imageHeight * 0.95) ||
                         (bbox.x1 > imageWidth * 0.95 && bbox.y1 > imageHeight * 0.95);
        if (enEsquina) {
            puntuacion += 35;
        }
        
        console.log(`📊 Texto "${texto}" - Puntuación: ${puntuacion} - Confianza: ${palabra.confidence}`);
        
        return puntuacion >= 60; // Umbral para considerar texto añadido
    }
    */

    /*
    async eliminarTextoMejorado(ctx, textoAñadido) {
        console.log('🎨 Eliminando texto con algoritmo mejorado...');
        
        for (const palabra of textoAñadido) {
            const bbox = palabra.bbox;
            console.log(`🗑️ Eliminando: "${palabra.text}" en posición (${bbox.x0}, ${bbox.y0})`);
            
            // Aplicar eliminación con margen
            const margen = 5;
            const x = Math.max(0, bbox.x0 - margen);
            const y = Math.max(0, bbox.y0 - margen);
            const ancho = Math.min(ctx.canvas.width - x, bbox.x1 - bbox.x0 + margen * 2);
            const alto = Math.min(ctx.canvas.height - y, bbox.y1 - bbox.y0 + margen * 2);
            
            // Usar inpainting inteligente
            this.aplicarInpaintingMejorado(ctx, x, y, ancho, alto);
        }
        
        console.log('✅ Eliminación de texto completada');
    }

    aplicarInpaintingMejorado(ctx, x, y, ancho, alto) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        
        // Crear máscara del área a rellenar
        const mascara = new Array(ancho * alto).fill(false);
        
        // Aplicar inpainting por regiones
        for (let i = 0; i < alto; i++) {
            for (let j = 0; j < ancho; j++) {
                const pixelX = x + j;
                const pixelY = y + i;
                
                if (pixelX >= 0 && pixelX < ctx.canvas.width && pixelY >= 0 && pixelY < ctx.canvas.height) {
                    const indice = (pixelY * ctx.canvas.width + pixelX) * 4;
                    
                    // Obtener color contextual mejorado
                    const color = this.obtenerColorContextualMejorado(data, pixelX, pixelY, ctx.canvas.width, ctx.canvas.height, 15);
                    
                    data[indice] = color.r;
                    data[indice + 1] = color.g;
                    data[indice + 2] = color.b;
                    // data[indice + 3] se mantiene (alpha)
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    obtenerColorContextualMejorado(data, x, y, width, height, radio) {
        let totalR = 0, totalG = 0, totalB = 0, contador = 0;
        const pesos = [];
        
        // Crear kernel gaussiano para muestreo
        for (let i = y - radio; i <= y + radio; i++) {
            for (let j = x - radio; j <= x + radio; j++) {
                if (i >= 0 && i < height && j >= 0 && j < width) {
                    const distancia = Math.sqrt(Math.pow(j - x, 2) + Math.pow(i - y, 2));
                    if (distancia <= radio && distancia > radio / 3) { // Evitar el área central
                        const peso = Math.exp(-(distancia * distancia) / (2 * (radio / 3) * (radio / 3)));
                        pesos.push({ x: j, y: i, peso });
                    }
                }
            }
        }
        
        // Aplicar pesos
        pesos.forEach(({ x: j, y: i, peso }) => {
            const indice = (i * width + j) * 4;
            totalR += data[indice] * peso;
            totalG += data[indice + 1] * peso;
            totalB += data[indice + 2] * peso;
            contador += peso;
        });
        
        return {
            r: contador > 0 ? Math.round(totalR / contador) : 128,
            g: contador > 0 ? Math.round(totalG / contador) : 128,
            b: contador > 0 ? Math.round(totalB / contador) : 128
        };
    }

    async detectarTextoAlternativo(ctx) {
        console.log('🔍 Usando detección de texto alternativa...');
        
        // Detectar áreas con alto contraste que podrían ser texto
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;
        
        const areasTexto = this.detectarAreasAltoContraste(data, ctx.canvas.width, ctx.canvas.height);
        
        if (areasTexto.length > 0) {
            console.log(`🎯 Áreas de texto detectadas: ${areasTexto.length}`);
            
            for (const area of areasTexto) {
                this.aplicarInpaintingMejorado(ctx, area.x, area.y, area.ancho, area.alto);
            }
        } else {
            console.log('ℹ️ No se detectaron áreas de texto para eliminar');
        }
    }

    detectarAreasAltoContraste(data, width, height) {
        const areas = [];
        const visitado = new Array(width * height).fill(false);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = y * width + x;
                
                if (!visitado[pixelIndex]) {
                    const contraste = this.calcularContrasteLocal(data, x, y, width, height);
                    
                    if (contraste > 100) { // Alto contraste
                        const area = this.encontrarAreaConectada(data, x, y, width, height, visitado, 100);
                        
                        if (area && area.ancho > 10 && area.alto > 10 && area.ancho < width * 0.3 && area.alto < height * 0.3) {
                            areas.push(area);
                        }
                    }
                }
            }
        }
        
        return areas;
    }

    calcularContrasteLocal(data, x, y, width, height) {
        let contraste = 0;
        const radio = 3;
        
        for (let i = y - radio; i <= y + radio; i++) {
            for (let j = x - radio; j <= x + radio; j++) {
                if (i >= 0 && i < height && j >= 0 && j < width) {
                    const indice = (i * width + j) * 4;
                    const luminancia = 0.299 * data[indice] + 0.587 * data[indice + 1] + 0.114 * data[indice + 2];
                    contraste += luminancia;
                }
            }
        }
        
        const promedio = contraste / ((radio * 2 + 1) * (radio * 2 + 1));
        const indiceCentral = (y * width + x) * 4;
        const luminanciaCentral = 0.299 * data[indiceCentral] + 0.587 * data[indiceCentral + 1] + 0.114 * data[indiceCentral + 2];
        
        return Math.abs(luminanciaCentral - promedio);
    }

    encontrarAreaConectada(data, startX, startY, width, height, visitado, umbralContraste) {
        const area = { x: startX, y: startY, ancho: 0, alto: 0 };
        const cola = [{ x: startX, y: startY }];
        let minX = startX, maxX = startX, minY = startY, maxY = startY;
        
        while (cola.length > 0) {
            const { x, y } = cola.shift();
            const pixelIndex = y * width + x;
            
            if (x < 0 || x >= width || y < 0 || y >= height || visitado[pixelIndex]) {
                continue;
            }
            
            const contraste = this.calcularContrasteLocal(data, x, y, width, height);
            if (contraste >= umbralContraste) {
                visitado[pixelIndex] = true;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                
                // Agregar vecinos
                cola.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
            }
        }
        
        area.x = minX;
        area.y = minY;
        area.ancho = maxX - minX + 1;
        area.alto = maxY - minY + 1;
        
        return area.ancho > 5 && area.alto > 5 ? area : null;
    }
    */


    async analizarImagen() {
        if (!this.imagenOriginal) return;
        
        this.mostrarNotificacion('🔍 Analizando composición de la imagen...', 'info');
        
        // Análisis simple de la imagen
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.imagenOriginal.width;
        canvas.height = this.imagenOriginal.height;
        ctx.drawImage(this.imagenOriginal, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let luminanciaTotal = 0;
        let saturaciónTotal = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            luminanciaTotal += 0.299 * r + 0.587 * g + 0.114 * b;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            saturaciónTotal += max === 0 ? 0 : (max - min) / max;
        }
        
        const luminanciaPromedio = luminanciaTotal / (data.length / 4);
        const saturaciónPromedio = saturaciónTotal / (data.length / 4);
        
        let análisis = `Luminancia: ${Math.round(luminanciaPromedio)} | `;
        análisis += `Saturación: ${Math.round(saturaciónPromedio * 100)}% | `;
        análisis += `Tamaño: ${canvas.width}×${canvas.height}px`;
        
        this.mostrarNotificacion(análisis, 'info');
    }

    activarModoComparacion() {
        this.mostrarNotificacion('👁️ Modo comparación activado - Desliza para comparar', 'info');
        
        // Implementación básica de modo comparación
        const container = this.elementos.previewOriginal.parentElement;
        container.style.position = 'relative';
        container.innerHTML += `
            <div class="comparison-slider absolute inset-0 bg-transparent cursor-col-resize" 
                 style="width: 50%; border-right: 2px solid #ffc600">
                <div class="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold">
                    ← Desliza →
                </div>
            </div>
        `;
        
        // Aquí iría la lógica completa del slider de comparación
    }

    descargarResultado() {
        if (!this.imagenProcesada) {
            this.mostrarNotificacion('❌ No hay resultado para descargar', 'error');
            return;
        }
        
        try {
            const enlace = document.createElement('a');
            enlace.href = this.imagenProcesada.toDataURL('image/png');
            enlace.download = `luminaedit_pro_${this.modoActual}_${Date.now()}.png`;
            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
            
            this.mostrarNotificacion('💾 Imagen descargada correctamente', 'exito');
            
        } catch (error) {
            console.error('Error descargando:', error);
            this.mostrarNotificacion('❌ Error al descargar', 'error');
        }
    }

    removerImagen() {
        this.imagenOriginal = null;
        this.imagenProcesada = null;
        this.elementos.inputImagen.value = '';
        this.elementos.infoArchivo.classList.add('hidden');
        this.elementos.contenedorPreview.classList.add('hidden');
        this.elementos.btnProcesar.disabled = true;
        this.elementos.placeholderOriginal.classList.remove('hidden');
        this.elementos.placeholderResultado.classList.remove('hidden');
        
        this.mostrarNotificacion('🗑️ Imagen removida', 'info');
    }

    formatearTamanoArchivo(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    mostrarNotificacion(mensaje, tipo) {
        // Crear notificación
        const notificacion = document.createElement('div');
        const tipoConfig = {
            exito: { icon: 'check-circle', color: 'from-green-500 to-green-400' },
            error: { icon: 'exclamation-triangle', color: 'from-red-500 to-red-400' },
            info: { icon: 'info-circle', color: 'from-blue-500 to-blue-400' }
        };
        
        const config = tipoConfig[tipo] || tipoConfig.info;
        
        notificacion.className = `fixed top-6 right-6 p-4 rounded-2xl shadow-2xl z-50 transform transition-all duration-500 translate-x-32 opacity-0 bg-gradient-to-r ${config.color} text-white`;
        
        notificacion.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-${config.icon} text-xl"></i>
                <span class="font-semibold">${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        // Animación de entrada
        setTimeout(() => {
            notificacion.classList.remove('translate-x-32', 'opacity-0');
            notificacion.classList.add('translate-x-0', 'opacity-100');
        }, 10);
        
        // Auto-eliminar
        setTimeout(() => {
            notificacion.classList.remove('translate-x-0', 'opacity-100');
            notificacion.classList.add('translate-x-32', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 500);
        }, 4000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.luminaEdit = new LuminaEditEngine();
});

// Manejar errores no capturados
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Optimizar para móviles
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Aquí podrías registrar un service worker para caching
    });
}