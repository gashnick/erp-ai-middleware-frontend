export type ReportFormat = "pdf" | "csv" | "xlsx";
export type ReportSection = "finance" | "hr" | "ops";
export type ReportInterval = "daily" | "weekly" | "monthly";

export interface ReportSchedule {
  id: string;
  name: string;
  cron: string;
  timezone: string;
  format: ReportFormat;
  recipients: string[];
  sections: ReportSection[];
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportScheduleDto {
  name: string;
  format: ReportFormat;
  recipients: string[];
  sections?: ReportSection[];
  timezone?: string;
  cron?: string;
  interval?: ReportInterval;
}

export interface UpdateReportScheduleDto {
  name?: string;
  format?: ReportFormat;
  recipients?: string[];
  sections?: ReportSection[];
  timezone?: string;
  cron?: string;
  interval?: ReportInterval;
  isActive?: boolean;
}

export interface GenerateReportDto {
  name?: string;
  format: ReportFormat;
  sections?: ReportSection[];
}

export interface ExportLog {
  id: string;
  reportName: string;
  format: ReportFormat;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  secureToken: string;
}

export interface ExportListResponse {
  data: ExportLog[];
  total: number;
}

export const FORMAT_CONFIG: Record<
  ReportFormat,
  { label: string; icon: string; mime: string }
> = {
  pdf: { label: "PDF", icon: "📄", mime: "application/pdf" },
  csv: { label: "CSV", icon: "📊", mime: "text/csv" },
  xlsx: {
    label: "Excel",
    icon: "📗",
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
};

export const SECTION_CONFIG: Record<
  ReportSection,
  { label: string; icon: string }
> = {
  finance: { label: "Finance", icon: "💰" },
  hr: { label: "HR", icon: "👥" },
  ops: { label: "Operations", icon: "⚙️" },
};

export const INTERVAL_OPTIONS: { label: string; value: ReportInterval }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];
