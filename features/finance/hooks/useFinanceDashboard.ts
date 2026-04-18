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
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to fetch finance dashboard");
      setError(error);
      console.error("Error fetching finance dashboard:", error);
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
