import { useState } from "react";
import { Link } from "wouter";
import {
  Zap,
  Timer,
  BrainCircuit,
  Activity,
  Database,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  Sliders,
} from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const PILLARS = [
  {
    id: "pomodoro",
    title: "Adaptive Pomodoro Rhythm",
    code: "01",
    icon: Timer,
    headline: "Neuro-Engineered Intervals for Sustained Flow",
    desc: "Move between deep work and cognitive recharge with configurable work/break cycles. Integrated ambient sound generators and real-time visual progress tracks focus telemetry.",
    specs: ["25/5 Standard Pomodoro", "50/10 Deep Flow Mode", "Custom Interval Builder", "Integrated Audio Synth"],
  },
  {
    id: "ai",
    title: "AI Deep-Work Intelligence",
    code: "02",
    icon: BrainCircuit,
    headline: "Instant Cognitive Task Decomposition",
    desc: "Overwhelmed by sprawling initiatives? Pace AI breaks ambiguous projects into crisp, executable 15-minute subtasks with estimated cognitive load scores.",
    specs: ["Gemini & OpenAI Backing", "Zero-Latency Subtask Engine", "Daily Focus Briefing", "Cognitive Load Scoring"],
  },
  {
    id: "habits",
    title: "Habit Velocity & Streaks",
    code: "03",
    icon: Activity,
    headline: "Momentum Engineering That Sticks",
    desc: "Build lasting routines with daily and weekly consistency tracking. Track atomic habits side-by-side with your active sprint tasks.",
    specs: ["Daily Streak Counter", "Completion Heatmap", "Historical Trend Telemetry", "One-Click Quick Log"],
  },
  {
    id: "sync",
    title: "Local-First Architecture",
    code: "04",
    icon: Database,
    headline: "Zero-Latency Local Operation with Cloud Sync",
    desc: "Never wait for an HTTP request to check off a task. Pace writes immediately to local storage and asynchronously reconciles with Supabase PostgreSQL.",
    specs: ["Sub-5ms UI Response", "Offline Resilient", "Row-Level Security (RLS)", "Multi-Device Realtime"],
  },
];

export default function FeaturesPage() {
  const [activePillar, setActivePillar] = useState(PILLARS[0]);

  return (
    <MarketingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>// ARCHITECTURE &amp; CAPABILITIES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground tracking-tight">
            Engineered for pure cognitive throughput.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-sans">
            Traditional task managers generate guilt and notification spam. Pace provides a streamlined cockpit that protects your attention.
          </p>
        </div>

        {/* Interactive Feature Explorer */}
        <div className="rounded-[12px] border border-border bg-surface/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl space-y-10">
          <div className="flex items-center justify-between pb-6 border-b border-border/50 flex-wrap gap-4">
            <div>
              <p className="text-xs font-mono uppercase text-greptile-green tracking-wider">
                // INTERACTIVE EXPLORER
              </p>
              <h2 className="text-2xl font-display font-bold text-foreground mt-1">
                Core Engine Capabilities
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {PILLARS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePillar(p)}
                  className={`px-3 py-1.5 rounded-[4px] font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activePillar.id === p.id
                      ? "bg-greptile-green text-black font-bold shadow-[0_0_15px_rgba(40,233,159,0.3)]"
                      : "bg-surface-raised border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{p.code}</span>
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Pillar Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-greptile-green/15 text-greptile-green font-mono text-xs">
                <span>MODULE {activePillar.code}</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-foreground">
                {activePillar.headline}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activePillar.desc}
              </p>
              <div className="space-y-2.5 pt-2">
                {activePillar.specs.map((spec) => (
                  <div key={spec} className="flex items-center gap-3 text-xs font-mono text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-greptile-green shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Graphic Simulator */}
            <div className="rounded-[8px] border border-border/80 bg-background/90 p-6 font-mono text-xs space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-muted-foreground pb-3 border-b border-border/40">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-greptile-green animate-pulse" />
                  RUNTIME: {activePillar.id.toUpperCase()}_ENGINE
                </span>
                <span>STATUS: OPERATIONAL</span>
              </div>
              <div className="p-4 rounded-[4px] bg-surface border border-border/60 space-y-3">
                <div className="text-greptile-green">// TELEMETRY PROJECTION</div>
                <div className="text-foreground text-sm font-bold font-display">
                  {activePillar.title}
                </div>
                <div className="w-full bg-surface-raised h-2 rounded-full overflow-hidden border border-border/50">
                  <div className="bg-greptile-green h-full w-4/5 animate-pulse" />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Throughput: Optimal</span>
                  <span>Latency: &lt; 4ms</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Seamlessly integrated into the Pace workspace with hotkey triggers and background state persistence.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <Shield className="w-6 h-6 text-greptile-green" />
            <h4 className="text-base font-display font-bold text-foreground">Zero Data Mining</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your focus data belongs to you. We never sell usage patterns or serve ads. Privacy-first architecture from day one.
            </p>
          </div>
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <BarChart3 className="w-6 h-6 text-greptile-green" />
            <h4 className="text-base font-display font-bold text-foreground">Deep Work Analytics</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Gain clarity on where your energy flows with daily summary heatmaps, completion trends, and focus velocity charts.
            </p>
          </div>
          <div className="p-6 rounded-[8px] border border-border bg-surface space-y-3">
            <Sliders className="w-6 h-6 text-greptile-green" />
            <h4 className="text-base font-display font-bold text-foreground">Full Customization</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tailor work/break intervals, audio soundscapes, notification chimes, and theme contrasts to match your personal flow.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-[10px] border border-greptile-green/30 bg-surface-raised p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Make room for focused work today.
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Experience the calm of a tool crafted for developers, creators, and builders who refuse distractions.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/pomodoro"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)]"
            >
              Launch Console <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
