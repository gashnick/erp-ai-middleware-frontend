"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useQuarantine } from "../hooks/useQuarantine";
import { ENTITY_TYPE_CONFIG, type QuarantineRecord } from "../types";
import { cn } from "@/utils/cn";

const SEVERITY_CONFIG = {
  warning: { label: "Warning", variant: "warning" as const },
  error: { label: "Error", variant: "error" as const },
  critical: { label: "Critical", variant: "error" as const },
};

const STATUS_CONFIG = {
  new: { label: "New", variant: "info" as const },
  reviewed: { label: "Reviewed", variant: "neutral" as const },
  fixed: { label: "Fixed", variant: "success" as const },
  retry_failed: { label: "Retry Failed", variant: "error" as const },
};

const COLUMNS: DataTableColumn<QuarantineRecord>[] = [
  {
    key: "entityType",
    label: "Type",
    render: (row) => {
      const config = ENTITY_TYPE_CONFIG[row.entityType];
      return (
        <div className="flex items-center gap-2">
          <span>{config?.icon}</span>
          <span className="text-sm text-gray-700">
            {config?.label ?? row.entityType}
          </span>
        </div>
      );
    },
  },
  {
    key: "originalData",
    label: "Record Preview",
    render: (row) => {
      const preview = Object.entries(row.originalData)
        .slice(0, 3)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ");
      return (
        <span className="text-xs text-gray-500 truncate max-w-[200px] block">
          {preview}
        </span>
      );
    },
  },
  {
    key: "errors",
    label: "Error",
    render: (row) => (
      <span className="text-xs text-red-600">
        {row.errors?.[0]?.message ?? "Validation error"}
      </span>
    ),
  },
  {
    key: "severity",
    label: "Severity",
    render: (row) => {
      const config = SEVERITY_CONFIG[row.severity];
      return <StatusBadge label={config.label} variant={config.variant} />;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const config = STATUS_CONFIG[row.status];
      return <StatusBadge label={config.label} variant={config.variant} />;
    },
  },
  {
    key: "createdAt",
    label: "Detected",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
];

export function QuarantineTable() {
  const { data, isLoading, refetch, isFetching } = useQuarantine();

  const records = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {total > 0 && (
            <div className="flex items-center gap-1.5 rounded-md bg-yellow-50 border border-yellow-200 px-2.5 py-1">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-700">
                {total} record{total !== 1 ? "s" : ""} need attention
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          <RefreshCw className={cn("h-3 w-3", isFetching && "animate-spin")} />
          Refresh
        </button>
      </div>

      <DataTable<QuarantineRecord>
        columns={COLUMNS}
        rows={records}
        isLoading={isLoading}
        emptyMessage="No quarantined records. Your imports are clean!"
      />
    </div>
  );
}
