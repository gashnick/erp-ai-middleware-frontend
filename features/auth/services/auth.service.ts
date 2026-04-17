import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types";

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", payload);
  },

  async logout(): Promise<void> {
    await apiClient.post<void>("/auth/logout", {});
  },

  async refreshToken(
    payload: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>("/auth/refresh", payload);
  },

  async getProfile(): Promise<LoginResponse["user"]> {
    return apiClient.get("/auth/me");
  },
};
