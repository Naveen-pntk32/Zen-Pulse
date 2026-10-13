# Master Web Application Page Planning & Production Architecture Guide
### The Comprehensive Blueprint for Scoping, Structuring, and Auditing Every Route, Layout, and UX State in Modern Web Applications

---

## Table of Contents
1. [Executive Overview: Beyond the Homepage Fallacy](#1-executive-overview-beyond-the-homepage-fallacy)
   - [The Production Reality](#the-production-reality)
   - [The Hidden Costs of Missing Pages](#the-hidden-costs-of-missing-pages)
   - [The Golden Rule: The 5-Part Architectural Separation](#the-golden-rule-the-5-part-architectural-separation)
2. [Page vs. Component vs. UI State Framework](#2-page-vs-component-vs-ui-state-framework)
   - [Definitions & Architectural Roles](#definitions--architectural-roles)
   - [Decision Matrix: Page, Component, or State?](#decision-matrix-page-component-or-state)
3. [Master Taxonomy of Web Application Pages](#3-master-taxonomy-of-web-application-pages)
   - [3.1 Public & Marketing Suite](#31-public--marketing-suite)
   - [3.2 Legal, Trust & Compliance Suite (The Often-Forgotten 15)](#32-legal-trust--compliance-suite-the-often-forgotten-15)
   - [3.3 Authentication & Identity Suite](#33-authentication--identity-suite)
   - [3.4 Customer Lifecycle & Revenue Retention Suite](#34-customer-lifecycle--revenue-retention-suite)
   - [3.5 Authenticated Core Application Suite](#35-authenticated-core-application-suite)
   - [3.6 User Account & Workspace Settings Suite](#36-user-account--workspace-settings-suite)
   - [3.7 Admin & Governance Suite](#37-admin--governance-suite)
   - [3.8 Reliability, System & UX Edge-Case States](#38-reliability-system--ux-edge-case-states)
4. [Domain-Specific Page Menus by Application Type](#4-domain-specific-page-menus-by-application-type)
5. [Application Areas, Shared Layouts & Route Blueprint](#5-application-areas-shared-layouts--route-blueprint)
   - [The Three Architectural Areas](#the-three-architectural-areas)
   - [Production Route Hierarchy Tree](#production-route-hierarchy-tree)
   - [Layout Nesting Architecture](#layout-nesting-architecture)
6. [The 11-Step End-to-End Application Planning Workflow](#6-the-11-step-end-to-end-application-planning-workflow)
7. [General Architecture, Security & Reliability Principles](#7-general-architecture-security--reliability-principles)
8. [The Production-Grade Audit Checklist](#8-the-production-grade-audit-checklist)

---

# 1. Executive Overview: Beyond the Homepage Fallacy

### The Production Reality
Most project teams, founders, and junior developers pour weeks into polishing the **marketing landing page** and the primary **happy path** of their product. They then ship to production without a real Refund Policy, a working 404 handler, or an explicit view for when a user's credit card fails.

These omitted screens and states are precisely where users decide whether a software product feels **trustworthy, enterprise-grade, and reliable**—or half-built and amateur.

```
+-----------------------------------------------------------------------------------+
|                        THE PRODUCTION WEB APP MATURITY SPECTRUM                   |
|                                                                                   |
|  AMATEUR / PROTOTYPE SITE (Surface-Level):                                        |
|  [ Landing Page ] ──> [ Basic Login ] ──> [ Happy-Path Dashboard ] ──> [ ? ]     |
|  * Missing legal docs, blank screen on session expiration, payment failure drops.  |
|                                                                                   |
|                                       vs.                                         |
|                                                                                   |
|  PRODUCTION-GRADE WEB APPLICATION (Engineered System):                            |
|  - Complete Legal & Compliance Layer (GDPR Cookie Controls, DPA, Disclosures)      |
|  - Full Customer Lifecycle (Onboarding, Upgrades, Downgrades, Retention Flow)     |
|  - Complete Resilience Layer (Session Expiry, Offline, 404/403/500, Empty States) |
|  - Strict Server-Side Authorization on all Admin & User Routes                    |
+-----------------------------------------------------------------------------------+
```

### The Hidden Costs of Missing Pages
1. **Missing Legal Pages = Compliance & Enterprise Sales Risk**: Enterprise procurement teams and corporate lawyers look at your footer first. Missing DPAs, Privacy Policies, Cookie Preferences, or Accessibility Statements immediately disqualify your app from institutional contracts and expose you to regulatory fines (GDPR, CCPA).
2. **Missing Lifecycle Pages = High Customer Support Burden & Churn**: When users cannot self-serve an invoice, change their plan, update a failing credit card, or pause a subscription, they flood your support inbox or issue bank chargebacks.
3. **Missing UX States = Silent Analytics Drop-Off**: When a session token expires, a database query errors, or a search returns zero results, an unhandled state renders a blank white screen or silent console error. Users assume the application is broken and silently abandon the product.

> **Real-World Incident**: A venture-backed SaaS launched with an ultra-sleek AI dashboard. However, they omitted a **Session Expired** modal and a dedicated **Payment Failed** screen. When subscription renewal webhooks failed or auth cookies expired after 24 hours, users were dumped onto a blank page. The team noticed a 35% monthly silent drop-off that no product analytics could diagnose until a full UX state audit was conducted.

---

### The Golden Rule: The 5-Part Architectural Separation
Before writing a single component or database migration, plan these five architectural layers independently:

1. **Pages & Routes**: What distinct screens and URLs exist in the application?
2. **Layouts**: What chrome, navigation shells, and structural wrappers are shared between screens?
3. **Reusable Components**: What atomic UI pieces (buttons, inputs, dialogs, tables, cards) are shared across views?
4. **User Roles & Permissions (RBAC)**: Who is authorized to access each specific route and execute each action?
5. **Application States**: What does the interface display while data is loading, when a list is completely empty, when input validation fails, and when network or server operations break?

---

# 2. Page vs. Component vs. UI State Framework

A frequent architectural flaw in frontend engineering is confusing a **route-level page** with a **reusable component** or a **conditional UI state**. Misidentifying these leads to bloated routing tables or tangled, non-reusable views.

### Definitions & Architectural Roles
- **Page (Route-Level Screen)**: A top-level container mounted at a unique URL pathname (e.g., `/dashboard/orders`). It handles URL parameters, coordinates data fetching, enforces route-level authentication guards, and injects SEO/metadata tags.
- **Component (Reusable UI Building Block)**: An isolated, composable element that accepts props and emits events (e.g., `<Navbar />`, `<DataTable />`, `<ConfirmModal />`). It renders within one or many pages and does not dictate the top-level route.
- **UI State (Contextual Visual Condition)**: The specific visual presentation of a page or component based on asynchronous data conditions, network status, or permissions (e.g., skeleton pulse, zero-data empty state, inline validation error).

### Decision Matrix: Page, Component, or State?

| Element | Concrete Example | Is it a Separate Page / Route? | Implementation Strategy |
|---|---|:---:|---|
| **App Overview** | Analytics Overview Screen | **Yes** (`/dashboard`) | Route handler with dedicated page template |
| **User Profile** | Personal Account Information | **Yes** (`/settings/profile`) | Nested route within Settings layout |
| **Global Navigation** | Pill Header or Left Sidebar | **No** | Shared layout component (`<Sidebar />`) |
| **Action Modal** | "Create New Workspace" Dialog | **No** (Usually) | Reusable modal component triggered via local state or shallow URL query parameter (`?modal=new`) |
| **Destructive Prompt** | "Delete Account" Confirmation | **No** | Dialog component with double-confirmation prompt |
| **Search Filter** | Multi-Select Facet Dropdown | **No** | Composable filter component tied to URL search parameters |
| **Feedback Banner** | Global Toast Notification | **No** | Context provider / portal notification stack |
| **Loading Condition** | Skeleton Table Pulse | **No** (State) | Rendered conditionally inside `<DataTable />` while `isLoading === true` |
| **Empty Record Set** | "No Invoices Found" Illustration | **No** (State) | Rendered inside `<InvoicesList />` when `data.length === 0` |
| **HTTP Error 404** | Route Not Found Screen | **Yes** (`/404` or root catch-all) | Global fallback route with search and navigation rescue links |
| **Auth Expiration** | Session Expired Notice | **Hybrid** | Can be a dedicated route (`/session-expired`) or an interceptor modal that preserves unsaved form state |

---

# 3. Master Taxonomy of Web Application Pages

Use this taxonomy as an exhaustive menu of possibilities. Select the modules that match your application's product requirements, business model, and compliance needs.

```
+----------------------------------------------------------------------------------------------------+
|                                    MASTER WEB APP PAGE TAXONOMY                                    |
|                                                                                                    |
|  [ 01. PUBLIC & MARKETING ]        [ 02. LEGAL & COMPLIANCE ]        [ 03. AUTH & IDENTITY ]       |
|  - Home / Landing                  - Privacy & Terms                 - Register & Login            |
|  - Features & Services             - Cookie Policy & Preferences     - Password Reset Flow         |
|  - Pricing & Plans                 - Refund & Cancellation           - Email / OTP Verification    |
|  - Contact, FAQ, Blog              - DPA, AUP, Security Policy       - 2FA & Team Invitations      |
|                                                                                                    |
|  [ 04. LIFECYCLE & REVENUE ]       [ 05. CORE APPLICATION ]          [ 06. ACCOUNT & SETTINGS ]    |
|  - Onboarding Wizard               - Dashboard / Shell               - Profile & Preferences       |
|  - Upgrade / Downgrade Flows       - List, Detail & Create Views     - Password & Security         |
|  - Retention Cancellation Flow     - Search & Activity Log           - Invoices & Billing          |
|  - Payment Success/Failed/Pending  - Notification Hub                - Connected Accounts & Danger |
|                                                                                                    |
|  [ 07. ADMIN & GOVERNANCE ]        [ 08. SYSTEM & RELIABILITY STATES ]                             |
|  - Admin Dashboard & Analytics     - 404, 403, 500, Offline & Maintenance Pages                    |
|  - User & Role Management (RBAC)   - Session Expired Handler (Preserves Unsaved State)              |
|  - Content Management & Audit Logs - In-Component Micro-States: Loading, Empty, Error, Success     |
+----------------------------------------------------------------------------------------------------+
```

---

### 3.1 Public & Marketing Suite
Pages accessible publicly without user authentication. Their objective is discovery, conversion, and brand authority.

- [ ] **Home / Landing Page (`/`)**: High-impact value proposition, hero visual or interactive demo, social proof, key feature highlights, and clear primary Call to Action (CTA).
- [ ] **Features / Product Overview (`/features` or `/product`)**: Comprehensive breakdown of software capabilities, architecture highlights, workflows, and integrations.
- [ ] **Services / Solutions (`/solutions`)**: Role-based or industry-specific landing pages (e.g., "For Enterprise", "For Startups", "For Agencies").
- [ ] **Pricing & Plans (`/pricing`)**: Transparent tier breakdown, feature comparison matrix, monthly/annual billing toggles, FAQ snippet, and direct checkout/signup triggers.
- [ ] **About Us (`/about`)**: Company mission, founding story, leadership team, company values, and investor/partner logos.
- [ ] **Contact Us (`/contact`)**: Inbound inquiry form, enterprise sales booking link, business address, and operational hours.
- [ ] **FAQ (`/faq`)**: Categorized accordion answering common technical, billing, and operational questions.
- [ ] **Blog / Articles / Changelog (`/blog`, `/changelog`)**: SEO content hub, product release announcements, tutorials, and engineering deep-dives.
- [ ] **Case Studies / Customer Stories (`/customers`)**: High-fidelity customer success stories, metrics, testimonials, and video interviews.

---

### 3.2 Legal, Trust & Compliance Suite (The Often-Forgotten 15)
Auditors, lawyers, payment gateways (Stripe, PayPal), and enterprise procurement teams inspect these first. Omitting them causes account verification rejections, regulatory penalties, and lost sales.

- [ ] **Privacy Policy (`/privacy`)**: Mandatory disclosure detailing what user data is collected, how it is processed, storage duration, third-party trackers, and user privacy rights.
- [ ] **Terms of Service / Terms & Conditions (`/terms`)**: Binding legal agreement defining acceptable usage, intellectual property, warranties, liability limitations, and governing law.
- [ ] **Cookie Policy (`/cookies`)**: Formal explanation of all first-party and third-party cookies, session storage, and analytics trackers utilized by the application.
- [ ] **Cookie Preferences (`/cookie-settings` or interactive modal)**: Interactive consent manager that allows visitors to opt-in or opt-out of functional, analytics, and marketing cookies.
  > **Good to Know — Cookie Policy vs. Cookie Preferences**: A *Cookie Policy* simply explains what trackers exist. A *Cookie Preferences* page or modal actually gives the user granular control to disable them. A website with only the static policy is **not GDPR-compliant**.
- [ ] **Refund Policy (`/refund-policy`)**: Explicit rules, timelines, and conditions under which customers qualify for full or partial monetary refunds.
- [ ] **Cancellation Policy (`/cancellation-policy`)**: Clear instructions on how recurring subscriptions can be terminated and when access terminates upon cancellation.
- [ ] **Shipping Policy (`/shipping`)**: *(Crucial for physical e-commerce)* Fulfillment timelines, geographic restrictions, shipping rates, and customs duties.
- [ ] **Return / Exchange Policy (`/returns`)**: *(E-commerce)* Instructions for item return eligibility, return shipping labels, inspection periods, and exchanges.
- [ ] **Disclaimer (`/disclaimer`)**: Legal liability waivers (e.g., medical, financial, investment, or legal disclaimers for advisory apps).
- [ ] **Accessibility Statement (`/accessibility`)**: Commitment to WCAG 2.1 AA compliance, known limitations, contact info for assistive technology users, and accessibility roadmap.
- [ ] **Data Processing Agreement / DPA (`/dpa`)**: Legal contract governing GDPR/CCPA data transfer terms for B2B SaaS processing customer data.
- [ ] **Acceptable Use Policy / AUP (`/acceptable-use`)**: Strict restrictions banning harassment, illegal activities, scraping, vulnerability scanning, and spam.
- [ ] **Security Policy (`/security`)**: Overview of organizational security practices (encryption in transit and at rest, SOC 2 compliance, cloud hosting infrastructure).
- [ ] **Responsible Disclosure / Vulnerability Reporting (`/security/report` or `/.well-known/security.txt`)**: Guidelines for security researchers to report vulnerabilities ethically without legal threat.
- [ ] **Community Guidelines (`/community-guidelines`)**: Ground rules for user-generated content, forum conduct, moderation standards, and account bans.

---

### 3.3 Authentication & Identity Suite
Handles user identification, session establishment, and access recovery.

- [ ] **Sign Up / Register (`/register` or `/signup`)**: Minimal friction onboarding form, password strength meter, terms acceptance checkbox, and optional OAuth buttons (Google, GitHub, Apple).
- [ ] **Login / Sign In (`/login`)**: Email/username and password fields, OAuth providers, "Remember Me" toggle, and direct links to password recovery.
- [ ] **Forgot Password (`/forgot-password`)**: Simple email submission form that initiates a secure password reset link or token.
- [ ] **Reset Password (`/reset-password`)**: Secure endpoint validating one-time tokens, enforcing new password requirements, and confirming successful credential updates.
- [ ] **Email Verification (`/verify-email`)**: Landing screen displaying confirmation status after clicking a verification link, with a "Resend Link" fallback.
- [ ] **OTP / SMS Verification (`/verify-otp`)**: Numeric code input with countdown timer and resend trigger.
- [ ] **Two-Factor Authentication / 2FA Challenge (`/auth/2fa`)**: Authenticator app TOTP code entry, hardware security key prompt, or fallback recovery code entry.
- [ ] **Accept Invitation (`/invite/accept`)**: Dedicated flow allowing invited team members to join an existing organization or workspace.
- [ ] **SSO / SAML Redirect Landing (`/auth/sso`)**: Enterprise login portal routing users through Okta, Google Workspace, or Azure AD identity providers.

---

### 3.4 Customer Lifecycle & Revenue Retention Suite
Every screen a user encounters between initial signup, ongoing subscription, and potential churn. These pages receive significant real-world traffic but are frequently overlooked during planning.

- [ ] **Onboarding Wizard / Welcome Screen (`/onboarding`)**: Progressive multi-step wizard collecting initial workspace details, primary use cases, and persona setup before dumping the user into an empty dashboard.
- [ ] **Billing & Subscription Overview (`/settings/billing`)**: Current active tier, renewal date, payment method on file, billing address, and downloadable PDF invoice history.
- [ ] **Upgrade Plan Page (`/upgrade` or `/billing/upgrade`)**: Comparison view showing locked vs. unlocked features, prorated billing calculations, and instant checkout.
- [ ] **Downgrade Plan Page (`/billing/downgrade`)**: Feature loss warning, account limit reconciliation (e.g., prompt to delete excess seats), and confirmation.
- [ ] **Cancel Subscription Page (`/billing/cancel`)**: 
  > **Good to Know — Retention over Punishment**: The cancellation screen is a **retention page, not a punishment page**. Top production apps use this view to:
  > 1. Inquire about the root reason for leaving (price, bugs, missing features).
  > 2. Offer an immediate alternative: a 1-to-3 month account pause, a 50% discount for 3 months, or a switch to a lower-cost tier.
  > 3. Clearly explain what happens to user data upon final confirmation.
- [ ] **Payment Success Screen (`/checkout/success`)**: Order/transaction confirmation, receipt summary, immediate next steps, and "Go to Dashboard" button.
- [ ] **Payment Failed Screen (`/checkout/failed` or `/billing/payment-failed`)**: Clear, non-technical explanation of payment rejection (e.g., expired card, insufficient funds, bank block), and an immediate one-click card update form.
- [ ] **Payment Pending / Processing Screen (`/checkout/pending`)**: Asynchronous webhook listener status screen for delayed payment rails (ACH, SEPA, crypto, wire transfer).
- [ ] **Support Request Page (`/support`)**: Ticket submission form with file attachment capabilities, diagnostic system data capture, and priority selectors.
- [ ] **Help Center / Knowledge Base (`/help`)**: Searchable documentation, interactive guides, video tutorials, and troubleshooting articles.

---

### 3.5 Authenticated Core Application Suite
The primary workspace where users interact with the product's core value proposition.

- [ ] **Application Shell & Dashboard Overview (`/app` or `/dashboard`)**: High-level telemetry, key metric cards, quick action shortcuts, recent activity feed, and pending tasks.
- [ ] **Primary Feature Workspace (`/app/{feature}`)**: The flagship utility of the platform (e.g., Canvas, Editor, Feed, Workflow Builder).
- [ ] **List / Browse Views (`/app/{items}`)**: Paginated or infinite-scrolling collection view with sorting, search, column filters, and batch operations.
- [ ] **Item Detail Views (`/app/{items}/:id`)**: Deep-dive record view displaying metadata, history, associated comments, and contextual actions.
- [ ] **Create / Add Views (`/app/{items}/new`)**: Structured form or multi-step wizard for item creation with client-side and server-side validation.
- [ ] **Edit / Update Views (`/app/{items}/:id/edit`)**: Pre-populated editing interface with change detection and unsaved work warnings.
- [ ] **Global Search & Filter Results (`/app/search`)**: Dedicated multi-entity search results page supporting faceted filtering and relevancy ranking.
- [ ] **Notifications Center (`/app/notifications`)**: Chronological inbox of system alerts, team mentions, and activity triggers with "Mark all as read" capability.
- [ ] **Activity History & Audit Trail (`/app/activity`)**: Immutable log of user actions, workspace changes, and exportable CSV reports.

---

### 3.6 User Account & Workspace Settings Suite
Self-service administration for individuals and organizations.

- [ ] **Personal Profile (`/settings/profile`)**: Avatar upload, full name, professional title, bio, and contact information.
- [ ] **Account Settings (`/settings/account`)**: Primary email address management, timezone selection, locale preferences, and linked authentication methods.
- [ ] **Display & App Preferences (`/settings/preferences`)**: Dark mode / light mode toggle, density settings, accessibility preferences, and language selection.
- [ ] **Security & Credentials (`/settings/security`)**: Password change form, active sessions list with remote logout, and 2FA configuration.
- [ ] **Notification Preferences (`/settings/notifications`)**: Granular matrix controlling email, SMS, and in-app notifications for specific events.
- [ ] **Team & Organization Management (`/settings/team`)**: Member list, seat allocation, role assignments (Admin, Editor, Viewer), and pending email invites.
- [ ] **Connected Accounts & API Integrations (`/settings/integrations`)**: Third-party OAuth connections (Slack, GitHub, Google Drive), webhook configuration, and API keys.
- [ ] **Danger Zone / Account Deletion (`/settings/danger`)**: Irreversible account termination, workspace deletion, data export (GDPR Right to Portability), and confirmation barriers.

---

### 3.7 Admin & Governance Suite
Internal back-office tools for platform operators and customer success staff.
> **Security Mandate**: Admin pages must be protected by strict **server-side authorization and Edge route guards**, never merely hidden from the client-side navigation!

- [ ] **Admin Dashboard (`/admin`)**: Global system health, Daily Active Users (DAU), Monthly Recurring Revenue (MRR), server load, and error velocity.
- [ ] **User & Tenant Management (`/admin/users`)**: Search, inspect, impersonate (support login), suspend, or manually activate user accounts and organizations.
- [ ] **Roles & Permissions Manager (`/admin/roles`)**: Granular Role-Based Access Control (RBAC) permission configuration and policy mapping.
- [ ] **Content Moderation & CMS (`/admin/content`)**: Review flagged user-generated content, publish marketing blog posts, and update system notices.
- [ ] **System Analytics & Business Reports (`/admin/reports`)**: Exportable financial, conversion, and usage telemetry.
- [ ] **System Settings & Feature Flags (`/admin/settings`)**: Runtime toggles for feature rollouts, maintenance mode triggers, and API third-party rate limit overrides.
- [ ] **Security & Audit Logs (`/admin/audit-logs`)**: Complete, immutable administrative action history (who changed what, IP address, timestamp).
- [ ] **Moderation & Approvals Queue (`/admin/approvals`)**: Workflow queue for pending KYC submissions, merchant approvals, or user verification.

---

### 3.8 Reliability, System & UX Edge-Case States
What happens when things go wrong, offline, or between states? Designing only the "happy path" leaves users facing confusing browser defaults or frozen blank screens.

```
+-----------------------------------------------------------------------------------+
|                        SYSTEM STATES & RELIABILITY TAXONOMY                       |
|                                                                                   |
|  FULL ROUTE-LEVEL PAGES:                                                          |
|  - 404 (Not Found)       - 403 (Forbidden)          - 500 (Internal Server Error) |
|  - Maintenance Mode      - Offline Network Screen   - Session Expired Screen      |
|                                                                                   |
|  IN-COMPONENT / MICRO-STATES:                                                     |
|  - Skeleton Pulse Loading - Zero-Data Empty State    - No Search Results Found     |
|  - Inline Error & Retry   - Action Success Feedback  - Partial Outage Banner       |
+-----------------------------------------------------------------------------------+
```

#### Full Route-Level System Pages:
- [ ] **404 — Page Not Found (`/404`)**: Helpful, user-friendly page with clear explanation, search bar, and direct links to Home, Dashboard, or Help Center.
- [ ] **403 — Access Denied / Forbidden (`/403`)**: Explains that the authenticated account lacks sufficient permissions, with an option to switch accounts or request access from the workspace admin.
- [ ] **500 — Internal Server Error (`/500`)**: Friendly apology with an incident reference ID, automated bug report confirmation, and a link to the public status page.
- [ ] **Maintenance Mode Page (`/maintenance`)**: Clean landing screen displayed during planned downtime, with scheduled recovery time and status link.
- [ ] **Offline / Network Error Screen**: Displayed by Service Workers or client routers when internet connectivity drops, with cached data and auto-reconnect listeners.
- [ ] **Session Expired Page / Modal (`/session-expired`)**:
  > **Critical Warning — The Most Skipped UX State**: When an auth cookie or JWT expires while a user is working, apps without a session expired handler either dump them into a broken blank view or navigate away, **wiping out unsaved form entries**. A production session-expired handler locks the screen with a re-authentication modal, allowing the user to log back in without losing their input!

#### In-Component Micro-States:
- [ ] **Loading States**: Skeleton screens matching the exact layout of data cards/tables (avoiding full-screen blank spinners that make apps feel slow).
- [ ] **Empty States**: Clear illustration, helpful explanation, and an immediate action button (e.g., *"No projects yet. Click below to create your first project."*).
- [ ] **No Search / Filter Results State**: Explains that no items matched the selected filters, offering an instant *"Clear all filters"* action.
- [ ] **Error & Retry States**: Inline visual warnings with a concrete *"Try again"* button and human-readable error descriptions.
- [ ] **Success & Feedback States**: Non-blocking toast notifications and confirmation dialogs providing clear task resolution.

---

# 4. Domain-Specific Page Menus by Application Type

Use this matrix when designing specialized applications to ensure industry-specific expectations are met:

| Application Type | Essential Specialized Pages | Critical Edge Cases & Compliance |
|---|---|---|
| **E-Commerce & Retail** | • Product Catalog (`/products`)<br>• Product Detail (`/products/:slug`)<br>• Cart Drawer / Page (`/cart`)<br>• Multi-Step Checkout (`/checkout`)<br>• Order Confirmation (`/orders/:id`)<br>• Order History & Tracking (`/account/orders`)<br>• Wishlist & Saved Items (`/wishlist`) | • Return / Exchange Policy<br>• Shipping & Customs Policy<br>• Out of Stock state<br>• Payment Failed recovery flow<br>• Guest Checkout vs. Member Login |
| **B2B SaaS & Productivity** | • Workspace Dashboard (`/dashboard`)<br>• Kanban / List / Calendar Views<br>• Member / Seat Management (`/team`)<br>• Usage & Quota Limits (`/usage`)<br>• API Keys & Webhooks (`/developers`)<br>• Audit Logs (`/audit`) | • Data Processing Agreement (DPA)<br>• Plan limit reached paywall modal<br>• Seat invitation accept flow<br>• SSO / SAML login integration<br>• Session Expired modal |
| **Social & Community Platforms** | • Main Feed (`/feed`)<br>• Post Detail & Comments (`/post/:id`)<br>• User Profile (`/u/:username`)<br>• Direct Messages / Chat (`/messages`)<br>• Explore / Trending (`/explore`)<br>• Notification Center (`/notifications`) | • Community Guidelines<br>• Report Abuse modal<br>• Blocked user state<br>• Content moderation queue<br>• Private profile restricted state |
| **Learning Management (EdTech)** | • Course Catalog (`/courses`)<br>• Course Syllabus & Overview (`/courses/:id`)<br>• Video Player / Lesson Classroom (`/lesson/:id`)<br>• Quiz & Assignment Submission (`/quiz/:id`)<br>• Student Progress Dashboard (`/progress`)<br>• Verified Certificate View (`/certificates/:id`) | • Certificate verification URL<br>• Prerequisite incomplete blocker<br>• Course expiration date notices<br>• Instructor vs. Student views |
| **Booking & Marketplace** | • Service Search with Date/Geo Filters<br>• Provider / Property Profile (`/listing/:id`)<br>• Interactive Availability Calendar<br>• Booking Summary & Escrow Payment<br>• Reservation Management (`/trips`)<br>• Review & Rating Submission | • Cancellation policy tiers<br>• Double-booking prevention state<br>• Dispute resolution portal<br>• Host / Provider payout dashboard |
| **Generative AI & LLM Apps** | • Conversation Workspace (`/chat`)<br>• Prompt Template Library (`/templates`)<br>• Model Parameter Settings (`/settings/model`)<br>• Token Usage & Balance (`/usage`)<br>• Generation History & Export (`/history`)<br>• Custom Agent Builder (`/agents/new`) | • AI Output Disclaimers<br>• Rate-limit / Token quota exceeded state<br>• Streaming generation error recovery<br>• Content moderation flag notice |
| **Portfolio & Agency Sites** | • Curated Case Studies (`/work`)<br>• Deep-Dive Project Detail (`/work/:slug`)<br>• Capabilities & Tech Stack (`/services`)<br>• Interactive Pricing Calculator<br>• Client Testimonials & Awards<br>• Booking / Discovery Call Page | • Client NDA confidential placeholders<br>• Live demo embed sandboxes<br>• Direct Calendly / Cal.com integration |
| **Job Board & Recruitment** | • Job Search & Filtering (`/jobs`)<br>• Job Description & Apply (`/jobs/:id`)<br>• Candidate Application Tracking (`/my-applications`)<br>• Employer Post-a-Job Wizard (`/employer/post`)<br>• Employer Candidate ATS Pipeline (`/employer/candidates`) | • Equal Opportunity statements<br>• Expired job posting banner<br>• Resume upload parsing error state<br>• Candidate privacy controls |

---

# 5. Application Areas, Shared Layouts & Route Blueprint

Organize your application into three distinct structural areas. Each area shares common navigation patterns, authentication rules, and layout templates.

```
+-----------------------------------------------------------------------------------------+
|                                APPLICATION LAYOUT ARCHITECTURE                          |
|                                                                                         |
|  1. PUBLIC AREA (Marketing Layout)                                                      |
|  +-----------------------------------------------------------------------------------+  |
|  | [Header: Logo, Public Links (Features, Pricing), CTA Button]                      |  |
|  +-----------------------------------------------------------------------------------+  |
|  |                                                                                   |  |
|  |                              Marketing Page Content                               |  |
|  |                                                                                   |  |
|  +-----------------------------------------------------------------------------------+  |
|  | [Footer: Sitemap, Legal Links (Privacy, Terms, Cookies), Social, Copyright]       |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                                         |
|  2. AUTHENTICATED USER AREA (App Shell Layout)                                          |
|  +-----------------------------------------------------------------------------------+  |
|  | [Sidebar] | [Top Bar: Breadcrumbs, Search Bar, Notifications, User Profile Menu]   |  |
|  |  - Home   |-----------------------------------------------------------------------|  |
|  |  - Work   |                                                                       |  |
|  |  - Team   |                       Active Workspace View                           |  |
|  |  - Billing|                       (Tables, Canvases, Forms)                       |  |
|  |  - Settings                                                                       |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                                         |
|  3. ADMIN AREA (Admin Shell Layout)                                                     |
|  +-----------------------------------------------------------------------------------+  |
|  | [Admin Bar: "ADMIN MODE ACTIVE" Warning Banner + Environment Flag (Staging/Prod)] |  |
|  | [Admin Sidebar: Overview, Users, RBAC, Logs] | [Admin Content Canvas]             |  |
|  +-----------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
```

### Production Route Hierarchy Tree

```text
/                                         --> Root Public Marketing Landing Page
├── /about                                --> Company & Team Information
├── /features                             --> Capabilities & Product Deep Dive
├── /pricing                              --> Pricing Plans & Tier Comparison
├── /contact                              --> Inbound Sales & Contact Form
├── /faq                                  --> Frequently Asked Questions
├── /blog                                 --> Articles & News
│   └── /:slug                            --> Individual Blog Post
├── /changelog                            --> Product Updates & Release Notes
│
├── (legal)                               --> Legal & Compliance Routes
│   ├── /privacy                          --> Privacy Policy
│   ├── /terms                            --> Terms of Service
│   ├── /cookies                          --> Cookie Policy
│   ├── /cookie-settings                  --> Interactive Cookie Preferences
│   ├── /refund-policy                    --> Refund Policy
│   ├── /cancellation-policy              --> Cancellation Terms
│   ├── /acceptable-use                   --> Acceptable Use Policy
│   ├── /security                         --> Security Practices
│   ├── /security/report                  --> Responsible Vulnerability Disclosure
│   ├── /accessibility                    --> Accessibility Statement
│   └── /dpa                              --> Data Processing Agreement
│
├── (auth)                                --> Authentication Flow
│   ├── /login                            --> Sign In Screen
│   ├── /register                         --> Sign Up Screen
│   ├── /forgot-password                  --> Password Reset Request
│   ├── /reset-password                   --> Password Reset Confirmation
│   ├── /verify-email                     --> Email Verification Callback
│   ├── /verify-otp                       --> OTP / 2FA Challenge
│   └── /invite/accept                    --> Workspace Invitation Acceptance
│
├── /app                                  --> Authenticated User Area (App Shell Layout)
│   ├── /onboarding                       --> First-Time User Setup Wizard
│   ├── /dashboard                        --> Main KPI & Activity Overview
│   ├── /{resources}                      --> List View for Core Entity
│   │   ├── /new                          --> Create Entity View
│   │   ├── /:id                          --> Detail View for Entity
│   │   └── /:id/edit                     --> Edit Entity View
│   ├── /search                           --> Multi-Entity Search Results
│   ├── /notifications                    --> User Notification Center
│   └── /settings                         --> Settings Nested Layout
│       ├── /profile                      --> Personal Profile
│       ├── /account                      --> Account Credentials & Email
│       ├── /preferences                  --> Display & Language Preferences
│       ├── /security                     --> 2FA & Active Sessions
│       ├── /billing                      --> Invoices & Payment Methods
│       │   ├── /upgrade                  --> Upgrade Tier Flow
│       │   ├── /downgrade                --> Downgrade Tier Flow
│       │   └── /cancel                   --> Retention Cancellation Flow
│       ├── /team                         --> Member Management & Seats
│       ├── /integrations                 --> Third-Party Connected Apps
│       └── /danger                       --> Data Export & Account Deletion
│
├── (checkout)                            --> Lifecycle Payment Views
│   ├── /checkout/success                 --> Payment Confirmation
│   ├── /checkout/failed                  --> Payment Declined & Card Updater
│   └── /checkout/pending                 --> Asynchronous Payment Processing
│
├── /admin                                --> Admin Area (Strict Server RBAC)
│   ├── /dashboard                        --> Platform Metrics & Operations
│   ├── /users                            --> User Accounts & Impersonation
│   │   └── /:id                          --> User Inspection & Logs
│   ├── /roles                            --> RBAC Permission Policies
│   ├── /content                          --> CMS & Content Moderation
│   ├── /reports                          --> Financial & Usage Analytics
│   ├── /settings                         --> Feature Flags & Runtime Config
│   └── /audit-logs                       --> Administrative Audit Trail
│
└── (system)                              --> System Error & Resilience Routes
    ├── /403                              --> Access Denied / Unauthorized
    ├── /404                              --> Page Not Found
    ├── /500                              --> Internal Server Error
    ├── /maintenance                      --> Scheduled Downtime Page
    └── /session-expired                  --> Session Expiry Interceptor
```

---

# 6. The 11-Step End-to-End Application Planning Workflow

Follow this battle-tested, 11-step sequence whenever scoping a new web application from scratch:

```
+-----------------------------------------------------------------------------------+
|                        THE 11-STEP APP PLANNING WORKFLOW                          |
|                                                                                   |
|  1. Define Product Purpose & ICP       ──>  2. Establish User Roles & RBAC Matrix |
|  3. Map Core User Journeys             ──>  4. Map Journeys to Routes & Pages     |
|  5. Define Shared Layout Hierarchy     ──>  6. Catalog Reusable UI Components     |
|  7. Plan States (Load/Empty/Error)     ──>  8. Define Route & Server Auth Guards  |
|  9. Plan Responsive Breakpoints        ──> 10. Build Vertical MVP Slices First    |
|  11. Chaos & Edge-Case Testing                                                    |
+-----------------------------------------------------------------------------------+
```

### Step 1: Define Product Purpose & Target Audience
- Formulate the sharp, 1-to-2 sentence value proposition.
- Identify the Ideal Customer Profile (ICP) and their primary pain points.

### Step 2: Establish User Roles & RBAC Permissions Matrix
- Document every distinct persona: `Public Visitor`, `Authenticated Free User`, `Paid Pro User`, `Team Manager`, `Support Staff`, `Super Admin`.
- Construct an access matrix defining what each role can `Create`, `Read`, `Update`, and `Delete` (CRUD).

### Step 3: Map Core User Journeys
- Detail step-by-step user pathways:
  - *Acquisition Flow*: Land on `/` → Review `/pricing` → Sign up via `/register` → Complete `/onboarding`.
  - *Core Value Flow*: Open `/dashboard` → Click *"New Item"* → Fill validation form → View created item at `/items/:id`.
  - *Monetization Flow*: Hit plan limit → Trigger upgrade modal → Complete checkout → Redirect to `/checkout/success`.

### Step 4: Map Journeys to Routes & Pages
- Create a route inventory using the Master Taxonomy. Eliminate redundant pages by utilizing modals or query parameters where a separate URL is unnecessary.

### Step 5: Define Shared Layout Hierarchy
- Group routes into their layout containers:
  - Public Marketing Layout (`Header` + `Footer`).
  - Auth Layout (Centered Minimal Card).
  - Application Shell (`Sidebar` + `Top Navigation` + `Content Area`).
  - Admin Shell (`Admin Warning Banner` + `Dense Data Table View`).

### Step 6: Catalog Reusable UI Components
- Identify repeating patterns: `<Button>`, `<Input>`, `<Select>`, `<Modal>`, `<DataTable>`, `<Card>`, `<Avatar>`, `<Badge>`, `<Toast>`, `<Tabs>`.

### Step 7: Plan Component & System States
- For every core screen, explicitly document:
  - **Loading**: Skeleton pulse matching final content geometry.
  - **Empty**: Contextual illustration + clear CTA button.
  - **Error**: Inline error banner with retry mechanism.
  - **Success**: Instant visual feedback (Toast or updated state).

### Step 8: Define Route & Data Authorization Guards
- Enforce security at the routing and server layers:
  - Next.js Edge Middleware / Django Route Guards redirect unauthenticated visitors to `/login?redirect={currentPath}`.
  - Prevent privilege escalation by validating role claims server-side for all `/admin` routes.

### Step 9: Plan Responsive Breakpoints & Device Adaptations
- **Mobile (< 640px)**: Sidebar folds into bottom navigation bar or hamburger drawer; multi-column tables convert to vertical card stacks.
- **Tablet (640px – 1024px)**: Collapsible icon-only sidebar; 2-column bento grids.
- **Desktop (> 1024px)**: Full multi-column data views; persistent sidebars; modal drawers.

### Step 10: Build Vertical MVP Slices First
- Build one complete end-to-end user slice (Database Model → Server Route → UI Page → State Handling) before horizontally scaffolding ten unfinished screens.

### Step 11: Chaos & Edge-Case Testing
- Test non-happy paths:
  - Direct URL access to nested paths while logged out.
  - Hard page refresh on step 3 of a multi-step form.
  - Form submission with slow or disconnected 3G network.
  - Expired session token during form entry.
  - Declined credit card during checkout.

---

# 7. General Architecture, Security & Reliability Principles

1. **Treat the Guide as a Menu, Not a Mandate**: Do not generate 40 pages for an MVP that only requires 3. Build only the pages justified by immediate requirements, but ensure the pages you *do* ship are production-grade.
2. **Prioritize Core Value Over Admin Bloat**: Build the primary user workspace before spending days crafting internal admin tools that can initially be handled via database GUIs or direct scripts.
3. **Decouple Route Containers from UI Components**: Pages should only orchestrate data fetching and top-level layout. All styling and visual elements should remain in composable, testable components.
4. **Enforce Dual Validation (Client + Server)**: Client-side validation (HTML5 / Zod) provides instant user feedback; server-side validation guarantees data integrity against API tampering.
5. **Enforce True Server-Side Authorization**: Never rely solely on hiding a sidebar link to protect admin routes. Enforce database Row-Level Security (RLS) and server middleware guards.
6. **Eliminate Full-Page Spinners**: Full-page spinning circles make apps feel broken or sluggish. Always prefer instant UI shells with localized skeleton pulses.
7. **Protect Form Data on Session Expiry**: When auth credentials expire, avoid hard redirects that discard user input. Cache input in `sessionStorage` or present an inline re-authentication modal.
8. **Ensure Full Keyboard & Accessibility Support (WCAG 2.1)**: Every interactive element must have a visible `:focus-visible` state, semantic HTML tags, and accessible ARIA attributes.

---

# 8. The Production-Grade Audit Checklist

Use this interactive checklist to audit any existing web application or verify a new build before releasing to production:

### Phase 1: Public, Marketing & SEO
- [ ] Responsive Home / Landing page with clear value proposition and primary CTA
- [ ] Features / Product overview page
- [ ] Transparent Pricing page with tier breakdown and FAQ
- [ ] Functional Contact page with input validation
- [ ] Complete meta tags (title, description, OpenGraph image, canonical URL)
- [ ] Valid `robots.txt` and `sitemap.xml` generated

### Phase 2: Legal & Enterprise Compliance (The 15 Essentials)
- [ ] Privacy Policy (`/privacy`)
- [ ] Terms of Service (`/terms`)
- [ ] Cookie Policy (`/cookies`)
- [ ] Functional Cookie Preferences Manager (GDPR/CCPA compliant opt-in/opt-out)
- [ ] Refund Policy (`/refund-policy`)
- [ ] Cancellation Policy (`/cancellation-policy`)
- [ ] Shipping Policy (if physical goods are sold)
- [ ] Return / Exchange Policy (if e-commerce)
- [ ] Disclaimer (medical, legal, financial, or performance)
- [ ] Accessibility Statement (`/accessibility`)
- [ ] Data Processing Agreement / DPA (for B2B customer data)
- [ ] Acceptable Use Policy (`/acceptable-use`)
- [ ] Security Practices Overview (`/security`)
- [ ] Responsible Disclosure Policy / `security.txt`
- [ ] Community Guidelines (if user-generated content or social)

### Phase 3: Authentication & Identity Management
- [ ] Sign Up / Registration with validation and password criteria
- [ ] Sign In / Login with clear error messaging
- [ ] Forgot Password submission view
- [ ] Reset Password token handler
- [ ] Email Verification landing screen with resend fallback
- [ ] 2FA / OTP verification challenge
- [ ] Team member invitation acceptance flow

### Phase 4: Customer Lifecycle & Revenue Protection
- [ ] Guided First-Time User Onboarding wizard
- [ ] Billing overview with invoice download and payment method updater
- [ ] Clear Plan Upgrade flow
- [ ] Plan Downgrade flow with feature-impact warnings
- [ ] Retention-focused Subscription Cancellation flow (pause/discount offers)
- [ ] Payment Success confirmation screen
- [ ] Payment Failed recovery screen with one-click card update
- [ ] Payment Pending / Processing asynchronous screen
- [ ] Customer Support ticket submission view
- [ ] Searchable Help Center / Documentation

### Phase 5: Core Application & Workspace
- [ ] Application Shell layout with responsive navigation
- [ ] Main KPI Dashboard / Overview
- [ ] List / Browse views with sorting, search, and pagination
- [ ] Detail view for core entities
- [ ] Create view with client and server input validation
- [ ] Edit view with unsaved changes detection
- [ ] Search results view with active filter tags
- [ ] In-app Notification center
- [ ] Activity log / Audit trail

### Phase 6: User Account & Workspace Governance
- [ ] User Profile editor with avatar upload
- [ ] Account credentials & email management
- [ ] Display & language preferences
- [ ] Security settings with active sessions list and remote logout
- [ ] Team / Organization seat management and invite modal
- [ ] Connected third-party integrations and API keys
- [ ] Danger Zone: Account deletion and data export (GDPR portability)

### Phase 7: Administrative Suite
- [ ] Admin Dashboard with business telemetry
- [ ] User management with search, suspend, and support impersonation
- [ ] Roles & permissions (RBAC) policy editor
- [ ] Content moderation / CMS queue
- [ ] Server-side route guards enforcing administrative authorization

### Phase 8: System Resilience & UX States
- [ ] Custom 404 Not Found page with rescue navigation
- [ ] Custom 403 Access Denied page
- [ ] Custom 500 Server Error page with incident reference ID
- [ ] Maintenance Mode landing page
- [ ] Offline network detection screen / toast
- [ ] Session Expired modal / handler that preserves unsaved form state
- [ ] Skeleton loaders for all asynchronous content
- [ ] Contextual empty states with action triggers for every list/table
- [ ] "No Search Results" state with "Clear Filters" shortcut
- [ ] Non-blocking success toasts and inline validation error alerts
