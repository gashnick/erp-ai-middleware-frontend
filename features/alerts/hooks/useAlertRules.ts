import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsServiceInstance } from "../services";
import { CreateAlertRuleDto, UpdateAlertRuleDto } from "../types";
import { useToastStore } from "@/store/toast.store";

export function useAlertRules(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["alerts", "rules", params],
    queryFn: () => alertsServiceInstance.listAlertRules(params),
    staleTime: 30_000,
  });
}

export function useAlertRule(id: string) {
  return useQuery({
    queryKey: ["alerts", "rules", id],
    queryFn: () => alertsServiceInstance.getAlertRule(id),
    staleTime: 30_000,
  });
}

export function useCreateAlertRule() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (dto: CreateAlertRuleDto) => alertsServiceInstance.createAlertRule(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      addToast("Alert rule created successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error.message || "Failed to create alert rule",
        "error",
      );
    },
  });
}

export function useUpdateAlertRule(id: string) {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (dto: UpdateAlertRuleDto) =>
      alertsServiceInstance.updateAlertRule(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules", id] });
      addToast("Alert rule updated successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error.message || "Failed to update alert rule",
        "error",
      );
    },
  });
}

export function useDeleteAlertRule() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => alertsServiceInstance.deleteAlertRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "rules"] });
      addToast("Alert rule deleted successfully", "success");
    },
    onError: (error: any) => {
      addToast(
        error.message || "Failed to delete alert rule",
        "error",
      );
    },
  });
}
