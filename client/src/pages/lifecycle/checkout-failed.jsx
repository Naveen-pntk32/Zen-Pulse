import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AlertCircle, CreditCard, RefreshCw, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function CheckoutFailedPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleRetry = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLocation("/checkout/success");
    }, 1000);
  };

  return (
    <AuthLayout
      title="Payment Declined"
      subtitle="Your card issuer declined the transaction."
      backTo="/settings"
    >
      <form onSubmit={handleRetry} className="space-y-6 font-sans">
        <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="p-4 rounded-[6px] border border-red-500/30 bg-red-500/10 text-xs text-red-300 space-y-1 text-left font-mono">
          <div className="font-bold">// DECLINE CODE: DO_NOT_HONOR</div>
          <p className="text-[11px] text-red-200/80 font-sans">
            Your financial institution declined the automated charge. Common reasons include bank international fraud prevention, insufficient funds, or an expired card.
          </p>
        </div>

        {/* Card Updater Input */}
        <div className="space-y-3 text-left">
          <label className="text-[11px] font-mono uppercase text-muted-foreground">
            Update Payment Card &amp; Retry
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter new card number"
              className="w-full pl-9 pr-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)] disabled:opacity-50"
          >
            {loading ? "Re-authorizing..." : (
              <>
                <RefreshCw className="w-3.5 h-3.5" /> Retry Payment
              </>
            )}
          </button>

          <Link
            href="/pomodoro"
            className="w-full py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          >
            Continue with Free Local Mode
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
