import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  CreateTenantRequest,
  CreateTenantResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types";

export const authService = {
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/auth/register", payload);
  },

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

  async createTenant(
    payload: CreateTenantRequest,
  ): Promise<CreateTenantResponse> {
    return apiClient.post<CreateTenantResponse>("/tenants", payload);
  },
};
