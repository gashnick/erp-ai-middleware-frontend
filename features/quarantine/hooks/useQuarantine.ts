import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quarantineService } from "../services/quarantine.service";
import type { QuarantineFilters, QuarantineStatus } from "../types";

export function useQuarantineRecords(filters?: QuarantineFilters) {
  return useQuery({
    queryKey: ["quarantine", "records", filters],
    queryFn: () => quarantineService.getRecords(filters),
    staleTime: 15_000,
  });
}

export function useQuarantineStatus() {
  return useQuery({
    queryKey: ["quarantine", "status"],
    queryFn: quarantineService.getStatus,
    staleTime: 15_000,
  });
}

export function useRetryRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      fixedData,
    }: {
      id: string;
      fixedData?: Record<string, unknown>;
    }) => quarantineService.retryRecord(id, fixedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarantine"] });
    },
  });
}

export function useBatchRetry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => quarantineService.batchRetry(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quarantine"] });
    },
  });
}

export function useQuarantineFilters() {
  const [filters, setFilters] = useState<QuarantineFilters>({
    limit: 20,
    offset: 0,
  });

  function setStatus(status: QuarantineStatus | undefined) {
    setFilters((f) => ({ ...f, status, offset: 0 }));
  }

  function setEntityType(entity_type: string | undefined) {
    setFilters((f) => ({ ...f, entity_type, offset: 0 }));
  }

  function nextPage() {
    setFilters((f) => ({ ...f, offset: (f.offset ?? 0) + (f.limit ?? 20) }));
  }

  function prevPage() {
    setFilters((f) => ({
      ...f,
      offset: Math.max(0, (f.offset ?? 0) - (f.limit ?? 20)),
    }));
  }

  return { filters, setStatus, setEntityType, nextPage, prevPage };
}
