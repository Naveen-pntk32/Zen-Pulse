import { useState } from "react";
import { Link } from "wouter";
import { MailCheck, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Click the confirmation link sent to your inbox to activate cloud sync."
      backTo="/login"
    >
      <div className="text-center py-4 space-y-5 font-sans">
        <div className="w-14 h-14 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(40,233,159,0.2)]">
          <MailCheck className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            We sent a verification link to your registered email address. Please check your inbox and spam folders to verify your account.
          </p>
        </div>

        {resent && (
          <div className="p-3 rounded-[4px] border border-greptile-green/30 bg-greptile-green/10 text-xs font-mono text-greptile-green">
            // NEW VERIFICATION LINK TRANSMITTED
          </div>
        )}

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/pomodoro"
            className="w-full py-2.5 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
          >
            Continue in Local Mode <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleResend}
            className="w-full py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Resend Verification Email
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
