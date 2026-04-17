import { apiClient } from "@/lib/api-client";
import type { Tenant, TenantSettings, TenantUsage } from "../types";

export const tenantService = {
  async getAvailableTenants(): Promise<Tenant[]> {
    return apiClient.get<Tenant[]>("/tenants");
  },

  async getTenant(id: string): Promise<Tenant> {
    return apiClient.get<Tenant>(`/tenants/${id}`);
  },

  async getTenantSettings(id: string): Promise<TenantSettings> {
    return apiClient.get<TenantSettings>(`/tenants/${id}/settings`);
  },

  async updateTenantSettings(
    id: string,
    payload: Partial<TenantSettings>,
  ): Promise<TenantSettings> {
    return apiClient.patch<TenantSettings>(`/tenants/${id}/settings`, payload);
  },

  async getTenantUsage(id: string): Promise<TenantUsage> {
    return apiClient.get<TenantUsage>(`/tenants/${id}/usage`);
  },
};
