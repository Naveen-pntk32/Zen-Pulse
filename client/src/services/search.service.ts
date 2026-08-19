import { Task, Habit } from '@/types';
import { taskService } from '@/services/task.service';
import { habitService } from '@/services/habit.service';
import { useQuery } from '@tanstack/react-query';

export interface SearchResults {
  tasks: Task[];
  habits: Habit[];
}

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    const q = query.trim().toLowerCase();
    if (!q) return { tasks: [], habits: [] };

    const [tasks, habits] = await Promise.all([
      taskService.getAll(),
      habitService.getAll(),
    ]);

    return {
      tasks: tasks.filter((t) => t.title.toLowerCase().includes(q)),
      habits: habits.filter((h) => h.name.toLowerCase().includes(q)),
    };
  },
};

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query.trim().toLowerCase()],
    queryFn: () => searchService.search(query),
    enabled: query.trim().length > 0,
  });
}
