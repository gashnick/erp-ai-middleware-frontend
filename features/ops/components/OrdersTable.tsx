'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { formatCurrency } from '@/utils/formatCurrency'
import { useOrders } from '../hooks/useOps'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/utils/cn'
import type { Order, OrderStatus } from '../types'

const STATUS_BADGE_MAP: Record<
  OrderStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }
> = {
  completed: { label: 'Completed', variant: 'success' },
  in_progress: { label: 'In Progress', variant: 'info' },
  confirmed: { label: 'Confirmed', variant: 'warning' },
  draft: { label: 'Draft', variant: 'neutral' },
  cancelled: { label: 'Cancelled', variant: 'error' },
}

const PRIORITY_CLASSES: Record<string, string> = {
  critical: 'text-red-600 font-medium',
  high: 'text-orange-500 font-medium',
  medium: 'text-gray-700',
  low: 'text-gray-400',
}

const STATUS_TABS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

const COLUMNS: DataTableColumn<Order>[] = [
  {
    key: 'orderNumber',
    label: 'Order #',
    render: (row) => (
      <span className="font-mono text-xs font-medium text-gray-900">
        {row.orderNumber}
      </span>
    ),
  },
  {
    key: 'customerName',
    label: 'Customer',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Description',
    render: (row) => (
      <span className="max-w-[200px] truncate block text-sm text-gray-600">
        {row.description}
      </span>
    ),
  },
  {
    key: 'priority',
    label: 'Priority',
    render: (row) => (
      <span className={cn('text-xs capitalize', PRIORITY_CLASSES[row.priority])}>
        {row.priority}
      </span>
    ),
  },
  {
    key: 'assignedTo',
    label: 'Assigned',
    render: (row) => (
      <span className="text-sm text-gray-600">{row.assignedTo}</span>
    ),
  },
  {
    key: 'dueDate',
    label: 'Due',
    sortable: true,
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.dueDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'value',
    label: 'Value',
    align: 'right',
    sortable: true,
    render: (row) => (
      <span className="font-medium tabular-nums text-sm">
        {formatCurrency(row.value, row.currency)}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const config = STATUS_BADGE_MAP[row.status]
      return <StatusBadge label={config.label} variant={config.variant} />
    },
  },
]

export function OrdersTable() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | undefined>()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, page, setPage, totalPages } = useOrders({
    limit: 15,
    status: activeStatus,
    search: debouncedSearch || undefined,
  })

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 border-b border-gray-200 -mb-3 pb-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={String(tab.value)}
              type="button"
              onClick={() => { setActiveStatus(tab.value); setPage(1) }}
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeStatus === tab.value
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <DataTable<Order>
        columns={COLUMNS}
        rows={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage="No orders found."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
