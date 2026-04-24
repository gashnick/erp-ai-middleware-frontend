"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useEmployees, useDepartments } from "../hooks/useHr";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import type { Employee, EmployeeStatus } from "../types";

const STATUS_BADGE_MAP: Record<
  EmployeeStatus,
  { label: string; variant: "success" | "warning" | "error" }
> = {
  active: { label: "Active", variant: "success" },
  on_leave: { label: "On Leave", variant: "warning" },
  terminated: { label: "Terminated", variant: "error" },
};

const COLUMNS: DataTableColumn<Employee>[] = [
  {
    key: "name",
    label: "Employee",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 uppercase">
          {row.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-400">{row.role}</p>
        </div>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    sortable: true,
    render: (row) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
        {row.department}
      </span>
    ),
  },
  {
    key: "startDate",
    label: "Start Date",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {row.startDate
          ? new Date(row.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—"}
      </span>
    ),
  },
  {
    key: "salary",
    label: "Salary",
    align: "right",
    render: (row) => (
      <span className="font-medium tabular-nums text-sm">
        {row.salary ? formatCurrency(row.salary, row.currency) : "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const config = STATUS_BADGE_MAP[row.status];
      return <StatusBadge label={config.label} variant={config.variant} />;
    },
  },
];

const STATUS_TABS: { label: string; value: EmployeeStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Active", value: "active" },
  { label: "On Leave", value: "on_leave" },
  { label: "Terminated", value: "terminated" },
];

export function EmployeesTable() {
  const [activeStatus, setActiveStatus] = useState<
    EmployeeStatus | undefined
  >();
  const [selectedDept, setSelectedDept] = useState<string | undefined>();
  const { data, isLoading } = useEmployees({
    status: activeStatus,
    department: selectedDept,
  });
  const { data: departments, isLoading: deptLoading } = useDepartments();

  const deptList = Array.isArray(departments) ? departments : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 border-b border-gray-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={String(tab.value)}
              type="button"
              onClick={() => setActiveStatus(tab.value)}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeStatus === tab.value
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={selectedDept ?? ""}
          onChange={(e) => setSelectedDept(e.target.value || undefined)}
          disabled={deptLoading}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-300 focus:outline-none disabled:opacity-50"
        >
          <option value="">
            {deptLoading ? "Loading departments..." : "All departments"}
          </option>
          {deptList.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <DataTable<Employee>
        columns={COLUMNS}
        rows={data ?? []}
        isLoading={isLoading}
        emptyMessage="No employees found."
      />
    </div>
  );
}
