import { apiClient } from "@/lib/api-client";
import type { Insight, InsightFilters, ScanResponse } from "../types";

export const insightsService = {
  async listInsights(filters?: InsightFilters): Promise<Insight[]> {
    const params: Record<string, string> = {};
    if (filters?.types?.length) params.types = filters.types.join(",");
    if (filters?.minScore !== undefined)
      params.minScore = String(filters.minScore);
    return apiClient.get<Insight[]>("/insights", params);
  },

  async getInsight(id: string): Promise<Insight> {
    return apiClient.get<Insight>(`/insights/${id}`);
  },

  async triggerScan(): Promise<ScanResponse> {
    return apiClient.post<ScanResponse>("/insights/scan", {});
  },
};
