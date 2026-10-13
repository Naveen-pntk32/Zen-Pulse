import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, Search, Keyboard, Sparkles, Database, Timer, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const DOCS_TOPICS = [
  {
    icon: Timer,
    title: "Pomodoro Rhythm Mastery",
    desc: "Understanding optimal work/break ratios, handling unexpected interruptions, and leveraging binaural brown noise.",
    articles: [
      "Configuring Custom Work & Break Durations",
      "Using the Keyboard Hotkey Controls (Space / R)",
      "How Audio Synthesizers Mask Distracting Office Noises",
    ],
  },
  {
    icon: Sparkles,
    title: "AI Task Decomposition",
    desc: "How to prompt the AI deep-work engine to turn large epics into crisp 15-minute executable chunks.",
    articles: [
      "Interpreting Cognitive Load Scores (1 to 5)",
      "Daily Focus Briefings: Your Morning Briefing Routine",
      "Privacy Guarantees for AI Input Data",
    ],
  },
  {
    icon: Database,
    title: "Local-First & Cloud Synchronization",
    desc: "How Pace manages indexed offline storage and reconciles conflicts when you reconnect.",
    articles: [
      "Local Mode vs. Authenticated Cloud Sync",
      "Exporting Your Productivity Data (JSON / CSV)",
      "Setting Up Supabase PostgreSQL Connection",
    ],
  },
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts & Hotkeys",
    desc: "Operate the entire Pace console without touching your mouse or trackpad.",
    articles: [
      "Global Command Palette Shortcuts",
      "Task Navigation & Quick Toggle",
      "Instant Pomodoro Interval Reset",
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");

  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>// DOCUMENTATION &amp; MANUALS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            Pace Documentation &amp; Guides
          </h1>
          <p className="text-base text-muted-foreground">
            Complete technical documentation, productivity frameworks, and console configuration manuals.
          </p>

          <div className="pt-4 relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documentation topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-[6px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
            />
          </div>
        </div>

        {/* Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOCS_TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                className="p-6 rounded-[8px] border border-border bg-surface hover:border-border-strong transition-colors space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-greptile-green/15 text-greptile-green flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground">
                    {topic.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {topic.desc}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  {topic.articles.map((art) => (
                    <div
                      key={art}
                      className="text-xs font-mono text-muted-foreground hover:text-greptile-green cursor-pointer flex items-center justify-between py-1 transition-colors"
                    >
                      <span>• {art}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hotkey Cheatsheet Card */}
        <div className="p-6 rounded-[8px] border border-greptile-green/30 bg-surface-raised space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-greptile-green font-semibold">
            <Keyboard className="w-4 h-4" />
            <span>// INSTANT HOTKEY REFERENCE</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-[4px] border border-border bg-surface">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-raised border border-border text-foreground font-bold">Space</kbd>
              <div className="text-[11px] text-muted-foreground mt-1.5">Start / Pause Timer</div>
            </div>
            <div className="p-3 rounded-[4px] border border-border bg-surface">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-raised border border-border text-foreground font-bold">R</kbd>
              <div className="text-[11px] text-muted-foreground mt-1.5">Reset Active Interval</div>
            </div>
            <div className="p-3 rounded-[4px] border border-border bg-surface">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-raised border border-border text-foreground font-bold">N</kbd>
              <div className="text-[11px] text-muted-foreground mt-1.5">New Rapid Task</div>
            </div>
            <div className="p-3 rounded-[4px] border border-border bg-surface">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-raised border border-border text-foreground font-bold">Cmd+K</kbd>
              <div className="text-[11px] text-muted-foreground mt-1.5">Omni Search Bar</div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
