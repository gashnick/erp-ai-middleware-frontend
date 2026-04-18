"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ChartCard } from "@/shared/ui/ChartCard";
import { formatCompactCurrency } from "@/utils/formatCurrency";
import { useExpenses } from "../hooks/useExpenses";
import { ExpenseBreakdown } from "../types";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

interface ExpenseBreakdownChartProps {
  from: string;
  to: string;
}

function ExpenseTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: ExpenseBreakdown;
  }>;
}) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-gray-900">{entry.payload?.vendorName}</p>
      <p className="text-gray-500">{entry.payload?.category}</p>
      <p className="font-semibold text-gray-900">
        {formatCompactCurrency(entry.value ?? 0)}
      </p>
    </div>
  );
}

/**
 * Pie chart showing expense breakdown by vendor/category
 */
export function ExpenseBreakdownChart({
  from,
  to,
}: ExpenseBreakdownChartProps) {
  const { data, isLoading } = useExpenses(from, to);

  const chartData =
    data?.map((item) => ({
      ...item,
      name: item.vendorName,
      value: item.total,
    })) ?? [];

  return (
    <ChartCard
      title="Expense Breakdown"
      subtitle={`${from} to ${to}`}
      isLoading={isLoading}
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data?.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ExpenseTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
