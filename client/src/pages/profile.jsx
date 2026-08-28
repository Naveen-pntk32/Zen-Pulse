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
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/services/task.service";
import { useHabits } from "@/services/habit.service";
import { useFocusSessions } from "@/services/focus-session.service";
import { formatDuration, formatDayLabel } from "@/lib/date";

/* ------------------------------------------------------------------ */
/* Auth Form — TickTick brand styled                                   */
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
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4"
      id="auth-page"
    >
      <div className="w-full max-w-sm">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--brand-blue)" }}
          >
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {mode === "login"
              ? "Sign in to sync your data across devices"
              : "Start tracking your focus & habits"}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-modal)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="auth-email"
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--input-border)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
                onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="auth-password"
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-150 pr-10"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--input-border)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--brand-blue)")}
                  onBlur={(e)  => (e.target.style.borderColor = "var(--input-border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                  tabIndex={-1}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error / Success messages */}
            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(71,114,250,0.1)", color: "var(--brand-blue)" }}>
                {success}
              </p>
            )}

            {/* Submit */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={busy}
              className="btn-pill btn-primary w-full flex items-center justify-center gap-2 text-sm font-semibold"
              style={{
                opacity: busy ? 0.7 : 1,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Mode switch */}
          <div className="text-center pt-1">
            <button
              id="auth-mode-switch"
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setSuccess(null); }}
              className="text-sm transition-colors duration-150"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--brand-blue)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
              {mode === "login"
                ? "Don't have an account? Sign up →"
                : "Already have an account? Sign in →"}
            </button>
          </div>
        </div>

        {/* Tagline below card */}
        <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
          Focus · Track · Grow with ZenPulse
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card helper                                                    */
/* ------------------------------------------------------------------ */
function StatCard({ icon: Icon, iconColor, value, label }) {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
      }}
    >
      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: iconColor }} />
      <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
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
    <div className="max-w-xl mx-auto animate-fade-in" id="profile-page">

      {/* Avatar + identity */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
          style={{ background: "var(--brand-blue)" }}
        >
          {initials}
        </div>
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {user.email ?? "ZenPulse User"}
        </h1>
        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          {user.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>
          )}
          {user.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Joined {formatDayLabel(user.createdAt.slice(0, 10))}
            </span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard
          icon={CheckSquare}
          iconColor="var(--brand-blue)"
          value={(tasks ?? []).length}
          label="Tasks Done"
        />
        <StatCard
          icon={Activity}
          iconColor="#22c55e"
          value={(habits ?? []).length}
          label="Habits"
        />
        <StatCard
          icon={Timer}
          iconColor="var(--brand-amber)"
          value={formatDuration(totalFocusSeconds)}
          label={`${totalSessionCount} Sessions`}
        />
      </div>

      {/* Logout */}
      <button
        id="profile-logout-btn"
        onClick={() => signOut()}
        className="w-full rounded-xl py-3 text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
        style={{
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          background: "transparent",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  );
}

export { ProfilePage as default };
