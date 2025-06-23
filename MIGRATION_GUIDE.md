# Migration Guide: Update Your Existing Repository

## Quick Start (No Database)
Your app works perfectly with localStorage. Simply copy these files to your existing repo:

### 1. Copy New Files
```
/client/src/components/html5-music-player.tsx
/client/src/pages/music.tsx
```

### 2. Update Existing Files

**client/src/App.tsx** - Add music route:
```jsx
import Music from "@/pages/music";

// Add to Router function:
<Route path="/music" component={Music} />
```

**client/src/pages/home.tsx** - Add navigation:
```jsx
import { Link, useLocation } from 'wouter';
import { Music, Home as HomeIcon } from 'lucide-react';

// Add navigation bar before header:
<nav className="flex justify-center mb-6">
  <div className="flex bg-gray-800 rounded-2xl p-1 border border-gray-700">
    <Link href="/">
      <Button>Dashboard</Button>
    </Link>
    <Link href="/music">
      <Button>Music Player</Button>
    </Link>
  </div>
</nav>
```

### 3. Install Dependencies (if needed)
```bash
npm install
```

### 4. Run Your App
```bash
npm run dev
```

## VS Code Setup

### Required Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag

### Launch Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "request": "launch",
      "type": "node",
      "program": "${workspaceFolder}/server/index.ts",
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    }
  ]
}
```

### Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## Features Added
- HTML5 audio player (no Spotify dependency)
- Playlist management with local storage
- Full music controls (play/pause/seek/volume)
- Navigation between Dashboard and Music Player
- Shuffle and repeat modes
- Real-time progress tracking

## Running in VS Code

1. **Open Terminal** (Ctrl+`)
2. **Install dependencies:** `npm install`
3. **Start development server:** `npm run dev`
4. **Open browser:** Navigate to `http://localhost:5000`

## Database (Optional)
If you want user accounts and cloud sync, see DATABASE_SETUP.md for PostgreSQL setup instructions.