export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  logoUrl?: string;
  plan: TenantPlan;
  isActive: boolean;
  createdAt: string;
}

export type TenantPlan = "starter" | "growth" | "enterprise";

export interface TenantSettings {
  tenantId: string;
  timezone: string;
  defaultCurrency: string;
  fiscalYearStartMonth: number;
  notificationsEnabled: boolean;
  alertEmailRecipients: string[];
}

export interface TenantUsage {
  tenantId: string;
  usedStorageMb: number;
  maxStorageMb: number;
  usedSeats: number;
  maxSeats: number;
  apiCallsThisMonth: number;
}
