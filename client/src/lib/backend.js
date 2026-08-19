import supabase from "@/config/supabase";
let backend = "local";
let probePromise = null;
async function probeSupabase() {
  if (!probePromise) {
    probePromise = (async () => {
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
  const ok = await probeSupabase();
  backend = ok ? "supabase" : "local";
  return backend;
}
function getBackend() {
  return backend;
}
function isSupabase() {
  return backend === "supabase";
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
  isSupabase,
  makeId,
  probeSupabase,
  refreshBackend,
  setCurrentUserId
};
