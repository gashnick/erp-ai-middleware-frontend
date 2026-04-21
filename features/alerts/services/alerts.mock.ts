import type { PaginatedResponse } from "@/types/api.types";
import {
  AlertRule,
  AlertEvent,
  CreateAlertRuleDto,
  UpdateAlertRuleDto,
  AlertStats,
} from "../types";

// Mock data
const mockRules: AlertRule[] = [
  {
    id: "rule-1",
    name: "Low Cash Balance Alert",
    metric: "cash_balance",
    operator: "lt",
    threshold: 10000,
    severity: "high",
    channels: ["in_app", "email"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule-2",
    name: "High Expenses Alert",
    metric: "expenses",
    operator: "gt",
    threshold: 50000,
    severity: "medium",
    channels: ["in_app", "slack"],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "rule-3",
    name: "Overdue Invoices Alert",
    metric: "invoice_overdue",
    operator: "gte",
    threshold: 5,
    severity: "critical",
    channels: ["in_app", "email", "sms"],
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockEvents: AlertEvent[] = [
  {
    id: "event-1",
    rule_id: "rule-1",
    metric: "cash_balance",
    current_value: 8500,
    threshold: 10000,
    severity: "high",
    status: "open",
    detected_at: new Date(Date.now() - 3600000).toISOString(),
    message: "Cash balance has fallen below threshold",
  },
  {
    id: "event-2",
    rule_id: "rule-2",
    metric: "expenses",
    current_value: 55000,
    threshold: 50000,
    severity: "medium",
    status: "acknowledged",
    detected_at: new Date(Date.now() - 7200000).toISOString(),
    acknowledged_at: new Date(Date.now() - 3600000).toISOString(),
    message: "Expenses have exceeded the threshold",
  },
  {
    id: "event-3",
    rule_id: "rule-3",
    metric: "invoice_overdue",
    current_value: 8,
    threshold: 5,
    severity: "critical",
    status: "resolved",
    detected_at: new Date(Date.now() - 86400000).toISOString(),
    acknowledged_at: new Date(Date.now() - 43200000).toISOString(),
    resolved_at: new Date(Date.now() - 3600000).toISOString(),
    message: "Multiple invoices are overdue",
  },
];

// Mock service
export const mockAlertsService = {
  async createAlertRule(dto: CreateAlertRuleDto): Promise<AlertRule> {
    const newRule: AlertRule = {
      id: `rule-${Date.now()}`,
      ...dto,
      is_active: dto.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockRules.push(newRule);
    return newRule;
  },

  async listAlertRules(params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
  }): Promise<PaginatedResponse<AlertRule>> {
    let filtered = mockRules;
    if (params?.is_active !== undefined) {
      filtered = filtered.filter((r) => r.is_active === params.is_active);
    }

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getAlertRule(id: string): Promise<AlertRule> {
    const rule = mockRules.find((r) => r.id === id);
    if (!rule) throw new Error("Rule not found");
    return rule;
  },

  async updateAlertRule(
    id: string,
    dto: UpdateAlertRuleDto,
  ): Promise<AlertRule> {
    const index = mockRules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Rule not found");

    mockRules[index] = {
      ...mockRules[index],
      ...dto,
      updated_at: new Date().toISOString(),
    };
    return mockRules[index];
  },

  async deleteAlertRule(id: string): Promise<void> {
    const index = mockRules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Rule not found");
    mockRules.splice(index, 1);
  },

  async listAlertEvents(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
  }): Promise<PaginatedResponse<AlertEvent>> {
    let filtered = mockEvents;

    if (params?.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }
    if (params?.severity) {
      filtered = filtered.filter((e) => e.severity === params.severity);
    }

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getAlertEvent(id: string): Promise<AlertEvent> {
    const event = mockEvents.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  async acknowledgeAlertEvent(id: string): Promise<AlertEvent> {
    const event = mockEvents.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");
    event.status = "acknowledged";
    event.acknowledged_at = new Date().toISOString();
    return event;
  },

  async resolveAlertEvent(id: string): Promise<AlertEvent> {
    const event = mockEvents.find((e) => e.id === id);
    if (!event) throw new Error("Event not found");
    event.status = "resolved";
    event.resolved_at = new Date().toISOString();
    return event;
  },

  async getAlertStats(): Promise<AlertStats> {
    return {
      total_rules: mockRules.length,
      active_rules: mockRules.filter((r) => r.is_active).length,
      open_events: mockEvents.filter((e) => e.status === "open").length,
      by_severity: {
        low: mockEvents.filter((e) => e.severity === "low").length,
        medium: mockEvents.filter((e) => e.severity === "medium").length,
        high: mockEvents.filter((e) => e.severity === "high").length,
        critical: mockEvents.filter((e) => e.severity === "critical").length,
      },
    };
  },

  async getOpenAlerts(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AlertEvent>> {
    const openEvents = mockEvents.filter((e) => e.status === "open");
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: openEvents.slice(start, end),
      total: openEvents.length,
      page,
      limit,
      totalPages: Math.ceil(openEvents.length / limit),
    };
  },
};
