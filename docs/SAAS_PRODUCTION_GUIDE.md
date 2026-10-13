# Pace SaaS Production Engineering & Architecture Guide

This guide details the production deployment, AI deep-work engine, high-converting landing page, custom SMTP email delivery, observability, and legal compliance architecture for Pace.

---

## 1. Executive Summary & Pillars Architecture

```
+-----------------------------------------------------------------------------------+
|                             PACE PRODUCTION ARCHITECTURE                          |
|                                                                                   |
|  [Pillar 2] AI Deep-Work Intelligence                                             |
|  - Autonomous task decomposition via Google Gemini API & deterministic heuristics |
|  - Real-time daily focus briefing and workload analysis                          |
|  - Zero-latency fallback to offline indexed heuristic breakdown                   |
|                                                                                   |
|  [Pillar 3] Cinematic Luxury Landing Page                                         |
|  - Greptile Dark Design System (#0b0a10, #12111c, #28e99f, #daff01)               |
|  - Interactive Hero Focus Telemetry Simulator                                     |
|  - 4-Tier Bento Grid Architecture showcase                                        |
|  - Multi-tenant auth awareness with seamless workspace entry                      |
|                                                                                   |
|  [Pillar 4] Production Infrastructure, Observability & Legal Compliance           |
|  - Custom SMTP email configuration with Resend (bypasses Supabase 3/hr cap)       |
|  - Error tracking & telemetry integration (Sentry / GlitchTip)                   |
|  - Full GDPR & CCPA SaaS legal compliance (/terms, /privacy)                     |
|  - Multi-tenant PostgreSQL Row-Level Security (RLS)                               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Pillar 2: AI Deep-Work Intelligence Configuration

### 2.1 Backend Endpoints
- **`GET /api/ai/briefing`**: Authenticated endpoint analyzing the user's pending tasks, high-priority counts, active habits, and focus minutes today. Returns personalized deep-work recommendations.
- **`POST /api/ai/decompose`**: Validates `{ taskId: UUID }`. Invokes Gemini 1.5 Flash to decompose complex tasks into 3–5 sequenced subtasks with time estimates and writes them directly to the database.

### 2.2 Environment Secret
Add your Google Gemini API key to the root `.env`:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
```
> **Resilience Note**: If `GEMINI_API_KEY` is omitted or unconfigured, Pace's built-in deterministic heuristic engine automatically generates high-quality phased subtasks, ensuring zero disruptions or failed requests.

---

## 3. Pillar 3: High-Converting Landing Page Architecture

- **Route**: Accessible at `/` for all users and visitors.
- **Components**:
  - **Hero Section**: Cybernetic display font, glowing Greptile gradient, interactive mini timer with live 25m/5m/50m modes.
  - **Bento Grid**: 12-column responsive layout detailing AI task decomposition, dual chronometer engine, habit streak lattice, and PostgreSQL cloud sync.
  - **Interactive FAQ Accordion**: Addresses data security, pricing, offline fallback, and migration.
  - **Footer Navigation**: Quick links to `/pomodoro`, `/tasks`, `/habits`, `/terms`, `/privacy`, and GitHub.

---

## 4. Pillar 4: Production Email Delivery (Custom SMTP with Resend)

### 4.1 The Supabase Free Tier Email Bottleneck
Supabase's default shared SMTP server imposes a strict rate limit of **3 to 4 emails per hour**. When onboarding real users or sending confirmation links, you will encounter:
```
[ERROR]: email rate limit exceeded
```

### 4.2 Eliminating the Limit with Resend
1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your domain (e.g., `pace.app`) with standard DKIM and SPF TXT records.
3. Generate an API Key under **API Keys**.
4. In your Supabase Dashboard:
   - Navigate to **Project Settings** → **Authentication** → **SMTP Settings**.
   - Enable **Enable Custom SMTP**.
   - **Sender email**: `noreply@pace.app`
   - **Sender name**: `Pace Focus OS`
   - **Host**: `smtp.resend.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **User**: `resend`
   - **Password**: `re_123456789...` (your Resend API key)
5. Save changes. Your email throughput increases immediately from 3/hour to thousands per month.

---

## 5. Observability, Sentry & Error Monitoring

### 5.1 Backend Sentry Integration
Install `@sentry/node` in the server package:
```bash
npm install @sentry/node --save
```
In `server/src/app.ts`:
```ts
import * as Sentry from "@sentry/node";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "production",
    tracesSampleRate: 0.2,
  });
}
```

### 5.2 Frontend Sentry Integration
In `client/src/main.jsx`:
```js
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
  });
}
```

---

## 6. SaaS Compliance & Legal Pages

- **`/terms`**: Complete Terms of Service covering acceptable use, AI output disclaimers, user data ownership, account security, and liability limits.
- **`/privacy`**: Comprehensive Privacy Policy detailing PostgreSQL RLS encryption, data retention, one-click JSON export, and GDPR/CCPA data deletion rights.

---

## 7. Production Verification & Pre-Flight Checklist

Before deploying to Vercel or your cloud hosting provider:
- [x] Run test suite: `npm test` (All 23+ unit & integration tests pass).
- [x] Run TypeScript check: `npx tsc --noEmit` (0 type errors).
- [x] Build frontend assets: `npm run build` (Clean production bundle created in `dist/`).
- [x] Verify database connection pooler (`DATABASE_URL`) with SSL enabled.
- [x] Confirm `ALLOW_MOCK_AUTH=false` in production environments.
