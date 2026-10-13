# ZenPulse Database & Full-Stack Setup Guide

This guide documents the architecture, setup, migrations, and deployment process for ZenPulse's full-stack application backed by PostgreSQL and Supabase.

---

## 1. Architecture Overview

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide icons, TanStack React Query, Wouter routing.
- **Backend**: Express.js with TypeScript (`/server/src`), RESTful architecture, Zod validation, Supabase Auth token verification middleware.
- **Database**: PostgreSQL hosted on Supabase (or standard PostgreSQL locally).
- **ORM**: Drizzle ORM (`drizzle-orm`) with Drizzle Kit (`drizzle-kit`).
- **Serverless / Vercel**: Vercel Serverless Function entry point (`/api/index.ts`) forwarding requests to the Express app.

---

## 2. Prerequisites

- **Node.js** >= 20.x
- **npm** >= 9.x
- A **Supabase account & project** (or local PostgreSQL instance)

---

## 3. Environment Variables Configuration

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# PostgreSQL Database Connection
# Supabase Transaction Pooler (recommended for serverless) or Session Pooler:
# e.g., postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/productivity_app

# Supabase Authentication
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# (Optional) JWT Secret
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Development/Testing Mock Authentication Flag (set false in production)
ALLOW_MOCK_AUTH=false
```

And in `client/.env`:
```env
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=/api
```

---

## 4. Applying Database Migrations

ZenPulse migrations are version-controlled in `supabase/migrations/`:
- `001_zenpulse_evolution.sql`: Core schema (`task_lists`, `tasks`, `habits`, `habit_completions`, `focus_sessions`, `user_settings`, RLS policies, indexes).
- `002_zenpulse_subtasks_profiles.sql`: Extended schema (`profiles`, `subtasks`, task recurrence & position).

### Method A: Via Supabase SQL Editor (Recommended for Cloud)
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run the contents of `supabase/migrations/001_zenpulse_evolution.sql`.
3. Run the contents of `supabase/migrations/002_zenpulse_subtasks_profiles.sql`.
4. Both migration files are completely idempotent with `IF NOT EXISTS` guards.

### Method B: Via CLI Script (Direct DB Connection)
```bash
npm run db:migrate
```

### Method C: Drizzle Kit Push
```bash
npm run db:push
```

---

## 5. Local Development Workflow

### Starting the Backend Server
```bash
# Starts Express server on http://localhost:5000
npm run server:dev
# or
npm start
```

### Starting the Frontend
```bash
# In a separate terminal:
npm run dev
```
Vite automatically proxies all `/api/*` calls to `http://localhost:5000` via the configured dev proxy.

---

## 6. Running Tests

The test suite validates health endpoints, Supabase authentication rejection, Zod schema input validation, and routing boundaries:

```bash
npm test
```

To typecheck the entire backend codebase:
```bash
npx tsc --noEmit
```

To test the production build of the frontend:
```bash
npm run build
```

---

## 7. Production Deployment (Vercel)

ZenPulse is preconfigured for unified monorepo deployment on Vercel:

1. **Vercel Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `vite build --config vite.config.vercel.js`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
2. **Rewrites (`vercel.json`)**:
   - `/api/(.*)` rewrites to `/api/index.ts` (Express serverless function).
   - `/(.*)` rewrites to `/index.html` (SPA routing).
3. **Vercel Environment Variables**:
   Add the following in Vercel Project Settings -> Environment Variables:
   - `DATABASE_URL` (Use Supabase Transaction Pooler URL, port 6543, with `?sslmode=require`)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NODE_ENV=production`

---

## 8. Troubleshooting & Common Errors

| Issue | Cause | Solution |
|---|---|---|
| `401 Unauthorized` on API calls | Missing or invalid Supabase Bearer token | Ensure user is signed in via Supabase Auth or valid session is present. |
| `DATABASE_URL not configured` | Missing database environment variable | Add `DATABASE_URL` to `.env` or Vercel environment variables. |
| Connection pool timeout in Serverless | Direct port 5432 used instead of pooler | In Supabase, use the **Transaction Pooler** connection string (port 6543). |
| CORS Error in local development | Frontend origin mismatch | Ensure `CLIENT_ORIGIN` matches frontend port (default `http://localhost:5173`). |