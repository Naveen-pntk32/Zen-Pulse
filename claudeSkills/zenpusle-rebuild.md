# ZENPULSE --- AGENT REBUILD INSTRUCTIONS

> **Purpose:** This file is the master instruction set for rebuilding
> the existing **ZenPulse** application with an AI coding agent such as
> Claude Code, Google Antigravity, or another capable development agent.
>
> **Important:** ZenPulse is an **existing project**. It is already
> built, but major parts are currently unreliable: login/authentication
> does not work correctly, many buttons/actions do not work, and the UI
> needs substantial improvement. The goal is therefore a **controlled
> rebuild of the existing application**, not a blind greenfield rewrite.

------------------------------------------------------------------------

# 0. OPERATING PRINCIPLE

You are working on an existing application called **ZenPulse**.

The application combines:

1.  Task Management
2.  Habit Tracking
3.  Pomodoro / Stopwatch Focus Tracking

These systems must work together.

The final application should feel like **one cohesive personal
productivity system**, not three unrelated features.

## Critical instruction

**DO NOT immediately start rewriting the project.**

First inspect and understand the existing project.

You must determine:

-   Current framework and build system
-   Folder structure
-   Entry points
-   Routes
-   Components
-   State management
-   Authentication implementation
-   Database/API layer
-   Data models
-   Services
-   Existing reusable UI components
-   Existing task functionality
-   Existing habit functionality
-   Existing Pomodoro/Stopwatch functionality
-   Existing search functionality
-   Existing settings/profile functionality
-   Existing dependencies
-   Existing environment configuration
-   Current errors
-   Broken buttons/actions
-   Unused code
-   Music-related code
-   `ui` folder dependencies
-   Existing styling system
-   Existing responsive behavior

**Do not assume something is unused merely because it looks old.**

------------------------------------------------------------------------

# 1. DIRECTIVE --- HOW YOU MUST BEHAVE

These rules apply throughout the entire rebuild.

## 1.1 Existing project first

This is a repair + rebuild of an existing application.

Prefer:

> Inspect → Understand → Reuse → Repair → Improve → Test

Do not default to:

> Delete → Rewrite everything

Reuse working functionality whenever practical.

------------------------------------------------------------------------

## 1.2 Do not make unnecessary architectural changes

Do NOT:

-   Replace the framework without a strong reason
-   Replace libraries without a strong reason
-   Rewrite the database unnecessarily
-   Change API architecture unnecessarily
-   Remove working features
-   Rename large numbers of files without need
-   Perform unrelated refactors
-   Introduce unnecessary abstractions
-   Add unnecessary dependencies
-   Add unnecessary animations
-   Redesign workflows based on personal preference

Every major change must have a reason connected to the ZenPulse
requirements.

------------------------------------------------------------------------

## 1.3 JavaScript requirement

The final project must use:

-   JavaScript
-   JSX

Do NOT introduce:

-   TypeScript
-   TSX

If the existing project contains TypeScript, convert only what is
necessary to JavaScript/JSX.

Do not use conversion as an excuse to redesign unrelated code.

------------------------------------------------------------------------

## 1.4 Do not fake functionality

A button is not considered implemented merely because clicking it
changes the UI.

Every important action must actually perform its intended operation.

Examples:

-   Login must actually authenticate.
-   Logout must actually clear the session.
-   Create task must actually create a task.
-   Edit task must actually persist changes.
-   Delete task must actually delete/archive as intended.
-   Complete task must persist completion.
-   Create habit must persist the habit.
-   Habit check-in must persist the check-in.
-   Start Pomodoro must actually start the timer.
-   Start Stopwatch must actually start timing.
-   Focus sessions must actually be recorded.
-   Search must actually search the relevant data.
-   Settings changes must actually persist where appropriate.

Do not use fake success messages to hide broken functionality.

------------------------------------------------------------------------

# 2. ORCHESTRATION --- REQUIRED WORKFLOW

You must work in controlled phases.

**Do not execute the entire rebuild in one uncontrolled operation.**

Use this sequence:

``` text
PHASE 0
Existing Project Audit
        ↓
PHASE 1
Architecture + Authentication Repair
        ↓
PHASE 2
Core Task System
        ↓
PHASE 3
Habit Tracker
        ↓
PHASE 4
Pomodoro + Stopwatch + Focus Sessions
        ↓
PHASE 5
Task / Habit / Focus Integration
        ↓
PHASE 6
Statistics + Productivity Analytics
        ↓
PHASE 7
UI / UX Rebuild
        ↓
PHASE 8
Music Feature Removal + ui Folder Cleanup
        ↓
PHASE 9
Full Testing + Self-Annealing
        ↓
PHASE 10
Final Verification
```

However, **do not automatically execute all phases**.

The user may provide instructions one phase at a time.

When the user says to perform a particular phase, work on that phase and
its dependencies only.

------------------------------------------------------------------------

# 3. PHASE 0 --- EXISTING PROJECT AUDIT

## Objective

Understand the existing ZenPulse project before modifying it.

### Required actions

Inspect the project structure.

Identify:

``` text
Frontend
Backend
Database
Authentication
API
Routes
Components
Hooks
Services
Utilities
Styles
Assets
Configuration
Environment variables
Tests
```

Also inspect:

-   `package.json`
-   build configuration
-   routing configuration
-   authentication configuration
-   database configuration
-   API configuration
-   environment variable usage
-   existing error logs
-   existing UI component libraries

## Produce an audit report

Before major implementation, report:

### A. What currently works

### B. What is broken

### C. What is partially implemented

### D. What can be reused

### E. What should be repaired

### F. What should be replaced

### G. What should be removed

### H. What dependencies are risky/outdated/unnecessary

### I. Current authentication flow

### J. Current data relationships

### K. Current UI architecture

### L. Current `ui` folder dependencies

Do not modify major architecture during the audit unless required to
run/read the project.

------------------------------------------------------------------------

# 4. PHASE 1 --- AUTHENTICATION FIRST

Authentication is currently one of the major broken areas.

Before building the rest of the application, establish a reliable
authentication foundation.

## Requirements

Inspect the existing authentication implementation first.

Determine:

-   Login method
-   Signup method
-   Session mechanism
-   Authentication provider
-   Token/session storage
-   Protected routes
-   User retrieval
-   Logout mechanism
-   Error handling
-   Loading states
-   Redirect behavior

Repair the existing authentication system where practical.

Only replace it if the existing implementation is fundamentally
unsuitable.

## Verify

Test at minimum:

``` text
Signup
↓
Login
↓
Authenticated application
↓
Refresh page
↓
Session remains valid
↓
Navigate between protected pages
↓
Logout
↓
Protected page becomes inaccessible
```

Do not continue to dependent functionality until authentication is
stable enough to support it.

------------------------------------------------------------------------

# 5. GLOBAL NAVIGATION

The main navigation is global and must remain consistent.

Global navigation:

``` text
Profile
Tasks
Pomodoro
Habit Tracker
Search
Settings
```

Do not put task-specific navigation into the global navigation.

The global navigation should remain available throughout the application
where appropriate.

------------------------------------------------------------------------

# 6. TASK MANAGEMENT

Tasks are normal user tasks.

Tasks may belong to custom user-created lists/categories such as:

``` text
Gaming
Work
Personal
Learning
Other custom lists
```

## Task secondary navigation

Inside Tasks, secondary navigation should contain only task-related
custom lists.

Example:

``` text
TASK LISTS

Gaming
Work
Personal
Learning
Custom Lists...
Completed
```

Do NOT add these as task secondary navigation items:

``` text
Today
Next 7 Days
Inbox
Trash
```

unless the user explicitly changes this requirement later.

------------------------------------------------------------------------

## Completed tasks

Completed is a special task section.

It must display completed tasks.

Completed tasks must remain associated with their original task list.

Example:

``` text
Original:
Learning → Complete DSA assignment

After completion:

Completed
└── Learning → Complete DSA assignment
```

The original association must never be lost.

Completed tasks should support filtering by:

-   Date
-   Original task list
-   Completion status/filter

------------------------------------------------------------------------

# 7. HABIT TRACKER

Habit Tracker is a separate global section.

The main Habit Tracker experience should focus on:

1.  Add Habit
2.  Daily Check-in

Do NOT recreate the old Habit Lists sidebar structure unless the user
explicitly requests it.

## Add Habit

Support:

-   Habit name
-   Habit icon
-   Frequency
-   Goal
-   Start date
-   Goal duration / goal days
-   Section/category
-   Reminder
-   Auto pop-up of habit log

Example:

``` text
Habit:
Vanakam DSA

Frequency:
Daily

Goal:
3 hours

Start Date:
Aug 19

Goal Days:
Forever
```

------------------------------------------------------------------------

## Daily Check-in

The user must be able to select a day and see the habits scheduled for
that day.

Each habit must show its completion state.

Support:

-   Daily completion
-   Streaks
-   Progress
-   Historical check-ins

------------------------------------------------------------------------

# 8. HABIT + FOCUS TIME --- CORE BUSINESS RULE

This is one of the most important requirements in ZenPulse.

A habit may have a time-based goal.

Example:

``` text
Habit:
Vanakam DSA

Daily goal:
3 hours
```

The user does not necessarily need to manually check the habit.

If actual focus time associated with the habit reaches the goal:

``` text
Actual focus time >= habit goal
```

then:

``` text
Automatically complete habit
Update streak
Update progress
Record check-in
Keep actual focus duration
```

------------------------------------------------------------------------

## Example

``` text
Habit goal = 3h

Pomodoro = 1h 30m
Stopwatch = 1h 45m

Total = 3h 15m
```

Result:

``` text
Habit = Completed
Actual focus = 3h 15m
```

**Never reduce the recorded time to 3h.**

The extra 15 minutes remains part of productivity statistics.

------------------------------------------------------------------------

# 9. HABIT CONTEXT MENU

Right-clicking a habit should open a context menu.

Expected options:

``` text
Start Focus
    ├── Start Pomodoro
    └── Start Stopwatch

Edit
Archive
Delete
```

When the user chooses Start Focus:

``` text
Selected Habit
       ↓
Focus Context
       ↓
Pomodoro / Stopwatch
```

The selected habit must remain associated with the focus session.

------------------------------------------------------------------------

# 10. POMODORO / STOPWATCH

Pomodoro is a dedicated global section.

It is NOT merely a Habit Tracker popup.

The dedicated Pomodoro page should support:

``` text
Pomodoro
Stopwatch
Timer
Start
Pause / Stop
Skip
Reset
Timer Settings
Focus Selection
```

The user must be able to choose what they are focusing on.

Example:

``` text
What are you focusing on?

→ Vanakam DSA
```

Then:

``` text
Start Pomodoro
```

or:

``` text
Start Stopwatch
```

------------------------------------------------------------------------

# 11. FOCUS SESSION DATA

Every actual focus session must be recorded.

A focus session must retain at least:

``` text
User
Target type
Target ID
Start time
End time
Actual duration
Focus mode
```

Where target type may be:

``` text
Task
Habit
```

Focus mode may be:

``` text
Pomodoro
Stopwatch
```

Example:

``` text
Vanakam DSA
Pomodoro
25 minutes
```

adds 25 minutes to the focus time associated with Vanakam DSA.

A later:

``` text
Vanakam DSA
Stopwatch
2 hours
```

must be added to the same historical focus data.

------------------------------------------------------------------------

# 12. FOCUS STATISTICS

The Pomodoro page should contain a statistics area.

Support:

``` text
Day
Week
Month
```

Show useful information such as:

-   Total focus hours
-   Focus goal
-   Goal achievement percentage
-   Focus breakdown by task/habit
-   Focus history
-   Best focus period/day
-   Auto check-in events

Example:

``` text
Today's Focus:
5.35 hrs

Focus Goal:
3.00 hrs

Achievement:
178%
```

Because:

``` text
5.35 / 3.00 × 100 ≈ 178%
```

------------------------------------------------------------------------

## Focus breakdown

Example:

``` text
Vanakam DSA       3.60 hrs
Dev Projects      1.20 hrs
Gaming            0.35 hrs
TELUS             0.20 hrs
```

Historical statistics should support:

``` text
Days
Weeks
Months
```

Do not calculate statistics from incomplete or fake UI state.

Statistics must be derived from persisted focus-session data.

------------------------------------------------------------------------

# 13. CORE DATA RELATIONSHIPS

Maintain clear relationships.

``` text
User
 ↓
Task Lists
 ↓
Tasks
```

and:

``` text
User
 ↓
Habits
```

and:

``` text
Task / Habit
 ↓
Focus Sessions
 ↓
Focus Statistics
```

Focus sessions must preserve their original target.

Completed tasks must preserve their original task-list association.

------------------------------------------------------------------------

# 14. UI / UX REBUILD

The existing UI is currently poor and requires a substantial visual
improvement.

However:

**Do not redesign randomly.**

The user will provide design reference images separately.

Those images are the visual source of truth.

The user may also provide a mindmap.

The mindmap is the source of truth for:

-   functionality
-   workflow
-   relationships
-   user flow

The design images are the source of truth for:

-   visual hierarchy
-   layout
-   spacing
-   controls
-   styling
-   component structure
-   visual appearance

------------------------------------------------------------------------

# 15. DESIGN SKILLS

The project may contain Anthropic skills such as:

``` text
skills/
├── skill-creator/
├── frontend-design/
└── brand-guidelines/
```

Use the appropriate skill when performing the relevant work.

## `frontend-design`

Use this skill when rebuilding the UI.

It should guide:

-   Layout
-   Spacing
-   Typography
-   Responsive design
-   Component composition
-   Visual hierarchy
-   Interaction design
-   Micro-interactions
-   Motion where appropriate

Do not add animations merely because the skill supports them.

Use motion only when it improves the experience.

------------------------------------------------------------------------

## `brand-guidelines`

Use this skill to keep the visual system consistent.

Establish a reusable design system for:

-   Colors
-   Typography
-   Borders
-   Radius
-   Shadows
-   Buttons
-   Inputs
-   Cards
-   Dialogs
-   Navigation
-   States
-   Focus indicators

The final UI should feel like one product.

------------------------------------------------------------------------

## `skill-creator`

Use this only when a custom skill is actually required.

Do not create custom skills unnecessarily.

------------------------------------------------------------------------

# 16. UI DESIGN DIRECTION

The intended ZenPulse visual language is:

``` text
Modern
Dark productivity application
Purple / blue accent direction
Clean cards
Rounded controls
Minimal interface
Clear hierarchy
Subtle borders
Focused typography
Responsive layout
```

But these are baseline directions.

If the user provides specific design references, **the references take
priority** over this general description.

Do not copy another product blindly.

ZenPulse should have its own coherent identity.

------------------------------------------------------------------------

# 17. RESPONSIVENESS

The UI must work correctly at different viewport sizes.

Test at minimum:

``` text
Desktop
Laptop
Tablet
Mobile
```

Do not rely on browser zoom as a substitute for responsive design.

Avoid layouts that only look correct at one screen size.

------------------------------------------------------------------------

# 18. REMOVE MUSIC FEATURE

The existing music feature must be removed completely.

Remove only music-related:

-   Components
-   Routes
-   State
-   Services
-   Assets
-   Controls
-   Music-specific API calls
-   Unused music code

Do NOT remove unrelated functionality.

After removal, search the project again for references to the music
system.

------------------------------------------------------------------------

# 19. `ui` FOLDER ANALYSIS

There is an existing `ui` folder containing many files.

**Do not delete it simply because it looks old or unchanged.**

Perform a dependency/usage analysis.

Check:

-   Direct imports
-   Indirect imports
-   Dynamic imports
-   Routes
-   Components
-   Forms
-   Dialogs
-   Utilities
-   Styling dependencies
-   Configuration dependencies

If genuinely unused:

``` text
Remove it.
```

If partially used:

``` text
Keep required files.
Remove only confirmed-unused files.
```

After cleanup, run the application and verify there are no broken
imports.

------------------------------------------------------------------------

# 20. SELF-ANNEALING / DEBUGGING

You are responsible for fixing errors you introduce or discover.

Whenever something fails:

1.  Read the actual terminal error.
2.  Read the browser console error.
3.  Identify the root cause.
4.  Fix the smallest appropriate area.
5.  Re-run the relevant command.
6.  Verify the fix.
7.  Continue until the error is resolved.

Do not repeatedly apply random changes.

------------------------------------------------------------------------

## Error loop

``` text
Run
 ↓
Observe error
 ↓
Understand root cause
 ↓
Fix
 ↓
Run again
 ↓
Verify
 ↓
Repeat if necessary
```

Never declare success because the code "looks correct."

------------------------------------------------------------------------

# 21. TESTING RULES

Every major feature must be tested through its actual user flow.

For example:

## Login

``` text
Enter credentials
↓
Submit
↓
Authentication
↓
Redirect
↓
Authenticated state
```

## Task

``` text
Create
↓
Persist
↓
Refresh
↓
Still exists
↓
Complete
↓
Completed section
↓
Original list preserved
```

## Habit

``` text
Create habit
↓
Daily check-in
↓
Record focus
↓
Reach goal
↓
Auto-complete
↓
Streak updated
```

## Focus

``` text
Select target
↓
Start
↓
Run
↓
Stop
↓
Persist session
↓
Statistics update
```

------------------------------------------------------------------------

# 22. DATA INTEGRITY RULE

Never solve a frontend problem by destroying or bypassing data
integrity.

Important historical relationships must survive:

``` text
Completed Task → Original Task List
Focus Session → Original Task/Habit
Habit Check-in → Habit + Date
Focus Session → Start/End/Duration
```

If the database schema needs modification, first inspect the existing
schema and explain the required change.

Avoid destructive migrations unless explicitly approved.

------------------------------------------------------------------------

# 23. EXISTING DATA SAFETY

Before destructive database operations:

**STOP and ask for confirmation.**

Do not:

-   Drop tables
-   Delete production-like data
-   Reset the database
-   Replace authentication data
-   Delete migrations
-   Perform destructive schema changes

without explicit approval.

If a migration is needed, prefer a safe additive migration.

------------------------------------------------------------------------

# 24. ENVIRONMENT AND SECRETS

Never expose secrets in source code.

Do not commit:

``` text
API keys
Passwords
Tokens
Private credentials
`.env` secrets
```

Use environment variables according to the project's existing
configuration.

If a required secret is missing, explain what variable is needed rather
than inventing one.

------------------------------------------------------------------------

# 25. IMPLEMENTATION STYLE

Prefer small, understandable changes.

When possible:

``` text
One feature
↓
Implement
↓
Run
↓
Test
↓
Fix
↓
Continue
```

Do not make hundreds of unrelated changes and then attempt to debug
everything at once.

------------------------------------------------------------------------

# 26. BEFORE EACH MAJOR PHASE

Before modifying a major system, answer internally:

``` text
What currently exists?
What is broken?
What can be reused?
What must change?
What dependencies will this affect?
How will I test it?
```

For major architectural decisions, explain the decision briefly to the
user before proceeding if it could materially affect existing
functionality.

------------------------------------------------------------------------

# 27. DEFINITION OF DONE

ZenPulse is not complete when:

``` text
The page renders.
```

ZenPulse is complete when:

``` text
Authentication works
        +
Navigation works
        +
Buttons/actions work
        +
Tasks persist correctly
        +
Completed tasks preserve list association
        +
Habits persist correctly
        +
Daily check-ins work
        +
Streaks/progress work
        +
Pomodoro works
        +
Stopwatch works
        +
Focus sessions persist
        +
Focus sessions retain target association
        +
Time-based habits auto-complete
        +
Extra focus time is preserved
        +
Statistics use real persisted data
        +
Search works
        +
Settings work
        +
Music feature is removed
        +
Unused UI code is cleaned safely
        +
Responsive UI works
        +
No critical console/terminal errors
```

------------------------------------------------------------------------

# 28. REQUIRED RESPONSE FORMAT DURING DEVELOPMENT

After completing a requested phase, report:

## Completed

-   What was changed

## Reused

-   Existing components/functions/services reused

## Removed

-   What was safely removed

## Fixed

-   Bugs/errors fixed

## Tested

-   What was actually tested

## Remaining

-   Known issues or incomplete work

## Next recommended step

-   The next logical phase

Keep this report concise.

------------------------------------------------------------------------

# 29. IMPORTANT --- DO NOT ASSUME USER APPROVAL

If the user asks you to:

> "Inspect the project"

then inspect it.

Do not automatically rebuild it.

If the user asks:

> "Fix authentication"

then focus on authentication and required dependencies.

If the user asks:

> "Rebuild the UI"

then use the provided design references and frontend-design skill.

If the user asks:

> "Continue"

continue from the last confirmed phase.

Do not interpret "continue" as permission to perform unrelated
destructive changes.

------------------------------------------------------------------------

# 30. FIRST ACTION WHEN THIS FILE IS LOADED

When the agent first loads `agents.md`, **do not immediately rewrite
ZenPulse**.

Your first job is to:

1.  Read this entire file.
2.  Inspect the existing ZenPulse project.
3.  Build an understanding of the current implementation.
4.  Identify the current architecture.
5.  Identify broken functionality.
6.  Identify reusable functionality.
7.  Identify the current authentication system.
8.  Identify the current database/API relationships.
9.  Analyze the `ui` folder.
10. Locate the music feature.
11. Check whether JavaScript/JSX conversion is required.
12. Produce an **Existing Project Audit**.

### Initial audit output should contain:

``` text
ZENPULSE EXISTING PROJECT AUDIT

1. Tech stack
2. Project structure
3. Authentication status
4. Routing status
5. Task system status
6. Habit system status
7. Pomodoro/Stopwatch status
8. Search status
9. Settings/Profile status
10. Database/API status
11. Broken buttons/actions
12. Music feature locations
13. ui folder dependency analysis
14. Reusable components
15. Critical errors
16. Recommended rebuild order
17. Risks
```

**Do not perform the full rebuild during this first audit.**

Wait for the user's next instruction.

------------------------------------------------------------------------

# 31. USER-PROVIDED REFERENCES

The user may provide:

-   UI screenshots
-   Design references
-   Mindmaps
-   Existing documentation
-   Database diagrams
-   Workflow diagrams
-   Other project files

When provided:

### Mindmap

Use it primarily for:

``` text
Workflow
Relationships
Business logic
User flow
Feature relationships
```

### UI/design screenshots

Use them primarily for:

``` text
Layout
Visual hierarchy
Spacing
Component structure
Styling
Interaction patterns
```

### Existing code

Use it to determine:

``` text
What already works
What can be reused
What needs repair
What must be replaced
```

Do not silently replace user-provided requirements with your own
interpretation.

------------------------------------------------------------------------

# 32. FINAL PRODUCT VISION

The final ZenPulse system should behave as one connected productivity
platform:

``` text
                    ZENPULSE
                       │
        ┌──────────────┼──────────────┐
        │              │              │
      TASKS          HABITS          FOCUS
        │              │              │
   Task Lists      Daily Goals    Pomodoro
   Tasks           Check-ins      Stopwatch
        │              │              │
        └──────────────┼──────────────┘
                       │
                 Focus Sessions
                       │
                       ▼
              Actual Focus Time
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        Productivity      Habit Auto
         Statistics        Check-in
                                │
                                ▼
                         Streak / Progress
```

The central idea is:

> **ZenPulse should record what the user actually does, connect that
> activity to tasks and habits, and turn actual focus time into
> meaningful productivity data.**

The rebuild should improve the reliability, functionality, architecture,
and UI of the existing ZenPulse project while preserving useful existing
work.

------------------------------------------------------------------------

# 33. START HERE

When this file is first loaded:

**DO NOT START CODING THE REBUILD YET.**

Start with:

``` text
READ agents.md
      ↓
INSPECT EXISTING ZENPULSE
      ↓
AUDIT ARCHITECTURE
      ↓
AUDIT BROKEN FUNCTIONALITY
      ↓
AUDIT AUTHENTICATION
      ↓
AUDIT DATABASE/API
      ↓
AUDIT ui FOLDER
      ↓
LOCATE MUSIC FEATURE
      ↓
PRODUCE AUDIT REPORT
      ↓
WAIT FOR USER INSTRUCTION
```

Only after the user provides the next instruction should implementation
begin.
