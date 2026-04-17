import type { CashBalance, DashboardKpis } from "@/features/finance/types";

// Re-export finance KPIs as the dashboard's primary KPI shape.
// The dashboard aggregates data from multiple features; extend here
// as HR and Ops KPIs are added to the dashboard summary.
export type { DashboardKpis, CashBalance };

export interface DashboardWidget {
  id: string;
  title: string;
  type: "kpi" | "chart" | "table" | "alert";
  featureArea: "finance" | "hr" | "ops" | "chat";
  isVisible: boolean;
  order: number;
}

export interface DashboardSummary {
  kpis: DashboardKpis;
  alertsCount: number;
  lastRefreshedAt: string;
}
