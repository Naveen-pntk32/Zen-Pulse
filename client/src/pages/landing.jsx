import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Database,
  ArrowRight,
  ChevronDown,
  Flame,
  TrendingUp,
  BrainCircuit,
  Terminal,
  Cpu,
  BarChart3,
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

/* --- Interactive Hero Mini-Timer Widget --- */
function MiniTimerWidget() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro | break | deep

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const selectMode = (newMode, mins) => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsLeft(mins * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const totalModeSeconds = mode === "pomodoro" ? 25 * 60 : mode === "break" ? 5 * 60 : 50 * 60;
  const progressPercent = ((totalModeSeconds - secondsLeft) / totalModeSeconds) * 100;

  return (
    <div className="w-full max-w-lg mx-auto rounded-[12px] border border-border-strong bg-surface-raised/95 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient radial aura */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-greptile-green/10 blur-3xl pointer-events-none rounded-full" />

      {/* Mini header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-greptile-green animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            // TELEMETRY SIMULATOR
          </span>
        </div>
        <div className="flex gap-1 bg-surface p-1 rounded-[6px] border border-border/60">
          <button
            onClick={() => selectMode("pomodoro", 25)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-colors",
              mode === "pomodoro"
                ? "bg-greptile-green text-black font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            25m Focus
          </button>
          <button
            onClick={() => selectMode("break", 5)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-colors",
              mode === "break"
                ? "bg-greptile-green text-black font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            5m Break
          </button>
          <button
            onClick={() => selectMode("deep", 50)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-mono rounded-[4px] transition-colors",
              mode === "deep"
                ? "bg-greptile-green text-black font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            50m Deep
          </button>
        </div>
      </div>

      {/* Digital readout */}
      <div className="my-8 text-center relative">
        <div className="font-mono text-6xl md:text-7xl font-bold tracking-tight text-foreground select-none">
          {timeFormatted}
        </div>
        <div className="text-[11px] font-mono uppercase tracking-widest text-greptile-green mt-2">
          {isRunning ? "● FOCUS CADENCE ACTIVE" : "○ ENGINE STANDBY"}
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-surface mx-auto mt-4 rounded-full overflow-hidden border border-border/60">
          <div
            className="h-full bg-greptile-green transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-[6px] font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer",
            isRunning
              ? "bg-surface text-foreground border border-border-strong hover:bg-surface-elevated"
              : "bg-greptile-green text-black hover:bg-[#34f5ab] shadow-[0_0_20px_rgba(40,233,159,0.3)]"
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" /> Engage Focus
            </>
          )}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(mode === "pomodoro" ? 25 * 60 : mode === "break" ? 5 * 60 : 50 * 60);
          }}
          className="p-2.5 rounded-[6px] border border-border/80 bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* --- Interactive FAQ Accordion Component --- */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border/70 rounded-[8px] bg-surface-raised/60 overflow-hidden transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-sans text-sm sm:text-base font-medium text-foreground hover:text-greptile-green transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4", open && "rotate-180 text-greptile-green")}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed border-t border-border/30 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background bg-grid-pattern relative text-foreground flex flex-col antialiased selection:bg-greptile-green selection:text-black">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-radial-glow pointer-events-none -z-10" />

      {/* --- Sticky Top Navigation Bar --- */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-[6px] bg-greptile-green flex items-center justify-center shadow-[0_0_15px_rgba(40,233,159,0.4)]">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              ZenPulse
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[3px] bg-greptile-green/10 text-greptile-green border border-greptile-green/30">
              v2.4
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#bento" className="hover:text-foreground transition-colors">
              Architecture
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/pomodoro"
                className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-greptile-green text-black font-mono text-xs font-semibold hover:bg-[#34f5ab] transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
              >
                Enter Console <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="hidden sm:inline-block text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-greptile-green text-black font-mono text-xs font-semibold hover:bg-[#34f5ab] transition-all shadow-[0_0_15px_rgba(40,233,159,0.3)]"
                >
                  Start Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- Main Hero Section --- */}
      <section className="pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        {/* System Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-greptile-green/40 bg-greptile-green/5 mb-6 text-xs font-mono text-greptile-green animate-fade-in">
          <Terminal className="w-3.5 h-3.5" />
          <span>// DEEP-WORK ENGINE v2.4 • SYSTEM ONLINE</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.08]">
          Architect Your Focus.{" "}
          <span className="bg-gradient-to-r from-greptile-green via-[#a6ffd4] to-neon bg-clip-text text-transparent">
            Master Deep Work.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
          The developer productivity cockpit engineered to eradicate context switching. Autonomous AI
          task breakdown, calibrated rhythm telemetry, habit preservation, and zero-latency local-first
          sync.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={user ? "/pomodoro" : "/profile"}
            className="w-full sm:w-auto px-8 py-3.5 rounded-[6px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#34f5ab] transition-all shadow-[0_0_25px_rgba(40,233,159,0.35)] flex items-center justify-center gap-2"
          >
            Launch Focus Console <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto px-6 py-3.5 rounded-[6px] border border-border bg-surface hover:bg-surface-elevated text-foreground font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            Explore Interactive Demo
          </a>
        </div>

        {/* Telemetry Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-muted-foreground border-y border-border/40 py-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-greptile-green" />
            <span>Sub-50ms Local-First Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-3.5 h-3.5 text-sky" />
            <span>AI Task Decomposition</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-coral" />
            <span>PostgreSQL + Supabase RLS</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-neon" />
            <span>Offline-First Fallback</span>
          </div>
        </div>

        {/* Interactive Hero Timer Demo */}
        <div id="demo" className="mt-14 scroll-mt-24">
          <MiniTimerWidget />
        </div>
      </section>

      {/* --- Bento Grid Section --- */}
      <section id="bento" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-greptile-green">
            // UNCOMPROMISING ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mt-2 text-foreground">
            Built for Extreme Focus Velocity
          </h2>
          <p className="text-sm text-muted-foreground font-sans max-w-xl mx-auto mt-3">
            Every component in ZenPulse is engineered to remove micro-friction and keep you inside the
            zone of peak flow.
          </p>
        </div>

        {/* The Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: AI Task Decomposition (8 cols) */}
          <div className="md:col-span-8 rounded-[10px] border border-border-strong bg-surface-raised/80 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group hover:border-greptile-green/40 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-[6px] bg-greptile-green/10 border border-greptile-green/30 flex items-center justify-center text-greptile-green">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
                Autonomous AI Task Decomposition
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl">
                Break daunting, ambiguous goals into concrete, sequenced milestones in a single click.
                Powered by Gemini intelligence with deterministic offline heuristics.
              </p>
            </div>

            {/* Visual simulation of breakdown */}
            <div className="mt-6 bg-surface/90 border border-border/80 rounded-[8px] p-4 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-border/50 text-muted-foreground text-[11px]">
                <span>TASK: &quot;Ship Production SaaS v1&quot;</span>
                <span className="text-greptile-green flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 4 SUBTASKS GENERATED
                </span>
              </div>
              <div className="flex items-center gap-2 text-foreground py-1">
                <Check className="w-3.5 h-3.5 text-greptile-green" />
                <span>1. Architect schema &amp; database migrations</span>
                <span className="ml-auto text-muted-foreground text-[10px]">25m</span>
              </div>
              <div className="flex items-center gap-2 text-foreground py-1">
                <Check className="w-3.5 h-3.5 text-greptile-green" />
                <span>2. Implement REST CRUD endpoints &amp; Zod guardrails</span>
                <span className="ml-auto text-muted-foreground text-[10px]">35m</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/80 py-1">
                <div className="w-3.5 h-3.5 rounded-[2px] border border-border-strong" />
                <span>3. Build cinematic landing experience</span>
                <span className="ml-auto text-muted-foreground text-[10px]">30m</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/60 py-1">
                <div className="w-3.5 h-3.5 rounded-[2px] border border-border-strong" />
                <span>4. Deploy to Vercel edge with CI automated tests</span>
                <span className="ml-auto text-muted-foreground text-[10px]">20m</span>
              </div>
            </div>
          </div>

          {/* Card 2: Calibrated Rhythm Timer (4 cols) */}
          <div className="md:col-span-4 rounded-[10px] border border-border-strong bg-surface-raised/80 p-6 sm:p-8 flex flex-col justify-between group hover:border-greptile-green/40 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-[6px] bg-neon/10 border border-neon/30 flex items-center justify-center text-neon">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground">
                Dual Chronometer Engine
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                Pomodoro rhythm intervals calibrated with automatic audio cue synthesis and stopwatch
                tracking.
              </p>
            </div>

            <div className="mt-6 bg-surface rounded-[8px] p-4 border border-border/60 text-center font-mono">
              <span className="text-2xl font-bold text-greptile-green">25:00</span>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase">
                Zero Distraction Fullscreen Ready
              </p>
            </div>
          </div>

          {/* Card 3: Habit Streak Lattice (4 cols) */}
          <div className="md:col-span-4 rounded-[10px] border border-border-strong bg-surface-raised/80 p-6 sm:p-8 flex flex-col justify-between group hover:border-greptile-green/40 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-[6px] bg-coral/10 border border-coral/30 flex items-center justify-center text-coral">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground">
                Habit Streak Lattice
              </h3>
              <p className="text-xs text-muted-foreground font-sans">
                Reinforce consistency with automatic check-ins linked directly to completed Pomodoro focus
                blocks.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between bg-surface rounded-[8px] p-3 border border-border/60">
              <span className="text-xs font-mono text-foreground">Deep Code Sprint</span>
              <span className="text-xs font-mono font-bold text-coral flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> 18 DAYS
              </span>
            </div>
          </div>

          {/* Card 4: Relational Supabase Cloud (8 cols) */}
          <div className="md:col-span-8 rounded-[10px] border border-border-strong bg-surface-raised/80 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between group hover:border-greptile-green/40 transition-colors">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-[6px] bg-sky/10 border border-sky/30 flex items-center justify-center text-sky">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-foreground">
                Relational PostgreSQL &amp; Local-First Synchronization
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-xl">
                True multi-tenant data isolation backed by Supabase PostgreSQL and Row-Level Security. If
                your connection drops, ZenPulse seamlessly falls back to indexed offline storage.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface rounded-[6px] p-2.5 border border-border/60 text-center">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">SYNC LATENCY</div>
                <div className="text-sm font-bold font-mono text-greptile-green mt-0.5">&lt; 38ms</div>
              </div>
              <div className="bg-surface rounded-[6px] p-2.5 border border-border/60 text-center">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">SECURITY</div>
                <div className="text-sm font-bold font-mono text-sky mt-0.5">Postgres RLS</div>
              </div>
              <div className="bg-surface rounded-[6px] p-2.5 border border-border/60 text-center">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">DATA MODEL</div>
                <div className="text-sm font-bold font-mono text-neon mt-0.5">Drizzle ORM</div>
              </div>
              <div className="bg-surface rounded-[6px] p-2.5 border border-border/60 text-center">
                <div className="text-[10px] font-mono text-muted-foreground uppercase">UPTIME</div>
                <div className="text-sm font-bold font-mono text-coral mt-0.5">99.98%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Metrics & Social Proof Section --- */}
      <section className="py-16 border-y border-border/40 bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-greptile-green">
                120,000+
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Deep Focus Hours Logged
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-foreground">
                99.98%
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Cloud Sync Reliability
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-neon">
                &lt; 50ms
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Local-First Response Time
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-sky">
                0
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                Ad Tracking or Distractions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-greptile-green">
            // FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl font-display font-bold mt-2 text-foreground">
            Clear Answers for Builders
          </h2>
        </div>

        <div className="space-y-3">
          <FaqItem
            question="Is ZenPulse completely free to use?"
            answer="Yes. ZenPulse provides full core capabilities including tasks, AI decomposition, Pomodoro timers, habit tracking, and cloud sync completely free. Premium tiers with advanced team telemetry will be optional additions in future releases."
          />
          <FaqItem
            question="Can I use ZenPulse offline without an internet connection?"
            answer="Yes. ZenPulse implements an active local-first architecture. All task edits, focus sessions, and habit check-ins work in local storage and synchronize seamlessly with PostgreSQL when your network recovers."
          />
          <FaqItem
            question="How does the AI task decomposition work?"
            answer="When you click the AI Breakdown action on any task, our backend invokes Google Gemini models to parse the task intent and return 3 to 5 actionable subtasks with time estimates. If the AI service is unreachable, a deterministic local heuristic fallback handles it instantly."
          />
          <FaqItem
            question="How is my data secured?"
            answer="Your records are stored in a dedicated PostgreSQL database protected by Supabase Row-Level Security (RLS) policies. Every query is filtered by your cryptographically verified user ID, ensuring strict tenant isolation."
          />
          <FaqItem
            question="Can I export my data or migrate from TickTick / Todoist?"
            answer="Yes. ZenPulse includes a dedicated one-click JSON migration engine in the settings and profile screens, allowing you to import and export your complete workspace."
          />
        </div>
      </section>

      {/* --- Bottom Cinematic CTA --- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-[12px] border border-greptile-green/40 bg-surface-raised p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none opacity-50" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-greptile-green">
              // RECLAIM YOUR TIME
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
              Ready to eliminate cognitive fatigue?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-sans">
              Enter your distraction-free cockpit and experience what effortless deep work feels like.
            </p>
            <div className="pt-4">
              <Link
                href={user ? "/pomodoro" : "/profile"}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-[6px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#34f5ab] transition-all shadow-[0_0_30px_rgba(40,233,159,0.4)]"
              >
                Launch ZenPulse Console <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="mt-auto border-t border-border/50 bg-background/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-greptile-green flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              ZenPulse
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              // Focus Operating System
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground">
            <Link href="/pomodoro" className="hover:text-foreground transition-colors">
              Pomodoro
            </Link>
            <Link href="/tasks" className="hover:text-foreground transition-colors">
              Tasks
            </Link>
            <Link href="/habits" className="hover:text-foreground transition-colors">
              Habits
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://github.com/Naveen-pntk32/Zen-Pulse"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} ZenPulse. Engineered for builders.
          </div>
        </div>
      </footer>
    </div>
  );
}
