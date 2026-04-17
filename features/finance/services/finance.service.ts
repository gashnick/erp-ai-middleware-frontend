import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import {
  CashBalance,
  DashboardKpis,
  Invoice,
  RevenueDataPoint,
} from "../types";

export const financeService = {
  async getDashboardKpis(): Promise<DashboardKpis> {
    return apiClient.get<DashboardKpis>("/finance/dashboard/kpis");
  },

  async getCashBalance(): Promise<CashBalance> {
    return apiClient.get<CashBalance>("/finance/cash-balance");
  },

  async getRevenueChart(months: number = 12): Promise<RevenueDataPoint[]> {
    return apiClient.get<RevenueDataPoint[]>("/finance/revenue-chart", {
      months: String(months),
    });
  },

  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Invoice>> {
    return apiClient.get<PaginatedResponse<Invoice>>("/finance/invoices", {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.status ? { status: params.status } : {}),
    });
  },
};
