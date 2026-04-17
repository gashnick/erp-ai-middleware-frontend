'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { ChartCard } from '@/shared/ui/ChartCard'
import { useHrKpis } from '../hooks/useHr'

function HeadcountTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="mb-1 font-medium text-gray-700">{label}</p>
      <p className="text-gray-500">
        Headcount: <span className="font-medium text-gray-900">{payload[0]?.value}</span>
      </p>
    </div>
  )
}

export function HeadcountChart() {
  const { data: kpis, isLoading } = useHrKpis()

  return (
    <ChartCard
      title="Headcount by Department"
      subtitle="Current active employees"
      isLoading={isLoading}
      height={240}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={kpis?.departmentBreakdown ?? []}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="department"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<HeadcountTooltip />} cursor={{ fill: '#F9FAFB' }} />
          <Bar
            dataKey="count"
            name="Headcount"
            fill="#2563EB"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
