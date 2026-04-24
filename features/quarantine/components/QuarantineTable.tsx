"use client";

import { useState } from "react";
import {
  RefreshCw,
  AlertTriangle,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { QuarantineDetailModal } from "./QuarantineDetailModal";
import {
  useQuarantineRecords,
  useBatchRetry,
  useQuarantineFilters,
} from "../hooks/useQuarantine";
import type { QuarantineRecord, QuarantineStatus } from "../types";
import { cn } from "@/utils/cn";

const STATUS_TABS: { label: string; value: QuarantineStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Dismissed", value: "dismissed" },
];

const STATUS_BADGE_MAP: Record<
  QuarantineStatus,
  { label: string; variant: "warning" | "info" | "neutral" }
> = {
  pending: { label: "Pending", variant: "warning" },
  reviewed: { label: "Reviewed", variant: "info" },
  dismissed: { label: "Dismissed", variant: "neutral" },
};

export function QuarantineTable() {
  const { filters, setStatus, nextPage, prevPage } = useQuarantineFilters();
  const { data, isLoading, isFetching, refetch } =
    useQuarantineRecords(filters);
  const batchRetryMutation = useBatchRetry();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailRecord, setDetailRecord] = useState<QuarantineRecord | null>(
    null,
  );

  const records = data?.data ?? [];
  const total = data?.total ?? 0;
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  }

  function handleBatchRetry() {
    batchRetryMutation.mutate([...selectedIds], {
      onSuccess: () => setSelectedIds(new Set()),
    });
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={String(tab.value)}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setSelectedIds(new Set());
              }}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                filters.status === tab.value
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              type="button"
              onClick={handleBatchRetry}
              disabled={batchRetryMutation.isPending}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {batchRetryMutation.isPending ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RotateCcw className="h-3 w-3" />
              )}
              Retry {selectedIds.size} selected
            </button>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <RefreshCw
              className={cn("h-3 w-3", isFetching && "animate-spin")}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    records.length > 0 && selectedIds.size === records.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 accent-blue-600"
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Entity Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Error
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Created
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3.5 animate-pulse rounded bg-gray-100" />
                    </td>
                  ))}
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  No quarantined records found
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const statusConfig = STATUS_BADGE_MAP[record.status];
                const firstError =
                  record.errors?.[0]?.message ?? "Validation error";
                return (
                  <tr
                    key={record.id}
                    className={cn(
                      "transition-colors hover:bg-gray-50",
                      selectedIds.has(record.id) && "bg-blue-50",
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(record.id)}
                        onChange={() => toggleSelect(record.id)}
                        className="rounded border-gray-300 accent-blue-600"
                        aria-label={`Select record ${record.id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {record.entity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {record.source_type}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-red-600 line-clamp-1 max-w-[200px]">
                        {firstError}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={statusConfig.label}
                        variant={statusConfig.variant}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(record.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDetailRecord(record)}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {currentPage} of {totalPages} · {total} records
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={offset === 0}
              onClick={prevPage}
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={nextPage}
              className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailRecord && (
        <QuarantineDetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      )}
    </>
  );
}
