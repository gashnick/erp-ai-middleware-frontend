import { useQuery } from "@tanstack/react-query";
import { financeService } from "../../finance/services/finance.service";
import type { DashboardKpis } from "../../finance/types";

const STALE_TIME_MS = 30_000;

export function useDashboardKpis() {
  return useQuery<DashboardKpis>({
    queryKey: ["finance", "dashboard-kpis"],
    queryFn: financeService.getDashboardKpis,
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: true,
  });
}
