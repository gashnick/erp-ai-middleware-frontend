import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { importService } from "../services/import.service";

export function useQuarantine() {
  return useQuery({
    queryKey: ["import", "quarantine"],
    queryFn: importService.getQuarantine,
    staleTime: 15_000,
  });
}

export function useBuildGraph() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importService.buildGraph,
    onSuccess: () => {
      // After graph build, finance data may have changed
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}
