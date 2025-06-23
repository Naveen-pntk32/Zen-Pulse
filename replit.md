# Smart Pomodoro Timer - Smartwatch Experience

## Overview

This is a full-stack web application that provides a smart Pomodoro timer with a modern smartwatch-inspired interface. The application combines productivity features like task scheduling, time tracking, and focus sessions with multimedia controls and customizable settings.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with local storage persistence
- **Styling**: Tailwind CSS with a custom dark theme optimized for smartwatch aesthetics
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API structure (routes prefixed with /api)
- **Development**: Hot reload with Vite integration
- **Production**: Compiled with esbuild for optimal performance

### Data Storage Solutions
- **Primary Storage**: In-memory storage (MemStorage class) for development
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema
- **Client Storage**: Browser localStorage for user preferences and application state
- **Schema**: User management system with extensible storage interface

## Key Components

### Timer Components
- **Digital Clock**: Real-time clock display with timezone and date information
- **Pomodoro Timer**: Configurable focus/break sessions with notification support
- **Stopwatch**: Precision timing with lap functionality

### Productivity Features
- **Task Scheduler**: Create, manage, and track scheduled tasks with notifications
- **Daily Statistics**: Track focus hours, completed pomodoros, and productivity streaks
- **Quick Settings**: Adjustable timer durations and notification preferences

### Media Integration
- **Music Controller**: Media session API integration for controlling external music players
- **Notification System**: Browser notifications for timer completions and task reminders

### UI/UX Features
- **Smartwatch Design**: Dark theme with rounded corners and card-based layout
- **Responsive Grid**: Adaptive layout that works on desktop and mobile devices
- **Toast Notifications**: In-app notification system for user feedback

## Data Flow

1. **User Interactions**: Components use React hooks to manage local state
2. **Persistence**: Critical data (tasks, settings, stats) automatically saved to localStorage
3. **Notifications**: Browser Notification API integrated with timer completions
4. **Media Control**: Media Session API allows external music app control
5. **Real-time Updates**: Timers and clocks update every second using setInterval

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18 with hooks, React Query for data fetching
- **UI Library**: Radix UI primitives with custom Tailwind styling
- **Database**: Drizzle ORM with PostgreSQL support via Neon serverless
- **Validation**: Zod for runtime type checking and schema validation

### Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Code Quality**: ESLint and TypeScript for static analysis
- **Development**: Hot reload and error overlay for debugging

### Browser APIs
- **Notifications API**: For timer and task reminders
- **Media Session API**: For music player integration
- **Local Storage API**: For client-side data persistence

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts development server on port 5000
- **Hot Reload**: Vite provides instant feedback during development
- **Error Handling**: Runtime error modal for debugging

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild compiles server to `dist/index.js`
- **Deployment**: Configured for Replit autoscale deployment

### Database Migration
- **Schema Management**: Drizzle Kit handles database schema migrations
- **Command**: `npm run db:push` applies schema changes to database

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```