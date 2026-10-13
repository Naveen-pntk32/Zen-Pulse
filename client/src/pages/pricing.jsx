import { useState } from "react";
import { Link } from "wouter";
import {
  Check,
  X,
  Zap,
  ArrowRight,
  Shield,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Free",
      badge: "Local-First",
      price: "$0",
      cadence: "forever",
      desc: "Ideal for individual builders wanting a clean, distraction-free offline Pomodoro console.",
      features: [
        "Unlimited Tasks & Projects",
        "Adaptive Pomodoro Timer & Stopwatch",
        "Habit Tracking (Up to 3 habits)",
        "Local IndexedDB Storage",
        "High-Contrast Greptile Dark Theme",
        "Ambient Sound Synthesizers",
      ],
      notIncluded: [
        "Cloud Multi-Device Synchronization",
        "AI Task Decomposition & Briefings",
        "Team Workspaces & Shared Projects",
        "Priority Customer Support",
      ],
      ctaText: "Start Free",
      ctaHref: "/pomodoro",
      highlight: false,
    },
    {
      name: "Pro",
      badge: "Most Popular",
      price: annual ? "$10" : "$12",
      cadence: "per month, billed " + (annual ? "annually" : "monthly"),
      desc: "Engineered for deep-work professionals needing multi-device cloud sync and AI task decomposition.",
      features: [
        "Everything in Free, plus:",
        "Unlimited Cloud Sync (Supabase PostgreSQL)",
        "AI Task Decomposition & Cognitive Scoring",
        "Daily AI Deep-Work Focus Briefings",
        "Unlimited Habit Streaks & Velocity History",
        "Custom Sound Scapes & Chime Library",
        "Export Data (JSON/CSV) for GDPR Portability",
        "Priority Email & Chat Support",
      ],
      notIncluded: [
        "Team Workspaces & Shared Sprints",
        "Admin Audit Logs & Governance",
      ],
      ctaText: "Upgrade to Pro",
      ctaHref: "/upgrade",
      highlight: true,
    },
    {
      name: "Team",
      badge: "For Squads",
      price: annual ? "$24" : "$29",
      cadence: "per seat/month, billed " + (annual ? "annually" : "monthly"),
      desc: "For engineering squads and agile teams synchronizing focus rhythms and shared deliverables.",
      features: [
        "Everything in Pro, plus:",
        "Shared Team Workspaces & Projects",
        "Squad Focus Rooms & Concurrent Timers",
        "Centralized Team Invoicing & Seat Management",
        "Admin Governance & Audit Trail Logs",
        "Single Sign-On (SSO / SAML) Integration",
        "Dedicated Success Manager & 99.9% SLA",
      ],
      notIncluded: [],
      ctaText: "Contact Sales",
      ctaHref: "/contact",
      highlight: false,
    },
  ];

  const comparisonRows = [
    { feature: "Pomodoro Rhythm Timer", free: true, pro: true, team: true },
    { feature: "Offline Local Storage", free: true, pro: true, team: true },
    { feature: "Ambient Audio Synth", free: true, pro: true, team: true },
    { feature: "Cloud Multi-Device Sync", free: false, pro: true, team: true },
    { feature: "AI Subtask Decomposition", free: false, pro: true, team: true },
    { feature: "AI Daily Focus Briefing", free: false, pro: true, team: true },
    { feature: "Unlimited Habit Streaks", free: "Max 3", pro: "Unlimited", team: "Unlimited" },
    { feature: "Shared Team Workspaces", free: false, pro: false, team: true },
    { feature: "Admin Audit Logs", free: false, pro: false, team: true },
    { feature: "Support SLA", free: "Community", pro: "Priority (24h)", team: "Dedicated (<4h)" },
  ];

  return (
    <MarketingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-greptile-green font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>// TRANSPARENT INVESTMENT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground tracking-tight">
            Fair pricing for focused builders.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-sans">
            Start completely free in local mode. Upgrade whenever you need cloud synchronization and AI deep-work intelligence.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-6 flex items-center justify-center gap-4 text-xs font-mono">
            <span className={!annual ? "text-foreground font-bold" : "text-muted-foreground"}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-surface border border-border p-1 relative transition-colors cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-greptile-green transition-transform ${
                  annual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={annual ? "text-foreground font-bold" : "text-muted-foreground"}>
                Annual
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-greptile-green/15 text-greptile-green text-[10px] font-bold">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[10px] p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-200 ${
                plan.highlight
                  ? "border-2 border-greptile-green bg-surface-raised shadow-[0_0_35px_rgba(40,233,159,0.15)] -translate-y-2"
                  : "border border-border bg-surface hover:border-border-strong"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-greptile-green text-black font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {plan.desc}
                  </p>
                </div>

                <div className="pt-2 pb-4 border-b border-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-display font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      / {plan.cadence}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Included capabilities:
                  </p>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-foreground font-sans">
                      <Check className="w-4 h-4 text-greptile-green shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-muted-foreground/60 font-sans">
                      <X className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-[4px] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    plan.highlight
                      ? "bg-greptile-green hover:bg-[#34f5ab] text-black shadow-[0_0_20px_rgba(40,233,159,0.3)]"
                      : "border border-border bg-surface-raised hover:bg-surface-hover text-foreground"
                  }`}
                >
                  {plan.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="rounded-[10px] border border-border bg-surface p-6 sm:p-10 space-y-6">
          <div className="border-b border-border/50 pb-4">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Detailed Feature Comparison
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              // COMPLETE ARCHITECTURAL BREAKDOWN
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Capability</th>
                  <th className="py-3 px-4">Free</th>
                  <th className="py-3 px-4 text-greptile-green">Pro</th>
                  <th className="py-3 px-4">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3.5 px-4 text-foreground font-medium">{row.feature}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {typeof row.free === "boolean" ? (
                        row.free ? <Check className="w-4 h-4 text-greptile-green" /> : <X className="w-4 h-4 text-muted-foreground/40" />
                      ) : row.free}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? <Check className="w-4 h-4 text-greptile-green" /> : <X className="w-4 h-4 text-muted-foreground/40" />
                      ) : row.pro}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      {typeof row.team === "boolean" ? (
                        row.team ? <Check className="w-4 h-4 text-greptile-green" /> : <X className="w-4 h-4 text-muted-foreground/40" />
                      ) : row.team}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-display font-bold text-foreground">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Have questions about billing, cancellations, or data safety?
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-[6px] border border-border bg-surface space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Can I cancel anytime?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. You can cancel your subscription at any time with a single click in your settings. You retain full access to Pro features until the end of your billing cycle, and your local data is never erased.
              </p>
            </div>
            <div className="p-4 rounded-[6px] border border-border bg-surface space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Do you offer refunds?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. We offer an unconditional 14-day money-back guarantee. If Pace does not enhance your productivity, email us and we will refund 100% of your payment.
              </p>
            </div>
            <div className="p-4 rounded-[6px] border border-border bg-surface space-y-2">
              <h4 className="text-sm font-semibold text-foreground">What happens to my data if I downgrade?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data stays intact. You continue using Pace in local-first offline mode with unlimited tasks and Pomodoro timer access.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/faq" className="text-xs font-mono text-greptile-green hover:underline">
              View all 20+ Frequently Asked Questions →
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
