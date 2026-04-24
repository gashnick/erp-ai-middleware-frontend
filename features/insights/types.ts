export type AnomalyType =
  | "EXPENSE_SPIKE"
  | "DUPLICATE_INVOICE"
  | "UNUSUAL_PAYMENT";

export interface Insight {
  id: string;
  type: AnomalyType;
  score: number; // 0–1
  confidence: number; // 0–1
  explanation: string;
  relatedIds: string[];
  detectedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ScanResponse {
  jobId: string | number;
}

export interface InsightFilters {
  types?: AnomalyType[];
  minScore?: number;
}

export const ANOMALY_TYPE_CONFIG: Record<
  AnomalyType,
  { label: string; description: string; icon: string; colorClass: string }
> = {
  EXPENSE_SPIKE: {
    label: "Expense Spike",
    description: "Unusually high vendor spend detected",
    icon: "📈",
    colorClass: "text-orange-600 bg-orange-50 border-orange-200",
  },
  DUPLICATE_INVOICE: {
    label: "Duplicate Invoice",
    description: "Potential duplicate invoice found",
    icon: "🔁",
    colorClass: "text-red-600 bg-red-50 border-red-200",
  },
  UNUSUAL_PAYMENT: {
    label: "Unusual Payment",
    description: "Payment pattern outside normal range",
    icon: "⚠️",
    colorClass: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
};
