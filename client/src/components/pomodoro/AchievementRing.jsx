import { cn } from "@/lib/utils";

function AchievementRing({ percent, size = 88, stroke = 7 }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  
  const isComplete = percent >= 100;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="achievement-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isComplete ? "#28e99f" : "#28e99f"} />
            <stop offset="100%" stopColor={isComplete ? "#daff01" : "#71adff"} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(85, 83, 104, 0.25)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray="3 3"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#achievement-gradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-mono text-sm font-bold tracking-tight",
            isComplete ? "text-greptile-green" : "text-foreground"
          )}
        >
          {percent}%
        </span>
        <span className="text-[8px] font-mono uppercase text-muted-foreground">
          GOAL
        </span>
      </div>
    </div>
  );
}

export { AchievementRing };
