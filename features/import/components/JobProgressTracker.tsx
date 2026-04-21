"use client";

import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ImportJob } from "../types";

interface JobProgressTrackerProps {
  jobId: string;
  job: ImportJob;
  onBuildGraph?: () => void;
  isBuildingGraph?: boolean;
}

export function JobProgressTracker({
  jobId,
  job,
  onBuildGraph,
  isBuildingGraph = false,
}: JobProgressTrackerProps) {
  const isProcessing = job.status === "processing";
  const isCompleted = job.status === "completed";
  const isFailed = job.status === "failed";

  const successRate =
    isCompleted && job.total
      ? Math.round(((job.synced ?? 0) / job.total) * 100)
      : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isProcessing && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          )}
          {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
          {isFailed && <XCircle className="h-4 w-4 text-red-600" />}
          <span className="text-sm font-medium text-gray-900">
            {isProcessing && "Processing…"}
            {isCompleted && "Import Complete"}
            {isFailed && "Import Failed"}
          </span>
        </div>
        <span className="font-mono text-[10px] text-gray-400">{jobId}</span>
      </div>

      {/* Processing state */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
          </div>
          <p className="text-xs text-gray-500">
            Validating and importing records…
          </p>
        </div>
      )}

      {/* Completed state */}
      {isCompleted && (
        <div className="space-y-3">
          {/* Progress bar */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>Success rate</span>
              <span>{successRate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  successRate === 100
                    ? "bg-green-500"
                    : successRate >= 70
                      ? "bg-yellow-500"
                      : "bg-red-500",
                )}
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md bg-gray-50 p-2 text-center">
              <p className="text-lg font-semibold tabular-nums text-gray-900">
                {job.total ?? 0}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                Total
              </p>
            </div>
            <div className="rounded-md bg-green-50 p-2 text-center">
              <p className="text-lg font-semibold tabular-nums text-green-700">
                {job.synced ?? 0}
              </p>
              <p className="text-[10px] text-green-600 uppercase tracking-wide">
                Imported
              </p>
            </div>
            <div
              className={cn(
                "rounded-md p-2 text-center",
                (job.quarantined ?? 0) > 0 ? "bg-yellow-50" : "bg-gray-50",
              )}
            >
              <p
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  (job.quarantined ?? 0) > 0
                    ? "text-yellow-700"
                    : "text-gray-500",
                )}
              >
                {job.quarantined ?? 0}
              </p>
              <p
                className={cn(
                  "text-[10px] uppercase tracking-wide",
                  (job.quarantined ?? 0) > 0
                    ? "text-yellow-600"
                    : "text-gray-400",
                )}
              >
                Quarantined
              </p>
            </div>
          </div>

          {/* Quarantine warning */}
          {(job.quarantined ?? 0) > 0 && (
            <div className="flex items-start gap-2 rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                {job.quarantined} record{job.quarantined !== 1 ? "s" : ""}{" "}
                failed validation and were quarantined. Review them in the
                Quarantine tab.
              </p>
            </div>
          )}

          {/* Build graph CTA */}
          {onBuildGraph && (
            <button
              type="button"
              onClick={onBuildGraph}
              disabled={isBuildingGraph}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isBuildingGraph ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "🔗"
              )}
              {isBuildingGraph
                ? "Building knowledge graph…"
                : "Build Knowledge Graph"}
            </button>
          )}
        </div>
      )}

      {/* Failed state */}
      {isFailed && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-xs text-red-700 font-medium">Error</p>
          <p className="mt-0.5 text-xs text-red-600">
            {job.error ?? "Unknown error"}
          </p>
        </div>
      )}
    </div>
  );
}
