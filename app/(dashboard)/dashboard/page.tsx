"use client";

import { DollarSign, TrendingUp, FileText, AlertCircle } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { RevenueChart } from "@/features/finance/components/RevenueChart";
import { InvoicesTable } from "@/features/finance/components/InvoicesTable";
import { useInvoices } from "@/features/finance/hooks/useInvoices";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";
import { formatCompactCurrency } from "@/utils/formatCurrency";

export default function DashboardPage() {
  const { data: kpis, isLoading } = useDashboardKpis();
  const { data: invoicesData } = useInvoices({ limit: 1000 });
  
  // Fallback: calculate pending and overdue counts from invoices if not in KPIs
  const invoices = Array.isArray(invoicesData) ? invoicesData : invoicesData?.data ?? [];
  const pendingCount = kpis?.pending_invoices_count ?? invoices.filter(inv => inv.status === 'pending').length;
  const overdueCount = kpis?.overdue_invoices_count ?? invoices.filter(inv => inv.status === 'overdue').length;
  
  console.log("Dashboard KPIs data:", kpis);
  console.log("pending_invoices_count:", kpis?.pending_invoices_count);
  console.log("overdue_invoices_count:", kpis?.overdue_invoices_count);
  console.log("Calculated pendingCount:", pendingCount);
  console.log("Calculated overdueCount:", overdueCount);

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
          value={String(pendingCount)}
          icon={FileText}
          isLoading={isLoading}
        />
        <KpiCard
          label="Overdue"
          value={String(overdueCount)}
          icon={AlertCircle}
          isLoading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="w-full lg:col-span-2">
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
