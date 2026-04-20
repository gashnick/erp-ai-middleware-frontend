"use client";

import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { useRecentTransactions } from "../hooks/useExpenses";
import { RecentTransaction } from "../types";

type TransactionRow = RecentTransaction & { id: string };

const STATUS_VARIANT_MAP: Record<
  RecentTransaction["status"],
  "success" | "warning" | "error" | "neutral"
> = {
  completed: "success",
  pending: "warning",
  failed: "error",
};

const TYPE_BADGE_MAP: Record<RecentTransaction["type"], string> = {
  invoice: "Invoice",
  expense: "Expense",
  payment: "Payment",
  deposit: "Deposit",
};

const COLUMNS: DataTableColumn<TransactionRow>[] = [
  {
    key: "description",
    label: "Description",
    render: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-gray-900">{row.description}</span>
        <span className="text-xs text-gray-500">
          {TYPE_BADGE_MAP[row.type]}
        </span>
      </div>
    ),
  },
  {
    key: "counterparty",
    label: "Counterparty",
    render: (row) => (
      <span className="text-gray-600">{row.counterparty || "—"}</span>
    ),
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
    key: "date",
    label: "Date",
    render: (row) => (
      <span className="text-gray-600">{formatDate(row.date)}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        variant={STATUS_VARIANT_MAP[row.status]}
      />
    ),
  },
];

interface RecentTransactionsTableProps {
  limit?: number;
}

/**
 * Shows recent transactions across invoices, expenses, and payments
 */
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
    <DataTable
      columns={COLUMNS as DataTableColumn<{ id: string | number }>[]}
      rows={(data ?? []) as TransactionRow[]}
      isLoading={isLoading}
      className="rounded-lg border border-gray-200"
    />
  );
}
