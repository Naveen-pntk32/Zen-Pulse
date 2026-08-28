import { cn } from "@/lib/utils";

function AchievementRing({ percent, size = 96, stroke = 8 }) {
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
            <stop offset="0%" stopColor={isComplete ? "#4ade80" : "var(--brand-blue)"} />
            <stop offset="100%" stopColor={isComplete ? "#22c55e" : "#6f9bff"} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--surface)"
          strokeWidth={stroke}
          fill="none"
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
          className={cn("font-mono text-lg font-bold tracking-tight", isComplete && "drop-shadow-sm")}
          style={{ color: isComplete ? "#4ade80" : "var(--text-primary)" }}
        >
          {percent}%
        </span>
      </div>
    </div>
  );
}

export { AchievementRing };
