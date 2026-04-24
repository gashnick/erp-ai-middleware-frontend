"use client";

import { AlertTriangle } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { useAttritionRisk } from "../hooks/useHr";
import type { AttritionRisk } from "../types";

const COLUMNS: DataTableColumn<AttritionRisk & { id: string }>[] = [
  {
    key: "name",
    label: "Employee",
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-400">{row.role}</p>
      </div>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (row) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
        {row.department}
      </span>
    ),
  },
  {
    key: "tenureMonths",
    label: "Tenure",
    render: (row) => (
      <span className="text-sm tabular-nums text-gray-700">
        {row.tenureMonths}mo
      </span>
    ),
  },
  {
    key: "riskReason",
    label: "Risk Reason",
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-yellow-500" />
        <span className="text-xs text-gray-600">{row.riskReason}</span>
      </div>
    ),
  },
];

export function AttritionRiskTable() {
  const { data, isLoading } = useAttritionRisk();

  const rows = (data ?? []).map((r) => ({ ...r, id: r.employeeId }));

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-900">Attrition Risk</h3>
        {rows.length > 0 && (
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
            {rows.length} flagged
          </span>
        )}
      </div>
      <DataTable
        columns={COLUMNS}
        rows={rows}
        isLoading={isLoading}
        emptyMessage="No attrition risks detected."
      />
    </div>
  );
}
