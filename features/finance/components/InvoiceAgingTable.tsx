"use client";

import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { useInvoiceAging } from "../hooks/useExpenses";
import { InvoiceAging } from "../types";

const COLUMNS: DataTableColumn<InvoiceAging>[] = [
  {
    key: "bucket",
    label: "Days Outstanding",
    render: (row) => (
      <span className="font-medium">
        {row.bucket === "90+" ? "90+ days" : row.bucket + " days"}
      </span>
    ),
  },
  {
    key: "count",
    label: "Count",
    align: "right",
    render: (row) => <span className="font-medium">{row.count}</span>,
  },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (row) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(row.amount, row.currency)}
      </span>
    ),
  },
  {
    key: "percentage",
    label: "Percent",
    align: "right",
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${row.percentage}%` }}
          />
        </div>
        <span className="w-10 text-right text-sm font-medium">
          {row.percentage.toFixed(1)}%
        </span>
      </div>
    ),
  },
];

/**
 * Shows invoice aging report - breakdown of invoices by days outstanding
 */
export function InvoiceAgingTable() {
  const { data, isLoading, error } = useInvoiceAging();

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        Failed to load invoice aging data
      </div>
    );
  }

  return (
    <DataTable
      columns={COLUMNS}
      data={data ?? []}
      isLoading={isLoading}
      compact
      title="Invoice Aging"
    />
  );
}
