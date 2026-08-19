import { useState } from "react";
import { User as UserIcon, LogOut, Loader2, CheckSquare, BarChart3, Timer, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/services/task.service";
import { useHabits } from "@/services/habit.service";
import { useFocusSessions } from "@/services/focus-session.service";
import { formatDuration, formatDayLabel } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password);
    } catch (err) {
      setError(err?.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };
  return <div className="bg-gray-800 rounded-3xl border border-gray-700 p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center mb-3">
          <UserIcon className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {mode === "login" ? "Sign in to sync your data across devices" : "Sign up to sync your data across devices"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Email</Label>
          <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="bg-gray-900 border-gray-700 text-white"
  />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-gray-300">Password</Label>
          <Input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    minLength={6}
    className="bg-gray-900 border-gray-700 text-white"
  />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Sign In" : "Sign Up"}
        </Button>
        <button
    type="button"
    onClick={() => {
      setMode(mode === "login" ? "signup" : "login");
      setError(null);
    }}
    className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300"
  >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>;
}
function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: tasks } = useTasks({ status: "completed" });
  const { data: habits } = useHabits();
  const { data: sessions } = useFocusSessions();
  if (!user) {
    return <AuthForm />;
  }
  const totalFocusSeconds = (sessions ?? []).filter((s) => s.status === "completed").reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalSessions = (sessions ?? []).filter((s) => s.status === "completed").length;
  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();
  return <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white mb-3">
          {initials}
        </div>
        <h1 className="text-2xl font-bold">{user.email ?? "ZenPulse User"}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mt-2">
          {user.email && <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>}
          {user.createdAt && <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Joined {formatDayLabel(user.createdAt.slice(0, 10))}
            </span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 text-center">
          <CheckSquare className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{(tasks ?? []).length}</div>
          <div className="text-xs text-gray-400 mt-1">Tasks Completed</div>
        </div>
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 text-center">
          <BarChart3 className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{(habits ?? []).length}</div>
          <div className="text-xs text-gray-400 mt-1">Habits</div>
        </div>
        <div className="bg-gray-800 rounded-3xl border border-gray-700 p-5 text-center">
          <Timer className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold font-mono">{formatDuration(totalFocusSeconds)}</div>
          <div className="text-xs text-gray-400 mt-1">{totalSessions} Sessions</div>
        </div>
      </div>

      <Button
    onClick={() => signOut()}
    variant="ghost"
    className="w-full rounded-2xl border border-gray-700 text-red-400 hover:text-red-300 hover:bg-red-400/10 py-6"
  >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>;
}
export {
  ProfilePage as default
};
