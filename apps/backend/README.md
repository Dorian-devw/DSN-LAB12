# ⚙️ GOLEATE! - Backend & Core API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

GOLEATE! Backend es el motor principal y la capa de lógica de negocio detrás de la plataforma de predicciones deportivas de TECSUP.
Construido bajo una arquitectura hexagonal impulsada por NestJS, este servicio provee una API RESTful robusta, conexiones WebSockets en tiempo real y procesos automatizados (Cron Jobs) para el cálculo masivo de puntajes.

---

## ✨ Características Principales (Features)

*   **🔒 Auth & Seguridad:** Validación estricta con dominios `@tecsup.edu.pe`, autenticación OTP por email (Brevo) y protección mediante JSON Web Tokens (JWT).
*   **⚽ Sincronización Automática (Cron):** Integración con `API-Football` para descargar partidos de la Copa Mundial de la FIFA automáticamente.
*   **🧮 Motor de Puntajes:** Sistema matemático automatizado que reparte puntos (3 puntos por exactitud, 1 punto por tendencia) tan pronto finaliza un partido en el mundo real.
*   **🤖 Integración de Inteligencia Artificial:** Conexión con `Groq API` (Llama 3) para generar análisis deportivos, chatbots predictivos y resúmenes de rendimiento.
*   **📡 WebSockets:** Notificaciones Push en tiempo real para eventos dentro del ecosistema (partidos en vivo, logros desbloqueados).
*   **📦 Alta Disponibilidad:** Optimizado para la nube, utilizando Redis para cachés veloces y PostgreSQL como única fuente de verdad.

---

## 🏗️ Arquitectura y Tecnologías

El Backend sigue estrictamente los principios SOLID y la inyección de dependencias modular:

*   **Framework:** [NestJS](https://nestjs.com/) (Express under the hood)
*   **ORM:** [Prisma](https://www.prisma.io/) (Typesafe Database Client)
*   **Base de Datos:** PostgreSQL
*   **Caché y Eventos:** Redis
*   **Despliegue:** Imagen Docker lista para Amazon ECS o Docker Hub.

---

## 📁 Estructura del Proyecto

```text
apps/backend/
├── Dockerfile                  # Receta para construir la imagen (Docker Hub/AWS)
├── prisma/
│   ├── schema.prisma           # Esquema de la base de datos (Modelos y Relaciones)
│   └── migrations/             # Historial de migraciones SQL
├── src/
│   ├── auth/                   # Módulo de Autenticación, JWT, Guardias y Brevo
│   ├── users/                  # Gestión de perfiles, puntos totales y avatares
│   ├── matches/                # Sincronización API-Football y Cron Jobs
│   ├── predictions/            # CRUD de predicciones de los estudiantes
│   ├── rankings/               # Cálculo matemático de las tablas de clasificación
│   ├── rooms/                  # Lógica de Salas Privadas y códigos de acceso
│   ├── achievements/           # Sistema de Gamificación (Insignias/Marcos)
│   ├── ai/                     # Integración con LLMs (Groq)
│   ├── notifications/          # WebSockets y Push Notifications
│   ├── prisma/                 # Servicio de conexión a base de datos
│   └── utils/                  # Herramientas matemáticas (scoring.util.ts)
```

---

## ⚙️ Variables de Entorno

Para levantar este servidor, asegúrate de tener el archivo `.env` configurado:

```env
# Conexión a Base de Datos
DATABASE_URL=postgresql://root:rootpassword@localhost:5432/goleate?schema=public

# Conexión a Caché
REDIS_HOST=localhost
REDIS_PORT=6379

# Seguridad
JWT_SECRET=super_secret_goleate_key_2026

# APIs Externas
API_FOOTBALL_KEY=tu_api_key_de_football
SENDGRID_API_KEY=tu_api_key_de_brevo_o_sendgrid
GROQ_API_KEY=tu_api_key_de_groq
```

---

## 🐳 Despliegue e Imágenes Docker

Esta aplicación ha sido diseñada como un microservicio "Stateless", lo que la hace perfecta para contenedores.

**Para descargar/usar desde Docker Hub:**
```bash
docker pull dorian778/goleate-backend:latest
docker run -p 3000:3000 --env-file .env dorian778/goleate-backend:latest
```

**Para construir la imagen localmente y subir a Docker Hub:**
```bash
docker build -t dorian778/goleate-backend:latest -f apps/backend/Dockerfile .
docker push dorian778/goleate-backend:latest
```

---

## 🛠️ Comandos de Desarrollo (Local)

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```
2.  **Generar Tipos de Prisma:**
    ```bash
    npx prisma generate --schema=apps/backend/prisma/schema.prisma
    ```
3.  **Iniciar Servidor en Modo Watch:**
    ```bash
    npm run dev:backend
    ```

---

> **Ingeniería robusta y de alto rendimiento. Arquitecturado para soportar miles de conexiones simultáneas durante los partidos del mundial.**
