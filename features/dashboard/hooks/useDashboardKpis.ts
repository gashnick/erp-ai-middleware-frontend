import { useQuery } from "@tanstack/react-query";
import { financeService } from "../../finance/services/finance.service";
import type { DashboardKpis } from "../../finance/types";

const STALE_TIME_MS = 30_000;

export function useDashboardKpis() {
  return useQuery<DashboardKpis>({
    queryKey: ["finance", "dashboard-kpis"],
    queryFn: async () => {
      const result = await financeService.getDashboardKpis();
      console.log("=== Dashboard KPIs Full Response ===");
      console.log("Result:", result);
      console.log("Keys:", Object.keys(result || {}));
      console.log("JSON:", JSON.stringify(result, null, 2));
      console.log("=================================");
      return result;
    },
    staleTime: STALE_TIME_MS,
    refetchOnWindowFocus: true,
  });
}
