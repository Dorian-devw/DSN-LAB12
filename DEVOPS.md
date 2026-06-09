# DEVOPS.md

# GOLEATE! DevOps Architecture

Version: 1.0

Cloud Provider: AWS

Container Platform: Docker

CI/CD: GitHub Actions

Deployment: ECS Fargate

---

# 1. Objectives

The DevOps strategy must guarantee:

- Automated deployments
- High availability
- Horizontal scalability
- Monitoring
- Logging
- Disaster recovery
- Infrastructure reproducibility

---

# 2. Deployment Environments

## Local

Purpose:
Developer environment

Components:
- Frontend
- Backend
- PostgreSQL
- Redis

---

## Development

Purpose:
Feature validation

Environment URL:

dev.goleate.pe

---

## Staging

Purpose:
Pre-production testing

Environment URL:

staging.goleate.pe

---

## Production

Purpose:
Final users

Environment URL:

goleate.pe

---

# 3. Docker Strategy

Every service must be containerized.

## Frontend Container

Technology:
Next.js

Docker Image:
goleate/frontend

---

## Backend Container

Technology:
NestJS

Docker Image:
goleate/backend

---

# 4. Local Development

Docker Compose will be used.

Services:

- frontend
- backend
- postgres
- redis

---

docker-compose.yml

Services:

frontend
backend
postgres
redis

---

Local Ports

Frontend:
3000

Backend:
3001

PostgreSQL:
5432

Redis:
6379

---

# 5. AWS Architecture

Production Infrastructure

                CloudFront
                     │
                     ▼
               Next.js Frontend
                     │
                     ▼
         Application Load Balancer
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   ECS Task 1               ECS Task 2
        │                         │
        └────────────┬────────────┘
                     ▼
                 Redis
                     ▼
              PostgreSQL
                     ▼
                    S3

---

# 6. AWS Services

## Route53

Purpose:
DNS Management

Examples:

goleate.pe
api.goleate.pe

---

## CloudFront

Purpose:
CDN

Benefits:

- Faster delivery
- Global cache
- Reduced latency

---

## ECS Fargate

Purpose:
Run containers without managing servers.

Benefits:

- No EC2 administration
- Auto scaling
- Lower operational complexity

---

## ECR

Purpose:
Store Docker Images

Repositories:

goleate/frontend
goleate/backend

---

## RDS PostgreSQL

Purpose:
Primary Database

Configuration:

- Multi-AZ
- Automated backups
- Encryption enabled

---

## ElastiCache Redis

Purpose:
Cache layer

Used for:

- Rankings
- Match data
- User statistics

---

## S3

Purpose:
Object Storage

Files:

- Profile images
- Room images
- Achievement assets

---

## CloudWatch

Purpose:
Monitoring

Metrics:

- CPU
- Memory
- Requests
- Errors
- Response times

---

# 7. Auto Scaling

## Backend Scaling

Minimum Tasks:
2

Desired Tasks:
4

Maximum Tasks:
10

---

Scaling Rules

Scale Out

When:
CPU > 70%

For:
5 minutes

---

Scale In

When:
CPU < 30%

For:
10 minutes

---

# 8. CI/CD Pipeline

Tool:
GitHub Actions

Workflow:

Developer Push
        ↓
GitHub Actions
        ↓
Install Dependencies
        ↓
Run Tests
        ↓
Build Docker Images
        ↓
Push ECR
        ↓
Deploy ECS
        ↓
Health Check
        ↓
Production

---

# 9. Branch Strategy

Main Branches

main
develop

---

Feature Branch Example

feature/auth-module
feature/predictions-module

---

Hotfix Branch Example

hotfix/login-fix

---

# 10. Secrets Management

Never store secrets in code.

Use:
AWS Secrets Manager

Secrets:

DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

REDIS_URL

API_FOOTBALL_KEY

GROQ_API_KEY

AWS_ACCESS_KEY

AWS_SECRET_KEY

---

# 11. Logging Strategy

Logger:
Pino

Log Levels

INFO
WARN
ERROR
FATAL

Example

{
  "service":"predictions",
  "event":"prediction_created",
  "userId":"uuid"
}

---

# 12. Monitoring

CloudWatch Dashboards

Track:

- Request count
- Error rate
- API latency
- Database latency
- Redis latency
- Active users

---

# 13. Alerts

Critical

Database Down

---

Critical

API Down

---

High

Error Rate > 5%

---

Medium

CPU > 80%

---

# 14. Database Backup Strategy

Daily Backups

Time:
02:00 UTC

Retention:
30 Days

Recovery Objectives

RPO:
15 Minutes

RTO:
1 Hour

---

# 15. Disaster Recovery

Failure Scenario:
Backend Instance Failure

Action:
ECS automatically replaces task.

---

Failure Scenario:
Redis Failure

Action:
Automatic Redis failover.

---

Failure Scenario:
Database Failure

Action:
RDS Multi-AZ failover.

---

# 16. Security

HTTPS Required

TLS 1.3

Security Headers

- CSP
- HSTS
- X-Frame-Options
- X-Content-Type-Options

Authentication

- JWT
- Refresh Tokens

Rate Limiting

Auth Endpoints:
10 req/min

API Endpoints:
100 req/min

AI Endpoints:
20 req/min

---

# 17. Cost Optimization

Target:
Student Startup Budget

Recommendations:

- ECS Fargate Spot for staging
- S3 Lifecycle Policies
- Redis Small Tier
- CloudFront Cache
- Auto Scaling

---

# 18. Performance Goals

Frontend Load Time:
< 2 seconds

API Response Time:
< 500ms

Ranking Queries:
< 200ms

Prediction Submission:
< 300ms

---

# 19. Deployment Checklist

Before Production

- Unit Tests Passed
- Integration Tests Passed
- Security Scan Passed
- Docker Build Successful
- Database Migration Applied
- Environment Variables Loaded
- Health Checks Successful

---

# 20. DevOps Success Criteria

Availability:
99%

Deployment Success:
95%+

Mean Response Time:
< 500ms

Zero Critical Security Vulnerabilities