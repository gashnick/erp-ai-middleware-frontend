"use client";

import { DollarSign, TrendingUp, FileText, AlertCircle } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";
import { formatCompactCurrency } from "@/utils/formatCurrency";

/**
 * Revenue-focused KPI row for the dashboard.
 * Owns its own data fetching via useDashboardKpis —
 * the dashboard page does not need to pass props down.
 */
export function RevenueKpiSection() {
  const { data: kpis, isLoading } = useDashboardKpis();

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <KpiCard
        label="Cash Balance"
        value={kpis ? formatCompactCurrency(kpis.cashBalance.current) : "—"}
        trend={
          kpis
            ? {
                direction: kpis.cashBalance.trend,
                percentage: kpis.cashBalance.changePercentage,
                label: "vs last month",
              }
            : undefined
        }
        icon={DollarSign}
        isLoading={isLoading}
      />
      <KpiCard
        label="Total Revenue"
        value={kpis ? formatCompactCurrency(kpis.totalRevenue) : "—"}
        trend={
          kpis
            ? {
                direction: kpis.revenueChangePercentage >= 0 ? "up" : "down",
                percentage: Math.abs(kpis.revenueChangePercentage),
                label: "vs last month",
              }
            : undefined
        }
        icon={TrendingUp}
        isLoading={isLoading}
      />
      <KpiCard
        label="Pending Invoices"
        value={kpis ? String(kpis.pendingInvoicesCount) : "—"}
        icon={FileText}
        isLoading={isLoading}
      />
      <KpiCard
        label="Overdue"
        value={kpis ? String(kpis.overdueInvoicesCount) : "—"}
        icon={AlertCircle}
        isLoading={isLoading}
      />
    </div>
  );
}
