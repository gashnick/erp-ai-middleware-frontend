export type AlertMetric =
  | "cash_balance"
  | "revenue"
  | "expenses"
  | "invoice_overdue"
  | "employee_count"
  | "asset_uptime";

export type AlertOperator = "gt" | "lt" | "eq" | "gte" | "lte" | "between";
export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertChannel = "in_app" | "email" | "sms" | "slack";
export type AlertEventStatus = "open" | "acknowledged" | "resolved";

export interface AlertRule {
  id: string;
  name: string;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  threshold_max?: number;
  severity: AlertSeverity;
  channels: AlertChannel[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface AlertEvent {
  id: string;
  rule_id: string;
  metric: AlertMetric;
  current_value: number;
  threshold: number;
  severity: AlertSeverity;
  status: AlertEventStatus;
  detected_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  message: string;
  metadata?: Record<string, any>;
}

export interface CreateAlertRuleDto {
  name: string;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  threshold_max?: number;
  severity: AlertSeverity;
  channels: AlertChannel[];
  is_active?: boolean;
}

export interface UpdateAlertRuleDto {
  name?: string;
  metric?: AlertMetric;
  operator?: AlertOperator;
  threshold?: number;
  threshold_max?: number;
  severity?: AlertSeverity;
  channels?: AlertChannel[];
  is_active?: boolean;
}

export interface AlertFilters {
  severity?: AlertSeverity;
  metric?: AlertMetric;
  status?: AlertEventStatus;
  isActive?: boolean;
  searchTerm?: string;
}

export interface AlertStats {
  total_rules: number;
  active_rules: number;
  open_events: number;
  by_severity: Record<AlertSeverity, number>;
}
