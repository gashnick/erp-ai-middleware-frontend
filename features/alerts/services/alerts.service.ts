import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import {
  AlertRule,
  AlertEvent,
  CreateAlertRuleDto,
  UpdateAlertRuleDto,
  AlertStats,
} from "../types";

export const alertsService = {
  // Alert Rules
  async createAlertRule(dto: CreateAlertRuleDto): Promise<AlertRule> {
    return apiClient.post<AlertRule>("/alerts/rules", dto);
  },

  async listAlertRules(params?: {
    page?: number;
    limit?: number;
    is_active?: boolean;
  }): Promise<PaginatedResponse<AlertRule>> {
    return apiClient.get<PaginatedResponse<AlertRule>>("/alerts/rules", {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.is_active !== undefined
        ? { is_active: String(params.is_active) }
        : {}),
    });
  },

  async getAlertRule(id: string): Promise<AlertRule> {
    return apiClient.get<AlertRule>(`/alerts/rules/${id}`);
  },

  async updateAlertRule(
    id: string,
    dto: UpdateAlertRuleDto,
  ): Promise<AlertRule> {
    return apiClient.patch<AlertRule>(`/alerts/rules/${id}`, dto);
  },

  async deleteAlertRule(id: string): Promise<void> {
    return apiClient.delete<void>(`/alerts/rules/${id}`);
  },

  // Alert Events
  async listAlertEvents(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
  }): Promise<PaginatedResponse<AlertEvent>> {
    return apiClient.get<PaginatedResponse<AlertEvent>>("/alerts/events", {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.severity ? { severity: params.severity } : {}),
    });
  },

  async getAlertEvent(id: string): Promise<AlertEvent> {
    return apiClient.get<AlertEvent>(`/alerts/events/${id}`);
  },

  async acknowledgeAlertEvent(id: string): Promise<AlertEvent> {
    return apiClient.post<AlertEvent>(`/alerts/events/${id}/acknowledge`, {});
  },

  async resolveAlertEvent(id: string): Promise<AlertEvent> {
    return apiClient.post<AlertEvent>(`/alerts/events/${id}/resolve`, {});
  },

  // Alert Stats
  async getAlertStats(): Promise<AlertStats> {
    return apiClient.get<AlertStats>("/alerts/stats");
  },

  // Open Alerts (convenience method)
  async getOpenAlerts(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AlertEvent>> {
    return apiClient.get<PaginatedResponse<AlertEvent>>("/alerts/events/open", {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
    });
  },
};
