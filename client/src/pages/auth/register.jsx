import { useState } from "react";
import { Link, useLocation } from "wouter";
import { UserPlus, Github, Mail, AlertTriangle, Check, ShieldCheck } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      setLocation("/onboarding");
    } catch (err) {
      setError(err?.message || "Registration failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Workspace"
      subtitle="Start your distraction-free deep work journey."
      backTo="/"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-[4px] border border-red-500/30 bg-red-500/10 text-xs text-red-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-muted-foreground">
            Work Email
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

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
          />

          {/* Password strength meter */}
          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="w-full bg-surface-raised h-1.5 rounded-full overflow-hidden border border-border/40">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength <= 25
                      ? "bg-red-500 w-1/4"
                      : strength <= 50
                      ? "bg-amber-500 w-2/4"
                      : strength <= 75
                      ? "bg-blue-400 w-3/4"
                      : "bg-greptile-green w-full"
                  }`}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Password Complexity</span>
                <span className={strength === 100 ? "text-greptile-green font-bold" : ""}>
                  {strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Terms acceptance */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 accent-greptile-green rounded mt-0.5 shrink-0"
            />
            <span className="font-sans leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-greptile-green hover:underline">
                Terms of Service
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy" className="text-greptile-green hover:underline">
                Privacy Policy
              </Link>.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
        >
          {loading ? "Creating Workspace..." : (
            <>
              <UserPlus className="w-3.5 h-3.5" /> Create Workspace
            </>
          )}
        </button>

        <div className="text-center pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-greptile-green hover:underline font-bold">
            Sign In →
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
