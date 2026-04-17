'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts'
import { ChartCard } from '@/shared/ui/ChartCard'
import { useOpsKpis } from '../hooks/useOps'
import type { OrderStatus } from '../types'

const STATUS_COLORS: Record<OrderStatus, string> = {
  in_progress: '#2563EB',
  confirmed: '#F59E0B',
  completed: '#16A34A',
  draft: '#9CA3AF',
  cancelled: '#DC2626',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  in_progress: 'In Progress',
  confirmed: 'Confirmed',
  completed: 'Completed',
  draft: 'Draft',
  cancelled: 'Cancelled',
}

function OpsTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-medium text-gray-700">{entry?.name}</p>
      <p className="text-gray-500">
        Orders: <span className="font-medium text-gray-900">{entry?.value}</span>
      </p>
    </div>
  )
}

export function OpsStatusChart() {
  const { data: kpis, isLoading } = useOpsKpis()

  const chartData = (kpis?.statusBreakdown ?? []).map((item) => ({
    name: STATUS_LABELS[item.status],
    value: item.count,
    color: STATUS_COLORS[item.status],
  }))

  return (
    <ChartCard
      title="Orders by Status"
      subtitle="Current breakdown"
      isLoading={isLoading}
      height={220}
    >
      <div className="flex h-full items-center gap-6">
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
            <Tooltip content={<OpsTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
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
  )
}
