# UI_UX_SPECIFICATION.md

# GOLEATE! UI / UX Specification

Version: 1.0

---

# Design Vision

GOLEATE! debe sentirse como una mezcla entre:

- Sofascore
- Discord
- Riot Games
- Duolingo

Objetivo:

Crear una plataforma deportiva universitaria moderna donde los estudiantes sientan que están participando en una competición real.

---

# Design Principles

1. Mobile First

La mayoría de usuarios accederá desde smartphones.

---

2. Information First

Los partidos y rankings siempre tienen prioridad visual.

---

3. Gamification Everywhere

Todo debe generar sensación de progreso.

---

4. Fast Interactions

Ninguna acción importante debe requerir más de 3 clics.

---

5. Live Feeling

La plataforma debe sentirse activa incluso cuando el usuario no interactúa.

---

# Visual Identity

Nombre:

GOLEATE!

Tagline:

Predice. Compite. Lidera.

---

# Design Language

Estilo:

University Gaming Sports Platform

No usar:

- Bootstrap clásico
- Interfaces corporativas
- Diseño académico aburrido

Inspiración:

- Esports
- Apps deportivas
- Dashboards modernos

---

# Component Library

Framework:

Ant Design

Animations:

Ant Motion

Libraries:

antd

@ant-design/icons

rc-motion

framer-motion

---

# Color Palette

Primary

#00E676

---

Primary Hover

#00C853

---

Accent Gold

#FFD54F

---

Success

#00E676

---

Danger

#FF5252

---

Warning

#FFC107

---

Background

#0B1220

---

Surface

#131C2E

---

Card

#1A2336

---

Border

#2C3954

---

Text Primary

#FFFFFF

---

Text Secondary

#94A3B8

---

# Typography

Font Family

Inter

Fallback

sans-serif

---

Page Titles

32px

Bold

---

Section Titles

24px

SemiBold

---

Body

16px

Regular

---

Captions

14px

Regular

---

# Animation System

Animation Style:

Sport Pulse

---

Page Enter

Fade + Slide Up

Duration:

300ms

---

Card Hover

Scale:

1.03

Duration:

200ms

---

Ranking Movement

Animated Position Change

Duration:

500ms

---

Goal Event

Bounce Animation

Glow Effect

Duration:

800ms

---

Achievement Unlock

Confetti Animation

Badge Pop

Duration:

1500ms

---

# Layout Structure

Desktop

Sidebar + Content

---

Tablet

Collapsible Sidebar

---

Mobile

Bottom Navigation

---

# Navigation

Home

Matches

Rankings

Rooms

Profile

---

# Home Dashboard

Sections

Welcome Card

Current Rank

Current Streak

Today's Matches

Live Matches

Community Predictions

Activity Feed

---

Hero Card

Display:

Avatar

Level

Rank

Current Points

Current Streak

---

# Today's Matches

Card Design

Match Status

Teams

Kickoff Time

Prediction Button

---

Example

Brazil vs Argentina

20:00

Predict Now

---

# Live Match Center

Premium Screen

Purpose:

Keep users engaged

---

Components

Live Score

Match Events

Lineups

Statistics

Community Prediction

Room Activity

---

Live Header

Brazil 2 - 1 Argentina

78'

LIVE

---

# Prediction Screen

Components

Team A Score

Team B Score

Prediction Confidence

Submit Button

---

Interaction

Animated Score Selector

---

Prediction Confirmation

Success Modal

With Animation

---

# Community Prediction Widget

Display

72%

Brazil

18%

Draw

10%

Argentina

Animated Bars

Auto Refresh

---

# Rankings Screen

Tabs

Global

Career

Room

Friends

---

Ranking Card

Position

Avatar

Name

Points

Level

Accuracy

---

Top 3 Design

Gold

Silver

Bronze

Special Effects

---

# Hall Of Fame

Dedicated Screen

Displays

Best Predictors

Historical Winners

Season Champions

---

Visual Style

Premium

Gold Theme

Animated Trophies

---

# Rooms Screen

Inspired by Discord

---

Room Card

Name

Description

Members

Room Ranking

Invite Code

---

Room Types

Academic

Social

---

Academic Examples

DSW2026

Cybersecurity2026

Architecture2026

---

Social Examples

Friends FC

Los Galácticos

Team Perú

---

# Room Dashboard

Displays

Ranking

Activity Feed

Members

Upcoming Matches

Collective Predictions

---

# Activity Feed

Examples

Juan predicted Brazil 2-1

Maria entered Top 10

DSW2026 became #1

Pedro unlocked Gold Badge

---

Updates

Real Time

WebSockets

---

# Profile Screen

Inspired by Gaming Profiles

---

Header

Avatar

Frame

Name

Level

Points

---

Statistics

Prediction Accuracy

Total Predictions

Exact Results

Longest Streak

Current Streak

---

Achievements

Badge Grid

---

Frames

Bronze

Silver

Gold

Diamond

Legend

---

# Achievement System

Examples

First Prediction

First Exact Score

10 Correct Winners

50 Predictions

Top 10 Global

Perfect Week

---

Unlock Animation

Badge Explosion

Glow Effect

---

# Notifications

Real Time

Web Push

In-App

---

Examples

Peru vs Chile starts in 1 hour

You entered Top 10

You unlocked a badge

Your room became #1

---

# AI Assistant

Floating Button

Bottom Right

---

Capabilities

My Accuracy

Pending Predictions

Room Ranking

Best Upcoming Matches

Weekly Summary

---

Example Questions

Who leads DSW2026?

What is my accuracy?

Which matches are pending?

---

# Loading States

Skeleton Components

Every Screen

---

# Empty States

Custom Illustrations

Examples

No Predictions Yet

No Rooms Joined

No Live Matches

---

# PWA Requirements

Installable

Offline Cache

Push Notifications

Splash Screen

App Icons

---

# Accessibility

Minimum Contrast Ratio

WCAG AA

---

Keyboard Navigation

Supported

---

Screen Readers

Supported

---

# UX Success Metrics

Prediction Creation

Less than 30 seconds

---

Match Discovery

Less than 10 seconds

---

Room Join

Less than 20 seconds

---

Mobile Lighthouse Score

90+

---

Desktop Lighthouse Score

95+