export type QuarantineStatus = "pending" | "reviewed" | "dismissed";
export type QuarantineSeverity = "warning" | "error" | "critical";

export interface QuarantineRecord {
  id: string;
  entity_type: string;
  source_type: string;
  raw_data: Record<string, unknown>;
  errors: QuarantineError[];
  status: QuarantineStatus;
  created_at: string;
}

export interface QuarantineError {
  field?: string;
  message: string;
  value?: unknown;
}

export interface QuarantineResponse {
  data: QuarantineRecord[];
  total: number;
  limit: number;
  offset: number;
}

export interface QuarantineStatusResponse {
  total: number;
  pending: number;
  reviewed: number;
  dismissed: number;
}

export interface RetryRecordRequest {
  fixedData?: Record<string, unknown>;
}

export interface RetryRecordResponse {
  success: boolean;
  message?: string;
}

export interface BatchRetryRequest {
  ids: string[];
}

export interface BatchRetryResponse {
  succeeded: number;
  failed: number;
  errors?: Record<string, string>;
}

export interface QuarantineFilters {
  status?: QuarantineStatus;
  entity_type?: string;
  limit?: number;
  offset?: number;
}
