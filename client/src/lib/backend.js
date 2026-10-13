import supabase from "@/config/supabase";

let backend = "local";
let probePromise = null;

async function probeBackendHealth() {
  if (!probePromise) {
    probePromise = (async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          return data.status === "ok";
        }
      } catch {
        // Fall back to direct supabase probe if local API server is unreachable
      }

      try {
        const { error } = await supabase.from("task_lists").select("id").limit(1);
        return !error;
      } catch {
        return false;
      }
    })();
  }
  return probePromise;
}

async function refreshBackend(userId) {
  if (!userId) {
    backend = "local";
    return backend;
  }
  const ok = await probeBackendHealth();
  backend = ok ? "api" : "local";
  return backend;
}

function getBackend() {
  return backend;
}

function isBackendActive() {
  return backend === "api" || backend === "supabase";
}

function isSupabase() {
  return isBackendActive();
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

let currentUserId = null;

function setCurrentUserId(id) {
  currentUserId = id;
}

function getCurrentUserIdSync() {
  return currentUserId;
}

export {
  getBackend,
  getCurrentUserIdSync,
  isBackendActive,
  isSupabase,
  makeId,
  probeBackendHealth as probeSupabase,
  refreshBackend,
  setCurrentUserId,
};
