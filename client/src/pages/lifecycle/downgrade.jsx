import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AlertTriangle, ArrowLeft, Check, Shield } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function DowngradePage() {
  const [, setLocation] = useLocation();
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDowngrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 800);
  };

  return (
    <AuthLayout
      title="Downgrade to Local Free Tier"
      subtitle="Review the features that will be locked upon your next billing cycle."
      backTo="/settings"
    >
      {confirmed ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-foreground">
              Downgrade Scheduled
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Your account will remain on the Pro tier until the end of your billing cycle, after which it will smoothly transition to the Free local tier.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/pomodoro"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider"
            >
              Return to Console
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 font-sans">
          <div className="p-4 rounded-[6px] border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>// FEATURE LOSS NOTICE</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              When downgrading to the Free tier, your account will revert to local-only browser storage. You will lose:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-200/80">
              <li>Automatic multi-device cloud synchronization.</li>
              <li>Generative AI task decomposition and daily focus briefings.</li>
              <li>Habit streak storage beyond 3 habits.</li>
            </ul>
          </div>

          <div className="p-4 rounded-[6px] border border-border bg-surface text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">What remains preserved?</p>
            <p>All your tasks, local Pomodoro timer, ambient sounds, and local habit tracking remain 100% free forever.</p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleDowngrade}
              disabled={loading}
              className="w-full py-2.5 rounded-[4px] border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs font-bold uppercase tracking-wider transition-all"
            >
              {loading ? "Scheduling Downgrade..." : "Confirm Downgrade to Free"}
            </button>
            <Link
              href="/settings"
              className="w-full py-2.5 rounded-[4px] bg-surface border border-border text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center justify-center"
            >
              Keep My Pro Features
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
