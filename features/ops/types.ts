export type AssetStatus = "operational" | "maintenance" | "offline" | "retired";

export interface Asset {
  id: string;
  externalId: string | null;
  name: string;
  category: string;
  status: AssetStatus;
  uptimePct: number | null;
  lastService: string | null;
  nextService: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  operational: number;
  avgUptimePct: number | null;
}

export interface InventorySummary {
  total: number;
  operational: number;
  maintenance: number;
  offline: number;
  retired: number;
  byCategory: CategorySummary[];
}

export interface OrdersByStatus {
  status: string;
  count: number;
  totalValue: number;
  avgValue: number;
}

export interface OrdersByChannel {
  channel: string;
  count: number;
  totalValue: number;
}

export interface OrdersPipeline {
  totalOrders: number;
  totalValue: number;
  byStatus: OrdersByStatus[];
  byChannel: OrdersByChannel[];
}

export type SlaState = "ok" | "warning" | "breached";

export interface SlaConfig {
  id: string;
  name: string;
  metric: string;
  targetValue: number;
  warningPct: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SlaStatusItem extends SlaConfig {
  actualValue: number | null;
  usedPct: number | null;
  state: SlaState;
}

export interface SlaStatusResult {
  asOf: string;
  total: number;
  ok: number;
  warning: number;
  breached: number;
  items: SlaStatusItem[];
}

export interface CreateSlaConfigDto {
  name: string;
  metric: string;
  targetValue: number;
  warningPct?: number;
}

export interface AssetFilters {
  category?: string;
  status?: AssetStatus;
  limit?: number;
  offset?: number;
}

export const SLA_METRICS = [
  {
    value: "invoice_processing_hours",
    label: "Invoice Processing Time (hours)",
  },
  { value: "overdue_invoice_count", label: "Overdue Invoice Count" },
  { value: "orders_in_progress", label: "Orders In Progress" },
  { value: "avg_asset_uptime_pct", label: "Avg Asset Uptime (%)" },
];
