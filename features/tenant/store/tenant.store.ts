import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  logoUrl?: string;
}

interface TenantState {
  activeTenant: Tenant | null;
  availableTenants: Tenant[];
  setActiveTenant: (tenant: Tenant) => void;
  setAvailableTenants: (tenants: Tenant[]) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      activeTenant: null,
      availableTenants: [],
      setActiveTenant: (tenant) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("tenant_schema", tenant.schemaName);
        }
        set({ activeTenant: tenant });
      },
      setAvailableTenants: (tenants) => set({ availableTenants: tenants }),
    }),
    { name: "cid-tenant-store" },
  ),
);
