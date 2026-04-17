"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ChartCard } from "@/shared/ui/ChartCard";
import { RevenueChart } from "@/features/finance/components/RevenueChart";
import { useInvoices } from "@/features/finance/hooks/useInvoices";
import { useDashboardKpis } from "@/features/finance/hooks/useDashboardKpis";
import { formatCurrency, formatCompactCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import type { Invoice, InvoiceStatus } from "@/features/finance/types";

const STATUS_TABS: { label: string; value: InvoiceStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
  { label: "Paid", value: "paid" },
  { label: "Draft", value: "draft" },
];

const STATUS_BADGE_MAP: Record<
  InvoiceStatus,
  { label: string; variant: "success" | "warning" | "error" | "neutral" }
> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  overdue: { label: "Overdue", variant: "error" },
  draft: { label: "Draft", variant: "neutral" },
};

const COLUMNS: DataTableColumn<Invoice>[] = [
  {
    key: "invoiceNumber",
    label: "Invoice #",
    render: (row) => (
      <span className="font-mono text-xs font-medium text-gray-900">
        {row.invoiceNumber}
      </span>
    ),
  },
  {
    key: "customerName",
    label: "Customer",
    sortable: true,
  },
  {
    key: "issuedAt",
    label: "Issued",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.issuedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    key: "dueDate",
    label: "Due Date",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-gray-500">
        {new Date(row.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    sortable: true,
    render: (row) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.amount, row.currency)}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const config = STATUS_BADGE_MAP[row.status];
      return <StatusBadge label={config.label} variant={config.variant} />;
    },
  },
];

export default function FinancePage() {
  const [activeStatus, setActiveStatus] = useState<InvoiceStatus | undefined>(
    undefined,
  );
  const [sortKey, setSortKey] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: kpis, isLoading: isKpisLoading } = useDashboardKpis();
  const {
    data: invoicesPage,
    isLoading: isInvoicesLoading,
    page,
    setPage,
    totalPages,
  } = useInvoices({ status: activeStatus, limit: 15 });

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-500">
          Cash flow, revenue, and invoices
        </p>
      </div>

      {/* KPIs */}
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
          isLoading={isKpisLoading}
        />
        <KpiCard
          label="Total Revenue"
          value={kpis ? formatCompactCurrency(kpis.totalRevenue) : "—"}
          trend={
            kpis
              ? {
                  direction: kpis.revenueChangePercentage >= 0 ? "up" : "down",
                  percentage: Math.abs(kpis.revenueChangePercentage),
                }
              : undefined
          }
          isLoading={isKpisLoading}
        />
        <KpiCard
          label="Pending Invoices"
          value={kpis ? String(kpis.pendingInvoicesCount) : "—"}
          isLoading={isKpisLoading}
        />
        <KpiCard
          label="Overdue"
          value={kpis ? String(kpis.overdueInvoicesCount) : "—"}
          isLoading={isKpisLoading}
        />
      </div>

      {/* Revenue chart */}
      <RevenueChart />

      {/* Invoices table */}
      <div>
        {/* Filter tabs */}
        <div className="mb-3 flex items-center gap-1 border-b border-gray-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={String(tab.value)}
              type="button"
              onClick={() => {
                setActiveStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeStatus === tab.value
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable<Invoice>
          columns={COLUMNS}
          rows={invoicesPage?.data ?? []}
          isLoading={isInvoicesLoading}
          emptyMessage="No invoices found for this filter."
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="flex h-7 w-7 items-center justify-center rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
