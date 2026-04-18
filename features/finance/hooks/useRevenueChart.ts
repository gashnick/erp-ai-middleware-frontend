import { useQuery } from "@tanstack/react-query";
import { financeService } from "../services/finance.service";
import { RevenueDataPoint, RevenueByMonth } from "../types";

export function useRevenueChart(months: number = 12) {
  return useQuery<RevenueDataPoint[]>({
    queryKey: ["finance", "revenue-chart", months],
    queryFn: () => financeService.getRevenueChart(months),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });
}

export function useRevenueByMonth(year: number) {
  return useQuery<{ month: number; revenue: number; label: string }[]>({
    queryKey: ["finance", "revenue-by-month", year],
    queryFn: () => financeService.getRevenueByMonth(year),
    staleTime: 5 * 60 * 1000,
  });
}
