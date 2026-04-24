import { apiClient } from "@/lib/api-client";
import type {
  BatchRetryRequest,
  BatchRetryResponse,
  QuarantineFilters,
  QuarantineResponse,
  QuarantineStatusResponse,
  RetryRecordRequest,
  RetryRecordResponse,
} from "../types";

export const quarantineService = {
  async getRecords(filters?: QuarantineFilters): Promise<QuarantineResponse> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.entity_type) params.entity_type = filters.entity_type;
    if (filters?.limit) params.limit = String(filters.limit);
    if (filters?.offset) params.offset = String(filters.offset);
    return apiClient.get<QuarantineResponse>("/quarantine", params);
  },

  async getStatus(): Promise<QuarantineStatusResponse> {
    return apiClient.get<QuarantineStatusResponse>("/quarantine/status");
  },

  async retryRecord(
    id: string,
    fixedData?: Record<string, unknown>,
  ): Promise<RetryRecordResponse> {
    return apiClient.post<RetryRecordResponse>(`/quarantine/${id}/retry`, {
      fixedData,
    });
  },

  async batchRetry(ids: string[]): Promise<BatchRetryResponse> {
    return apiClient.post<BatchRetryResponse>("/quarantine/batch-retry", {
      ids,
    } satisfies BatchRetryRequest);
  },
};
