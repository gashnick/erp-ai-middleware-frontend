import { apiClient } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api.types";
import {
  CashBalance,
  DashboardKpis,
  Invoice,
  RevenueDataPoint,
  FinanceDashboardData,
  FinanceDashboardFilters,
  ExpenseBreakdown,
  InvoiceAging,
  RecentTransaction,
  CashFlowData,
} from "../types";

export const financeService = {
  async getDashboardKpis(): Promise<DashboardKpis> {
    return apiClient.get<DashboardKpis>("/finance/dashboard/kpis");
  },

  async getDashboardMetrics(
    filters?: FinanceDashboardFilters,
  ): Promise<FinanceDashboardData> {
    const params = buildFilterParams(filters);
    return apiClient.get<FinanceDashboardData>("/dashboard/finance", params);
  },

  async getCashBalance(): Promise<CashBalance> {
    return apiClient.get<CashBalance>("/finance/cash-balance");
  },

  async getCashPosition(asOf?: string): Promise<CashBalance> {
    if (asOf) {
      return apiClient.get<CashBalance>("/finance/cash-position", {
        asOf,
      });
    }
    return apiClient.get<CashBalance>("/finance/cash-position");
  },

  async getRevenueChart(months: number = 12): Promise<RevenueDataPoint[]> {
    return apiClient.get<RevenueDataPoint[]>("/finance/revenue-chart", {
      months: String(months),
    });
  },

  async getRevenueByMonth(
    year: number,
  ): Promise<{ month: number; revenue: number; label: string }[]> {
    return apiClient.get("/finance/revenue/by-month", {
      year: String(year),
    });
  },

  async getExpenseBreakdown(
    from: string,
    to: string,
  ): Promise<ExpenseBreakdown[]> {
    return apiClient.get<ExpenseBreakdown[]>("/finance/expenses/breakdown", {
      from,
      to,
    });
  },

  async getInvoiceAging(): Promise<InvoiceAging[]> {
    return apiClient.get<InvoiceAging[]>("/finance/invoices/aging");
  },

  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Invoice>> {
    return apiClient.get<PaginatedResponse<Invoice>>("/invoices", {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.status ? { status: params.status } : {}),
    });
  },

  async getRecentTransactions(
    limit: number = 10,
  ): Promise<RecentTransaction[]> {
    return apiClient.get<RecentTransaction[]>("/finance/transactions/recent", {
      limit: String(limit),
    });
  },

  async getCashFlow(year: number): Promise<CashFlowData[]> {
    return apiClient.get<CashFlowData[]>("/finance/cash-flow", {
      year: String(year),
    });
  },

  async exportDashboardPdf(filters?: FinanceDashboardFilters): Promise<Blob> {
    const params = buildFilterParams(filters);
    return apiClient.get("/finance/dashboard/export/pdf", {
      params,
      responseType: "blob",
    });
  },
};

/**
 * Helper: Build filter params for API requests
 */
function buildFilterParams(filters?: FinanceDashboardFilters): any {
  if (!filters) return { period: "month" };

  const params: any = { period: filters.period };

  if (filters.period === "custom" && filters.dateRange) {
    params.from = filters.dateRange.from.toISOString().split("T")[0];
    params.to = filters.dateRange.to.toISOString().split("T")[0];
  }

  if (filters.currencies && filters.currencies.length > 0) {
    params.currencies = filters.currencies.join(",");
  }

  return params;
}
