# AWS_INFRASTRUCTURE.md

# GOLEATE! AWS Infrastructure Specification

Version: 1.0

Status: Approved

Purpose:

This document defines the complete cloud infrastructure architecture of GOLEATE!, including networking, compute resources, databases, storage, security, monitoring, scalability, disaster recovery, and deployment strategy.

The infrastructure is designed to support between 3,000 and 5,000 concurrent users while maintaining high availability, low latency, and operational simplicity.

----------------------------------------------------------------

# 1. Infrastructure Philosophy

GOLEATE! follows the following principles:

- Cloud Native
- High Availability
- Auto Scaling
- Cost Efficient
- Container First
- Secure By Design
- Infrastructure As Code Ready

----------------------------------------------------------------

# 2. AWS Services Overview

Core Services:

Route53

CloudFront

AWS WAF

AWS Shield

Application Load Balancer (ALB)

Amazon ECS Fargate

Amazon ECR

Amazon RDS PostgreSQL

Amazon ElastiCache Redis

Amazon S3

CloudWatch

Secrets Manager

SNS

SES

----------------------------------------------------------------

# 3. High Level Architecture

User

↓

Route53

↓

CloudFront

↓

AWS WAF

↓

Application Load Balancer

↓

ECS Fargate Cluster

↓

NestJS API Containers

↓

Redis + PostgreSQL

↓

S3 Storage

----------------------------------------------------------------

# 4. DNS Layer

Service:

Amazon Route53

Responsibilities:

Domain Management

DNS Resolution

Health Checks

Traffic Routing

----------------------------------------------------------------

Domain Example

goleate.pe

www.goleate.pe

api.goleate.pe

----------------------------------------------------------------

# 5. CDN Layer

Service:

Amazon CloudFront

Purpose:

Reduce latency.

Serve frontend assets globally.

Cache static resources.

Protect origin services.

----------------------------------------------------------------

Cached Resources

JavaScript

CSS

Images

Fonts

PWA Assets

Profile Frames

Badges

----------------------------------------------------------------

# 6. Security Edge Layer

Services:

AWS WAF

AWS Shield

----------------------------------------------------------------

Purpose

DDoS Protection

Bot Protection

Rate Limiting

Threat Filtering

----------------------------------------------------------------

Blocked Attacks

SQL Injection

Cross Site Scripting

Known Bots

Brute Force Attempts

Malicious Payloads

----------------------------------------------------------------

# 7. Load Balancing Layer

Service:

Application Load Balancer

----------------------------------------------------------------

Responsibilities

Traffic Distribution

Health Checks

SSL Termination

Auto Scaling Integration

----------------------------------------------------------------

Routing

/api/*

↓

NestJS Services

----------------------------------------------------------------

/*

↓

Next.js Frontend

----------------------------------------------------------------

# 8. Compute Layer

Service:

Amazon ECS Fargate

----------------------------------------------------------------

Reason

No server management.

Containerized deployment.

Native AWS integration.

Easy horizontal scaling.

----------------------------------------------------------------

Services Hosted

Next.js Frontend

NestJS Backend

Background Workers

Scheduled Jobs

----------------------------------------------------------------

# 9. Docker Strategy

Every service runs in containers.

----------------------------------------------------------------

Frontend

Docker Image

↓

ECR

↓

ECS

----------------------------------------------------------------

Backend

Docker Image

↓

ECR

↓

ECS

----------------------------------------------------------------

Worker Service

Docker Image

↓

ECR

↓

ECS

----------------------------------------------------------------

# 10. Container Registry

Service:

Amazon ECR

----------------------------------------------------------------

Repositories

goleate-frontend

goleate-backend

goleate-worker

----------------------------------------------------------------

Purpose

Store versioned Docker images.

----------------------------------------------------------------

# 11. Auto Scaling Strategy

Target:

3000-5000 concurrent users

----------------------------------------------------------------

Minimum Instances

2

----------------------------------------------------------------

Recommended Instances

4

----------------------------------------------------------------

Maximum Instances

10

----------------------------------------------------------------

Scaling Triggers

CPU > 70%

Memory > 75%

Request Count Threshold

----------------------------------------------------------------

# 12. Database Layer

Service:

Amazon RDS PostgreSQL

----------------------------------------------------------------

Database Engine

PostgreSQL 17+

----------------------------------------------------------------

Purpose

Main transactional database.

----------------------------------------------------------------

Stores

Users

Predictions

Matches

Rooms

Achievements

Notifications

Hall Of Fame

Activity Feed

----------------------------------------------------------------

# 13. Database Configuration

Multi-AZ

Enabled

----------------------------------------------------------------

Automated Backups

Enabled

----------------------------------------------------------------

Public Access

Disabled

----------------------------------------------------------------

Encryption

Enabled

----------------------------------------------------------------

# 14. Read Replica Strategy

Current Phase

Not Required

----------------------------------------------------------------

Future Growth

20,000+ users

↓

Add Read Replicas

----------------------------------------------------------------

Purpose

Ranking Queries

Statistics Queries

Analytics Queries

----------------------------------------------------------------

# 15. Cache Layer

Service:

Amazon ElastiCache Redis

----------------------------------------------------------------

Purpose

Reduce database load.

Increase response speed.

----------------------------------------------------------------

Cached Data

Global Rankings

Room Rankings

Course Rankings

Career Rankings

Upcoming Matches

User Statistics

Activity Feed

AI Context

----------------------------------------------------------------

# 16. Redis Benefits

Expected Ranking Query

< 200ms

----------------------------------------------------------------

Expected Dashboard Load

< 1 second

----------------------------------------------------------------

# 17. Storage Layer

Service:

Amazon S3

----------------------------------------------------------------

Stored Assets

Profile Images

Room Images

Achievement Icons

Frames

Badges

Generated Reports

Exports

----------------------------------------------------------------

# 18. S3 Security

Public Access

Disabled

----------------------------------------------------------------

Access Method

Signed URLs

----------------------------------------------------------------

Encryption

AES-256

----------------------------------------------------------------

# 19. Notification Infrastructure

Service:

Amazon SNS

----------------------------------------------------------------

Purpose

Push Notifications

Event Broadcasting

Background Notifications

----------------------------------------------------------------

# 20. Email Infrastructure

Service:

Amazon SES

----------------------------------------------------------------

Purpose

OTP Delivery

Account Verification

Critical Notifications

Weekly Reports

----------------------------------------------------------------

# 21. Secrets Management

Service:

AWS Secrets Manager

----------------------------------------------------------------

Stored Secrets

Database Credentials

Redis Credentials

Groq API Key

JWT Secrets

SMTP Credentials

----------------------------------------------------------------

Never Stored In

Git

Docker Images

Source Code

Frontend

----------------------------------------------------------------

# 22. Monitoring Layer

Service:

CloudWatch

----------------------------------------------------------------

Metrics

CPU Usage

Memory Usage

Request Count

Response Time

Error Rate

Database Usage

Redis Usage

----------------------------------------------------------------

# 23. Logging Strategy

Application Logs

NestJS

Next.js

Workers

----------------------------------------------------------------

Stored In

CloudWatch Logs

----------------------------------------------------------------

Retention

90 Days

----------------------------------------------------------------

# 24. Alerts

Examples

API Down

Database Down

Redis Down

High Error Rate

CPU Overload

Memory Exhaustion

----------------------------------------------------------------

Notification Channels

Email

CloudWatch Alerts

SNS

----------------------------------------------------------------

# 25. Match Synchronization Architecture

Data Provider

API-Football

----------------------------------------------------------------

Flow

Scheduler

↓

API-Football

↓

Transform Data

↓

Database

↓

Redis Refresh

----------------------------------------------------------------

Frequency

Every 5 Minutes

----------------------------------------------------------------

# 26. Background Workers

Purpose

Heavy Processing

----------------------------------------------------------------

Responsibilities

Score Calculation

Ranking Rebuild

Achievement Evaluation

Notification Delivery

Activity Feed Generation

AI Summary Generation

----------------------------------------------------------------

# 27. Worker Architecture

Worker Containers

Independent ECS Tasks

----------------------------------------------------------------

Benefits

No impact on API performance.

----------------------------------------------------------------

# 28. AI Infrastructure

Provider

Groq

----------------------------------------------------------------

Flow

User Question

↓

NestJS AI Module

↓

Groq API

↓

Response

----------------------------------------------------------------

Use Cases

Chatbot

Weekly Summary

Performance Analysis

Hall Of Fame Insights

Prediction Statistics

----------------------------------------------------------------

# 29. Network Architecture

VPC

Private Subnets

Public Subnets

NAT Gateway

Internet Gateway

----------------------------------------------------------------

Public Layer

ALB

CloudFront

----------------------------------------------------------------

Private Layer

ECS

Redis

PostgreSQL

----------------------------------------------------------------

# 30. Availability Zones

Minimum

2 Availability Zones

----------------------------------------------------------------

Recommended

3 Availability Zones

----------------------------------------------------------------

Purpose

Fault Tolerance

High Availability

----------------------------------------------------------------

# 31. Backup Strategy

RDS Backups

Daily

----------------------------------------------------------------

Retention

30 Days

----------------------------------------------------------------

S3 Versioning

Enabled

----------------------------------------------------------------

Redis Snapshots

Enabled

----------------------------------------------------------------

# 32. Disaster Recovery

Recovery Point Objective

15 Minutes

----------------------------------------------------------------

Recovery Time Objective

1 Hour

----------------------------------------------------------------

# 33. CI/CD Pipeline

Developer Push

↓

GitHub Actions

↓

Unit Tests

↓

Integration Tests

↓

Docker Build

↓

Push To ECR

↓

Deploy To ECS

↓

Health Check

↓

Production

----------------------------------------------------------------

# 34. Deployment Strategy

Blue-Green Deployment

----------------------------------------------------------------

Benefits

Zero Downtime

Easy Rollback

Safer Releases

----------------------------------------------------------------

# 35. Cost Optimization

Development

Small ECS Tasks

Single Database

----------------------------------------------------------------

Production

Auto Scaling Enabled

CloudFront Caching

Redis Caching

Resource Monitoring

----------------------------------------------------------------

# 36. Expected Capacity

Target Users

5000+

----------------------------------------------------------------

Expected Concurrent Users

3000+

----------------------------------------------------------------

Expected API Response

< 500 ms

----------------------------------------------------------------

Expected Ranking Response

< 200 ms

----------------------------------------------------------------

Expected Availability

99.9%

----------------------------------------------------------------

# 37. Infrastructure Evolution Roadmap

Phase 1

MVP

3000 Users

----------------------------------------------------------------

Phase 2

5000 Users

Additional ECS Tasks

Improved Redis

----------------------------------------------------------------

Phase 3

20000 Users

Read Replicas

Dedicated Analytics

Microservice Extraction

----------------------------------------------------------------

Phase 4

50000+ Users

Multi Region

Global CDN Optimization

Dedicated Data Warehouse

----------------------------------------------------------------

# 38. Infrastructure Diagram

Internet

↓

Route53

↓

CloudFront

↓

AWS WAF

↓

Application Load Balancer

↓

ECS Fargate Cluster

├── Next.js Frontend
├── NestJS Backend
└── Worker Service

↓

Redis ElastiCache

↓

RDS PostgreSQL

↓

S3 Storage

↓

CloudWatch Monitoring

----------------------------------------------------------------

# 39. Source Of Truth

This document defines the official AWS infrastructure architecture of GOLEATE!.

If implementation conflicts with this document:

AWS_INFRASTRUCTURE.md takes precedence.

----------------------------------------------------------------

END OF DOCUMENT