import { taskService } from "@/services/task.service";
import { habitService } from "@/services/habit.service";
import { useQuery } from "@tanstack/react-query";
const searchService = {
  async search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return { tasks: [], habits: [] };
    const [tasks, habits] = await Promise.all([
      taskService.getAll(),
      habitService.getAll()
    ]);
    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)),
      habits: habits.filter((h) => h.name.toLowerCase().includes(q))
    };
  }
};
function useSearch(query) {
  return useQuery({
    queryKey: ["search", query.trim().toLowerCase()],
    queryFn: () => searchService.search(query),
    enabled: query.trim().length > 0
  });
}
export {
  searchService,
  useSearch
};
