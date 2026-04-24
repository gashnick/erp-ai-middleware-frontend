import { apiClient } from "@/lib/api-client";
import type {
  Asset,
  AssetFilters,
  CreateSlaConfigDto,
  InventorySummary,
  OrdersPipeline,
  SlaConfig,
  SlaStatusItem,
  SlaStatusResult,
} from "../types";

export const opsService = {
  async getInventorySummary(): Promise<InventorySummary> {
    return apiClient.get<InventorySummary>("/ops/inventory/summary");
  },

  async getAssets(filters?: AssetFilters): Promise<Asset[]> {
    const params: Record<string, string> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.status) params.status = filters.status;
    if (filters?.limit) params.limit = String(filters.limit);
    if (filters?.offset) params.offset = String(filters.offset);
    return apiClient.get<Asset[]>("/ops/assets", params);
  },

  async getOrdersPipeline(): Promise<OrdersPipeline> {
    return apiClient.get<OrdersPipeline>("/ops/orders/pipeline");
  },

  async getSlaStatus(): Promise<SlaStatusResult> {
    return apiClient.get<SlaStatusResult>("/ops/sla/status");
  },

  async getSlaBreaches(): Promise<SlaStatusItem[]> {
    return apiClient.get<SlaStatusItem[]>("/ops/sla/breaches");
  },

  async createSlaConfig(dto: CreateSlaConfigDto): Promise<SlaConfig> {
    return apiClient.post<SlaConfig>("/ops/sla/configs", dto);
  },
};
