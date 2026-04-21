import { useQuery } from "@tanstack/react-query";
import { alertsServiceInstance } from "../services";

export function useAlertStats() {
  return useQuery({
    queryKey: ["alerts", "stats"],
    queryFn: () => alertsServiceInstance.getAlertStats(),
    staleTime: 20_000,
    refetchInterval: 30_000,
  });
}
