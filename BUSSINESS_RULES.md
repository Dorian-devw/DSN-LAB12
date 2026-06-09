# BUSINESS_RULES.md

# GOLEATE! Business Rules Specification

Version: 1.0

Status: Approved

Purpose:

This document defines all official business rules governing predictions, scoring, rankings, rooms, gamification, participation, and competition within GOLEATE!.

These rules serve as the single source of truth for Backend, Frontend, Database, QA, Analytics, and AI modules.

----------------------------------------------------------------

# 1. General Rules

GOLEATE! is a sports prediction platform designed exclusively for TECSUP students.

The platform does not involve real money, gambling, betting, or financial rewards.

All rewards, achievements, rankings, badges, and profile frames are purely virtual.

----------------------------------------------------------------

# 2. User Eligibility

A user may participate only if:

- Has a valid institutional email.
- Completes registration successfully.
- Accepts platform rules.

Allowed email domains:

@tecsup.edu.pe

Any other email domain must be rejected.

----------------------------------------------------------------

# 3. Prediction Rules

Users may predict the result of any available match.

A prediction consists of:

- Team A score
- Team B score

Example:

Brazil 2 - 1 Argentina

----------------------------------------------------------------

# 4. Prediction Lock Rule

Predictions may only be submitted before the lock window.

Lock window:

10 minutes before match start.

Example:

Match starts at:

20:00

Prediction closes at:

19:50

After lock:

- Creation prohibited
- Modification prohibited
- Deletion prohibited

----------------------------------------------------------------

# 5. Prediction Modification Rule

Users may edit predictions before lock time.

After lock time:

Prediction becomes immutable.

----------------------------------------------------------------

# 6. No Prediction Rule

If a user does not submit a prediction:

Awarded Points:

0

No penalties are applied.

----------------------------------------------------------------

# 7. Official Match Data

Match results are obtained exclusively through API-Football.

The official result stored by the platform is considered final.

Users cannot dispute results.

----------------------------------------------------------------

# 8. Match Statuses

Possible statuses:

SCHEDULED

PREDICTION_OPEN

PREDICTION_LOCKED

LIVE

FINISHED

CANCELLED

POSTPONED

----------------------------------------------------------------

# 9. Match Cancellation Rule

If a match is cancelled:

- Predictions remain stored.
- No points awarded.
- Match excluded from scoring.

----------------------------------------------------------------

# 10. Match Postponement Rule

If a match is postponed:

Predictions remain valid.

Lock time recalculated using new kickoff time.

----------------------------------------------------------------

# 11. Scoring System

Official scoring system defined by project requirements.

----------------------------------------------------------------

Rule 1

Exact Result

Points:

5

Condition:

Predicted score matches final score exactly.

Example:

Prediction:

2-1

Result:

2-1

Award:

5 points

----------------------------------------------------------------

Rule 2

Correct Winner

Points:

3

Condition:

Winner predicted correctly.

Exact score not required.

Example:

Prediction:

3-1

Result:

1-0

Award:

3 points

----------------------------------------------------------------

Rule 3

Correct Goal Difference

Points:

2

Condition:

Goal difference matches.

Winner must also be the same.

Example:

Prediction:

3-1

Result:

2-0

Difference:

+2

Award:

2 points

----------------------------------------------------------------

Rule Priority

The system must award only the highest applicable rule.

Example:

Exact Result

User receives:

5

Not:

5 + 3 + 2

----------------------------------------------------------------

Priority Order

1. Exact Result
2. Correct Winner
3. Goal Difference
4. No Match

----------------------------------------------------------------

# 12. Draw Rule

Draws are considered valid outcomes.

Example:

Prediction:

1-1

Result:

2-2

Award:

3 points

Reason:

Correct draw outcome.

----------------------------------------------------------------

# 13. Early Prediction Bonus

Bonus:

+1 point

Condition:

Prediction submitted more than 24 hours before kickoff.

Example:

Prediction created:

48 hours before match

Award:

+1 bonus point

----------------------------------------------------------------

# 14. Last Minute Prediction Rule

Predictions submitted within the final 24 hours:

No anticipation bonus.

Base scoring still applies.

----------------------------------------------------------------

# 15. Streak Bonus

Purpose:

Reward consistency.

Rule:

Every 3 consecutive successful predictions.

Bonus:

+2 points

Successful prediction means:

- Exact score
OR
- Correct winner
OR
- Correct goal difference

----------------------------------------------------------------

Examples

3 consecutive correct:

+2 bonus

6 consecutive correct:

+4 total bonus

9 consecutive correct:

+6 total bonus

----------------------------------------------------------------

# 16. Streak Reset Rule

A streak resets when:

- User fails a prediction.
- User skips a match.
- User predicts wrong winner.

Current streak becomes:

0

----------------------------------------------------------------

# 17. Total Points Formula

Total User Points =

Prediction Points
+
Streak Bonuses
+
Early Prediction Bonuses

----------------------------------------------------------------

# 18. Ranking Rules

Rankings are sorted by:

1. Total Points
2. Accuracy Percentage
3. Exact Predictions
4. Earliest Registration Date

----------------------------------------------------------------

# 19. Global Ranking

Includes all users.

Visible to everyone.

Updates automatically after score processing.

----------------------------------------------------------------

# 20. Room Ranking

Includes only room members.

Updates automatically.

----------------------------------------------------------------

# 21. Career Ranking

Includes students belonging to the same academic career.

Example:

Software Development

Cybersecurity

Industrial Automation

Architecture

Electromechanics

----------------------------------------------------------------

# 22. Course Ranking

Includes students belonging to the same classroom or course.

Example:

DSW2026

DSW2025

CS2026

----------------------------------------------------------------

# 23. Hall Of Fame Rule

Hall Of Fame stores historical achievements.

Examples:

Highest Score Ever

Most Exact Predictions

Longest Streak

Best Career Champion

Best Room Champion

Hall Of Fame entries never expire.

----------------------------------------------------------------

# 24. Room Rules

Maximum members:

50

Minimum members:

1

----------------------------------------------------------------

# 25. Room Types

Academic Room

Examples:

DSW2026

Cyber2026

Architecture2026

----------------------------------------------------------------

Social Room

Examples:

Los Galácticos

Friends FC

Team Perú

----------------------------------------------------------------

# 26. Room Creation Rule

Any authenticated user may create a room.

Requirements:

- Unique room name
- Room description
- Room type

----------------------------------------------------------------

# 27. Invitation Rule

Each room generates:

Invite Code

Example:

ABC123

Users may join using:

- Invite code
- Direct invitation

----------------------------------------------------------------

# 28. Room Ownership

Room creator becomes:

Owner

Permissions:

- Manage room
- Remove members
- Change room information

----------------------------------------------------------------

# 29. Activity Feed Rules

Activities are automatically generated.

Examples:

User reached Top 10

User unlocked achievement

Room reached first place

User achieved streak

Prediction scored exact result

----------------------------------------------------------------

# 30. Profile Rules

Each profile must display:

- Avatar
- Name
- Career
- Level
- Total Points
- Accuracy
- Current Streak
- Longest Streak
- Hall Of Fame Achievements
- Frames
- Badges

----------------------------------------------------------------

# 31. Avatar Rules

Users may upload custom profile images.

Allowed formats:

PNG

JPG

WEBP

Maximum size:

5 MB

----------------------------------------------------------------

# 32. AI Assistant Rules

AI assistant may answer:

- User statistics
- Rankings
- Pending predictions
- Room performance
- Weekly summaries
- Historical performance

AI cannot:

- Modify data
- Submit predictions
- Alter rankings

----------------------------------------------------------------

# 33. Notification Rules

Notification types:

MATCH_REMINDER

ACHIEVEMENT_UNLOCKED

RANKING_CHANGED

ROOM_INVITATION

WEEKLY_SUMMARY

SYSTEM_ANNOUNCEMENT

----------------------------------------------------------------

# 34. Match Reminder Rule

Default reminders:

24 hours before match

1 hour before match

15 minutes before match

----------------------------------------------------------------

# 35. Anti-Abuse Rules

Forbidden:

- Multiple accounts
- Fake institutional accounts
- Automated prediction scripts
- API abuse

Violations may result in:

Warning

Suspension

Permanent Ban

----------------------------------------------------------------

# 36. Administrator Rules

Administrators may:

- Manage users
- Manage rooms
- Trigger match synchronization
- View analytics
- Manage announcements

Administrators cannot:

- Modify prediction scores manually
- Alter official results

----------------------------------------------------------------

# 37. Auditability Rule

Critical actions must be logged.

Examples:

Login

Prediction creation

Prediction update

Room creation

Achievement unlock

Admin actions

----------------------------------------------------------------

# 38. Data Retention Rule

Predictions are never deleted.

Historical rankings are preserved.

Hall Of Fame records are permanent.

----------------------------------------------------------------

# 39. Fair Play Principle

All participants compete under the same scoring rules.

No user receives preferential treatment.

All calculations must be deterministic and reproducible.

----------------------------------------------------------------

# 40. Source Of Truth

This document is the official source of business logic.

If implementation conflicts with this document:

BUSINESS_RULES.md takes precedence.

----------------------------------------------------------------

END OF DOCUMENT 