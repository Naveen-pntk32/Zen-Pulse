import { cn } from "@/lib/utils";
function AchievementRing({
  percent,
  size = 96,
  stroke = 8
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  return <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
    cx={size / 2}
    cy={size / 2}
    r={radius}
    stroke="currentColor"
    strokeWidth={stroke}
    fill="none"
    className="text-gray-700"
  />
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
        <defs>
          <linearGradient id="achievement-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono text-lg font-bold", percent >= 100 ? "text-green-400" : "text-white")}>
          {percent}%
        </span>
      </div>
    </div>;
}
export {
  AchievementRing
};
