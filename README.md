# 🧪 Quiz Ciencia - Aplicación Educativa de Preguntas

Una aplicación web progresiva (PWA) interactiva para aprender ciencia de forma divertida. Con preguntas diseñadas para tres niveles de dificultad: Niño, Joven y Adulto.

## 🌟 Características

- ✨ **30 Preguntas de Ciencia**: Categoría completa con temas de astronomía, biología, física, química y ciencias naturales
- 🎯 **Tres Niveles de Dificultad**: Niño, Joven, Adulto + Modo Mixto
- 🎨 **Diseño Cartoon Vibrante**: Interfaz colorida y animada con Framer Motion
- 📱 **PWA Completa**: Instalable en dispositivos móviles y compatible con ChromeOS
- 🏆 **Sistema de Puntuación**: Feedback inmediato con explicaciones detalladas
- 🎉 **Celebraciones Animadas**: Confetti y animaciones al completar el quiz
- 💾 **Almacenamiento Local**: Guarda resultados en localStorage y archivo JSON
- 🔌 **API REST**: Endpoints para obtener preguntas y guardar resultados
- ⚡ **Optimizado para ARM64**: Funciona perfectamente en Chromebooks de bajos recursos

## 🚀 Tecnologías Utilizadas

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Radix UI** (componentes accesibles)
- **Framer Motion** (animaciones)
- **Lucide React** (iconos)
- **React Confetti** (celebraciones)

## 📦 Instalación

### Requisitos previos
- Node.js 18+ o 20+
- pnpm (recomendado) o npm

### Pasos

```bash
# Clonar el repositorio
git clone <repository-url>
cd lol-quizz

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar en producción
pnpm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📂 Estructura del Proyecto

```
lol-quizz/
├── data/
│   ├── questions.json      # 30 preguntas de ciencia
│   ├── metadata.json       # Metadatos del quiz
│   └── results.json        # Resultados guardados
├── public/
│   ├── icons/              # Iconos PWA
│   ├── manifest.json       # Manifiesto PWA
│   └── sw.js              # Service Worker
├── scripts/
│   └── validate-questions.mjs  # Script de validación
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/    # Health check endpoint
│   │   │   ├── questions/ # Endpoints de preguntas
│   │   │   └── results/   # Endpoints de resultados
│   │   ├── page.tsx       # Página principal
│   │   ├── quiz/
│   │   │   └── page.tsx   # Página del quiz
│   │   └── results/
│   │       └── page.tsx   # Página de resultados
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── LevelSelector.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── QuizProgress.tsx
│   │   └── ui/            # Componentes Radix UI
│   ├── hooks/
│   │   └── useQuiz.ts     # Hook personalizado del quiz
│   ├── lib/
│   │   └── quiz-utils.ts  # Utilidades del quiz
│   └── types/
│       └── quiz.ts        # Tipos TypeScript
├── package.json
└── README.md
```

## 🔌 API REST

La aplicación incluye una API REST completa para interactuar con las preguntas y resultados del quiz.

### Endpoints Disponibles

#### 1. Health Check
**GET** `/api/health`

Verifica el estado de la aplicación y retorna información básica.

**Respuesta:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-25T10:00:00.000Z",
  "data": {
    "totalQuestions": 30,
    "metadata": { ... }
  }
}
```

#### 2. Obtener Preguntas
**GET** `/api/questions`

Obtiene una lista de preguntas del quiz.

**Query Parameters:**
- `level` (opcional): `niño` | `joven` | `adulto` | `mixto`
- `count` (opcional): Número de preguntas a retornar (default: 10)

**Ejemplo:**
```bash
GET /api/questions?level=joven&count=5
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q-011",
      "level": "joven",
      "text": "¿Qué proceso permite a las plantas convertir la luz solar en energía?",
      "choices": ["Respiración celular", "Fotosíntesis", "Fermentación", "Digestión"],
      "correctIndex": 1,
      "explanation": "La fotosíntesis es el proceso...",
      "image": null
    }
  ],
  "total": 5
}
```

#### 3. Obtener Pregunta Individual
**GET** `/api/questions/[id]`

Obtiene una pregunta específica por su ID.

**Ejemplo:**
```bash
GET /api/questions/q-001
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "q-001",
    "level": "niño",
    "text": "¿Cuál es el planeta más grande de nuestro sistema solar?",
    "choices": ["Marte", "Júpiter", "Saturno", "Tierra"],
    "correctIndex": 1,
    "explanation": "Júpiter es el planeta más grande...",
    "image": null
  }
}
```

#### 4. Guardar Resultados
**POST** `/api/results`

Guarda los resultados de un quiz completado.

**Body:**
```json
{
  "level": "joven",
  "score": 80,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "incorrectAnswers": 2,
  "timeSpent": 120,
  "answers": [
    {
      "questionId": "q-011",
      "selectedIndex": 1,
      "isCorrect": true,
      "timeSpent": 12
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Resultado guardado correctamente",
  "data": {
    "id": "result-1737806400000",
    "timestamp": "2026-01-25T10:00:00.000Z",
    "score": 80,
    "level": "joven"
  }
}
```

#### 5. Obtener Resultados Guardados
**GET** `/api/results`

Obtiene la lista de resultados guardados.

**Query Parameters:**
- `level` (opcional): Filtrar por nivel
- `limit` (opcional): Número máximo de resultados (default: 10)
- `sortBy` (opcional): `date` | `score` (default: `date`)

**Ejemplo:**
```bash
GET /api/results?level=joven&limit=5&sortBy=score
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "totalQuestions": 10,
      "correctAnswers": 8,
      "incorrectAnswers": 2,
      "score": 80,
      "timeSpent": 120,
      "level": "joven",
      "answers": [...],
      "date": "2026-01-25T10:00:00.000Z"
    }
  ],
  "total": 15,
  "showing": 5,
  "filters": {
    "level": "joven",
    "limit": 5,
    "sortBy": "score"
  }
}
```

#### 6. Validar Preguntas
**GET** `/api/questions/validate`

Valida la integridad de todas las preguntas del quiz.

**Respuesta:**
```json
{
  "success": true,
  "valid": true,
  "summary": {
    "totalQuestions": 30,
    "expectedQuestions": 30,
    "uniqueIds": 30,
    "hasDuplicates": false
  },
  "levelDistribution": {
    "niño": 10,
    "joven": 10,
    "adulto": 10
  },
  "expectedDistribution": {
    "niño": 10,
    "joven": 10,
    "adulto": 10
  },
  "metadataValid": true,
  "checks": {
    "uniqueIds": true,
    "correctCount": true,
    "validStructure": true,
    "metadataMatch": true
  }
}
```

### Manejo de Errores

Todos los endpoints retornan errores en el siguiente formato:

```json
{
  "success": false,
  "error": "Mensaje de error descriptivo",
  "details": "Detalles técnicos adicionales (opcional)"
}
```

**Códigos de Estado HTTP:**
- `200 OK`: Operación exitosa
- `400 Bad Request`: Datos inválidos en la petición
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Error de validación
- `500 Internal Server Error`: Error del servidor

### Persistencia de Datos

Los resultados se almacenan en:
- **Archivo local**: `data/results.json` (persistencia simple basada en archivos)
- **localStorage**: Para acceso rápido desde el navegador
- **Supabase** (opcional): Si se configuran las variables de entorno

## 📊 Sistema de Preguntas

### Generación de Preguntas

Las preguntas están almacenadas en `data/questions.json` con el siguiente formato:

```json
{
  "id": "q-001",
  "level": "niño" | "joven" | "adulto",
  "text": "Pregunta en español",
  "choices": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correctIndex": 1,
  "explanation": "Breve explicación",
  "image": null
}
```

### Niveles de Dificultad

- **Niño**: Preguntas básicas con lenguaje simple y hechos curiosos
- **Joven**: Preguntas intermedias que requieren razonamiento
- **Adulto**: Preguntas avanzadas con conceptos complejos
- **Mixto**: Combinación aleatoria de todos los niveles

### Validar Preguntas

Puedes validar la integridad de las preguntas de dos formas:

**1. Script de validación:**
```bash
node scripts/validate-questions.mjs
```

**2. Endpoint de validación:**
```bash
curl http://localhost:3000/api/questions/validate
```

El validador verifica:
- ✅ IDs únicos (sin duplicados)
- ✅ Estructura correcta de cada pregunta
- ✅ Exactamente 4 opciones por pregunta
- ✅ Índice de respuesta correcta válido (0-3)
- ✅ Presencia de explicaciones
- ✅ Coherencia con metadata
- ✅ Total de 30 preguntas

### Regenerar Preguntas

Para regenerar o modificar las preguntas:

1. Edita el archivo `data/questions.json`
2. Asegúrate de seguir el formato JSON correcto
3. Cada pregunta debe tener exactamente 4 opciones
4. El `correctIndex` debe estar entre 0 y 3
5. Actualiza `data/metadata.json` si cambias el número total de preguntas
6. Ejecuta el validador para verificar: `node scripts/validate-questions.mjs`

## 🎨 Sistema de Diseño

### Paleta de Colores

- **Coral Primario**: `#FF6B6B` (para botones principales)
- **Turquesa**: `#4ECDC4` (para secundarios)
- **Amarillo Sol**: `#FFE66D` (para acentos)
- **Púrpura Vibrante**: `#A855F7` (para niveles avanzados)
- **Gris Claro**: `#F8F9FA` (fondos)
- **Gris Oscuro**: `#2D3436` (texto)

### Componentes

Todos los componentes usan:
- Bordes redondeados (border-radius: 1rem+)
- Sombras suaves para profundidad
- Transiciones suaves (300ms)
- Animaciones con Framer Motion
- Hover effects para interactividad

## 📱 PWA (Progressive Web App)

### Características PWA

- ✅ Instalable en dispositivos móviles
- ✅ Funciona offline (caché básico)
- ✅ Icono en pantalla de inicio
- ✅ Splash screen
- ✅ Orientación portrait
- ✅ Service Worker registrado

### Instalación en Dispositivos

**Android / ChromeOS:**
1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona "Instalar aplicación" o "Añadir a pantalla de inicio"

**iOS:**
1. Abre la app en Safari
2. Toca el botón Compartir
3. Selecciona "Añadir a pantalla de inicio"

### Generar Iconos PWA

Los iconos se pueden generar abriendo el archivo:
```
public/icons/generate-icons.html
```

Este script genera automáticamente todos los tamaños necesarios (72x72 hasta 512x512).

## 🔧 Configuración

### Variables de Entorno

No se requieren variables de entorno para la versión básica. Para integración con Supabase (opcional):

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

Para activar el uso de API en el frontend:

```env
NEXT_PUBLIC_USE_API=true
```

### Personalización

**Cambiar colores:**
Edita `src/app/globals.css` en la sección `:root`

**Agregar más preguntas:**
Edita `data/questions.json` y añade objetos siguiendo el formato

**Cambiar temas:**
Modifica las categorías en los componentes de nivel

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Conecta tu repositorio con Vercel
vercel

# O deploy manual
vercel --prod
```

### Netlify

```bash
# Instalar CLI de Netlify
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Build Estático

```bash
pnpm build

# Los archivos estarán en .next/
# Sirve con cualquier servidor web
```

## 🧪 Testing

```bash
# Ejecutar linter
pnpm lint

# Validar preguntas
node scripts/validate-questions.mjs

# Build de prueba
pnpm build

# Test de API (requiere servidor corriendo)
curl http://localhost:3000/api/health
curl http://localhost:3000/api/questions/validate
```

## 📝 Notas de Desarrollo

### Optimizaciones para Chromebook ARM64

- Sin dependencias pesadas innecesarias
- Imágenes optimizadas (se recomienda WebP)
- Caché de service worker para recursos estáticos
- Lazy loading de componentes grandes
- Renderizado eficiente con React 19

### Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Chrome Android
- ✅ Safari iOS

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- Iconos: Lucide React
- Componentes UI: Radix UI
- Animaciones: Framer Motion
- Framework: Next.js
- Estilo: Tailwind CSS

---

Hecho con ❤️ para aprender ciencia de forma divertida
