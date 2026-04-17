import { useQuery } from "@tanstack/react-query";
import { financeService } from "../services/finance.service";
import type { CashBalance } from "../types";

export function useCashBalance() {
  return useQuery<CashBalance>({
    queryKey: ["finance", "cash-balance"],
    queryFn: financeService.getCashBalance,
    staleTime: 30_000,
    refetchInterval: 60_000, // Poll every 60s for near-realtime balance
  });
}
