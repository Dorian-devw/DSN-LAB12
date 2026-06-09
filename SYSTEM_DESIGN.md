# SYSTEM_DESIGN.md

# GOLEATE! System Design Document

Version: 1.0

Architecture Style: Modular Monolith

Deployment Model: Cloud Native

Cloud Provider: AWS

---

# 1. System Overview

Goleate! es una plataforma web de predicciones deportivas para estudiantes TECSUP.

El sistema permitirá:

* Autenticación institucional.
* Predicciones deportivas.
* Rankings.
* Salas sociales.
* Gamificación.
* Notificaciones.
* Inteligencia Artificial.
* Estadísticas.

La plataforma será desplegada sobre AWS utilizando contenedores Docker y preparada para soportar al menos 3000 usuarios concurrentes.

---

# 2. Architectural Principles

## Simplicity First

Se prioriza una arquitectura simple y mantenible.

No se implementarán microservicios independientes durante el MVP.

---

## Scalability

El sistema debe poder escalar horizontalmente.

---

## Cloud Native

Todos los componentes deben ser desplegables mediante contenedores.

---

## API First

Toda la lógica será expuesta mediante REST APIs.

---

## Security By Design

Todas las funcionalidades deberán incluir validaciones y controles de acceso.

---

# 3. High Level Architecture

```txt
┌─────────────────────────┐
│       CloudFront        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      Next.js PWA        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Application Load Balancer│
└────────────┬────────────┘
             │
 ┌───────────┴───────────┐
 ▼                       ▼
┌─────────────┐    ┌─────────────┐
│ NestJS API  │    │ NestJS API  │
│ Instance 1  │    │ Instance 2  │
└──────┬──────┘    └──────┬──────┘
       │                  │
       └────────┬─────────┘
                ▼
        ┌──────────────┐
        │ Redis Cache  │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ PostgreSQL   │
        │ AWS RDS      │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │ AWS S3       │
        └──────────────┘
```

---

# 4. Frontend Architecture

Technology Stack:

* Next.js 15
* React 19
* TypeScript
* TailwindCSS
* Shadcn/UI
* TanStack Query
* Zustand
* PWA

---

# Frontend Modules

## Authentication

Responsibilities:

* OTP Login
* Session Management

---

## Dashboard

Responsibilities:

* Upcoming Matches
* Rankings
* Notifications

---

## Predictions

Responsibilities:

* Create Prediction
* Edit Prediction

---

## Rooms

Responsibilities:

* Create Room
* Join Room
* View Members

---

## Profile

Responsibilities:

* Statistics
* Achievements
* Hall of Fame

---

## AI Assistant

Responsibilities:

* Chat Interface
* Summary Visualization

---

# 5. Backend Architecture

Technology:

NestJS

Architecture:

```txt
src/
│
├── auth/
├── users/
├── matches/
├── predictions/
├── rankings/
├── rooms/
├── achievements/
├── notifications/
├── ai/
├── admin/
├── integrations/
└── common/
```

---

# 6. Module Responsibilities

## Auth Module

Responsibilities:

* OTP generation
* OTP validation
* JWT creation
* Refresh token management

---

## Users Module

Responsibilities:

* User profile
* Statistics
* Avatar management

---

## Matches Module

Responsibilities:

* Match synchronization
* Match queries
* Match status updates

---

## Predictions Module

Responsibilities:

* Prediction creation
* Prediction validation
* Prediction scoring

---

## Rankings Module

Responsibilities:

* Global rankings
* Room rankings
* Career rankings
* Course rankings

---

## Rooms Module

Responsibilities:

* Room creation
* Room membership
* Invitation codes

---

## Notifications Module

Responsibilities:

* Push notifications
* In-app notifications

---

## AI Module

Responsibilities:

* Groq integration
* Chatbot
* Automatic summaries

---

# 7. Database Architecture

Database:

PostgreSQL

Deployment:

AWS RDS PostgreSQL

Approach:

Single relational database.

Reason:

* Easier maintenance.
* Strong consistency.
* Supports future scaling.

---

# 8. Caching Strategy

Technology:

Redis

Deployment:

AWS ElastiCache

---

# Cached Data

## Global Ranking

Cache Key:

```txt
leaderboard:global
```

TTL:

5 minutes

---

## Room Ranking

Cache Key:

```txt
leaderboard:room:{roomId}
```

TTL:

5 minutes

---

## Upcoming Matches

Cache Key:

```txt
matches:upcoming
```

TTL:

10 minutes

---

## User Statistics

Cache Key:

```txt
user:{userId}
```

TTL:

15 minutes

---

# 9. Match Synchronization Flow

Source:

API-Football

Flow:

```txt
Scheduler
    ↓
API-Football
    ↓
Transform Data
    ↓
Database
    ↓
Redis Cache Refresh
```

Frequency:

Every 5 minutes.

---

# 10. Prediction Scoring Flow

```txt
Match Finished
      ↓
Fetch Predictions
      ↓
Calculate Scores
      ↓
Update Users
      ↓
Update Rankings
      ↓
Generate Activities
      ↓
Refresh Redis
```

Trigger:

Automatic background job.

---

# 11. Ranking Calculation Strategy

Rankings should never be calculated in real time.

Instead:

```txt
Match Ends
    ↓
Update Points
    ↓
Update Ranking Tables
    ↓
Refresh Redis
```

This minimizes database load.

---

# 12. AI Integration

Provider:

Groq

---

# Chatbot Flow

```txt
User Question
      ↓
NestJS AI Module
      ↓
Gather User Data
      ↓
Build Context
      ↓
Groq API
      ↓
Return Response
```

---

# Daily Summary Flow

```txt
Cron Job
    ↓
Collect Statistics
    ↓
Build Prompt
    ↓
Groq
    ↓
Save Summary
```

---

# 13. Notification System

Types:

* Match reminders
* Ranking changes
* Achievement unlocked
* Room invitations

---

# Notification Flow

```txt
System Event
      ↓
Notification Service
      ↓
Database
      ↓
Push Notification
      ↓
Frontend
```

---

# 14. File Storage

Technology:

AWS S3

Stored Files:

* Profile Images
* Room Images
* Achievement Assets

---

# 15. Security Design

Authentication:

JWT

Authorization:

Role-Based Access Control

Roles:

* USER
* ADMIN

---

# Security Measures

* HTTPS only
* Rate limiting
* DTO validation
* Input sanitization
* Helmet
* CORS
* CSRF protection where applicable
* Secure cookies

---

# 16. Scalability Strategy

Current Target:

3000 users

---

# Horizontal Scaling

NestJS instances can scale independently.

```txt
1 Instance
     ↓
2 Instances
     ↓
4 Instances
     ↓
8 Instances
```

No code changes required.

---

# Database Scaling

Read-heavy operations:

Redis

Write-heavy operations:

PostgreSQL

Future Option:

Read Replicas

---

# 17. Monitoring

AWS CloudWatch

Metrics:

* CPU Usage
* Memory Usage
* Request Count
* Error Rate
* Latency

---

# Alerts

* API Down
* Database Down
* Redis Down
* High Error Rate

---

# 18. Logging

Framework:

Pino Logger

Store:

CloudWatch

Log Levels:

* INFO
* WARN
* ERROR

---

# 19. CI/CD Pipeline

```txt
Developer Push
      ↓
GitHub Actions
      ↓
Run Tests
      ↓
Build Docker Images
      ↓
Push to ECR
      ↓
Deploy ECS
      ↓
Health Check
      ↓
Production
```

---

# 20. Disaster Recovery

Database Backups:

Daily

Retention:

30 Days

---

# Recovery Objectives

RPO:

15 minutes

RTO:

1 hour

---

# 21. Performance Targets

API Response Time:

< 500ms

Page Load Time:

< 2 seconds

Ranking Query:

< 200ms

Prediction Submission:

< 300ms

---

# 22. Future Evolution

When Goleate exceeds 20,000 users:

Possible extraction of services:

* Ranking Service
* Notification Service
* AI Service

Transition Path:

Modular Monolith → Microservices

No database redesign required.

---

# 23. Architectural Decision Records (ADR)

ADR-001

Use PostgreSQL instead of MongoDB.

Reason:

Strong relationships.

---

ADR-002

Use Redis for rankings.

Reason:

Fast leaderboard access.

---

ADR-003

Use NestJS.

Reason:

Scalable enterprise architecture.

---

ADR-004

Use API-Football.

Reason:

Reliable football data source.

---

ADR-005

Use Groq.

Reason:

Low-cost AI integration for MVP.

```
```
