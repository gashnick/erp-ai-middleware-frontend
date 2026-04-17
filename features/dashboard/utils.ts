import type { DashboardKpis } from "./types";

/**
 * Returns a human-readable summary line for the dashboard header.
 * Example: "4 overdue invoices · 2 alerts"
 */
export function buildDashboardSummaryLine(kpis: DashboardKpis): string {
  const parts: string[] = [];

  if (kpis.overdueInvoicesCount > 0) {
    parts.push(
      `${kpis.overdueInvoicesCount} overdue invoice${kpis.overdueInvoicesCount > 1 ? "s" : ""}`,
    );
  }

  if (kpis.pendingInvoicesCount > 0) {
    parts.push(`${kpis.pendingInvoicesCount} pending`);
  }

  return parts.length > 0 ? parts.join(" · ") : "All clear";
}

/**
 * Determines the overall financial health signal for the dashboard banner.
 */
export function getFinancialHealthSignal(
  kpis: DashboardKpis,
): "healthy" | "warning" | "critical" {
  if (kpis.overdueInvoicesCount > 10 || kpis.cashBalance.trend === "down") {
    return kpis.overdueInvoicesCount > 25 ? "critical" : "warning";
  }
  return "healthy";
}
