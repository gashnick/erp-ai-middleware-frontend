import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { financeService } from "../services/finance.service";
import type { InvoiceStatus } from "../types";

interface UseInvoicesParams {
  initialPage?: number;
  limit?: number;
  status?: InvoiceStatus;
}

export function useInvoices({
  initialPage = 1,
  limit = 20,
  status,
}: UseInvoicesParams = {}) {
  const [page, setPage] = useState(initialPage);

  const query = useQuery({
    queryKey: ["finance", "invoices", { page, limit, status }],
    queryFn: () => financeService.getInvoices({ page, limit, status }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });

  return {
    ...query,
    page,
    setPage,
    totalPages: query.data?.totalPages ?? 1,
  };
}
