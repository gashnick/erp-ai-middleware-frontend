import { apiClient } from "@/lib/api-client";
import type { DashboardSummary } from "../types";

export const dashboardService = {
  /**
   * Single aggregated endpoint — returns KPIs from all feature areas
   * in one call, avoiding multiple waterfall requests on dashboard load.
   */
  async getSummary(): Promise<DashboardSummary> {
    return apiClient.get<DashboardSummary>("/dashboard/summary");
  },
};
