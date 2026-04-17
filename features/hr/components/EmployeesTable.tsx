'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import { useEmployees, useDepartments } from '../hooks/useHr'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/utils/cn'
import type { Employee, EmploymentStatus } from '../types'

const STATUS_BADGE_MAP: Record<
  EmploymentStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }
> = {
  active: { label: 'Active', variant: 'success' },
  on_leave: { label: 'On Leave', variant: 'warning' },
  probation: { label: 'Probation', variant: 'info' as 'success' },
  terminated: { label: 'Terminated', variant: 'error' },
}

const COLUMNS: DataTableColumn<Employee>[] = [
  {
    key: 'employeeNumber',
    label: 'ID',
    render: (row) => (
      <span className="font-mono text-xs text-gray-500">{row.employeeNumber}</span>
    ),
  },
  {
    key: 'firstName',
    label: 'Name',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 uppercase">
          {row.firstName.charAt(0)}{row.lastName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'jobTitle',
    label: 'Title',
    render: (row) => (
      <span className="text-sm text-gray-700">{row.jobTitle}</span>
    ),
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    render: (row) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
        {row.department}
      </span>
    ),
  },
  {
    key: 'startDate',
    label: 'Start Date',
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.startDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
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

export function EmployeesTable() {
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState<string | undefined>()
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useEmployees({
    limit: 15,
    search: debouncedSearch || undefined,
    department: selectedDept,
  })
  const { data: departments } = useDepartments()

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={selectedDept ?? ''}
          onChange={(e) => setSelectedDept(e.target.value || undefined)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All departments</option>
          {departments?.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <DataTable<Employee>
        columns={COLUMNS}
        rows={data?.data ?? []}
        isLoading={isLoading}
        emptyMessage="No employees found."
      />
    </div>
  )
}
