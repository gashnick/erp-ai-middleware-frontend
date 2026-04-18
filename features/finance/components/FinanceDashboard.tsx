"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { CashBalanceCard } from "./CashBalanceCard";
import { KpiSection } from "./KpiSection";
import { RevenueChart } from "./RevenueChart";
import { CashFlowChart } from "./CashFlowChart";
import { ExpenseBreakdownChart } from "./ExpenseBreakdownChart";
import { InvoiceAgingTable } from "./InvoiceAgingTable";
import { RecentTransactionsTable } from "./RecentTransactionsTable";
import { PeriodSelector } from "./PeriodSelector";
import { EmptyStateFinance } from "./EmptyStateFinance";
import { useFinanceDashboard } from "../hooks/useFinanceDashboard";
import { FinanceDashboardFilters } from "../types";

/**
 * Complete Finance Dashboard - main container
 * Orchestrates all finance widgets and handles data fetching
 */
export function FinanceDashboard() {
  const { data, loading, error, refetch, filters, setFilters } =
    useFinanceDashboard();

  const handlePeriodChange = (period: FinanceDashboardFilters["period"]) => {
    setFilters({ ...filters, period });
  };

  const handleExport = async () => {
    try {
      // TODO: Implement PDF export
      console.log("Export to PDF");
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  // Show empty state if no data and not loading
  if (!data && !loading) {
    return <EmptyStateFinance onRetry={refetch} />;
  }

  // Show error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="mb-2 font-semibold text-red-900">
          Error Loading Dashboard
        </h3>
        <p className="mb-4 text-sm text-red-800">{error.message}</p>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Finance Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            {data?.refreshedAt
              ? `Updated ${new Date(data.refreshedAt).toLocaleTimeString()}`
              : "Loading..."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PeriodSelector
            value={filters.period}
            onChange={handlePeriodChange}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Cash Balance Summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CashBalanceCard />
        </div>

        {/* KPI Cards */}
        {data?.kpis && (
          <div className="lg:col-span-2">
            <KpiSection kpis={data.kpis} loading={loading} />
          </div>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueChart />
        <CashFlowChart year={new Date().getFullYear()} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ExpenseBreakdownChart
          from={
            new Date(new Date().setMonth(new Date().getMonth() - 1))
              .toISOString()
              .split("T")[0]
          }
          to={new Date().toISOString().split("T")[0]}
        />
        <InvoiceAgingTable />
      </div>

      {/* Transactions Table */}
      <RecentTransactionsTable limit={15} />
    </div>
  );
}
