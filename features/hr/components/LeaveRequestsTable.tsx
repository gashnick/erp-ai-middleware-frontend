'use client'

import { useState } from 'react'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { useLeaveRequests } from '../hooks/useHr'
import { cn } from '@/utils/cn'
import type { LeaveRequest, LeaveRequestStatus } from '../types'

const LEAVE_TYPE_LABELS: Record<LeaveRequest['leaveType'], string> = {
  annual: 'Annual',
  sick: 'Sick',
  personal: 'Personal',
  unpaid: 'Unpaid',
  maternity: 'Maternity',
  paternity: 'Paternity',
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
    key: 'leaveType',
    label: 'Type',
    render: (row) => (
      <span className="text-sm text-gray-700">{LEAVE_TYPE_LABELS[row.leaveType]}</span>
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

const STATUS_TABS: { label: string; value: LeaveRequestStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

export function LeaveRequestsTable() {
  const [activeStatus, setActiveStatus] = useState<LeaveRequestStatus | undefined>()
  const { data, isLoading } = useLeaveRequests(activeStatus ? String(activeStatus) : undefined)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            type="button"
            onClick={() => setActiveStatus(tab.value)}
            className={cn(
              'px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeStatus === tab.value
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-900',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <DataTable<LeaveRequest>
        columns={COLUMNS}
        rows={data ?? []}
        isLoading={isLoading}
        emptyMessage="No leave requests found."
      />
    </div>
  )
}
