import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsServiceInstance } from "../services";
import { useToastStore } from "@/store/toast.store";

export function useAlertEvents(params?: {
  status?: string;
  severity?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["alerts", "events", params],
    queryFn: () => alertsServiceInstance.listAlertEvents(params),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useOpenAlerts(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['alerts', 'events', 'open', params],
    queryFn: () => alertsServiceInstance.getOpenAlerts(params),
    staleTime: 10_000,
    refetchInterval: 20_000,
  })
}

export function useAlertEvent(params?: {
  status?: string;
  severity?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["alerts", "events", params],
    queryFn: () => alertsServiceInstance.listAlertEvents(params),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useAcknowledgeAlertEvent() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => alertsServiceInstance.acknowledgeAlertEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "events"] });
      queryClient.invalidateQueries({ queryKey: ["alerts", "stats"] });
      addToast("Alert acknowledged", "success");
    },
    onError: (error: any) => {
      addToast(error.message || "Failed to acknowledge alert", "error");
    },
  });
}

export function useResolveAlertEvent() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => alertsServiceInstance.resolveAlertEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", "events"] });
      queryClient.invalidateQueries({ queryKey: ["alerts", "stats"] });
      addToast("Alert resolved", "success");
    },
    onError: (error: any) => {
      addToast(error.message || "Failed to resolve alert", "error");
    },
  });
}
