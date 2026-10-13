import { useState } from "react";
import { Link, useLocation } from "wouter";
import { XCircle, Gift, PauseCircle, Check, ArrowLeft, Shield } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function CancelSubscriptionPage() {
  const [, setLocation] = useLocation();
  const [reason, setReason] = useState("price");
  const [stage, setStage] = useState("offer"); // offer | confirmed
  const [loading, setLoading] = useState(false);

  const handlePause = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("paused");
    }, 600);
  };

  const handleDiscount = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("discounted");
    }, 600);
  };

  const handleFinalCancel = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStage("cancelled");
    }, 800);
  };

  return (
    <AuthLayout
      title="Subscription Management"
      subtitle="We're sad to see you go. Help us understand your decision."
      backTo="/settings"
    >
      {stage === "offer" && (
        <div className="space-y-6 font-sans">
          {/* Reason Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              What is your primary reason for leaving?
            </label>
            <div className="space-y-1.5 text-xs font-mono">
              {[
                { id: "price", label: "Pace Pro is outside my current budget" },
                { id: "time", label: "I am taking time off / not using it enough" },
                { id: "features", label: "Missing specific integrations or features" },
                { id: "technical", label: "Encountered technical issues or bugs" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setReason(item.id)}
                  className={`w-full p-2.5 rounded-[4px] border text-left transition-all ${
                    reason === item.id
                      ? "border-greptile-green bg-greptile-green/10 text-greptile-green font-bold"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Retention Offer Box */}
          <div className="p-4 rounded-[8px] border border-greptile-green/30 bg-surface-raised space-y-3">
            <div className="flex items-center gap-2 text-greptile-green font-mono text-xs font-bold uppercase">
              <Gift className="w-4 h-4" />
              <span>// EXCLUSIVE BUILDER RETENTION OFFER</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We appreciate your focus journey. Rather than losing your cloud sync and AI capabilities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDiscount}
                className="p-3 rounded-[4px] border border-greptile-green/40 bg-greptile-green/15 hover:bg-greptile-green/25 text-left text-xs transition-colors"
              >
                <div className="font-bold text-greptile-green">Claim 50% Off</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">$6/mo for next 3 months</div>
              </button>

              <button
                type="button"
                onClick={handlePause}
                className="p-3 rounded-[4px] border border-border bg-surface hover:bg-surface-hover text-left text-xs transition-colors"
              >
                <div className="font-bold text-foreground">Pause for 2 Months</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Resume automatically later</div>
              </button>
            </div>
          </div>

          {/* Final Cancel Link */}
          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/settings"
              className="text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Keep My Current Plan
            </Link>
            <button
              onClick={handleFinalCancel}
              className="text-xs font-mono text-red-400 hover:text-red-300 underline"
            >
              Proceed with Cancellation
            </button>
          </div>
        </div>
      )}

      {stage === "discounted" && (
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-foreground">
              50% Discount Applied!
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Your next 3 monthly invoices will be reduced to $6.00/mo. Thank you for continuing to build with Pace.
            </p>
          </div>
          <Link
            href="/pomodoro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider"
          >
            Return to Console
          </Link>
        </div>
      )}

      {stage === "paused" && (
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <PauseCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-foreground">
              Subscription Paused
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Billing paused for 60 days. Your cloud data remains safely encrypted and waiting for your return.
            </p>
          </div>
          <Link
            href="/pomodoro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider"
          >
            Return to Console
          </Link>
        </div>
      )}

      {stage === "cancelled" && (
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-foreground">
              Subscription Cancelled
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Your subscription will not renew. Your account has transitioned to the Free local tier. Your tasks and timer remain forever accessible.
            </p>
          </div>
          <Link
            href="/pomodoro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider"
          >
            Return to Console
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
