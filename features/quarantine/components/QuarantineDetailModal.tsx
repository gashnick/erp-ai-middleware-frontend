"use client";

import { useState } from "react";
import { X, RefreshCw, AlertTriangle } from "lucide-react";
import { useRetryRecord } from "../hooks/useQuarantine";
import type { QuarantineRecord } from "../types";
import { cn } from "@/utils/cn";

interface QuarantineDetailModalProps {
  record: QuarantineRecord;
  onClose: () => void;
}

export function QuarantineDetailModal({
  record,
  onClose,
}: QuarantineDetailModalProps) {
  const [fixedData, setFixedData] = useState(
    JSON.stringify(record.raw_data, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const retryMutation = useRetryRecord();

  function handleJsonChange(value: string) {
    setFixedData(value);
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch {
      setJsonError("Invalid JSON — fix before retrying");
    }
  }

  function handleRetry() {
    try {
      const parsed = JSON.parse(fixedData);
      retryMutation.mutate(
        { id: record.id, fixedData: parsed },
        { onSuccess: onClose },
      );
    } catch {
      setJsonError("Invalid JSON — fix before retrying");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-2xl flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Quarantine Record
            </h2>
            <p className="mt-0.5 font-mono text-[10px] text-gray-400">
              {record.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {record.entity_type}
          </span>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {record.source_type}
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              record.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : record.status === "reviewed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-500",
            )}
          >
            {record.status}
          </span>
        </div>

        {/* Errors */}
        {record.errors?.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-xs font-medium text-red-700">
                Validation Errors
              </span>
            </div>
            <ul className="space-y-1">
              {record.errors.map((err, i) => (
                <li key={i} className="text-xs text-red-600">
                  {err.field && (
                    <span className="font-medium">{err.field}: </span>
                  )}
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Editor */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">
              Record Data (editable)
            </label>
            <span className="text-[10px] text-gray-400">
              Edit and retry to re-import
            </span>
          </div>
          <textarea
            value={fixedData}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={10}
            className={cn(
              "w-full rounded-lg border font-mono text-xs p-3 outline-none transition-colors resize-none",
              jsonError
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-gray-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100",
            )}
            spellCheck={false}
          />
          {jsonError && (
            <p className="mt-1 text-xs text-red-600">{jsonError}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRetry}
            disabled={!!jsonError || retryMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {retryMutation.isPending ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Retry Import
          </button>
        </div>
      </div>
    </div>
  );
}
