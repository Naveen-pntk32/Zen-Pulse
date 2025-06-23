# Database Setup Guide

## Option 1: Continue with localStorage (Recommended for personal use)
Your app currently works perfectly with browser localStorage. No database needed!

## Option 2: Add PostgreSQL Database (For multi-device sync)

### Prerequisites
- PostgreSQL installed locally
- Node.js and npm

### VS Code Setup

1. **Install PostgreSQL:**
   ```bash
   # Windows (using chocolatey)
   choco install postgresql

   # macOS (using homebrew)
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE productivity_app;
   CREATE USER app_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE productivity_app TO app_user;
   \q
   ```

3. **Environment Variables:**
   Create `.env` file in your project root:
   ```env
   DATABASE_URL=postgresql://app_user:your_password@localhost:5432/productivity_app
   PGHOST=localhost
   PGPORT=5432
   PGUSER=app_user
   PGPASSWORD=your_password
   PGDATABASE=productivity_app
   ```

4. **Run Migrations:**
   ```bash
   # Generate migration files
   npx drizzle-kit generate

   # Apply migrations
   npx drizzle-kit migrate
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

### VS Code Extensions (Recommended)
- PostgreSQL by Chris Kolkman
- Thunder Client (for API testing)
- ES7+ React/Redux/React-Native snippets

### Database Schema
The database includes tables for:
- Users (authentication)
- Tasks (scheduling)
- Pomodoro Sessions (tracking)
- Daily Stats (productivity metrics)
- Playlists (music)
- Settings (user preferences)

### Migration Commands
```bash
# Create new migration
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# View database schema
npx drizzle-kit studio
```

## Current Features Working Without Database
- Pomodoro timer with session tracking
- Task scheduling and management
- HTML5 music player with playlists
- Daily productivity statistics
- All settings and preferences
- Data persists in browser localStorage