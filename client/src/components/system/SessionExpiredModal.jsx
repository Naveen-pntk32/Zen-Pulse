import { useState, useEffect } from "react";
import { Lock, LogIn, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, signIn } = useAuth();

  useEffect(() => {
    const handleExpired = () => {
      // Capture any active textarea or input values into sessionStorage to preserve work
      try {
        const activeInputs = Array.from(
          document.querySelectorAll("input:not([type=password]), textarea")
        ).map((el) => ({
          id: el.id || el.name,
          value: el.value,
        }));
        sessionStorage.setItem("pace_preserved_form_state", JSON.stringify(activeInputs));
      } catch (e) {
        console.warn("Could not cache form state:", e);
      }
      setOpen(true);
    };

    window.addEventListener("pace:session-expired", handleExpired);
    return () => window.removeEventListener("pace:session-expired", handleExpired);
  }, []);

  if (!open) return null;

  const handleReAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (user?.email) {
        await signIn(user.email, password);
      }
      setOpen(false);
      // Restore cached form values if present
      try {
        const cached = sessionStorage.getItem("pace_preserved_form_state");
        if (cached) {
          const inputs = JSON.parse(cached);
          inputs.forEach(({ id, value }) => {
            if (id) {
              const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
              if (el) el.value = value;
            }
          });
        }
      } catch (e) {
        console.warn("Could not restore form state:", e);
      }
    } catch (err) {
      setError(err?.message || "Re-authentication failed. Please check your credentials.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md rounded-[8px] border border-border bg-surface-raised p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Lock className="w-4 h-4" />
            <span>// SECURITY INTERCEPTOR</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded-[3px] text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-foreground">
            Session Expired
          </h2>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Your authenticated session token has expired. Your current form state has been safely saved in local memory. Enter your credentials to resume without losing any work.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-[4px] border border-red-500/30 bg-red-500/10 text-xs text-red-400 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleReAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              Account Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || "developer@pace.app"}
              className="w-full px-3 py-2 rounded-[4px] border border-border bg-surface text-xs font-mono text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-[4px] border border-border focus:border-greptile-green focus:outline-none bg-surface text-xs font-mono text-foreground"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.location.href = "/profile";
              }}
              className="px-3 py-2 rounded-[4px] border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              Sign In with Another Account
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-[4px] bg-greptile-green hover:bg-[#34f5ab] text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(40,233,159,0.25)]"
            >
              <LogIn className="w-3.5 h-3.5" /> Re-Authenticate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SessionExpiredModal;
