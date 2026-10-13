import { useState } from "react";
import {
  User as UserIcon,
  LogOut,
  Loader2,
  CheckSquare,
  Activity,
  Timer,
  Mail,
  Calendar,
  Zap,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/services/task.service";
import { useHabits } from "@/services/habit.service";
import { useFocusSessions } from "@/services/focus-session.service";
import { formatDuration, formatDayLabel } from "@/lib/date";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* Auth Form — Greptile styled                                         */
/* ------------------------------------------------------------------ */
function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode]       = useState("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);
  const [busy, setBusy]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setSuccess("Account created! Check your email to confirm, then sign in.");
      }
    } catch (err) {
      setError(err?.message ?? "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center p-4"
      id="auth-page"
    >
      <div className="w-full max-w-sm space-y-6">

        {/* Logo + heading */}
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-[6px] bg-greptile-green flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(40,233,159,0.35)]"
          >
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
            {mode === "login" ? "ACCESS PACE" : "INITIALIZE ACCOUNT"}
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
            {mode === "login"
              ? "AUTHENTICATE FOR CROSS-DEVICE SYNC"
              : "COMMENCE FOCUS & HABIT TRACKING"}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[8px] p-6 space-y-4 bg-surface-raised border border-border shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="auth-email"
                className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold"
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="developer@pace.app"
                className="w-full px-3 py-2 rounded-[4px] text-xs font-sans bg-surface border border-input-border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-greptile-green focus:ring-1 focus:ring-greptile-green/40 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="auth-password"
                className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold"
              >
                Password Key
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-[4px] text-xs font-sans bg-surface border border-input-border text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-greptile-green focus:ring-1 focus:ring-greptile-green/40 transition-colors pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error / Success messages */}
            {error && (
              <p className="text-xs font-mono p-2.5 rounded-[4px] bg-bloom/10 border border-bloom/40 text-bloom">
                [ERROR]: {error}
              </p>
            )}
            {success && (
              <p className="text-xs font-mono p-2.5 rounded-[4px] bg-greptile-green/10 border border-greptile-green/40 text-greptile-green">
                [SUCCESS]: {success}
              </p>
            )}

            {/* Submit */}
            <Button
              id="auth-submit-btn"
              type="submit"
              disabled={busy}
              variant="default"
              size="lg"
              className="w-full mt-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              <span>{mode === "login" ? "AUTHENTICATE" : "REGISTER ACCOUNT"}</span>
            </Button>
          </form>

          {/* Mode switch */}
          <div className="text-center pt-2 border-t border-border/40">
            <button
              id="auth-mode-switch"
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setSuccess(null); }}
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-greptile-green transition-colors"
            >
              {mode === "login"
                ? "NO ACCOUNT? CREATE ONE →"
                : "HAVE AN ACCOUNT? SIGN IN →"}
            </button>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
          // PACE ENGINE v2.0 // MAKE ROOM FOR FOCUSED WORK
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card helper                                                    */
/* ------------------------------------------------------------------ */
function StatCard({ icon: Icon, colorClass, value, label }) {
  return (
    <div
      className="rounded-[6px] p-4 text-center bg-surface border border-border/80 shadow-sm space-y-1"
    >
      <Icon className={`w-4 h-4 mx-auto ${colorClass}`} />
      <div className="text-xl font-bold font-mono tracking-tight text-foreground">
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile page (authenticated state)                                  */
/* ------------------------------------------------------------------ */
function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: tasks }    = useTasks({ status: "completed" });
  const { data: habits }   = useHabits();
  const { data: sessions } = useFocusSessions();

  if (!user) return <AuthForm />;

  const completedSessions  = (sessions ?? []).filter((s) => s.status === "completed");
  const totalFocusSeconds  = completedSessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalSessionCount  = completedSessions.length;
  const initials           = (user.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in" id="profile-page">
      {/* Header Banner */}
      <div className="pb-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold font-display flex items-center gap-2.5 text-foreground">
            <UserIcon className="w-5 h-5 text-greptile-green" />
            User Identity
          </h1>
          <span className="badge-tech badge-tech-green">
            AUTHENTICATED
          </span>
        </div>
      </div>

      {/* Identity Card */}
      <div className="p-6 rounded-[8px] bg-surface-raised border border-border text-center space-y-3">
        <div
          className="w-16 h-16 mx-auto rounded-[6px] flex items-center justify-center text-xl font-bold font-mono bg-greptile-green text-black shadow-[0_0_16px_rgba(40,233,159,0.35)]"
        >
          {initials}
        </div>
        <div>
          <h2 className="text-base font-bold font-display text-foreground">
            {user.email ?? "Pace User"}
          </h2>
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground mt-1">
            {user.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
            )}
            {user.createdAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatDayLabel(user.createdAt.slice(0, 10))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={CheckSquare}
          colorClass="text-sky"
          value={(tasks ?? []).length}
          label="Tasks Done"
        />
        <StatCard
          icon={Activity}
          colorClass="text-greptile-green"
          value={(habits ?? []).length}
          label="Habits"
        />
        <StatCard
          icon={Timer}
          colorClass="text-neon"
          value={formatDuration(totalFocusSeconds)}
          label={`${totalSessionCount} Sessions`}
        />
      </div>

      {/* Cloud Sync Status */}
      <div className="p-4 rounded-[6px] border border-border/60 bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-greptile-green" />
          <div>
            <div className="text-xs font-bold font-sans text-foreground">Supabase Cloud Sync Active</div>
            <div className="text-[10px] font-mono text-muted-foreground">Session state synced across devices</div>
          </div>
        </div>
        <span className="badge-tech badge-tech-green text-[9px]">
          ONLINE
        </span>
      </div>

      {/* Logout */}
      <Button
        id="profile-logout-btn"
        variant="destructive"
        size="lg"
        onClick={() => signOut()}
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        <span>SIGN OUT FROM PACE</span>
      </Button>
    </div>
  );
}

export { ProfilePage as default };
