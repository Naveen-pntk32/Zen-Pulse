import { eq, and } from "drizzle-orm";
import { getDb } from "../config/database.js";
import { tasks, subtasks, habits, focusSessions } from "../db/schema.js";

interface DecomposeItem {
  title: string;
  estimatedMinutes?: number;
}

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!response.ok) return null;
    const json: any = await response.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    console.warn("[AI Service] Gemini API call failed:", error);
    return null;
  }
}

function heuristicDecomposition(title: string): DecomposeItem[] {
  const lower = title.toLowerCase();
  if (lower.includes("build") || lower.includes("develop") || lower.includes("create") || lower.includes("app") || lower.includes("website")) {
    return [
      { title: `Architect requirements and specifications for "${title}"`, estimatedMinutes: 25 },
      { title: "Set up component layout and data schema", estimatedMinutes: 30 },
      { title: "Implement core user interaction flow", estimatedMinutes: 45 },
      { title: "Perform edge-case testing and QA review", estimatedMinutes: 20 },
      { title: "Deploy and review final deliverable", estimatedMinutes: 15 },
    ];
  }

  if (lower.includes("read") || lower.includes("study") || lower.includes("learn") || lower.includes("exam")) {
    return [
      { title: `Review foundational concepts for "${title}"`, estimatedMinutes: 20 },
      { title: "Take deep-work notes and extract key principles", estimatedMinutes: 35 },
      { title: "Practice active recall or sample exercises", estimatedMinutes: 25 },
      { title: "Summarize top 3 takeaways", estimatedMinutes: 15 },
    ];
  }

  if (lower.includes("write") || lower.includes("blog") || lower.includes("article") || lower.includes("doc")) {
    return [
      { title: `Outline core thesis and structure for "${title}"`, estimatedMinutes: 20 },
      { title: "Draft introduction and main argument blocks", estimatedMinutes: 40 },
      { title: "Review for clarity, flow, and conciseness", estimatedMinutes: 25 },
      { title: "Final proofread and publication", estimatedMinutes: 15 },
    ];
  }

  // Default breakdown
  return [
    { title: `Phase 1: Research and clarify goal for "${title}"`, estimatedMinutes: 20 },
    { title: `Phase 2: Execute core action block for "${title}"`, estimatedMinutes: 45 },
    { title: `Phase 3: Review progress and finalize output`, estimatedMinutes: 20 },
  ];
}

export const aiService = {
  async decomposeTask(userId: string, taskId: string) {
    const db = getDb();
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (!task) return null;

    let subtaskItems: DecomposeItem[] = [];
    let source = "heuristic";

    const prompt = `You are a high-performance productivity coach. Break down the task "${task.title}" (Description: "${task.description || 'None'}") into 3 to 5 clear, concrete, sequential actionable subtasks.
Respond in valid JSON with this exact structure:
{
  "subtasks": [
    { "title": "Subtask title here", "estimatedMinutes": 25 }
  ]
}`;

    const geminiResponse = await callGemini(prompt);
    if (geminiResponse) {
      try {
        const parsed = JSON.parse(geminiResponse);
        if (Array.isArray(parsed?.subtasks) && parsed.subtasks.length > 0) {
          subtaskItems = parsed.subtasks;
          source = "gemini";
        }
      } catch {
        // Fall back to heuristic
      }
    }

    if (subtaskItems.length === 0) {
      subtaskItems = heuristicDecomposition(task.title);
    }

    // Insert subtasks into DB
    const inserted: any[] = [];
    for (let i = 0; i < subtaskItems.length; i++) {
      const item = subtaskItems[i];
      const [res] = await db
        .insert(subtasks)
        .values({
          taskId,
          userId,
          title: item.title,
          completed: false,
          position: i,
        })
        .returning();
      inserted.push({
        id: res.id,
        taskId: res.taskId,
        title: res.title,
        completed: res.completed,
        position: res.position,
        estimatedMinutes: item.estimatedMinutes ?? 25,
        createdAt: res.createdAt.toISOString(),
      });
    }

    return {
      taskId,
      taskTitle: task.title,
      source,
      subtasks: inserted,
    };
  },

  async getDailyBriefing(userId: string) {
    const db = getDb();
    const today = new Date().toISOString().slice(0, 10);

    const [userTasks, userHabits, todaySessions] = await Promise.all([
      db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, "pending"))),
      db.select().from(habits).where(and(eq(habits.userId, userId), eq(habits.archived, false))),
      db.select().from(focusSessions).where(and(eq(focusSessions.userId, userId), eq(focusSessions.date, today))),
    ]);

    const highPriorityCount = userTasks.filter((t) => t.priority === "high").length;
    const completedMinutesToday = Math.round(
      todaySessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
    );

    let recommendation = "";
    if (userTasks.length === 0) {
      recommendation = "All tasks cleared. Perfect time to focus on daily habits or plan ahead.";
    } else if (highPriorityCount > 0) {
      recommendation = `You have ${highPriorityCount} high-priority tasks pending. Recommend a 45-minute deep focus block on your top priority.`;
    } else {
      recommendation = `You have ${userTasks.length} active tasks and ${userHabits.length} habits. A 25-minute Pomodoro session will build strong momentum today.`;
    }

    return {
      date: today,
      stats: {
        pendingTasks: userTasks.length,
        highPriorityTasks: highPriorityCount,
        activeHabits: userHabits.length,
        focusedMinutesToday: completedMinutesToday,
      },
      briefing: recommendation,
    };
  },
};
