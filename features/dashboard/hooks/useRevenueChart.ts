import { useQuery } from "@tanstack/react-query";
import { financeService } from "../../Finance/services/finance.service";
import type { RevenueDataPoint } from "../../Finance/types";

export function useRevenueChart(months: number = 6) {
  return useQuery<RevenueDataPoint[]>({
    queryKey: ["finance", "revenue-chart", months],
    queryFn: () => financeService.getRevenueChart(months),
    staleTime: 60_000,
  });
}
