import type { AlertMetric, AlertOperator, AlertSeverity } from "../types";

export interface MetricConfig {
  id: AlertMetric;
  label: string;
  description: string;
  unit: string;
  dataType: "number" | "currency" | "percentage";
  supportedOperators: AlertOperator[];
  defaultThreshold: number;
  icon: string;
}

export const ALERT_METRICS: Record<AlertMetric, MetricConfig> = {
  cash_balance: {
    id: "cash_balance",
    label: "Cash Balance",
    description: "Alert when cash balance falls below threshold",
    unit: "USD",
    dataType: "currency",
    supportedOperators: ["lt", "lte", "between"],
    defaultThreshold: 10000,
    icon: "DollarSign",
  },
  revenue: {
    id: "revenue",
    label: "Revenue",
    description: "Alert when monthly revenue is below threshold",
    unit: "USD",
    dataType: "currency",
    supportedOperators: ["lt", "lte", "gt", "gte", "between"],
    defaultThreshold: 50000,
    icon: "TrendingUp",
  },
  expenses: {
    id: "expenses",
    label: "Expenses",
    description: "Alert when expenses exceed threshold",
    unit: "USD",
    dataType: "currency",
    supportedOperators: ["gt", "gte", "between"],
    defaultThreshold: 30000,
    icon: "TrendingDown",
  },
  invoice_overdue: {
    id: "invoice_overdue",
    label: "Overdue Invoices",
    description: "Alert when overdue invoices count exceeds threshold",
    unit: "count",
    dataType: "number",
    supportedOperators: ["gt", "gte", "eq"],
    defaultThreshold: 5,
    icon: "AlertCircle",
  },
  employee_count: {
    id: "employee_count",
    label: "Employee Count",
    description: "Alert when employee count changes",
    unit: "count",
    dataType: "number",
    supportedOperators: ["lt", "gt", "eq"],
    defaultThreshold: 50,
    icon: "Users",
  },
  asset_uptime: {
    id: "asset_uptime",
    label: "Asset Uptime",
    description: "Alert when asset uptime falls below threshold",
    unit: "%",
    dataType: "percentage",
    supportedOperators: ["lt", "lte"],
    defaultThreshold: 95,
    icon: "Server",
  },
};

export const ALERT_OPERATORS: Record<
  AlertOperator,
  { label: string; description: string }
> = {
  gt: { label: "Greater than", description: "Value > threshold" },
  gte: { label: "Greater than or equal", description: "Value >= threshold" },
  lt: { label: "Less than", description: "Value < threshold" },
  lte: { label: "Less than or equal", description: "Value <= threshold" },
  eq: { label: "Equal to", description: "Value = threshold" },
  between: {
    label: "Between",
    description: "threshold_min <= Value <= threshold_max",
  },
};

export const ALERT_SEVERITIES: Record<
  AlertSeverity,
  { label: string; color: string; bgColor: string }
> = {
  low: {
    label: "Low",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  high: {
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  critical: {
    label: "Critical",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export const ALERT_CHANNELS = [
  { id: "in_app", label: "In-App", icon: "Bell" },
  { id: "email", label: "Email", icon: "Mail" },
  { id: "sms", label: "SMS", icon: "MessageSquare" },
  { id: "slack", label: "Slack", icon: "Send" },
] as const;

export function getMetricConfig(metric: AlertMetric): MetricConfig {
  return ALERT_METRICS[metric];
}

export function getOperatorLabel(operator: AlertOperator): string {
  return ALERT_OPERATORS[operator].label;
}

export function getSeverityConfig(severity: AlertSeverity) {
  return ALERT_SEVERITIES[severity];
}
