# PRD.md

# GOLEATE! - Product Requirements Document

Version: 1.0

Project Type: Cloud-Native Web Application

Target Audience: TECSUP Students

Primary Tournament: FIFA World Cup

---

# 1. Executive Summary

Goleate! es una plataforma web de predicciones deportivas diseñada para estudiantes de TECSUP.

Los usuarios podrán predecir resultados de partidos oficiales de la FIFA World Cup, competir con otros estudiantes, crear salas privadas, obtener logros y visualizar estadísticas personales y comunitarias.

La plataforma busca combinar elementos de:

* Sofascore
* Fantasy Sports
* Discord
* Gamificación académica

El sistema deberá ser escalable, desplegable en AWS y soportar aproximadamente 3000 estudiantes activos.

---

# 2. Problem Statement

Actualmente los estudiantes siguen eventos deportivos utilizando grupos de WhatsApp, Discord o redes sociales.

Estos medios presentan problemas:

* No existe seguimiento automático de puntajes.
* No existen rankings centralizados.
* No existe historial de predicciones.
* No existe gamificación.
* No existe análisis estadístico.
* No existe integración con resultados reales.

Goleate! busca centralizar toda esta experiencia en una única plataforma.

---

# 3. Product Vision

Convertirse en la principal plataforma universitaria de predicciones deportivas de TECSUP, ofreciendo una experiencia competitiva, social y entretenida.

Aunque inicialmente estará enfocada en la FIFA World Cup, la arquitectura permitirá soportar futuros torneos deportivos.

---

# 4. Product Goals

## Objetivos Funcionales

* Permitir autenticación institucional.
* Mostrar partidos reales.
* Registrar predicciones.
* Calcular puntajes automáticamente.
* Gestionar salas.
* Mostrar rankings.
* Proporcionar estadísticas.
* Incorporar IA.

## Objetivos Técnicos

* Soportar 3000 usuarios.
* Arquitectura cloud-native.
* Escalamiento horizontal.
* Contenerización completa.
* Disponibilidad superior al 99%.

---

# 5. Target Users

## Usuario Principal

Estudiante TECSUP.

Edad:

17 a 25 años.

Características:

* Usuario frecuente de aplicaciones móviles.
* Familiarizado con Discord.
* Familiarizado con redes sociales.
* Interesado en deportes y competencias.

---

# 6. User Personas

## Persona 1

Nombre:

Carlos

Carrera:

Diseño y Desarrollo de Software

Objetivo:

Competir con sus compañeros y liderar rankings.

---

## Persona 2

Nombre:

María

Carrera:

Arquitectura

Objetivo:

Participar en grupos privados con amigos.

---

## Persona 3

Nombre:

Luis

Carrera:

Ciberseguridad

Objetivo:

Analizar estadísticas y precisión histórica.

---

# 7. Scope

## Incluido

* Login institucional
* Perfil de usuario
* Predicciones
* Salas
* Rankings
* IA
* Feed social
* Logros
* Hall of Fame
* PWA

## No Incluido

* Apuestas reales
* Transferencias monetarias
* Marketplace
* Chats privados
* Comentarios públicos

---

# 8. Authentication Requirements

## Login

Solo correos:

@tecsup.edu.pe

## OTP

Proceso:

1. Ingresar correo.
2. Recibir código.
3. Verificar código.
4. Acceder.

## Restricciones

Correos externos deben ser rechazados.

---

# 9. User Profile Requirements

Cada usuario debe poseer:

* Nombre completo
* Correo institucional
* Carrera
* Curso principal
* Foto de perfil
* Nivel
* Puntaje total
* Precisión histórica
* Racha máxima
* Insignias obtenidas
* Sala favorita

---

# 10. Match Requirements

Los partidos serán obtenidos mediante API-Football.

Cada partido debe mostrar:

* Equipo local
* Equipo visitante
* Escudo
* Fecha
* Hora
* Estado
* Resultado

Estados:

* Programado
* En curso
* Finalizado

---

# 11. Prediction Requirements

Los usuarios podrán predecir:

* Goles local
* Goles visitante

Las predicciones estarán disponibles hasta:

10 minutos antes del inicio.

Luego quedarán bloqueadas automáticamente.

---

# 12. Scoring System

## Exact Score

Puntaje:

5

Condición:

Marcador exacto.

---

## Correct Winner

Puntaje:

3

Condición:

Acertar ganador o empate.

---

## Goal Difference

Puntaje:

2

Condición:

Acertar margen de victoria.

---

## Streak Bonus

Puntaje:

+2

Condición:

3 partidos consecutivos acertados.

---

## Early Prediction

Puntaje:

+1

Condición:

Predicción realizada más de 24 horas antes.

---

# 13. Ranking Requirements

## Ranking Global

Todos los usuarios.

## Ranking por Sala

Miembros de una sala.

## Ranking por Carrera

Usuarios agrupados por carrera.

## Ranking por Curso

Usuarios agrupados por curso.

## Hall of Fame

Histórico permanente.

---

# 14. Room Requirements

Inspiración:

Discord.

## Características

* Nombre
* Descripción
* Imagen
* Código único
* Máximo 50 miembros

## Creación

Máximo:

3 salas por usuario.

## Tipos

### Académicas

Ejemplos:

* DSW2026
* Cloud Computing

### Sociales

Ejemplos:

* Los Cracks
* Equipo Perú

---

# 15. Activity Feed Requirements

Mostrar eventos relevantes.

Ejemplos:

🔥 Juan logró una racha de 6.

🏆 María ingresó al Top 10.

⚽ DSW2026 lidera la Liga de Carreras.

🎯 Pedro desbloqueó una insignia.

---

# 16. Gamification Requirements

## Insignias

Primer Acierto

10 Aciertos

50 Aciertos

100 Aciertos

Maestro Predictor

Leyenda Goleate

## Marcos

Bronce

Plata

Oro

Diamante

## Niveles

Novato

Analista

Experto

Maestro

Leyenda

---

# 17. Collective Prediction

El sistema mostrará estadísticas agregadas.

Ejemplo:

72% cree que ganará Brasil.

18% empate.

10% Argentina.

No deben mostrarse predicciones individuales.

---

# 18. AI Features

Proveedor:

GroqCloud

## Chatbot

Consultas permitidas:

* Mi ranking
* Mi precisión
* Mi racha
* Próximos partidos
* Estado de salas

## Automatic Summaries

Generación diaria.

Ejemplo:

"María fue la participante más precisa esta semana."

---

# 19. Notification Requirements

Tipos:

* Recordatorio de partido
* Cambio de ranking
* Logro desbloqueado
* Nueva insignia

Canales:

* Push Notification
* Notificación dentro del sistema

---

# 20. PWA Requirements

La aplicación deberá:

* Instalarse en Android
* Instalarse en iOS
* Tener icono propio
* Soportar acceso rápido
* Permitir notificaciones push

---

# 21. Non Functional Requirements

## Performance

Tiempo de respuesta:

Menor a 2 segundos.

## Availability

99% o superior.

## Scalability

3000 usuarios concurrentes.

## Security

JWT.

OTP.

HTTPS obligatorio.

Validación de dominio institucional.

## Accessibility

Responsive.

Desktop.

Tablet.

Mobile.

---

# 22. Success Metrics

## Engagement

70% de usuarios activos semanalmente.

## Retention

60% de retención semanal.

## Usage

Promedio mínimo:

3 predicciones por usuario por semana.

## Technical

95% de solicitudes respondidas exitosamente.

Tiempo promedio menor a 2 segundos.

---

# 23. Future Vision

Versiones futuras podrán incluir:

* Copa América
* Champions League
* Liga 1 Perú
* Torneos internos TECSUP
* Aplicación móvil nativa
* Sistema de temporadas
* Predicciones colaborativas

La arquitectura deberá estar preparada para soportar estas expansiones sin rediseños mayores.
