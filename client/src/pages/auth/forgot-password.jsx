import { useState } from "react";
import { Link } from "wouter";
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your verified email to receive a secure recovery token."
      backTo="/login"
    >
      {submitted ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-foreground">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              If an active account exists for <span className="text-foreground font-mono">{email}</span>, you will receive password reset instructions within 2 minutes.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-greptile-green hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              Account Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@pace.app"
              className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
          >
            {loading ? "Transmitting..." : (
              <>
                <Mail className="w-3.5 h-3.5" /> Send Reset Link
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
