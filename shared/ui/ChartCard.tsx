import { cn } from "@/utils/cn";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  height?: number;
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  isLoading = false,
  className,
  height = 280,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Chart area */}
      <div className="mt-4" style={{ height }} aria-label={`Chart: ${title}`}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-full w-full animate-pulse rounded-md bg-gray-50" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
