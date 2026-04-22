"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/shared/ui/ChartCard";
import { formatCompactCurrency } from "@/utils/formatCurrency";
import { useCashFlow } from "../hooks/useExpenses";
import { CashFlowData } from "../types";

interface CashFlowChartProps {
  year: number;
}

function CashFlowTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="mb-1 font-medium text-gray-700">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background:
                entry.name === "inflow"
                  ? "#10B981"
                  : entry.name === "outflow"
                    ? "#EF4444"
                    : "#3B82F6",
            }}
          />
          <span className="text-gray-500 capitalize">{entry.name}:</span>
          <span className="font-medium text-gray-900">
            {formatCompactCurrency(entry.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  );
}

/**
 * Bar chart showing cash inflow, outflow, and net cash flow
 */
export function CashFlowChart({ year }: CashFlowChartProps) {
  const { data, isLoading } = useCashFlow(year);

  const chartData =
    data?.map((item) => ({
      month: item.label || `Month ${item.month}`,
      inflow: item.inflow,
      outflow: item.outflow,
      netCashFlow: item.netCashFlow,
    })) ?? [];

  return (
    <ChartCard
      title="Cash Flow Analysis"
      subtitle={`Year ${year}`}
      isLoading={isLoading}
      height={300}
    >
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatCompactCurrency(v)}
          />

          <Tooltip content={<CashFlowTooltip />} />
          <Legend />

          <Bar dataKey="inflow" fill="#10B981" name="Inflow" />
          <Bar dataKey="outflow" fill="#EF4444" name="Outflow" />
          <Bar dataKey="netCashFlow" fill="#3B82F6" name="Net Cash Flow" />
        </BarChart>
      </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
