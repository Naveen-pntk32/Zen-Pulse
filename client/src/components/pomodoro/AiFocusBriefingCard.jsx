import { Sparkles, BrainCircuit, RefreshCw, CheckCircle2, Flame, Target } from "lucide-react";
import { useDailyBriefing } from "@/services/ai.service";
import { cn } from "@/lib/utils";

export function AiFocusBriefingCard() {
  const { data: briefing, isLoading, refetch, isRefetching } = useDailyBriefing();

  return (
    <div className="rounded-[8px] border border-greptile-green/30 bg-surface-raised/90 p-5 mb-6 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
      {/* Subtle green ambient accent glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-greptile-green/5 blur-2xl rounded-full pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-greptile-green/10 border border-greptile-green/30 flex items-center justify-center text-greptile-green">
            <BrainCircuit className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-semibold tracking-wider text-greptile-green uppercase">
            // AI DEEP-WORK BRIEFING
          </span>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-[3px] hover:bg-surface text-xs flex items-center gap-1 font-mono"
          title="Refresh briefing"
        >
          <RefreshCw className={cn("w-3 h-3", isRefetching && "animate-spin text-greptile-green")} />
        </button>
      </div>

      {/* Briefing Recommendation */}
      <div className="mt-3.5">
        {isLoading ? (
          <div className="h-10 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-greptile-green" />
            Analyzing daily workload and focus rhythms...
          </div>
        ) : (
          <p className="text-xs text-foreground/90 font-sans leading-relaxed">
            {briefing?.briefing || "Plan your deep focus blocks and execute without interruption."}
          </p>
        )}
      </div>

      {/* Micro Stats Bar */}
      {briefing?.stats && (
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/30">
          <div className="bg-surface/80 rounded-[4px] p-2 border border-border/40 flex flex-col">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <Target className="w-2.5 h-2.5 text-sky" />
              PENDING
            </div>
            <span className="text-sm font-bold font-mono text-foreground mt-0.5">
              {briefing.stats.pendingTasks}
            </span>
          </div>

          <div className="bg-surface/80 rounded-[4px] p-2 border border-border/40 flex flex-col">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <Flame className="w-2.5 h-2.5 text-coral" />
              HIGH PRIO
            </div>
            <span className="text-sm font-bold font-mono text-foreground mt-0.5">
              {briefing.stats.highPriorityTasks}
            </span>
          </div>

          <div className="bg-surface/80 rounded-[4px] p-2 border border-border/40 flex flex-col">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <CheckCircle2 className="w-2.5 h-2.5 text-greptile-green" />
              FOCUSED
            </div>
            <span className="text-sm font-bold font-mono text-foreground mt-0.5">
              {briefing.stats.focusedMinutesToday}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
