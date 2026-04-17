'use client'

import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { useLeaveRequests } from '../hooks/useHr'
import type { LeaveRequest } from '../types'

const LEAVE_TYPE_LABELS: Record<LeaveRequest['type'], string> = {
  annual: 'Annual',
  sick: 'Sick',
  parental: 'Parental',
  unpaid: 'Unpaid',
}

const STATUS_BADGE_MAP: Record<
  LeaveRequest['status'],
  { label: string; variant: 'success' | 'warning' | 'neutral' }
> = {
  approved: { label: 'Approved', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  rejected: { label: 'Rejected', variant: 'neutral' },
}

const COLUMNS: DataTableColumn<LeaveRequest>[] = [
  {
    key: 'employeeName',
    label: 'Employee',
    render: (row) => (
      <span className="text-sm font-medium text-gray-900">{row.employeeName}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    render: (row) => (
      <span className="text-sm text-gray-700">{LEAVE_TYPE_LABELS[row.type]}</span>
    ),
  },
  {
    key: 'startDate',
    label: 'From',
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.startDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'endDate',
    label: 'To',
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.endDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'days',
    label: 'Days',
    align: 'right',
    render: (row) => (
      <span className="font-medium tabular-nums text-sm">{row.days}</span>
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

export function LeaveRequestsTable() {
  const { data, isLoading } = useLeaveRequests()

  return (
    <DataTable<LeaveRequest>
      columns={COLUMNS}
      rows={data?.data ?? []}
      isLoading={isLoading}
      emptyMessage="No leave requests found."
    />
  )
}
