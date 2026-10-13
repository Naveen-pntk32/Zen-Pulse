import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sparkles, Check, CreditCard, Shield, Lock, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function UpgradePage() {
  const [, setLocation] = useLocation();
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCheckout = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation("/checkout/success");
    }, 1200);
  };

  return (
    <AuthLayout
      title="Upgrade to pace. Pro"
      subtitle="Unlock AI deep work intelligence and continuous multi-device cloud sync."
      backTo="/settings"
    >
      <form onSubmit={handleCheckout} className="space-y-6 font-sans">
        {/* Tier Summary Card */}
        <div className="p-4 rounded-[6px] border border-greptile-green/40 bg-surface space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-greptile-green font-bold">
                PACE PRO TIER
              </span>
              <div className="text-2xl font-display font-bold text-foreground">
                {annual ? "$10" : "$12"}{" "}
                <span className="text-xs font-mono text-muted-foreground font-normal">
                  / month
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded-[2px] bg-greptile-green/15 text-greptile-green text-[10px] font-mono font-bold">
                {annual ? "BILLED ANNUALLY" : "BILLED MONTHLY"}
              </span>
              <p className="text-[10px] text-muted-foreground mt-1">
                {annual ? "$120 billed today" : "$12 billed today"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-3.5 h-3.5 text-greptile-green shrink-0" />
              <span>Unlimited Multi-Device Cloud Sync (Supabase PostgreSQL)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-3.5 h-3.5 text-greptile-green shrink-0" />
              <span>AI Task Decomposition &amp; Cognitive Load Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-3.5 h-3.5 text-greptile-green shrink-0" />
              <span>Unlimited Habit Streaks &amp; Velocity Telemetry</span>
            </div>
          </div>
        </div>

        {/* Payment Simulation Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
            <span>Payment Method</span>
            <span className="flex items-center gap-1 text-greptile-green">
              <Lock className="w-3 h-3" /> Stripe 256-Bit TLS
            </span>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                defaultValue="4242 •••• •••• 4242"
                placeholder="Card Number"
                className="w-full pl-9 pr-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                defaultValue="12/28"
                placeholder="MM/YY"
                className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
              />
              <input
                type="text"
                required
                defaultValue="888"
                placeholder="CVC"
                className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
        >
          {loading ? "Processing Encryption..." : (
            <>
              Activate Pro Cockpit <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-muted-foreground font-sans">
          Includes our 14-day unconditional money-back guarantee. Cancel anytime in Settings.
        </p>
      </form>
    </AuthLayout>
  );
}
