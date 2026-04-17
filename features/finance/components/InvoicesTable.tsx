"use client";

import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";
import { useInvoices } from "../hooks/useInvoices.ts";
import type { Invoice, InvoiceStatus } from "../types";

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
    label: "Invoice",
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
  {
    key: "dueDate",
    label: "Due Date",
    sortable: true,
    render: (row) => (
      <span className="text-gray-500 text-xs">
        {new Date(row.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];

export function InvoicesTable() {
  const { data, isLoading } = useInvoices({ limit: 10 });

  return (
    <DataTable<Invoice>
      columns={COLUMNS}
      rows={data?.data ?? []}
      isLoading={isLoading}
      emptyMessage="No invoices found."
    />
  );
}
