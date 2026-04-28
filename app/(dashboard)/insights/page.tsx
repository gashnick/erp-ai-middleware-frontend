"use client";

import { Loader2, RefreshCw, ScanSearch } from "lucide-react";
import { InsightCard } from "@/features/insights/components/InsightCard";
import {
  useInsights,
  useTriggerScan,
  useInsightFilters,
} from "@/features/insights/hooks/useInsights";
import {
  ANOMALY_TYPE_CONFIG,
  type AnomalyType,
} from "@/features/insights/types";
import { cn } from "@/utils/cn";

const SCORE_FILTERS = [
  { label: "All", value: undefined },
  { label: "High (≥80%)", value: 0.8 },
  { label: "Medium (≥60%)", value: 0.6 },
  { label: "Low (≥40%)", value: 0.4 },
];

export default function InsightsPage() {
  const { filters, setMinScore, toggleType, clearFilters } =
    useInsightFilters();
  const {
    data: insights,
    isLoading,
    isFetching,
    refetch,
  } = useInsights(filters);
  const scanMutation = useTriggerScan();

  const anomalyTypes = Object.keys(ANOMALY_TYPE_CONFIG) as AnomalyType[];
  const hasActiveFilters =
    (filters.types?.length ?? 0) > 0 || filters.minScore !== undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">AI Insights</h1>
          <p className="text-sm text-gray-500">
            Anomalies and patterns detected in your business data
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isFetching && "animate-spin")}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
            className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {scanMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ScanSearch className="h-3.5 w-3.5" />
            )}
            {scanMutation.isPending ? "Scanning…" : "Run Scan"}
          </button>
        </div>
      </div>

      {/* Scan success banner */}
      {scanMutation.isSuccess && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Scan queued — job ID:{" "}
          <span className="font-mono font-medium">
            {scanMutation.data?.jobId}
          </span>
          . Results will appear shortly.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filters */}
        <div className="flex flex-wrap gap-1.5">
          {anomalyTypes.map((type) => {
            const config = ANOMALY_TYPE_CONFIG[type];
            const isActive = filters.types?.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? config.colorClass
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
              >
                <span>{config.icon}</span>
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Score filter */}
        <select
          value={filters.minScore ?? ""}
          onChange={(e) =>
            setMinScore(e.target.value ? Number(e.target.value) : undefined)
          }
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-300 focus:outline-none"
        >
          {SCORE_FILTERS.map((f) => (
            <option key={String(f.value)} value={f.value ?? ""}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Summary */}
      {!isLoading && insights && (
        <p className="text-xs text-gray-400">
          {insights.length} insight{insights.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : insights?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <ScanSearch className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No insights found</p>
          <p className="mt-1 text-xs text-gray-400">
            Run a scan to detect anomalies in your data
          </p>
          <button
            type="button"
            onClick={() => scanMutation.mutate()}
            disabled={scanMutation.isPending}
            className="mt-4 flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {scanMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ScanSearch className="h-3.5 w-3.5" />
            )}
            Run First Scan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {insights?.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
