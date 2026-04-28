"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { GenerateReportForm } from "@/features/reports/components/GenerateReportForm";
import {
  useSchedules,
  useCreateSchedule,
  useDeleteSchedule,
} from "@/features/reports/hooks/useReports";
import { INTERVAL_OPTIONS, FORMAT_CONFIG, SECTION_CONFIG } from "@/features/reports/types";
import type { ReportSchedule } from "@/features/reports/types";
import { cn } from "@/utils/cn";

export default function Page() {
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const schedulesQuery = useSchedules();
  const createScheduleMutation = useCreateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const schedules = schedulesQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">
          Generate on-demand reports or manage scheduled exports
        </p>
      </div>

      {/* On-Demand Report */}
      <GenerateReportForm />

      {/* Scheduled Reports */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Scheduled Reports
          </h3>
          <button
            type="button"
            onClick={() => setShowNewSchedule(!showNewSchedule)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Schedule
          </button>
        </div>

        {schedulesQuery.isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : schedules.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No scheduled reports yet
          </p>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <ScheduleRow
                key={schedule.id}
                schedule={schedule}
                onDelete={() => deleteScheduleMutation.mutate(schedule.id)}
                isDeleting={deleteScheduleMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleRow({
  schedule,
  onDelete,
  isDeleting,
}: {
  schedule: ReportSchedule;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900">{schedule.name}</h4>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              schedule.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600",
            )}
          >
            {schedule.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
          <span>{FORMAT_CONFIG[schedule.format].label}</span>
          <span>
            {schedule.sections
              .map((s) => SECTION_CONFIG[s].label)
              .join(", ")}
          </span>
          <span>{schedule.recipients.length} recipient(s)</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="ml-4 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
