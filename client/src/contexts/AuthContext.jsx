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
      settingsService.ensureDefaults(user?.id ?? null),
    ]);
    if (settings?.theme) {
      applyTheme(settings.theme);
    }
  } catch (error) {
    console.error("Bootstrap defaults failed:", error);
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState(getBackend());

  const runBootstrap = useCallback(async (u) => {
    try {
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
    } catch (err) {
      console.warn("runBootstrap error:", err);
    }
  }, []);

  useEffect(() => {
    let active = true;

    // Safety timeout: ensure loading screen NEVER blocks more than 1.5 seconds
    const safetyTimer = setTimeout(() => {
      if (active) setLoading(false);
    }, 1500);

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;

        const sessionUser = data?.session?.user ?? null;
        if (sessionUser) {
          const u = {
            id: sessionUser.id,
            email: sessionUser.email,
            createdAt: sessionUser.created_at,
          };
          setUser(u);
          runBootstrap(u).catch((err) => console.warn("Bootstrap error:", err));
        } else {
          // Fallback to local mock user if no Supabase session
          const mockUser = localStorage.getItem("pace_mock_user") || localStorage.getItem("zenpulse_mock_user");
          if (mockUser) {
            try {
              const u = JSON.parse(mockUser);
              setUser(u);
              runBootstrap(u).catch((err) => console.warn("Bootstrap error:", err));
            } catch {
              setUser(null);
              runBootstrap(null).catch((err) => console.warn("Bootstrap error:", err));
            }
          } else {
            setUser(null);
            runBootstrap(null).catch((err) => console.warn("Bootstrap error:", err));
          }
        }
      } catch (e) {
        console.warn("Auth getSession failed:", e);
        const mockUser = localStorage.getItem("pace_mock_user") || localStorage.getItem("zenpulse_mock_user");
        if (mockUser) {
          try {
            const u = JSON.parse(mockUser);
            setUser(u);
            runBootstrap(u).catch((err) => console.warn("Bootstrap error:", err));
          } catch {
            setUser(null);
            runBootstrap(null).catch((err) => console.warn("Bootstrap error:", err));
          }
        } else {
          setUser(null);
          runBootstrap(null).catch((err) => console.warn("Bootstrap error:", err));
        }
      } finally {
        if (active) {
          clearTimeout(safetyTimer);
          setLoading(false);
        }
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null;
      if (sessionUser) {
        const u = {
          id: sessionUser.id,
          email: sessionUser.email,
          createdAt: sessionUser.created_at,
        };
        setUser(u);
        runBootstrap(u).catch((err) => console.warn("Bootstrap error:", err));
      }
    });

    return () => {
      active = false;
      clearTimeout(safetyTimer);
      listener?.subscription?.unsubscribe();
    };
  }, [runBootstrap]);

  const signIn = useCallback(async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e) {
      if (e.message?.includes("fetch") || e.message?.includes("NetworkError") || e.name === "TypeError" || e.message?.includes("CORS")) {
        console.warn("Supabase auth unavailable. Using local mock auth.");
        const fakeUser = { id: "local-user-123", email, createdAt: new Date().toISOString() };
        localStorage.setItem("pace_mock_user", JSON.stringify(fakeUser));
        setUser(fakeUser);
        await runBootstrap(fakeUser);
        return;
      }
      throw e;
    }
  }, [runBootstrap]);

  const signUp = useCallback(async (email, password) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (e) {
      if (e.message?.includes("fetch") || e.message?.includes("NetworkError") || e.name === "TypeError" || e.message?.includes("CORS")) {
        console.warn("Supabase auth unavailable. Using local mock auth.");
        const fakeUser = { id: "local-user-123", email, createdAt: new Date().toISOString() };
        localStorage.setItem("pace_mock_user", JSON.stringify(fakeUser));
        setUser(fakeUser);
        await runBootstrap(fakeUser);
        return;
      }
      throw e;
    }
  }, [runBootstrap]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("pace_mock_user");
    localStorage.removeItem("zenpulse_mock_user");
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
