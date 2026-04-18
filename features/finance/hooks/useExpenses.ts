import { useQuery } from "@tanstack/react-query";
import { financeService } from "../services/finance.service";
import {
  ExpenseBreakdown,
  InvoiceAging,
  RecentTransaction,
  CashFlowData,
} from "../types";

export function useExpenses(from: string, to: string) {
  return useQuery<ExpenseBreakdown[]>({
    queryKey: ["finance", "expenses", from, to],
    queryFn: () => financeService.getExpenseBreakdown(from, to),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvoiceAging() {
  return useQuery<InvoiceAging[]>({
    queryKey: ["finance", "invoices", "aging"],
    queryFn: () => financeService.getInvoiceAging(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
}

export function useRecentTransactions(limit: number = 10) {
  return useQuery<RecentTransaction[]>({
    queryKey: ["finance", "transactions", "recent", limit],
    queryFn: () => financeService.getRecentTransactions(limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCashFlow(year: number) {
  return useQuery<CashFlowData[]>({
    queryKey: ["finance", "cash-flow", year],
    queryFn: () => financeService.getCashFlow(year),
    staleTime: 5 * 60 * 1000,
  });
}
