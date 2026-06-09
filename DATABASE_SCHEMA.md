# DATABASE_SCHEMA.md

# GOLEATE! Database Schema

Database Engine: PostgreSQL

Version: PostgreSQL 16+

ORM Recommendation: Prisma ORM

ID Strategy: UUID v4

Timezone: UTC

Naming Convention: snake_case

---

# Entity Relationship Overview

users
│
├── predictions
├── rooms (owner)
├── room_members
├── notifications
├── activity_logs
├── user_achievements
└── user_sessions

matches
│
├── predictions
└── collective_predictions

rooms
│
├── room_members
└── room_rankings

achievements
│
└── user_achievements

---

# ENUMS

## user_role

```sql
USER
ADMIN
```

## match_status

```sql
SCHEDULED
LIVE
FINISHED
CANCELLED
POSTPONED
```

## notification_type

```sql
MATCH_REMINDER
RANKING_UPDATE
ACHIEVEMENT_UNLOCKED
SYSTEM
```

## activity_type

```sql
PREDICTION_CREATED
ACHIEVEMENT_UNLOCKED
RANKING_UP
ROOM_JOINED
STREAK_REACHED
```

---

# TABLE: users

Stores platform users.

```sql
users
```

| Column              | Type                |
| ------------------- | ------------------- |
| id                  | uuid PK             |
| email               | varchar(255) UNIQUE |
| full_name           | varchar(150)        |
| profile_image_url   | text                |
| career              | varchar(100)        |
| course              | varchar(100)        |
| role                | user_role           |
| total_points        | integer             |
| total_predictions   | integer             |
| correct_predictions | integer             |
| accuracy_rate       | decimal(5,2)        |
| current_streak      | integer             |
| max_streak          | integer             |
| favorite_room_id    | uuid FK             |
| level               | integer             |
| is_active           | boolean             |
| created_at          | timestamp           |
| updated_at          | timestamp           |

Indexes:

```sql
email
total_points DESC
career
course
```

---

# TABLE: user_sessions

Stores active login sessions.

```sql
user_sessions
```

| Column        | Type      |
| ------------- | --------- |
| id            | uuid PK   |
| user_id       | uuid FK   |
| refresh_token | text      |
| expires_at    | timestamp |
| created_at    | timestamp |

---

# TABLE: otp_codes

Stores email verification codes.

```sql
otp_codes
```

| Column     | Type         |
| ---------- | ------------ |
| id         | uuid PK      |
| email      | varchar(255) |
| otp_code   | varchar(10)  |
| expires_at | timestamp    |
| used       | boolean      |
| created_at | timestamp    |

---

# TABLE: teams

Football teams.

```sql
teams
```

| Column      | Type           |
| ----------- | -------------- |
| id          | uuid PK        |
| api_team_id | integer UNIQUE |
| name        | varchar(100)   |
| short_name  | varchar(50)    |
| logo_url    | text           |
| country     | varchar(100)   |
| created_at  | timestamp      |

---

# TABLE: tournaments

Future-proof design.

```sql
tournaments
```

| Column            | Type         |
| ----------------- | ------------ |
| id                | uuid PK      |
| api_tournament_id | integer      |
| name              | varchar(150) |
| logo_url          | text         |
| season            | varchar(20)  |
| start_date        | date         |
| end_date          | date         |
| created_at        | timestamp    |

Example:

* FIFA World Cup 2026
* Copa América
* Champions League

---

# TABLE: matches

Stores football matches.

```sql
matches
```

| Column              | Type           |
| ------------------- | -------------- |
| id                  | uuid PK        |
| api_match_id        | integer UNIQUE |
| tournament_id       | uuid FK        |
| home_team_id        | uuid FK        |
| away_team_id        | uuid FK        |
| kickoff_time        | timestamp      |
| status              | match_status   |
| home_score          | integer        |
| away_score          | integer        |
| prediction_deadline | timestamp      |
| created_at          | timestamp      |
| updated_at          | timestamp      |

Indexes:

```sql
kickoff_time
status
prediction_deadline
```

---

# TABLE: predictions

Stores user predictions.

```sql
predictions
```

| Column                | Type      |
| --------------------- | --------- |
| id                    | uuid PK   |
| user_id               | uuid FK   |
| match_id              | uuid FK   |
| predicted_home_score  | integer   |
| predicted_away_score  | integer   |
| points_awarded        | integer   |
| is_exact_score        | boolean   |
| is_correct_winner     | boolean   |
| is_correct_difference | boolean   |
| early_bonus_awarded   | boolean   |
| created_at            | timestamp |
| updated_at            | timestamp |

Constraint:

```sql
UNIQUE(user_id, match_id)
```

Meaning:

One prediction per user per match.

---

# TABLE: rooms

Discord-style groups.

```sql
rooms
```

| Column      | Type               |
| ----------- | ------------------ |
| id          | uuid PK            |
| owner_id    | uuid FK            |
| name        | varchar(100)       |
| description | text               |
| invite_code | varchar(20) UNIQUE |
| image_url   | text               |
| max_members | integer            |
| is_academic | boolean            |
| created_at  | timestamp          |

Constraint:

```sql
max_members <= 50
```

---

# TABLE: room_members

Members of rooms.

```sql
room_members
```

| Column    | Type      |
| --------- | --------- |
| room_id   | uuid FK   |
| user_id   | uuid FK   |
| joined_at | timestamp |

Primary Key:

```sql
(room_id, user_id)
```

---

# TABLE: achievements

Available achievements.

```sql
achievements
```

| Column         | Type         |
| -------------- | ------------ |
| id             | uuid PK      |
| title          | varchar(100) |
| description    | text         |
| icon_url       | text         |
| frame_url      | text         |
| required_value | integer      |
| created_at     | timestamp    |

Examples:

* First Prediction
* 10 Correct Predictions
* Top 10 Ranking
* 50 Matches Predicted

---

# TABLE: user_achievements

Achievements unlocked.

```sql
user_achievements
```

| Column         | Type      |
| -------------- | --------- |
| user_id        | uuid FK   |
| achievement_id | uuid FK   |
| unlocked_at    | timestamp |

Primary Key:

```sql
(user_id, achievement_id)
```

---

# TABLE: notifications

In-app notifications.

```sql
notifications
```

| Column            | Type              |
| ----------------- | ----------------- |
| id                | uuid PK           |
| user_id           | uuid FK           |
| title             | varchar(200)      |
| message           | text              |
| notification_type | notification_type |
| is_read           | boolean           |
| created_at        | timestamp         |

---

# TABLE: activity_logs

Community activity feed.

```sql
activity_logs
```

| Column        | Type          |
| ------------- | ------------- |
| id            | uuid PK       |
| user_id       | uuid FK       |
| activity_type | activity_type |
| title         | varchar(200)  |
| description   | text          |
| created_at    | timestamp     |

Examples:

* Juan reached Top 10
* Maria unlocked Gold Frame
* Pedro achieved 5-win streak

---

# TABLE: ranking_snapshots

Historical rankings.

```sql
ranking_snapshots
```

| Column           | Type    |
| ---------------- | ------- |
| id               | uuid PK |
| user_id          | uuid FK |
| ranking_position | integer |
| points           | integer |
| snapshot_date    | date    |

Used for:

* Hall of Fame
* Historical charts

---

# TABLE: collective_predictions

Stores community prediction percentages.

```sql
collective_predictions
```

| Column              | Type         |
| ------------------- | ------------ |
| id                  | uuid PK      |
| match_id            | uuid FK      |
| home_win_percentage | decimal(5,2) |
| draw_percentage     | decimal(5,2) |
| away_win_percentage | decimal(5,2) |
| calculated_at       | timestamp    |

Example:

Brazil Win: 72%

Draw: 18%

Argentina Win: 10%

---

# TABLE: ai_summaries

AI generated summaries.

```sql
ai_summaries
```

| Column       | Type        |
| ------------ | ----------- |
| id           | uuid PK     |
| summary_type | varchar(50) |
| content      | text        |
| generated_at | timestamp   |

Examples:

Daily Summary

Weekly Summary

Top Predictors

---

# TABLE: chatbot_conversations

Optional analytics.

```sql
chatbot_conversations
```

| Column     | Type      |
| ---------- | --------- |
| id         | uuid PK   |
| user_id    | uuid FK   |
| question   | text      |
| response   | text      |
| created_at | timestamp |

---

# Ranking Calculation Strategy

Ranking should NOT be recalculated from scratch every request.

Recommended:

1. Calculate on match completion.
2. Update total_points.
3. Cache ranking in Redis.
4. Refresh cache periodically.

---

# Redis Cache Keys

```txt
leaderboard:global

leaderboard:career

leaderboard:course

leaderboard:room:{roomId}

match:{matchId}

user:{userId}
```

---

# Expected Initial Scale

Users:

3000+

Predictions:

50,000+

Matches:

100+

Rooms:

500+

Notifications:

100,000+

Activity Records:

250,000+

Database must be designed to support future growth without structural redesign.
