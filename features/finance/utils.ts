import type { InvoiceStatus, CashBalance } from "./types";

/**
 * Maps an InvoiceStatus to a display label and badge variant.
 */
export function getInvoiceStatusConfig(status: InvoiceStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "neutral";
} {
  const map: Record<
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
  return map[status];
}

/**
 * Returns true when a due date string is past today.
 */
export function isInvoiceOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}

/**
 * Derives a cash balance health label for display.
 */
export function getCashBalanceLabel(balance: CashBalance): string {
  if (balance.trend === "down" && balance.changePercentage < -10) {
    return "Declining fast";
  }
  if (balance.trend === "down") return "Declining";
  if (balance.trend === "up") return "Growing";
  return "Stable";
}

/**
 * Formats a change percentage with sign for display.
 * E.g. 5.2 → "+5.2%", -3 → "-3%"
 */
export function formatChangePercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
