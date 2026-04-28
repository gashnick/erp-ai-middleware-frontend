interface ConfidenceScoreProps {
  score: number; // 0–1
  size?: number;
}

export function ConfidenceScore({ score, size = 40 }: ConfidenceScoreProps) {
  const pct = Math.round(score * 100);
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const color = pct >= 80 ? "#DC2626" : pct >= 60 ? "#F59E0B" : "#16A34A";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] font-medium tabular-nums" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}
