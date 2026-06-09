# ADMIN_PANEL_SPEC.md

# GOLEATE! Administration Panel Specification

Version: 1.0

Status: Approved

Purpose:

This document defines all administrative functionalities available within GOLEATE!, including user management, room management, match synchronization, analytics, moderation, notifications, and platform monitoring.

The Admin Panel is designed to provide complete operational control over the platform while preserving competitive fairness.

---

# 1. Overview

The Administration Panel is accessible only to users with the ADMIN role.

Objectives:

* Manage platform operations
* Monitor participation
* Manage rooms
* Monitor predictions
* Synchronize matches
* Generate reports
* Monitor platform health

Administrators must not have any competitive advantage over regular users.

---

# 2. Administrator Roles

Current Roles

ADMIN

Full platform management.

---

Future Roles

SUPER_ADMIN

Platform owner.

---

MODERATOR

Community moderation.

---

ANALYST

Read-only access to reports.

---

# 3. Admin Dashboard

The dashboard is the first screen visible after login.

Displays:

Total Users

Active Users

Total Predictions

Total Rooms

Upcoming Matches

Predictions Today

Average Accuracy

Current Leader

System Status

---

# 4. Dashboard Widgets

Widget: Registered Users

Displays:

Total registered students.

---

Widget: Active Users

Displays:

Users active in last 30 days.

---

Widget: Prediction Volume

Displays:

Predictions submitted per day.

---

Widget: Room Activity

Displays:

Most active rooms.

---

Widget: Top Predictor

Displays:

Current global leader.

---

Widget: API Status

Displays:

API-Football connectivity status.

---

Widget: AI Status

Displays:

Groq service health.

---

# 5. User Management Module

Purpose:

Manage platform users.

---

User Search

Search by:

* Name
* Email
* Career
* Course

---

User Profile View

Displays:

Name

Email

Career

Course

Points

Level

Achievements

Accuracy

Room Memberships

Status

---

Available Actions

View Profile

Suspend User

Reactivate User

Reset Avatar

View Activity History

---

# 6. User Statuses

ACTIVE

Normal access.

---

SUSPENDED

Cannot access platform.

---

BANNED

Permanent access restriction.

---

# 7. Room Management Module

Purpose:

Manage academic and social rooms.

---

Room Information

Name

Description

Owner

Members

Ranking Position

Creation Date

---

Available Actions

View Room

Edit Room

Archive Room

Delete Room

Transfer Ownership

Remove Members

---

# 8. Room Moderation

Administrators may:

Remove inappropriate content.

Remove offensive room names.

Deactivate abusive rooms.

---

# 9. Match Management Module

Purpose:

Manage football matches.

---

Displays

Upcoming Matches

Finished Matches

Postponed Matches

Cancelled Matches

---

Available Actions

View Match

Refresh Match Data

Manual Sync

Force Status Update

View Predictions

---

# 10. Match Synchronization

Source:

API-Football

---

Automatic Sync

Every 5 minutes.

---

Manual Sync

Administrator can trigger synchronization.

---

System Logs

Must record:

Sync Time

Records Updated

Errors

Duration

---

# 11. Prediction Monitoring

Purpose:

Observe platform activity.

Administrators may not modify predictions.

---

Displays

Prediction Volume

Most Predicted Matches

Prediction Distribution

Accuracy Distribution

---

Available Actions

View Only

Export Reports

---

# 12. Ranking Management

Purpose:

Monitor rankings.

Administrators cannot modify scores.

---

Displays

Global Ranking

Career Ranking

Course Ranking

Room Ranking

---

Available Actions

View Rankings

Export Rankings

Recalculate Rankings

---

# 13. Hall Of Fame Management

Purpose:

Monitor historical records.

---

Displays

Current Records

Historical Records

Champions

Longest Streaks

Highest Accuracy

---

Available Actions

View

Export

Recalculate

---

# 14. Achievement Monitoring

Purpose:

Track gamification progress.

---

Displays

Most Common Achievements

Rare Achievements

Recently Unlocked Achievements

---

Available Actions

View

Export

Audit

---

# 15. Activity Feed Monitoring

Purpose:

Observe platform activity.

---

Displays

Recent Events

New Users

Top Rank Changes

Achievement Unlocks

Room Activity

---

Available Actions

Filter

Export

Search

---

# 16. Notification Management

Purpose:

Manage platform notifications.

---

Notification Types

Announcement

Match Reminder

Maintenance Notice

Achievement Alert

Room Invitation

---

Available Actions

Create Notification

Schedule Notification

Cancel Notification

View History

---

# 17. Broadcast System

Administrators may send platform-wide announcements.

Examples:

Welcome to GOLEATE!

World Cup starts tomorrow.

Maintenance scheduled tonight.

---

# 18. Analytics Module

Purpose:

Business intelligence and reporting.

---

KPIs

Daily Active Users

Monthly Active Users

Predictions Per User

Room Participation Rate

Accuracy Distribution

Retention Rate

Achievement Unlock Rate

---

Charts

Predictions Over Time

User Growth

Room Growth

Accuracy Trends

---

# 19. AI Monitoring Module

Purpose:

Monitor Groq integration.

---

Displays

Total Questions

Daily Questions

Average Response Time

Most Common Questions

Failed Requests

---

# 20. System Monitoring Module

Purpose:

Monitor platform health.

---

Displays

CPU Usage

Memory Usage

Database Usage

Redis Usage

API Response Times

Error Rate

---

# 21. Audit Logs

All administrative actions must be recorded.

---

Examples

User Suspension

Room Deletion

Manual Sync

Broadcast Creation

Notification Cancellation

---

Stored Information

Administrator

Timestamp

Action

Affected Resource

Result

---

# 22. Reports Module

Administrators may export:

Users

Rooms

Predictions

Rankings

Achievements

Analytics

---

Supported Formats

CSV

Excel

PDF

---

# 23. Security Controls

Admin routes require:

JWT Authentication

Role Validation

Rate Limiting

Audit Logging

---

Sensitive Operations

User Suspension

Room Deletion

Broadcast Messages

Require confirmation dialogs.

---

# 24. Administrator Restrictions

Administrators cannot:

Modify prediction scores.

Modify official match results.

Grant achievements manually.

Modify Hall Of Fame records.

Manipulate rankings.

Modify point calculations.

---

# 25. Future Expansion

Future versions may include:

Moderator Dashboard

University Management

Multi-Campus Administration

Tournament Administration

Sponsor Management

Advanced Analytics

---

# 26. Source Of Truth

This document defines the official administration functionality of GOLEATE!.

If implementation conflicts with this document:

ADMIN_PANEL_SPEC.md takes precedence.

---

END OF DOCUMENT
