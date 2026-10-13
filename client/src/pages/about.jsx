import { Link } from "wouter";
import { Zap, Heart, Shield, Cpu, Code2, ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function AboutPage() {
  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 font-sans">
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>// OUR MANIFESTO</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight">
            We built Pace because productivity software was burning us out.
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Most modern productivity tools aren&apos;t designed for focused creation—they&apos;re designed for corporate surveillance, notification spam, and endless status updates.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div className="p-8 rounded-[10px] border border-border bg-surface space-y-4">
            <h2 className="text-xl font-display font-bold text-foreground">
              The Context Switching Crisis
            </h2>
            <p>
              According to cognitive psychology studies, every notification or tab-switch imposes a 23-minute cognitive penalty before returning to a state of deep flow. When your task manager behaves like a social feed—complete with gamified badges, red alert dots, and sprawling Kanban columns—you expend all your mental energy managing tasks rather than completing them.
            </p>
            <p>
              Pace started as an internal tool: a dark-mode cockpit inspired by hacker consoles and spacecraft telemetry. We stripped out every distraction and focused on the sacred trinity of deep execution: <strong>Rhythm (Pomodoro)</strong>, <strong>Clarity (AI Decomposition)</strong>, and <strong>Habit Momentum</strong>.
            </p>
          </div>

          {/* Three Core Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-[8px] border border-border bg-surface-raised space-y-3">
              <div className="w-8 h-8 rounded-[4px] bg-greptile-green/15 text-greptile-green flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-display font-bold text-foreground">Local-First Priority</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interactions must resolve in sub-5ms. Waiting for network latency to check off a checkbox kills momentum. Local state comes first; the cloud reconciles in the background.
              </p>
            </div>

            <div className="p-6 rounded-[8px] border border-border bg-surface-raised space-y-3">
              <div className="w-8 h-8 rounded-[4px] bg-greptile-green/15 text-greptile-green flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-display font-bold text-foreground">Calm Aesthetic</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Greptile dark palette (#0b0a10, #12111c, #28e99f) was specifically curated to minimize eye fatigue during late-night programming and writing sprints.
              </p>
            </div>

            <div className="p-6 rounded-[8px] border border-border bg-surface-raised space-y-3">
              <div className="w-8 h-8 rounded-[4px] bg-greptile-green/15 text-greptile-green flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-display font-bold text-foreground">Zero Surveillance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We believe in autonomous focus, not micromanagement. Pace will never include employee keystroke logging, webcam tracking, or privacy-invasive features.
              </p>
            </div>
          </div>
        </div>

        {/* Engineering Specs */}
        <div className="rounded-[10px] border border-border/80 bg-surface/80 p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>// ARCHITECTURAL FOUNDATION</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
            <div>
              <p className="text-muted-foreground uppercase text-[10px]">Client Engine</p>
              <p className="text-foreground font-bold mt-1">Vite + React 18</p>
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px]">Database</p>
              <p className="text-foreground font-bold mt-1">PostgreSQL + Supabase</p>
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px]">Security</p>
              <p className="text-foreground font-bold mt-1">Row-Level Security (RLS)</p>
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px]">AI Backend</p>
              <p className="text-foreground font-bold mt-1">Gemini Pro + OpenAI</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/pomodoro"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)]"
          >
            Experience Pace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
