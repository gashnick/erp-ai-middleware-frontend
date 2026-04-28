"use client";

import { useSubscriptionUsage } from "../hooks/useSubscription";
import { cn } from "@/utils/cn";

export function UsageSummaryCards() {
  const { data: usage, isLoading } = useSubscriptionUsage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!usage?.length) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Feature Usage
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {usage.map((item) => {
          const pct = item.percentage ?? 0;
          const barColor =
            pct >= 90
              ? "bg-red-500"
              : pct >= 70
                ? "bg-yellow-500"
                : "bg-blue-500";
          const isUnlimited = item.limit === null || item.limit === -1;

          return (
            <div
              key={item.feature}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 capitalize">
                  {item.feature.replace(/_/g, " ")}
                </span>
                <span className="text-xs tabular-nums text-gray-500">
                  {item.used}
                  {!isUnlimited && ` / ${item.limit}`}
                </span>
              </div>
              {!isUnlimited && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      barColor,
                    )}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              )}
              {isUnlimited && (
                <div className="h-1.5 w-full rounded-full bg-blue-100">
                  <div className="h-full w-full rounded-full bg-blue-200" />
                </div>
              )}
              <p className="mt-1 text-[10px] text-gray-400">
                {isUnlimited ? "Unlimited" : `${pct}% used`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
