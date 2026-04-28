import { apiClient } from "@/lib/api-client";
import type {
  CreateReportScheduleDto,
  ExportLog,
  GenerateReportDto,
  ReportFormat,
  ReportSchedule,
  UpdateReportScheduleDto,
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  const schema = localStorage.getItem("tenant_schema");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(schema ? { "x-tenant-schema": schema } : {}),
  };
}

export const reportsService = {
  async createSchedule(dto: CreateReportScheduleDto): Promise<ReportSchedule> {
    return apiClient.post<ReportSchedule>("/reports/schedules", dto);
  },

  async listSchedules(): Promise<ReportSchedule[]> {
    return apiClient.get<ReportSchedule[]>("/reports/schedules");
  },

  async updateSchedule(
    id: string,
    dto: UpdateReportScheduleDto,
  ): Promise<ReportSchedule> {
    return apiClient.put<ReportSchedule>(`/reports/schedules/${id}`, dto);
  },

  async deleteSchedule(id: string): Promise<void> {
    return apiClient.delete<void>(`/reports/schedules/${id}`);
  },

  /**
   * Generate on-demand report — returns a Blob for download.
   * Cannot use apiClient because the response is binary, not JSON.
   */
  async generateReport(dto: GenerateReportDto): Promise<{
    blob: Blob;
    format: ReportFormat;
    filename: string;
    exportToken?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message ?? `Report generation failed: ${response.statusText}`,
      );
    }

    const blob = await response.blob();
    const exportToken = response.headers.get("X-Export-Token") ?? undefined;
    const format = dto.format;
    const name = dto.name ?? "Report";
    const filename = `${name.replace(/\s+/g, "-")}.${format}`;

    return { blob, format, filename, exportToken };
  },

  async listExports(
    limit = 20,
    offset = 0,
  ): Promise<{ data: ExportLog[]; total: number }> {
    return apiClient.get("/reports/exports", {
      limit: String(limit),
      offset: String(offset),
    });
  },

  /**
   * Download by token — constructs the public URL.
   * No auth required — the token IS the credential.
   */
  getDownloadUrl(token: string): string {
    return `${API_BASE_URL}/reports/download/${token}`;
  },
};
