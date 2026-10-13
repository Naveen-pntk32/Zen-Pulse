import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Ensure your new password contains at least 8 characters."
      backTo="/login"
    >
      {submitted ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-greptile-green/20 text-greptile-green flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-display font-bold text-foreground">
              Password Updated
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Your credentials have been securely updated. You can now access your Pace console.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-greptile-green text-black font-mono text-xs font-bold uppercase tracking-wider"
            >
              Sign In Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-[4px] border border-red-500/30 bg-red-500/10 text-xs text-red-400 font-mono">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              New Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
          >
            {loading ? "Updating..." : (
              <>
                <Lock className="w-3.5 h-3.5" /> Save New Password
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
