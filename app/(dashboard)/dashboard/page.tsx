"use client";

import { DollarSign, TrendingUp, FileText, AlertCircle } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { RevenueChart } from "@/features/finance/components/RevenueChart";
import { InvoicesTable } from "@/features/finance/components/InvoicesTable";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";
import { formatCompactCurrency } from "@/utils/formatCurrency";

export default function DashboardPage() {
  const { data: kpis, isLoading } = useDashboardKpis();

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Real-time overview of your business
        </p>
      </div>

      {/* KPI Row */}
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

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">Quick Stats</h3>
          <p className="mt-2 text-xs text-gray-400">
            Add more widgets here (alerts, upcoming payments, etc.)
          </p>
        </div>
      </div>

      {/* Invoices table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Recent Invoices
          </h2>
          <a
            href="/finance"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            View all
          </a>
        </div>
        <InvoicesTable />
      </div>
    </div>
  );
}
