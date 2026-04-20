export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
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
  id: string;
  email: string;
  fullName: string;
  role: string;
  tenantId: string | null;
  phoneNumber: string | null;
  createdAt: string;
}

export interface CreateTenantRequest {
  companyName: string;
  subscriptionPlan: string;
  dataSourceType: "internal" | "external"; // sent by frontend, not shown to user
  externalSource?: string;
}

// CreateTenant response — tenant-scoped, from generateTenantSession
// What createOrganization actually returns
export interface CreateTenantResponse {
  tenantId: string;
  slug: string;
  schemaName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  tenantId: string | null;
  role: string;
  fullName?: string;
  tenants?: UserTenant[];
}

export type UserRole = "superADMIN" | "ADMIN" | "ANALYST" | "viewer";

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

// What generateTenantSession returns
export interface CreateTenantResponse {
  success: boolean;
  message: string;
  tenantId: string;
  schemaName: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  auth: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface TenantSessionResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}
