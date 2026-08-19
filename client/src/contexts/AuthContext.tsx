import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import supabase from '@/config/supabase';
import { getBackend, refreshBackend, setCurrentUserId, Backend } from '@/lib/backend';
import { taskListService } from '@/services/task-list.service';
import { settingsService } from '@/services/settings.service';
import { migrateLocalToSupabase } from '@/services/migrate';
import { applyTheme } from '@/contexts/theme';

export interface AuthUser {
  id: string;
  email?: string;
  createdAt?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  backend: Backend;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function bootstrapDefaults(user: AuthUser | null) {
  try {
    const [, settings] = await Promise.all([
      taskListService.ensureDefaults(user?.id ?? null),
      settingsService.ensureDefaults(user?.id ?? null),
    ]);
    applyTheme(settings.theme ?? 'dark');
  } catch (error) {
    console.error('Bootstrap defaults failed:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [backend, setBackend] = useState<Backend>(getBackend());

  const runBootstrap = useCallback(async (u: AuthUser | null) => {
    setCurrentUserId(u?.id ?? null);
    const resolved = await refreshBackend(u?.id ?? null);
    setBackend(resolved);
    if (u && resolved === 'supabase') {
      try {
        await migrateLocalToSupabase(u.id);
      } catch (error) {
        console.warn('Local data migration failed:', error);
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

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
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
    [user, loading, backend, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
