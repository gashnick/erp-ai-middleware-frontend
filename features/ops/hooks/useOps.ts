import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { opsService } from "../services/ops.service";
import type { AssetFilters, CreateSlaConfigDto } from "../types";

export function useInventorySummary() {
  return useQuery({
    queryKey: ["ops", "inventory-summary"],
    queryFn: opsService.getInventorySummary,
    staleTime: 30_000,
  });
}

export function useAssets(filters?: AssetFilters) {
  return useQuery({
    queryKey: ["ops", "assets", filters],
    queryFn: () => opsService.getAssets(filters),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  });
}

export function useOrdersPipeline() {
  return useQuery({
    queryKey: ["ops", "orders-pipeline"],
    queryFn: opsService.getOrdersPipeline,
    staleTime: 15_000,
  });
}

export function useSlaStatus() {
  return useQuery({
    queryKey: ["ops", "sla-status"],
    queryFn: opsService.getSlaStatus,
    staleTime: 30_000,
  });
}

export function useSlaBreaches() {
  return useQuery({
    queryKey: ["ops", "sla-breaches"],
    queryFn: opsService.getSlaBreaches,
    staleTime: 15_000,
  });
}

export function useCreateSlaConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSlaConfigDto) => opsService.createSlaConfig(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops", "sla-status"] });
      queryClient.invalidateQueries({ queryKey: ["ops", "sla-breaches"] });
    },
  });
}

export function useAssetCategories() {
  return useQuery({
    queryKey: ["ops", "asset-categories"],
    queryFn: async () => {
      const summary = await opsService.getInventorySummary();
      return summary.byCategory.map((c) => c.category);
    },
    staleTime: 60_000 * 5,
  });
}
