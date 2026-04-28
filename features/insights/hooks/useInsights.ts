import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { insightsService } from "../services/insights.service";
import type { AnomalyType, InsightFilters } from "../types";

export function useInsights(filters?: InsightFilters) {
  return useQuery({
    queryKey: ["insights", "list", filters],
    queryFn: () => insightsService.listInsights(filters),
    staleTime: 30_000,
  });
}

export function useInsight(id: string) {
  return useQuery({
    queryKey: ["insights", id],
    queryFn: () => insightsService.getInsight(id),
    staleTime: 60_000,
    enabled: !!id,
  });
}

export function useTriggerScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: insightsService.triggerScan,
    onSuccess: () => {
      // Refetch insights after a short delay to allow scan to complete
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["insights"] });
      }, 3000);
    },
  });
}

export function useInsightFilters() {
  const [filters, setFilters] = useState<InsightFilters>({});

  function setMinScore(minScore: number | undefined) {
    setFilters((f) => ({ ...f, minScore }));
  }

  function toggleType(type: AnomalyType) {
    setFilters((f) => {
      const current = f.types ?? [];
      const exists = current.includes(type);
      return {
        ...f,
        types: exists ? current.filter((t) => t !== type) : [...current, type],
      };
    });
  }

  function clearFilters() {
    setFilters({});
  }

  return { filters, setMinScore, toggleType, clearFilters };
}
