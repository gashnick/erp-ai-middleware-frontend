"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/shared/ui/ChartCard";
import { useIsClient } from "@/hooks/useIsClient";
import { useHeadcountTrend } from "../hooks/useHr";

export function HeadcountTrendChart() {
  const isClient = useIsClient();
  const { data, isLoading } = useHeadcountTrend(12);

  return (
    <ChartCard
      title="Headcount Trend"
      subtitle="Last 12 months"
      isLoading={isLoading}
      height={240}
    >
      {isClient && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data ?? []}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="period"
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
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="active"
              name="Active"
              stroke="#16A34A"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
