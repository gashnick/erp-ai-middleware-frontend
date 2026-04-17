import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTenantStore } from "../store/tenant.store";
import { tenantService } from "../services/tenant.service";

/**
 * Bootstrap hook — fetches the list of tenants the current user
 * has access to and hydrates the tenant store.
 * Call once near the top of the authenticated layout.
 */
export function useTenantContext() {
  const { activeTenant, setAvailableTenants, setActiveTenant } =
    useTenantStore();

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants", "available"],
    queryFn: tenantService.getAvailableTenants,
    staleTime: 60_000 * 5,
  });

  // On first load: populate the store and auto-select if none active
  useEffect(() => {
    if (!tenants?.length) return;

    const mapped = tenants.map((t) => ({
      id: t.id,
      name: t.name,
      schemaName: t.schemaName,
      logoUrl: t.logoUrl,
    }));

    setAvailableTenants(mapped);

    if (!activeTenant && mapped[0]) {
      setActiveTenant(mapped[0]);
    }
  }, [tenants, activeTenant, setAvailableTenants, setActiveTenant]);

  return {
    activeTenant,
    isLoading,
    hasMultipleTenants: (tenants?.length ?? 0) > 1,
  };
}
