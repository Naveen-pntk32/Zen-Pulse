import { api } from "@/lib/api";
import { getBackend, getCurrentUserIdSync, makeId } from "@/lib/backend";
import { localDb } from "@/lib/local-db";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const aiService = {
  async getDailyBriefing() {
    if (getBackend() !== "local") {
      try {
        const data = await api.get("/ai/briefing");
        if (data && data.briefing) {
          return data;
        }
      } catch (err) {
        console.warn("[AIService] API briefing failed, calculating locally:", err);
      }
    }

    // Local heuristic fallback
    const tasks = localDb.getTasks().filter((t) => t.status === "pending");
    const habits = localDb.getHabits().filter((h) => !h.archived);
    const today = new Date().toISOString().slice(0, 10);
    const sessions = localDb.getFocusSessions().filter((s) => s.date === today);

    const highPriorityCount = tasks.filter((t) => t.priority === "high").length;
    const completedMinutes = Math.round(
      sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
    );

    let briefing = "";
    if (tasks.length === 0) {
      briefing = "All tasks cleared! Great opportunity to build streak momentum or plan upcoming milestones.";
    } else if (highPriorityCount > 0) {
      briefing = `You have ${highPriorityCount} high-priority tasks waiting. Focus on your top priority during your next 25-minute Pomodoro.`;
    } else {
      briefing = `You have ${tasks.length} active tasks queued. Initiate a deep-work sprint to maintain high momentum today.`;
    }

    return {
      date: today,
      stats: {
        pendingTasks: tasks.length,
        highPriorityTasks: highPriorityCount,
        activeHabits: habits.length,
        focusedMinutesToday: completedMinutes,
      },
      briefing,
    };
  },

  async decomposeTask(taskId) {
    if (getBackend() !== "local") {
      try {
        const data = await api.post("/ai/decompose", { taskId });
        return data;
      } catch (err) {
        console.warn("[AIService] API decompose failed, generating local fallback:", err);
      }
    }

    // Local heuristic fallback
    const task = localDb.getTasks().find((t) => t.id === taskId);
    const title = task?.title || "Task";
    const subtaskTitles = [
      `Phase 1: Clarify architecture and scope for "${title}"`,
      `Phase 2: Implement core action items`,
      `Phase 3: QA review and validation`,
    ];

    const generated = subtaskTitles.map((stTitle, idx) => {
      const item = {
        id: makeId(),
        taskId,
        userId: getCurrentUserIdSync(),
        title: stTitle,
        completed: false,
        position: idx,
        createdAt: new Date().toISOString(),
      };
      localDb.saveSubtask(item);
      return item;
    });

    return {
      taskId,
      taskTitle: title,
      source: "local-heuristic",
      subtasks: generated,
    };
  },
};

export function useDailyBriefing() {
  return useQuery({
    queryKey: ["ai", "briefing"],
    queryFn: () => aiService.getDailyBriefing(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDecomposeTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId) => aiService.decomposeTask(taskId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", data?.taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
