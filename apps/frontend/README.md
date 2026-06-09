# ⚽ GOLEATE! - Frontend Web Application

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

GOLEATE! es una plataforma web gamificada de predicciones deportivas diseñada exclusivamente para los estudiantes de TECSUP. 
Esta interfaz de usuario moderna permite a los estudiantes predecir resultados de la Copa Mundial de la FIFA, competir en un ranking global o en salas privadas, ganar insignias y recibir análisis impulsados por Inteligencia Artificial.

---

## ✨ Características Principales (Features)

*   **🏆 Predicciones en Vivo:** Interfaz intuitiva para pronosticar los marcadores de la FIFA.
*   **📊 Rankings Dinámicos:** Tablas de clasificación en tiempo real (Global y por Salas).
*   **🏢 Salas Privadas y Académicas:** Sistema de creación de salas protegidas por códigos de invitación.
*   **🏅 Gamificación Glassmorphism:** Diseño hiper-moderno con avatares, marcos (frames), insignias de logros y sistema de niveles.
*   **🤖 Asistente IA (Groq):** Resúmenes predictivos y análisis de equipos generados por inteligencia artificial al vuelo.
*   **🔒 Autenticación Institucional:** Acceso exclusivo mediante correos `@tecsup.edu.pe` con validación OTP.

---

## 🏗️ Arquitectura y Tecnologías

El Frontend está construido utilizando las últimas tecnologías del mercado, siguiendo una arquitectura orientada a componentes modulares:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** Vanilla CSS (Glassmorphism + Dark Mode Nativo)
*   **Consumo de API:** Arquitectura `fetch` nativa encapsulada en `src/lib/api.ts`
*   **Despliegue:** Contenedorizado con Docker (Alpine) para AWS ECS Fargate.

---

## 📁 Estructura del Proyecto

```text
apps/frontend/
├── Dockerfile                  # Receta para construir la imagen en AWS
├── next.config.ts              # Configuración base de Next.js
├── public/                     # Assets estáticos (íconos, imágenes, fondos)
└── src/
    ├── app/
    │   ├── globals.css         # Tokens de diseño, colores y utilidades base
    │   ├── layout.tsx          # Estructura principal (HTML, Body, Navegación)
    │   ├── page.tsx            # Landing Page (Página de Aterrizaje)
    │   └── dashboard/          # Panel de Usuario (Protegido)
    │       ├── layout.tsx      # Barra lateral (Sidebar) del panel
    │       ├── page.tsx        # Resumen general (Stats, Predicciones)
    │       ├── matches/        # Listado de Partidos y Formulario de predicción
    │       ├── rankings/       # Top 10 y Tabla de posiciones global
    │       └── rooms/          # Creación y membresía de salas privadas
    └── lib/
        └── api.ts              # Cliente HTTP centralizado (Intercepción de JWT)
```

---

## ⚙️ Variables de Entorno

Para ejecutar este proyecto en tu entorno local o en producción, necesitas configurar las siguientes variables de entorno. Crea un archivo `.env` o `.env.local` en la raíz de `apps/frontend/`:

```env
# URL del Backend API (NestJS)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🚀 Despliegue Local (Desarrollo)

Sigue estos pasos para arrancar la interfaz web en tu computadora:

1.  **Instalar dependencias** (desde la raíz del monorepo):
    ```bash
    npm install
    ```
2.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev:frontend
    ```
    *La aplicación estará disponible en `http://localhost:3001` (o el puerto que Next asigne).*

---

## 🐳 Despliegue con Docker

El proyecto ya está preparado para DevOps mediante contenedores.

**Opción A: Docker Compose (Recomendado)**
Desde la raíz del proyecto, ejecuta toda la arquitectura (Backend + Frontend + BBDD):
```bash
docker compose up --build -d
```

**Opción B: Construcción aislada del Frontend**
Si deseas empaquetar únicamente esta interfaz:
```bash
docker build -t goleate-frontend -f Dockerfile .
docker run -p 3001:3001 goleate-frontend
```

---

## 🛡️ Seguridad y Buenas Prácticas

1.  **Protección de Rutas:** El directorio `app/dashboard` es privado. Si un usuario no posee un JSON Web Token (JWT) válido en el almacenamiento de su navegador, es redirigido automáticamente a la Landing Page.
2.  **CSR y SSR:** Se emplea Client-Side Rendering (`"use client"`) exclusivamente donde se requiere interactividad o manejo de estados, dejando el resto pre-renderizado para un mejor rendimiento y SEO básico.
3.  **UI/UX:** Se respetan estrictamente las directrices del documento `UI_UX_SPECIFICATION.md`, implementando paletas oscuras, desenfoque de fondo (*backdrop-filter*) y tarjetas semitransparentes.

---

> **Diseñado y programado para el ecosistema universitario de TECSUP.**
