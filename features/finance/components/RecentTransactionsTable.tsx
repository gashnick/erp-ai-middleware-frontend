"use client";

import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRecentTransactions } from "../hooks/useExpenses";
import type { RecentTransaction } from "../types";
import { cn } from "@/utils/cn";

const COLUMNS: DataTableColumn<RecentTransaction>[] = [
  {
    key: "description",
    label: "Description",
    render: (row) => (
      <span className="text-sm text-gray-900">{row.description ?? "—"}</span>
    ),
  },
  {
    key: "reference",
    label: "Reference",
    render: (row) => (
      <span className="font-mono text-xs text-gray-500">
        {row.reference ?? "—"}
      </span>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (row) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          row.type === "credit"
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700",
        )}
      >
        {row.type === "credit" ? "↑ Credit" : "↓ Debit"}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (row) => (
      <span
        className={cn(
          "font-medium tabular-nums",
          row.type === "credit" ? "text-green-700" : "text-red-600",
        )}
      >
        {row.type === "credit" ? "+" : "-"}
        {formatCurrency(row.amount, row.currency)}
      </span>
    ),
  },
  {
    key: "transactionDate",
    label: "Date",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {row.transactionDate
          ? new Date(row.transactionDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—"}
      </span>
    ),
  },
];

interface RecentTransactionsTableProps {
  limit?: number;
}

export function RecentTransactionsTable({
  limit = 10,
}: RecentTransactionsTableProps) {
  const { data, isLoading, error } = useRecentTransactions(limit);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        Failed to load recent transactions
      </div>
    );
  }

  return (
    <DataTable<RecentTransaction>
      columns={COLUMNS}
      rows={data ?? []}
      isLoading={isLoading}
      emptyMessage="No transactions found."
      className="rounded-lg border border-gray-200"
    />
  );
}
