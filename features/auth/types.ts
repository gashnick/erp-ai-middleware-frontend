export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phoneNumber: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface CreateTenantRequest {
  companyName: string;
  subscriptionPlan: "free" | "pro" | "enterprise";
}

export interface CreateTenantResponse {
  accessToken: string;
  refreshToken: string;
  tenant: UserTenant;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  tenants: UserTenant[];
}

export type UserRole = "superadmin" | "admin" | "analyst" | "viewer";

export interface UserTenant {
  tenantId: string;
  tenantName: string;
  schemaName: string;
  role: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
