"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { ChartCard } from "@/shared/ui/ChartCard";
import { useIsClient } from "@/hooks/useIsClient";
import { useOrdersPipeline } from "../hooks/useOps";
import { formatCompactCurrency } from "@/utils/formatCurrency";

function PipelineTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="mb-1 font-medium text-gray-700 capitalize">{label}</p>
      <p className="text-gray-500">
        Orders:{" "}
        <span className="font-medium text-gray-900">{payload[0]?.value}</span>
      </p>
      <p className="text-gray-500">
        Value:{" "}
        <span className="font-medium text-gray-900">
          {formatCompactCurrency(payload[1]?.value ?? 0)}
        </span>
      </p>
    </div>
  );
}

export function OrdersPipelineChart() {
  const isClient = useIsClient();
  const { data, isLoading } = useOrdersPipeline();

  return (
    <ChartCard
      title="Orders Pipeline"
      subtitle={
        data
          ? `${data.totalOrders} total · ${formatCompactCurrency(data.totalValue)} value`
          : "By status"
      }
      isLoading={isLoading}
      height={240}
    >
      {isClient && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data?.byStatus ?? []}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<PipelineTooltip />}
              cursor={{ fill: "#F9FAFB" }}
            />
            <Bar
              dataKey="count"
              name="Orders"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
