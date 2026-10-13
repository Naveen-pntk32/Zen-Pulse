import { Link } from "wouter";
import { XCircle, ArrowLeft, Shield } from "lucide-react";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function CancellationPolicyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans">
        <div className="space-y-2 mb-10 pb-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-xs font-mono text-greptile-green uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" />
            <span>// SUBSCRIPTION GOVERNANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
            Cancellation Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: October 13, 2026 • Frictionless Self-Service Subscription Termination
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">1. Immediate Self-Service Cancellation</h2>
            <p>
              At Pace, we believe in voluntary retention, not contractual captivity. You can cancel your subscription at any time without having to call an agent or wait in support queues.
            </p>
            <p>
              To cancel: Navigate to <strong>Settings &gt; Billing</strong>, scroll to your active subscription card, and click <strong>Cancel Subscription</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">2. Access Retention Until Cycle End</h2>
            <p>
              When you cancel a paid plan (monthly or annual), your account remains fully active with Pro access until the exact end of your current paid billing period. We do not immediately revoke your access upon cancellation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">3. What Happens to Your Data</h2>
            <p>
              Unlike legacy software platforms that delete your workspaces upon cancellation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>All existing tasks, completed focus sessions, and habit streaks remain preserved in your account.</li>
              <li>Your account seamlessly switches to the <strong>Pace Free Local Tier</strong> once your paid period concludes.</li>
              <li>You can continue tracking tasks and running Pomodoro timers indefinitely without paying a cent.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display text-foreground">4. Account Pause Alternatives</h2>
            <p>
              If you are taking an extended vacation or sabbatical, you can elect to pause your billing for up to 3 months rather than canceling. This keeps your cloud synchronization ready for when you return to deep work.
            </p>
          </section>
        </div>
      </div>
    </MarketingLayout>
  );
}
