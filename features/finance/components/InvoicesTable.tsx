"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateSafe } from "@/utils/formatDate";
import { displayEncrypted, isEncrypted } from "@/utils/encryption";
import { useInvoices } from "../hooks/useInvoices";
import { cn } from "@/utils/cn";
import type { Invoice, InvoiceStatus } from "../types";

const STATUS_BADGE_MAP: Record<
  InvoiceStatus,
  { label: string; variant: "success" | "warning" | "error" | "neutral" }
> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  overdue: { label: "Overdue", variant: "error" },
  draft: { label: "Draft", variant: "neutral" },
  sent: { label: "Sent", variant: "info" as "success" },
  void: { label: "Void", variant: "neutral" },
};

const COLUMNS: DataTableColumn<Invoice>[] = [
  {
    key: "invoice_number",
    label: "Invoice",
    render: (row) => (
      <span className="font-mono text-xs font-medium text-gray-900">
        {displayEncrypted(row.invoice_number)}
      </span>
    ),
  },
  {
    key: "customer_name",
    label: "Customer",
    sortable: true,
    render: (row) => displayEncrypted(row.customer_name),
  },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    sortable: true,
    render: (row) => (
      <span className="font-medium tabular-nums">
        {formatCurrency(Number(row.amount), row.currency)}
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
    key: "due_date",
    label: "Due Date",
    sortable: true,
    render: (row) => (
      <span className="text-gray-500 text-xs">
        {formatDateSafe(row.due_date)}
      </span>
    ),
  },
];

const STATUS_TABS: { label: string; value: InvoiceStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
  { label: "Draft", value: "draft" },
];

export function InvoicesTable() {
  const [activeStatus, setActiveStatus] = useState<InvoiceStatus | undefined>();
  const { data, isLoading } = useInvoices({ limit: 10, status: activeStatus });
  
  // Handle both array and paginated response formats
  const invoices = Array.isArray(data) ? data : data?.data ?? [];
  
  // Debug logging
  console.log("=== InvoicesTable Debug ===");
  console.log("Raw data:", data);
  console.log("Invoices array:", invoices);
  if (invoices.length > 0) {
    console.log("First invoice:", invoices[0]);
    console.log("First invoice customer_name:", invoices[0].customer_name);
    console.log("Is customer_name encrypted?", isEncrypted(invoices[0].customer_name));
    console.log("First invoice invoice_number:", invoices[0].invoice_number);
    console.log("Is invoice_number encrypted?", isEncrypted(invoices[0].invoice_number));
    console.log("First invoice due_date:", invoices[0].due_date);
  }
  console.log("=========================");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 border-b border-gray-200">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            type="button"
            onClick={() => setActiveStatus(tab.value)}
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
        rows={invoices}
        isLoading={isLoading}
        emptyMessage="No invoices found."
      />
    </div>
  );
}
