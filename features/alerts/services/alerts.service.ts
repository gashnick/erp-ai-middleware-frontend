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
    metric?: string
    severity?: string
    isActive?: boolean
  }): Promise<PaginatedResponse<AlertRule>> {
    const p: Record<string, string> = {}
    if (params?.metric) p.metric = params.metric
    if (params?.severity) p.severity = params.severity
    if (params?.isActive !== undefined) p.isActive = String(params.isActive)
    return apiClient.get<PaginatedResponse<AlertRule>>('/alerts/rules', p)
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
    status?: string
    severity?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedResponse<AlertEvent>> {
    const p: Record<string, string> = {}
    if (params?.status) p.status = params.status
    if (params?.severity) p.severity = params.severity
    if (params?.limit) p.limit = String(params.limit)
    if (params?.offset) p.offset = String(params.offset)
    return apiClient.get<PaginatedResponse<AlertEvent>>('/alerts/events', p)
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

  async getOpenAlerts(params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<AlertEvent>> {
    return apiClient.get<PaginatedResponse<AlertEvent>>('/alerts/events/open', {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
    })
  },
};
