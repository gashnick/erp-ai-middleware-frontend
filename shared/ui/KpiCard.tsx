import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type TrendDirection = "up" | "down" | "neutral";

interface KpiCardProps {
  label: string;
  value: string;
  trend?: {
    direction: TrendDirection;
    percentage: number;
    label?: string;
  };
  icon?: LucideIcon;
  isLoading?: boolean;
  className?: string;
}

const TREND_CONFIG: Record<
  TrendDirection,
  { icon: LucideIcon; colorClass: string }
> = {
  up: { icon: TrendingUp, colorClass: "text-green-600" },
  down: { icon: TrendingDown, colorClass: "text-red-600" },
  neutral: { icon: Minus, colorClass: "text-gray-400" },
};

export function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  isLoading = false,
  className,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-4",
          className,
        )}
        aria-busy="true"
        aria-label={`Loading ${label}`}
      >
        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
        <div className="mt-3 h-7 w-32 animate-pulse rounded bg-gray-100" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  const trendConfig = trend ? TREND_CONFIG[trend.direction] : null;
  const TrendIcon = trendConfig?.icon;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50">
            <Icon className="h-3.5 w-3.5 text-gray-400" />
          </div>
        )}
      </div>

      {/* Value */}
      <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
        {value}
      </p>

      {/* Trend */}
      {trend && trendConfig && TrendIcon && (
        <div className="mt-1.5 flex items-center gap-1">
          <TrendIcon className={cn("h-3.5 w-3.5", trendConfig.colorClass)} />
          <span className={cn("text-xs font-medium", trendConfig.colorClass)}>
            {trend.percentage > 0 ? "+" : ""}
            {trend.percentage}%
          </span>
          {trend.label && (
            <span className="text-xs text-gray-400">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
