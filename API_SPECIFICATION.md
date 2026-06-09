# API_SPECIFICATION.md

# GOLEATE! API Specification

Version: v1

Architecture Style: REST API

Base URL:

```http
/api/v1
```

Authentication:

```http
Bearer JWT
```

Content-Type:

```http
application/json
```

---

# Response Standards

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Validation error",
  "errors": []
}
```

---

# AUTH MODULE

## Request OTP

### Endpoint

```http
POST /auth/request-otp
```

### Body

```json
{
  "email": "usuario@tecsup.edu.pe"
}
```

### Validation

* Must end with @tecsup.edu.pe

### Response

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

## Verify OTP

### Endpoint

```http
POST /auth/verify-otp
```

### Body

```json
{
  "email": "usuario@tecsup.edu.pe",
  "otp": "123456"
}
```

### Response

```json
{
  "success": true,
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

## Refresh Token

### Endpoint

```http
POST /auth/refresh
```

### Body

```json
{
  "refreshToken": "token"
}
```

---

## Logout

### Endpoint

```http
POST /auth/logout
```

Authorization Required.

---

# USER MODULE

## Get My Profile

### Endpoint

```http
GET /users/me
```

### Response

```json
{
  "id": "uuid",
  "fullName": "Juan Perez",
  "email": "juan@tecsup.edu.pe",
  "career": "Diseño y Desarrollo de Software",
  "course": "Cloud Computing",
  "totalPoints": 125,
  "accuracyRate": 78.5,
  "currentStreak": 4,
  "maxStreak": 9,
  "level": 6
}
```

---

## Update Profile

### Endpoint

```http
PATCH /users/me
```

### Body

```json
{
  "fullName": "Juan Perez",
  "career": "Diseño y Desarrollo de Software",
  "course": "Cloud Computing"
}
```

---

## Upload Profile Image

### Endpoint

```http
POST /users/me/avatar
```

Content-Type:

```http
multipart/form-data
```

Storage:

AWS S3

---

# MATCHES MODULE

## Get Upcoming Matches

### Endpoint

```http
GET /matches/upcoming
```

### Query Parameters

```http
?page=1
&limit=20
```

### Response

```json
{
  "matches": [
    {
      "id": "uuid",
      "homeTeam": "Brazil",
      "awayTeam": "Argentina",
      "kickoffTime": "2026-06-20T18:00:00Z",
      "predictionDeadline": "2026-06-20T17:50:00Z"
    }
  ]
}
```

---

## Get Match Details

### Endpoint

```http
GET /matches/{matchId}
```

---

## Get Today's Matches

### Endpoint

```http
GET /matches/today
```

---

## Get Live Matches

### Endpoint

```http
GET /matches/live
```

---

## Get Finished Matches

### Endpoint

```http
GET /matches/finished
```

---

# PREDICTIONS MODULE

## Create Prediction

### Endpoint

```http
POST /predictions
```

### Body

```json
{
  "matchId": "uuid",
  "predictedHomeScore": 2,
  "predictedAwayScore": 1
}
```

### Business Rules

* One prediction per user.
* Match must be open.
* Deadline not exceeded.

---

## Update Prediction

### Endpoint

```http
PATCH /predictions/{predictionId}
```

Allowed only before deadline.

---

## Delete Prediction

### Endpoint

```http
DELETE /predictions/{predictionId}
```

Allowed only before deadline.

---

## Get My Predictions

### Endpoint

```http
GET /predictions/me
```

---

## Get Prediction History

### Endpoint

```http
GET /predictions/history
```

---

# ROOMS MODULE

## Create Room

### Endpoint

```http
POST /rooms
```

### Body

```json
{
  "name": "DSW2026",
  "description": "Sala oficial de Software"
}
```

### Business Rules

* Maximum 3 rooms per user.

---

## Join Room

### Endpoint

```http
POST /rooms/join
```

### Body

```json
{
  "inviteCode": "ABC123"
}
```

---

## Leave Room

### Endpoint

```http
POST /rooms/{roomId}/leave
```

---

## Get Room Details

### Endpoint

```http
GET /rooms/{roomId}
```

---

## Get Room Members

### Endpoint

```http
GET /rooms/{roomId}/members
```

---

## Get My Rooms

### Endpoint

```http
GET /rooms/my
```

---

# RANKINGS MODULE

## Global Ranking

### Endpoint

```http
GET /rankings/global
```

### Query

```http
?page=1
&limit=50
```

---

## Room Ranking

### Endpoint

```http
GET /rankings/room/{roomId}
```

---

## Career Ranking

### Endpoint

```http
GET /rankings/careers
```

---

## Course Ranking

### Endpoint

```http
GET /rankings/courses
```

---

## Hall of Fame

### Endpoint

```http
GET /rankings/hall-of-fame
```

---

# ACHIEVEMENTS MODULE

## Get Available Achievements

### Endpoint

```http
GET /achievements
```

---

## Get My Achievements

### Endpoint

```http
GET /achievements/me
```

---

## Get Achievement Details

### Endpoint

```http
GET /achievements/{achievementId}
```

---

# ACTIVITY FEED MODULE

## Global Feed

### Endpoint

```http
GET /activity-feed
```

---

## Room Feed

### Endpoint

```http
GET /activity-feed/room/{roomId}
```

---

# COLLECTIVE PREDICTIONS MODULE

## Get Collective Prediction

### Endpoint

```http
GET /collective-predictions/{matchId}
```

### Response

```json
{
  "homeWin": 72,
  "draw": 18,
  "awayWin": 10
}
```

---

# NOTIFICATIONS MODULE

## Get Notifications

### Endpoint

```http
GET /notifications
```

---

## Mark As Read

### Endpoint

```http
PATCH /notifications/{notificationId}/read
```

---

## Mark All As Read

### Endpoint

```http
PATCH /notifications/read-all
```

---

# AI MODULE

## Ask Chatbot

### Endpoint

```http
POST /ai/chat
```

### Body

```json
{
  "question": "¿Cuál es mi precisión?"
}
```

### Response

```json
{
  "answer": "Tu precisión actual es 78.4%"
}
```

---

## Get Daily Summary

### Endpoint

```http
GET /ai/summary/daily
```

---

## Get Weekly Summary

### Endpoint

```http
GET /ai/summary/weekly
```

---

# ADMIN MODULE

Authorization:

ADMIN only

---

## Sync Matches

### Endpoint

```http
POST /admin/matches/sync
```

### Description

Synchronizes matches from API-Football.

---

## Recalculate Rankings

### Endpoint

```http
POST /admin/rankings/recalculate
```

---

## Generate AI Summaries

### Endpoint

```http
POST /admin/ai/generate-summaries
```

---

## Get System Metrics

### Endpoint

```http
GET /admin/metrics
```

### Response

```json
{
  "totalUsers": 3000,
  "totalPredictions": 45000,
  "activeRooms": 320,
  "matches": 80
}
```

---

# HEALTH CHECKS

## API Health

### Endpoint

```http
GET /health
```

### Response

```json
{
  "status": "healthy"
}
```

---

# Rate Limits

General Endpoints

```txt
100 requests/minute
```

Authentication

```txt
10 requests/minute
```

Chatbot

```txt
20 requests/minute
```

---

# Security Requirements

* JWT Authentication
* Refresh Tokens
* HTTPS Required
* Input Validation
* DTO Validation
* SQL Injection Protection
* XSS Protection
* Rate Limiting
* CORS Configuration
* Audit Logging

---

# Swagger

All endpoints must be documented using:

@nestjs/swagger

Documentation URL:

```http
/api/docs
```

All DTOs, responses and examples must be visible through Swagger UI.
