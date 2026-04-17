"use client";

import { DollarSign, RefreshCw } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { useCashBalance } from "../hooks/useCashBalance";
import { formatCompactCurrency } from "@/utils/formatCurrency";
import { getCashBalanceLabel } from "../utils";

/**
 * Self-contained cash balance card.
 * Owns its own data fetching via useCashBalance.
 * Polls every 60s for near-realtime updates.
 */
export function CashBalanceCard() {
  const { data, isLoading, dataUpdatedAt, refetch, isFetching } =
    useCashBalance();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="relative">
      <KpiCard
        label="Cash Balance"
        value={data ? formatCompactCurrency(data.current, data.currency) : "—"}
        trend={
          data
            ? {
                direction: data.trend,
                percentage: Math.abs(data.changePercentage),
                label: getCashBalanceLabel(data),
              }
            : undefined
        }
        icon={DollarSign}
        isLoading={isLoading}
      />

      {/* Refresh control + last updated */}
      {!isLoading && (
        <div className="mt-1 flex items-center justify-between px-0.5">
          {lastUpdated && (
            <span className="text-[10px] text-gray-400">
              Updated {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="ml-auto flex items-center gap-1 rounded text-[10px] text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
            aria-label="Refresh cash balance"
          >
            <RefreshCw
              className={`h-2.5 w-2.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
