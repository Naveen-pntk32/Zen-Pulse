import { Link } from "wouter";
import { GitCommit, Sparkles, Zap, Shield, Bug, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const RELEASES = [
  {
    version: "v2.0.0",
    date: "October 2026",
    title: "The Pace Evolution & Complete Production Architecture",
    badge: "Major Release",
    description: "Complete rebrand to Pace with full production page architecture, including dedicated legal, authentication, customer lifecycle, and system resilience suites.",
    changes: [
      { type: "Added", text: "Master Web App Page Architecture suite with complete legal, auth, and system edge-case states." },
      { type: "Added", text: "Interactive GDPR/CCPA Cookie Preferences Manager with granular consent switches." },
      { type: "Added", text: "System Resilience Layer: Offline detector, Session-expired modal, custom 403/404/500 handlers." },
      { type: "Added", text: "Full customer lifecycle flow: Onboarding wizard, subscription cancellation with retention offers, checkout states." },
      { type: "Improved", text: "Greptile Dark Design Language tokens across all components with high-contrast accessibility." },
      { type: "Security", text: "Dual client-and-server input validation (Zod + Express) and Row-Level Security." },
    ],
  },
  {
    version: "v1.9.0",
    date: "September 2026",
    title: "AI Deep-Work Engine & Synthesizer",
    badge: "Feature Release",
    description: "Introduced generative task decomposition powered by Gemini Pro, breaking complex projects into 15-minute executable micro-steps.",
    changes: [
      { type: "Added", text: "AI Subtask Decomposition modal with estimated cognitive load scoring." },
      { type: "Added", text: "Brownian, pink, and binaural audio noise synthesizer directly inside the timer." },
      { type: "Improved", text: "Pomodoro rhythm engine with keyboard hotkeys (Space to toggle, R to reset)." },
      { type: "Fixed", text: "Resolved timer drift when browser tabs were backgrounded on Chrome." },
    ],
  },
  {
    version: "v1.8.0",
    date: "August 2026",
    title: "Habit Streaks & Velocity Telemetry",
    badge: "Core Update",
    description: "Added dedicated habit tracking alongside sprint tasks, complete with 7-day completion matrices and streak counters.",
    changes: [
      { type: "Added", text: "Habit Tracker module with customizable recurrence frequencies." },
      { type: "Added", text: "Completion heatmaps and velocity analytics charts." },
      { type: "Improved", text: "Instant optimistic state updates for lightning-fast task completion." },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16 font-sans">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <GitCommit className="w-3.5 h-3.5" />
            <span>// RELEASE HISTORY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            Changelog &amp; Product Updates
          </h1>
          <p className="text-base text-muted-foreground">
            A chronological timeline of features, security enhancements, and architectural upgrades shipped to Pace.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-12 border-l border-border/60 pl-6 sm:pl-8 ml-2">
          {RELEASES.map((rel) => (
            <div key={rel.version} className="relative space-y-4">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-greptile-green border-4 border-background shadow-[0_0_10px_rgba(40,233,159,0.5)]" />

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-greptile-green font-bold">
                  {rel.version}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  • {rel.date}
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-greptile-green/15 text-greptile-green font-mono text-[10px] uppercase font-bold">
                  {rel.badge}
                </span>
              </div>

              <h2 className="text-2xl font-display font-bold text-foreground">
                {rel.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {rel.description}
              </p>

              <div className="space-y-2 pt-2">
                {rel.changes.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs font-sans">
                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] font-bold shrink-0 mt-0.5 ${
                        c.type === "Added"
                          ? "bg-greptile-green/15 text-greptile-green"
                          : c.type === "Security"
                          ? "bg-cyan-500/15 text-cyan-400"
                          : c.type === "Improved"
                          ? "bg-purple-500/15 text-purple-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {c.type}
                    </span>
                    <span className="text-foreground/90">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
