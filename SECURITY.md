# SECURITY.md

# GOLEATE! Security Specification

Version: 1.0

Status: Approved

Purpose:

This document defines the security architecture, authentication model, authorization policies, data protection strategies, and security controls implemented within GOLEATE!.

The objective is to ensure confidentiality, integrity, availability, and trustworthiness of all platform operations.

----------------------------------------------------------------

# 1. Security Principles

GOLEATE! follows the following security principles:

- Least Privilege
- Defense in Depth
- Secure by Default
- Zero Trust
- Data Minimization
- Principle of Auditability

----------------------------------------------------------------

# 2. Authentication Model

Authentication Method:

Institutional Email Authentication

Allowed Domain:

@tecsup.edu.pe

Any email outside the approved domain must be rejected.

----------------------------------------------------------------

# 3. Authentication Flow

User enters institutional email

↓

Verification Code (OTP)

↓

OTP Validation

↓

JWT Issued

↓

Access Granted

----------------------------------------------------------------

# 4. OTP Rules

OTP Length:

6 digits

----------------------------------------------------------------

Expiration:

10 minutes

----------------------------------------------------------------

Maximum Attempts:

5

----------------------------------------------------------------

After maximum attempts:

OTP invalidated.

New OTP required.

----------------------------------------------------------------

# 5. JWT Authentication

Access Token Duration:

15 minutes

----------------------------------------------------------------

Refresh Token Duration:

7 days

----------------------------------------------------------------

Algorithm:

RS256

----------------------------------------------------------------

JWT Contains:

User ID

Role

Email

Expiration

----------------------------------------------------------------

# 6. Session Security

Each device receives:

Unique Refresh Token

----------------------------------------------------------------

User may revoke sessions manually.

----------------------------------------------------------------

Logout invalidates:

Refresh Token

----------------------------------------------------------------

# 7. Authorization Model

Authorization Strategy:

Role Based Access Control (RBAC)

----------------------------------------------------------------

Roles

USER

ADMIN

----------------------------------------------------------------

# 8. USER Permissions

Create Predictions

Edit Predictions

Join Rooms

Create Rooms

View Rankings

Use AI Assistant

Manage Own Profile

----------------------------------------------------------------

# 9. ADMIN Permissions

Manage Users

Manage Rooms

Manage Notifications

Manage Matches

View Analytics

Access Admin Dashboard

----------------------------------------------------------------

# 10. Restricted Actions

Administrators cannot:

Modify Scores

Modify Rankings

Modify Hall Of Fame

Modify Prediction Results

Modify Match Outcomes

----------------------------------------------------------------

# 11. Password Policy

Current Version:

Passwordless Authentication

Passwords are not stored.

Passwords are not required.

----------------------------------------------------------------

# 12. Email Verification

All accounts must verify ownership of institutional email.

Unverified accounts cannot access platform features.

----------------------------------------------------------------

# 13. Input Validation

All API endpoints must validate:

Required Fields

Data Types

Maximum Length

Minimum Length

Allowed Values

----------------------------------------------------------------

Technology:

NestJS Validation Pipe

Class Validator

----------------------------------------------------------------

# 14. SQL Injection Protection

ORM:

Prisma

----------------------------------------------------------------

Protection:

Parameterized Queries

Prepared Statements

No Raw Queries Allowed

----------------------------------------------------------------

# 15. Cross Site Scripting Protection (XSS)

Protection Mechanisms:

Input Sanitization

Output Escaping

Content Security Policy

----------------------------------------------------------------

User-generated content must be sanitized before rendering.

----------------------------------------------------------------

# 16. Cross Site Request Forgery (CSRF)

Protection:

SameSite Cookies

Anti-CSRF Tokens

Secure Headers

----------------------------------------------------------------

# 17. HTTP Security Headers

Implemented Using:

Helmet

----------------------------------------------------------------

Headers

Content-Security-Policy

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

Permissions-Policy

Strict-Transport-Security

----------------------------------------------------------------

# 18. HTTPS Enforcement

HTTPS is mandatory.

HTTP requests must automatically redirect to HTTPS.

----------------------------------------------------------------

TLS Version

TLS 1.3

----------------------------------------------------------------

# 19. Rate Limiting

Purpose:

Prevent abuse.

----------------------------------------------------------------

Authentication Endpoints

10 requests per minute

----------------------------------------------------------------

Prediction Endpoints

60 requests per minute

----------------------------------------------------------------

AI Endpoints

30 requests per minute

----------------------------------------------------------------

Admin Endpoints

20 requests per minute

----------------------------------------------------------------

# 20. DDoS Protection

AWS Shield

CloudFront

Rate Limiting

WAF Rules

----------------------------------------------------------------

# 21. AWS WAF Rules

Block:

SQL Injection Attempts

Cross Site Scripting

Known Bots

Abusive Traffic

Malicious Payloads

----------------------------------------------------------------

# 22. File Upload Security

Allowed Formats

PNG

JPG

JPEG

WEBP

----------------------------------------------------------------

Maximum File Size

5 MB

----------------------------------------------------------------

File Scanning

Virus Detection

Malware Detection

----------------------------------------------------------------

Executable files prohibited.

----------------------------------------------------------------

# 23. Profile Image Security

Images stored in:

AWS S3

----------------------------------------------------------------

Direct public access disabled.

----------------------------------------------------------------

Access via signed URLs.

----------------------------------------------------------------

# 24. Data Encryption

Encryption In Transit

TLS 1.3

----------------------------------------------------------------

Encryption At Rest

AES-256

----------------------------------------------------------------

Applies To

PostgreSQL

Redis

S3

Backups

----------------------------------------------------------------

# 25. Database Security

Database:

PostgreSQL

AWS RDS

----------------------------------------------------------------

Private Subnet

Enabled

----------------------------------------------------------------

Public Access

Disabled

----------------------------------------------------------------

Direct Internet Access

Prohibited

----------------------------------------------------------------

# 26. Redis Security

Redis accessible only from backend services.

----------------------------------------------------------------

Public Exposure

Disabled

----------------------------------------------------------------

Authentication Required

Enabled

----------------------------------------------------------------

# 27. Secrets Management

Secrets stored in:

AWS Secrets Manager

----------------------------------------------------------------

Never stored in:

Git

Docker Images

Frontend

Source Code

----------------------------------------------------------------

# 28. Logging Policy

Security Events Logged

Login

Logout

OTP Verification

Prediction Submission

Role Changes

Admin Actions

Room Creation

Account Suspension

----------------------------------------------------------------

# 29. Audit Trail

All administrative actions must generate audit logs.

----------------------------------------------------------------

Audit Fields

Administrator

Timestamp

Action

Target Resource

IP Address

Result

----------------------------------------------------------------

# 30. Account Suspension

Administrators may suspend accounts for:

Spam

Abuse

Fake Accounts

Terms Violations

----------------------------------------------------------------

Suspended users:

Cannot login.

Cannot create predictions.

Cannot access rooms.

----------------------------------------------------------------

# 31. Account Ban

Permanent restriction.

----------------------------------------------------------------

Reasons

Severe Abuse

Automation Attacks

Multiple Fake Accounts

Platform Manipulation

----------------------------------------------------------------

# 32. Anti-Bot Protection

Google reCAPTCHA

Applied To

Login

Room Creation

Mass Actions

----------------------------------------------------------------

# 33. API Security

Every API endpoint must validate:

Authentication

Authorization

Input Data

Request Limits

----------------------------------------------------------------

No endpoint may trust client data.

----------------------------------------------------------------

# 34. AI Security

AI Assistant may:

Read Data

Generate Insights

Answer Questions

----------------------------------------------------------------

AI Assistant may not:

Modify Data

Create Predictions

Delete Information

Alter Rankings

Execute Administrative Actions

----------------------------------------------------------------

# 35. Monitoring And Detection

AWS CloudWatch

AWS GuardDuty

AWS WAF

----------------------------------------------------------------

Monitor

Failed Logins

Suspicious Traffic

Rate Limit Violations

API Abuse

Unexpected Activity

----------------------------------------------------------------

# 36. Backup Security

Database Backups

Encrypted

----------------------------------------------------------------

Retention

30 Days

----------------------------------------------------------------

Backup Access

Administrators Only

----------------------------------------------------------------

# 37. Incident Response

Severity Levels

LOW

MEDIUM

HIGH

CRITICAL

----------------------------------------------------------------

Examples

LOW

Minor Error

----------------------------------------------------------------

MEDIUM

Service Degradation

----------------------------------------------------------------

HIGH

Database Failure

----------------------------------------------------------------

CRITICAL

Data Breach

----------------------------------------------------------------

# 38. Recovery Objectives

Recovery Point Objective (RPO)

15 Minutes

----------------------------------------------------------------

Recovery Time Objective (RTO)

1 Hour

----------------------------------------------------------------

# 39. Compliance Objectives

Protect Student Data

Protect Institutional Accounts

Protect Prediction Integrity

Protect Ranking Integrity

Protect Historical Records

----------------------------------------------------------------

# 40. Security Checklist

Before Production Release

✓ HTTPS Enabled

✓ WAF Configured

✓ JWT Enabled

✓ OTP Enabled

✓ Audit Logs Enabled

✓ Secrets Stored Securely

✓ Backups Verified

✓ Monitoring Configured

✓ Penetration Tests Completed

✓ Rate Limits Configured

----------------------------------------------------------------

# 41. Future Security Enhancements

Multi-Factor Authentication

Behavior Analysis

Risk-Based Authentication

Advanced Threat Detection

University Single Sign-On Integration

----------------------------------------------------------------

# 42. Source Of Truth

This document defines the official security architecture of GOLEATE!.

If implementation conflicts with this document:

SECURITY.md takes precedence.

----------------------------------------------------------------

END OF DOCUMENT