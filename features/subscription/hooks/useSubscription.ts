import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "../services/subscription.service";
import { useToastStore } from "@/store/toast.store";

export function useSubscription() {
  return useQuery({
    queryKey: ["subscription", "current"],
    queryFn: subscriptionService.getCurrent,
    staleTime: 60_000,
  });
}

export function useSubscriptionUsage() {
  return useQuery({
    queryKey: ["subscription", "usage"],
    queryFn: subscriptionService.getUsage,
    staleTime: 30_000,
  });
}

export function useSeats() {
  return useQuery({
    queryKey: ["subscription", "seats"],
    queryFn: subscriptionService.getSeats,
    staleTime: 15_000,
  });
}

export function useUpgradePlan() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (planSlug: string) => subscriptionService.upgrade(planSlug),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      addToast(`Upgraded to ${data.planName} successfully`, "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to upgrade plan", "error");
    },
  });
}

export function useDowngradePlan() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (planSlug: string) => subscriptionService.downgrade(planSlug),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      addToast(`Downgraded to ${data.planName} successfully`, "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to downgrade plan", "error");
    },
  });
}

export function useActivateSeat() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (userId: string) => subscriptionService.activateSeat(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription", "seats"] });
      addToast("Seat activated successfully", "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to activate seat", "error");
    },
  });
}

export function useDeactivateSeat() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (userId: string) => subscriptionService.deactivateSeat(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription", "seats"] });
      addToast("Seat deactivated successfully", "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to deactivate seat", "error");
    },
  });
}
