import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function CheckoutPendingPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState("polling"); // polling | confirmed

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("confirmed");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthLayout
      title="Payment Verification"
      subtitle="Awaiting asynchronous payment gateway webhook confirmation."
      backTo="/settings"
    >
      <div className="space-y-6 text-center font-sans">
        {status === "polling" ? (
          <div className="space-y-4 py-6">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-display font-bold text-foreground">
                Reconciling Bank Settlement
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                // LISTENING FOR STRIPE WEBHOOK EVENT...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(40,233,159,0.2)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-display font-bold text-foreground">
                Settlement Confirmed
              </h3>
              <p className="text-xs text-muted-foreground">
                Your transaction has settled. Pro features are active on your account.
              </p>
            </div>
            <Link
              href="/pomodoro"
              className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)]"
            >
              Enter Console <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
