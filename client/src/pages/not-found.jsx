import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AlertCircle, ArrowLeft, Search, Timer, CheckSquare, Activity, HelpCircle } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-[8px] bg-surface-raised border border-border text-center space-y-6 shadow-2xl relative">
        <div className="w-14 h-14 rounded-[6px] bg-bloom/15 border border-bloom/40 text-bloom flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,109,109,0.2)]">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="badge-tech badge-tech-coral text-[10px] mb-2 inline-block">
            ERROR 404 // ROUTE NOT FOUND
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Target Page Unreachable
          </h1>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            The route you navigated to does not exist or has been relocated to another workspace coordinate.
          </p>
        </div>

        {/* Rescue Search */}
        <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, habits, docs..."
            className="w-full pl-9 pr-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
          />
        </form>

        {/* Navigation Rescue Links */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <p className="text-[10px] font-mono uppercase text-muted-foreground">
            // RESCUE COORDINATES
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <Link
              href="/pomodoro"
              className="p-2.5 rounded-[4px] border border-border bg-surface hover:border-greptile-green/50 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Timer className="w-3.5 h-3.5 text-greptile-green" /> Pomodoro Timer
            </Link>
            <Link
              href="/tasks"
              className="p-2.5 rounded-[4px] border border-border bg-surface hover:border-greptile-green/50 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5 text-greptile-green" /> Active Tasks
            </Link>
            <Link
              href="/habits"
              className="p-2.5 rounded-[4px] border border-border bg-surface hover:border-greptile-green/50 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-greptile-green" /> Habit Tracker
            </Link>
            <Link
              href="/help"
              className="p-2.5 rounded-[4px] border border-border bg-surface hover:border-greptile-green/50 text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-greptile-green" /> Documentation
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/pomodoro"
            className="w-full py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Safe Cockpit
          </Link>
        </div>
      </div>
    </div>
  );
}
