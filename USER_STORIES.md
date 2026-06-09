# USER_STORIES.md

# GOLEATE! User Stories & Product Backlog

Version: 1.0

Methodology: Agile Scrum

Story Point Scale:
- 1 = Muy pequeño
- 2 = Pequeño
- 3 = Medio
- 5 = Complejo
- 8 = Muy complejo
- 13 = Épico

Priorities:
- P0 = Crítico
- P1 = Alto
- P2 = Medio
- P3 = Bajo

---

# PRODUCT EPICS

EPIC-01 Authentication

EPIC-02 User Profiles

EPIC-03 Match Management

EPIC-04 Predictions

EPIC-05 Rankings

EPIC-06 Rooms

EPIC-07 Activity Feed

EPIC-08 Gamification

EPIC-09 Notifications

EPIC-10 Artificial Intelligence

EPIC-11 Administration

EPIC-12 PWA

---

# EPIC-01 AUTHENTICATION

## US-001 Login with Institutional Email

Priority: P0

Story Points: 5

As a TECSUP student

I want to login using my institutional email

So that only valid students can access the platform.

Acceptance Criteria:

- Email must end with @tecsup.edu.pe
- Invalid domains must be rejected
- User receives OTP
- OTP expires after 10 minutes
- User gains access after verification

---

## US-002 Verify OTP

Priority: P0

Story Points: 3

As a user

I want to verify my OTP code

So that I can securely access my account.

Acceptance Criteria:

- OTP must match
- OTP must not be expired
- OTP can only be used once
- JWT token is generated

---

## US-003 Maintain Session

Priority: P1

Story Points: 3

As a user

I want to remain logged in

So that I do not need to authenticate repeatedly.

Acceptance Criteria:

- Refresh token available
- Session survives browser refresh

---

# EPIC-02 USER PROFILE

## US-004 View My Profile

Priority: P0

Story Points: 3

As a user

I want to see my profile

So that I can review my statistics.

Acceptance Criteria:

Display:

- Name
- Career
- Course
- Accuracy
- Points
- Level
- Streak
- Achievements

---

## US-005 Upload Profile Picture

Priority: P1

Story Points: 3

As a user

I want to upload a profile image

So that my account feels personalized.

Acceptance Criteria:

- JPG
- PNG
- WEBP
- Maximum 5MB
- Stored in AWS S3

---

## US-006 Edit Profile Information

Priority: P1

Story Points: 2

As a user

I want to update my profile

So that my information remains accurate.

---

# EPIC-03 MATCH MANAGEMENT

## US-007 View Upcoming Matches

Priority: P0

Story Points: 3

As a user

I want to see upcoming matches

So that I can make predictions.

Acceptance Criteria:

Display:

- Teams
- Logos
- Date
- Time
- Tournament
- Countdown

---

## US-008 View Live Matches

Priority: P1

Story Points: 2

As a user

I want to see live matches

So that I can follow results.

---

## US-009 View Finished Matches

Priority: P1

Story Points: 2

As a user

I want to review finished matches

So that I can compare my predictions.

---

# EPIC-04 PREDICTIONS

## US-010 Create Prediction

Priority: P0

Story Points: 5

As a user

I want to predict a match score

So that I can earn points.

Acceptance Criteria:

- One prediction per match
- Match still open
- Prediction saved

---

## US-011 Edit Prediction

Priority: P0

Story Points: 3

As a user

I want to edit my prediction

So that I can update my opinion.

Acceptance Criteria:

- Only before deadline
- Previous prediction replaced

---

## US-012 Prevent Late Predictions

Priority: P0

Story Points: 2

As a system

I must block predictions

10 minutes before kickoff.

Acceptance Criteria:

- Prediction form disabled
- API validation enforced

---

## US-013 Calculate Points Automatically

Priority: P0

Story Points: 8

As a system

I must calculate points automatically

When a match ends.

Acceptance Criteria:

Apply:

- Exact score
- Correct winner
- Goal difference
- Streak bonus
- Early prediction bonus

---

# EPIC-05 RANKINGS

## US-014 View Global Ranking

Priority: P0

Story Points: 3

As a user

I want to see the global ranking

So that I know my position.

---

## US-015 View Room Ranking

Priority: P0

Story Points: 3

As a user

I want to see room rankings

So that I can compete with friends.

---

## US-016 View Career Ranking

Priority: P1

Story Points: 3

As a user

I want to compare careers

So that I can support my academic program.

---

## US-017 View Course Ranking

Priority: P1

Story Points: 3

As a user

I want to compare courses

So that I can see which class performs best.

---

## US-018 Hall of Fame

Priority: P2

Story Points: 5

As a user

I want to view historical champions

So that I can recognize top performers.

---

# EPIC-06 ROOMS

## US-019 Create Room

Priority: P0

Story Points: 5

As a user

I want to create a room

So that I can compete with others.

Acceptance Criteria:

- Maximum 3 rooms
- Unique invite code generated

---

## US-020 Join Room

Priority: P0

Story Points: 3

As a user

I want to join a room using an invitation code

So that I can participate.

Acceptance Criteria:

- Code validated
- Room capacity checked

---

## US-021 Leave Room

Priority: P1

Story Points: 2

As a user

I want to leave a room

So that I can manage my memberships.

---

## US-022 View Room Members

Priority: P1

Story Points: 2

As a user

I want to view room members

So that I know who is participating.

---

# EPIC-07 ACTIVITY FEED

## US-023 View Community Activity

Priority: P1

Story Points: 5

As a user

I want to view community activity

So that the platform feels alive.

Examples:

- New achievements
- Ranking changes
- Streaks
- Hall of Fame entries

---

# EPIC-08 GAMIFICATION

## US-024 Unlock Achievements

Priority: P1

Story Points: 5

As a user

I want to unlock achievements

So that I feel rewarded.

---

## US-025 Earn Profile Frames

Priority: P2

Story Points: 3

As a user

I want to earn profile frames

So that I can showcase my accomplishments.

---

## US-026 Gain Levels

Priority: P2

Story Points: 3

As a user

I want to increase my level

So that my progress is visible.

---

# EPIC-09 NOTIFICATIONS

## US-027 Match Reminder

Priority: P1

Story Points: 3

As a user

I want to receive reminders

So that I don't miss predictions.

Example:

⚽ Peru vs Chile starts in 1 hour.

---

## US-028 Ranking Change Notification

Priority: P1

Story Points: 2

As a user

I want notifications when my ranking changes

So that I stay engaged.

---

## US-029 Achievement Notification

Priority: P1

Story Points: 2

As a user

I want to know when I unlock achievements.

---

# EPIC-10 ARTIFICIAL INTELLIGENCE

## US-030 Ask the Chatbot

Priority: P2

Story Points: 5

As a user

I want to ask questions about my statistics

So that I get information quickly.

Example Questions:

- What is my accuracy?
- What is my streak?
- Which room am I leading?

---

## US-031 View AI Summary

Priority: P2

Story Points: 5

As a user

I want automatic summaries

So that I can understand weekly performance.

---

## US-032 View Collective Predictions

Priority: P1

Story Points: 3

As a user

I want to see community predictions

So that I know public sentiment.

---

# EPIC-11 ADMINISTRATION

## US-033 Synchronize Matches

Priority: P0

Story Points: 5

As an administrator

I want to synchronize matches from API-Football

So that match information remains current.

---

## US-034 Manage Users

Priority: P1

Story Points: 5

As an administrator

I want to manage users

So that I can maintain platform quality.

---

## US-035 Recalculate Rankings

Priority: P1

Story Points: 5

As an administrator

I want to recalculate rankings

So that scoring errors can be corrected.

---

## US-036 Generate AI Reports

Priority: P2

Story Points: 3

As an administrator

I want to generate AI reports

So that platform insights are available.

---

# EPIC-12 PWA

## US-037 Install Application

Priority: P2

Story Points: 5

As a user

I want to install Goleate on my phone

So that it behaves like a mobile application.

Acceptance Criteria:

- Android installable
- iOS installable
- Custom icon
- Offline shell support

---

# MVP DEFINITION

The MVP must include:

Authentication

- US-001
- US-002
- US-003

Profiles

- US-004
- US-005

Matches

- US-007

Predictions

- US-010
- US-011
- US-012
- US-013

Rankings

- US-014
- US-015

Rooms

- US-019
- US-020

Notifications

- US-027

Administration

- US-033

Total MVP Scope:

16 User Stories

---

# POST-MVP FEATURES

Phase 2

- Hall of Fame
- Activity Feed
- Achievements
- Levels
- Frames

Phase 3

- AI Chatbot
- AI Summaries
- Collective Predictions

Phase 4

- Multi-Tournament Support
- Advanced Analytics
- Mobile App
- Public API

---

# DEFINITION OF DONE

A User Story is considered complete when:

- Code implemented
- Unit tests created
- Integration tests passed
- API documented in Swagger
- Responsive UI completed
- Code reviewed
- Deployed to staging
- Accepted by Product Owner