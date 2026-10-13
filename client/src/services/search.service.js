import { api } from "@/lib/api";
import { localDb } from "@/lib/local-db";
import { getBackend } from "@/lib/backend";
import { useQuery } from "@tanstack/react-query";

const searchService = {
  async search(query) {
    const q = query.trim();
    if (!q) return { tasks: [], habits: [] };

    if (getBackend() !== "local") {
      try {
        const data = await api.get(`/search?q=${encodeURIComponent(q)}`);
        return data;
      } catch (err) {
        console.warn("[SearchService] API search failed, falling back to localDb:", err);
      }
    }

    const lowerQ = q.toLowerCase();
    const tasks = localDb.getTasks();
    const habits = localDb.getHabits();

    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(lowerQ)),
      habits: habits.filter((h) => h.name.toLowerCase().includes(lowerQ)),
    };
  },
};

function useSearch(query) {
  return useQuery({
    queryKey: ["search", query.trim().toLowerCase()],
    queryFn: () => searchService.search(query),
    enabled: query.trim().length > 0,
  });
}

export {
  searchService,
  useSearch,
};
