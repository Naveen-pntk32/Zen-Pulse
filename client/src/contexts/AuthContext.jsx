import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import supabase from "@/config/supabase";
import { getBackend, refreshBackend, setCurrentUserId } from "@/lib/backend";
import { taskListService } from "@/services/task-list.service";
import { settingsService } from "@/services/settings.service";
import { migrateLocalToSupabase } from "@/services/migrate";
import { applyTheme } from "@/contexts/theme";
const AuthContext = createContext(null);
async function bootstrapDefaults(user) {
  try {
    const [, settings] = await Promise.all([
      taskListService.ensureDefaults(user?.id ?? null),
      settingsService.ensureDefaults(user?.id ?? null)
    ]);
    applyTheme(settings.theme ?? "dark");
  } catch (error) {
    console.error("Bootstrap defaults failed:", error);
  }
}
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState(getBackend());
  const runBootstrap = useCallback(async (u) => {
    setCurrentUserId(u?.id ?? null);
    const resolved = await refreshBackend(u?.id ?? null);
    setBackend(resolved);
    if (u && resolved === "supabase") {
      try {
        await migrateLocalToSupabase(u.id);
      } catch (error) {
        console.warn("Local data migration failed:", error);
      }
    }
    await bootstrapDefaults(u);
  }, []);
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const sessionUser = data.session?.user ?? null;
      const u = sessionUser ? { id: sessionUser.id, email: sessionUser.email, createdAt: sessionUser.created_at } : null;
      setUser(u);
      await runBootstrap(u);
      setLoading(false);
    })();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      const u = sessionUser ? { id: sessionUser.id, email: sessionUser.email, createdAt: sessionUser.created_at } : null;
      setUser(u);
      await runBootstrap(u);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [runBootstrap]);
  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);
  const signUp = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    await runBootstrap(null);
  }, [runBootstrap]);
  const value = useMemo(
    () => ({ user, loading, backend, signIn, signUp, signOut }),
    [user, loading, backend, signIn, signUp, signOut]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
export {
  AuthProvider,
  useAuthContext
};
