import { apiClient } from "@/lib/api-client";
import type {
  ChangePlanResponse,
  SeatsResponse,
  SubscriptionDetails,
  UsageSummary,
} from "../types";

export const subscriptionService = {
  async getCurrent(): Promise<SubscriptionDetails> {
    return apiClient.get<SubscriptionDetails>("/subscription");
  },

  async getUsage(): Promise<UsageSummary[]> {
    return apiClient.get<UsageSummary[]>("/subscription/usage");
  },

  async getSeats(): Promise<SeatsResponse> {
    return apiClient.get<SeatsResponse>("/subscription/seats");
  },

  async upgrade(planSlug: string): Promise<ChangePlanResponse> {
    return apiClient.put<ChangePlanResponse>("/subscription/upgrade", {
      planSlug,
    });
  },

  async downgrade(planSlug: string): Promise<ChangePlanResponse> {
    return apiClient.put<ChangePlanResponse>("/subscription/downgrade", {
      planSlug,
    });
  },

  async activateSeat(userId: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `/subscription/seats/${userId}/activate`,
      {},
    );
  },

  async deactivateSeat(userId: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(
      `/subscription/seats/${userId}/deactivate`,
      {},
    );
  },
};
