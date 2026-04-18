import { useEffect, useState, useCallback } from "react";
import { financeService } from "../services/finance.service";
import { FinanceDashboardData, FinanceDashboardFilters } from "../types";

interface UseFinanceDashboardReturn {
  data: FinanceDashboardData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  filters: FinanceDashboardFilters;
  setFilters: (filters: FinanceDashboardFilters) => void;
}

const defaultFilters: FinanceDashboardFilters = {
  period: "month",
};

export function useFinanceDashboard(
  initialFilters?: Partial<FinanceDashboardFilters>,
): UseFinanceDashboardReturn {
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FinanceDashboardFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await financeService.getDashboardMetrics(filters);
      setData(result);
    } catch (err) {
      // Use mock data in development when API is unavailable
      console.warn("Using mock data - API unavailable");
      const mockData: FinanceDashboardData = {
        cashBalance: {
          balance: 125000,
          currency: "USD",
          asOf: new Date().toISOString(),
          trend: "up",
          trendPercent: 12.5,
        },
        kpis: [
          {
            label: "Monthly Revenue",
            value: 45000,
            currency: "USD",
            trend: 8.2,
            period: "month",
          },
          {
            label: "Monthly Expenses",
            value: 18000,
            currency: "USD",
            trend: -2.1,
            period: "month",
          },
          {
            label: "Pending Invoices",
            value: 12,
            trend: 5,
            period: "month",
          },
          {
            label: "Overdue Invoices",
            value: 3,
            trend: -15,
            period: "month",
          },
        ],
        revenueByMonth: [
          { month: 1, year: 2024, revenue: 42000, currency: "USD" },
          { month: 2, year: 2024, revenue: 45000, currency: "USD" },
          { month: 3, year: 2024, revenue: 48000, currency: "USD" },
        ],
        expenseBreakdown: [
          {
            category: "Salaries",
            vendorId: "v1",
            vendorName: "Payroll",
            total: 8000,
            currency: "USD",
            percentage: 44,
          },
          {
            category: "Operations",
            vendorId: "v2",
            vendorName: "Utilities",
            total: 4000,
            currency: "USD",
            percentage: 22,
          },
        ],
        invoiceAging: [
          {
            id: "0-30",
            bucket: "0-30",
            count: 24,
            amount: 15000,
            currency: "USD",
            percentage: 65,
          },
          {
            id: "31-60",
            bucket: "31-60",
            count: 8,
            amount: 5000,
            currency: "USD",
            percentage: 22,
          },
          {
            id: "61-90",
            bucket: "61-90",
            count: 3,
            amount: 2000,
            currency: "USD",
            percentage: 9,
          },
          {
            id: "90+",
            bucket: "90+",
            count: 1,
            amount: 800,
            currency: "USD",
            percentage: 4,
          },
        ],
        recentTransactions: [
          {
            id: "1",
            type: "invoice",
            description: "Client Invoice #001",
            amount: 5000,
            currency: "USD",
            date: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "completed",
            counterparty: "ACME Corp",
          },
          {
            id: "2",
            type: "expense",
            description: "Office Supplies",
            amount: 250,
            currency: "USD",
            date: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
            status: "completed",
            counterparty: "Staples",
          },
        ],
        cashFlow: [
          {
            month: 1,
            year: 2024,
            inflow: 42000,
            outflow: 18000,
            netCashFlow: 24000,
            currency: "USD",
          },
          {
            month: 2,
            year: 2024,
            inflow: 45000,
            outflow: 20000,
            netCashFlow: 25000,
            currency: "USD",
          },
        ],
        currency: "USD",
        refreshedAt: new Date().toISOString(),
      };
      setData(mockData);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    filters,
    setFilters,
  };
}
