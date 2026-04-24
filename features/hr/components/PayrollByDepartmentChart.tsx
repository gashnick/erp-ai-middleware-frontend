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
import { usePayrollBreakdown } from "../hooks/useHr";
import { formatCompactCurrency } from "@/utils/formatCurrency";

function PayrollTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="mb-1 font-medium text-gray-700">{label}</p>
      <p className="text-gray-500">
        Total:{" "}
        <span className="font-medium text-gray-900">
          {formatCompactCurrency(payload[0]?.value ?? 0)}
        </span>
      </p>
      <p className="text-gray-500">
        Headcount:{" "}
        <span className="font-medium text-gray-900">{payload[1]?.value}</span>
      </p>
    </div>
  );
}

export function PayrollByDepartmentChart() {
  const isClient = useIsClient();
  const { data, isLoading } = usePayrollBreakdown();

  return (
    <ChartCard
      title="Payroll by Department"
      subtitle="Total salary cost"
      isLoading={isLoading}
      height={240}
    >
      {isClient && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data ?? []}
            layout="vertical"
            margin={{ top: 4, right: 4, left: 60, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <YAxis
              type="category"
              dataKey="department"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              content={<PayrollTooltip />}
              cursor={{ fill: "#F9FAFB" }}
            />
            <Bar
              dataKey="total"
              name="Total"
              fill="#7C3AED"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
