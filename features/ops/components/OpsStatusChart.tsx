"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/shared/ui/ChartCard";
import { useIsClient } from "@/hooks/useIsClient";
import { useInventorySummary } from "../hooks/useOps";

const STATUS_COLORS: Record<string, string> = {
  operational: "#16A34A",
  maintenance: "#F59E0B",
  offline: "#DC2626",
  retired: "#9CA3AF",
};

export function OpsStatusChart() {
  const isClient = useIsClient();
  const { data: summary, isLoading } = useInventorySummary();

  const chartData = summary
    ? [
        {
          name: "Operational",
          value: summary.operational,
          color: STATUS_COLORS.operational,
        },
        {
          name: "Maintenance",
          value: summary.maintenance,
          color: STATUS_COLORS.maintenance,
        },
        {
          name: "Offline",
          value: summary.offline,
          color: STATUS_COLORS.offline,
        },
        {
          name: "Retired",
          value: summary.retired,
          color: STATUS_COLORS.retired,
        },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <ChartCard
      title="Asset Status"
      subtitle="Current breakdown"
      isLoading={isLoading}
      height={220}
    >
      <div className="flex h-full items-center gap-6">
        {isClient && (
          <ResponsiveContainer width="50%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
        <div className="flex flex-1 flex-col gap-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-sm"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
              <span className="text-xs font-medium tabular-nums text-gray-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
