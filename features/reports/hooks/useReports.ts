import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsService } from "../services/reports.service";
import { useToastStore } from "@/store/toast.store";
import type {
  CreateReportScheduleDto,
  GenerateReportDto,
  UpdateReportScheduleDto,
} from "../types";

export function useSchedules() {
  return useQuery({
    queryKey: ["reports", "schedules"],
    queryFn: reportsService.listSchedules,
    staleTime: 30_000,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (dto: CreateReportScheduleDto) =>
      reportsService.createSchedule(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "schedules"] });
      addToast("Schedule created successfully", "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to create schedule", "error");
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateReportScheduleDto }) =>
      reportsService.updateSchedule(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "schedules"] });
      addToast("Schedule updated", "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to update schedule", "error");
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (id: string) => reportsService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "schedules"] });
      addToast("Schedule deleted", "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to delete schedule", "error");
    },
  });
}

export function useGenerateReport() {
  const addToast = useToastStore((s) => s.addToast);

  return useMutation({
    mutationFn: (dto: GenerateReportDto) => reportsService.generateReport(dto),
    onSuccess: ({ blob, filename }) => {
      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(`${filename} downloaded successfully`, "success");
    },
    onError: (error: Error) => {
      addToast(error.message || "Failed to generate report", "error");
    },
  });
}

export function useExports(limit = 20) {
  return useQuery({
    queryKey: ["reports", "exports", limit],
    queryFn: () => reportsService.listExports(limit),
    staleTime: 15_000,
  });
}
