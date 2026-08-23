# 🧘 ZenPulse

A TickTick-inspired productivity and task management web app with a Pomodoro focus timer, task scheduling, and daily productivity analytics.

**Live Demo:** [zen-pulse-liard.vercel.app](https://zen-pulse-liard.vercel.app/pomodoro)
**Repository:** [github.com/Naveen-pntk32/Zen-Pulse](https://github.com/Naveen-pntk32/Zen-Pulse)

## Overview

ZenPulse is a SaaS-style productivity app built end to end, combining task and project management with a Pomodoro-based focus system. It spans 10+ features — dashboard, tasks, projects, categories, search, filters, priorities, due dates, recurring tasks, and dark/light mode — backed by a REST API and a relational database.

## Features

- ✅ Task and project management with categories, priorities, and due dates
- 🔁 Recurring tasks support
- 🔍 Search and filtering across tasks and projects
- ⏱️ Pomodoro focus timer with a built-in stopwatch
- 🎵 Music controller for focus sessions
- 📊 Daily and weekly productivity analytics across 2 dashboard views
- 🔔 Notification/toast system for reminders and session updates
- 🔐 JWT-based authentication for user-specific task management
- 🌗 Dark/light mode toggle
- 📱 Fully responsive UI

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Custom hooks (timer, notifications, local storage, media session)

**Backend**
- Node.js REST API
- 8+ CRUD endpoints across tasks and projects
- Request validation and structured error handling
- JWT authentication

**Database**
- Supabase (PostgreSQL) with a 4-table relational schema: Users, Projects, Tasks, Subtasks

**Deployment**
- Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- A Supabase project (for database & auth) — see `DATABASE_SETUP.md` in the repo

### Installation

```bash
# Clone the repository
git clone https://github.com/Naveen-pntk32/Zen-Pulse.git

# Navigate to the project directory
cd Zen-Pulse

# Install dependencies
npm install
```

### Environment Setup

Configure your Supabase credentials and any required environment variables as described in `DATABASE_SETUP.md`.

### Run Locally

```bash
npm start
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
├── client/                  # Frontend application
│   └── src/
│       ├── components/      # Pomodoro timer, stopwatch, task scheduler, daily stats, etc.
│       ├── hooks/           # Custom hooks (timer, notifications, local storage)
│       ├── lib/             # Query client, storage, utility functions
│       ├── pages/           # App pages
│       └── types/           # Type definitions
├── supabase/
│   └── migrations/          # Database migrations
├── DATABASE_SETUP.md        # Supabase/database setup guide
├── MIGRATION_GUIDE.md       # Migration instructions
└── vercel.json              # Deployment configuration
```

## Core Modules

| Module | Description |
|--------|-------------|
| Pomodoro Timer | Focus sessions with start/pause/reset controls |
| Stopwatch | Free-form time tracking |
| Task Scheduler | Create, organize, and manage tasks and due dates |
| Daily Stats | Visualizes daily/weekly completion analytics |
| Music Controller | Background focus music during sessions |
| Notifications | Toast-based alerts for session and task events |

## Author

**Navaneetha Krishnan P**
[LinkedIn](https://www.linkedin.com/in/navien-krish/) • [GitHub](https://github.com/Naveen-pntk32) • [Portfolio](https://navien-krish.vercel.app)
