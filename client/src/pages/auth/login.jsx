import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LogIn, Github, Mail, AlertTriangle, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      setLocation("/pomodoro");
    } catch (err) {
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Access pace."
      subtitle="Enter your credentials to access your deep work console."
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-mono text-greptile-green hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3 py-2.5 rounded-[4px] border border-border bg-surface text-xs font-mono text-foreground focus:border-greptile-green focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-greptile-green rounded"
            />
            <span>Remember session</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(40,233,159,0.3)] disabled:opacity-50"
        >
          {loading ? "Authenticating..." : (
            <>
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </>
          )}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-surface-raised px-2 text-muted-foreground">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setEmail("demo@pace.app");
              setPassword("password123");
            }}
            className="py-2 px-3 rounded-[4px] border border-border bg-surface hover:bg-surface-hover text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <Github className="w-3.5 h-3.5" /> GitHub
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("demo@pace.app");
              setPassword("password123");
            }}
            className="py-2 px-3 rounded-[4px] border border-border bg-surface hover:bg-surface-hover text-xs font-mono text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Google
          </button>
        </div>

        <div className="text-center pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
          Don&apos;t have a workspace yet?{" "}
          <Link href="/register" className="text-greptile-green hover:underline font-bold">
            Create an Account →
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
