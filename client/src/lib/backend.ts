import supabase from '@/config/supabase';

export type Backend = 'supabase' | 'local';

let backend: Backend = 'local';
let probePromise: Promise<boolean> | null = null;

export async function probeSupabase(): Promise<boolean> {
  if (!probePromise) {
    probePromise = (async () => {
      try {
        const { error } = await supabase.from('task_lists').select('id').limit(1);
        return !error;
      } catch {
        return false;
      }
    })();
  }
  return probePromise;
}

/**
 * Resolve the active backend. A user must be authenticated AND the Supabase
 * tables must exist for the app to use Supabase; otherwise it falls back to
 * localStorage so the app always works.
 */
export async function refreshBackend(userId: string | null): Promise<Backend> {
  if (!userId) {
    backend = 'local';
    return backend;
  }
  const ok = await probeSupabase();
  backend = ok ? 'supabase' : 'local';
  return backend;
}

export function getBackend(): Backend {
  return backend;
}

export function isSupabase(): boolean {
  return backend === 'supabase';
}

export function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Synchronous current-user tracking (set by AuthProvider) so services can build
// query keys / pass user_id without importing the auth context (avoids cycles).
let currentUserId: string | null = null;

export function setCurrentUserId(id: string | null) {
  currentUserId = id;
}

export function getCurrentUserIdSync(): string | null {
  return currentUserId;
}
