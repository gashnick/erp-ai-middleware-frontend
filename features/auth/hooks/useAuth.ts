import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useTenantStore } from "@/features/tenant/store/tenant.store";
import type {
  LoginRequest,
  RegisterRequest,
  CreateTenantRequest,
} from "../types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setTokens, setUser, clearAuth } =
    useAuthStore();
  const { setAvailableTenants, setActiveTenant } = useTenantStore();

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      router.push("/login");
    },
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);

      const tenants = data.user.tenants.map((t) => ({
        id: t.tenantId,
        name: t.tenantName,
        schemaName: t.schemaName,
      }));
      setAvailableTenants(tenants);

      if (tenants.length === 0) {
        router.push("/login/setup-company");
      } else {
        if (tenants[0]) {
          setActiveTenant(tenants[0]);
        }
        router.push("/dashboard");
      }
    },
  });

  const createTenantMutation = useMutation({
    mutationFn: (payload: CreateTenantRequest) =>
      authService.createTenant(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);

      const tenant = {
        id: data.tenant.tenantId,
        name: data.tenant.tenantName,
        schemaName: data.tenant.schemaName,
      };
      setAvailableTenants([tenant]);
      setActiveTenant(tenant);

      router.push("/dashboard");
    },
  });

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
      router.push("/login");
    }
  }, [clearAuth, router]);

  return {
    user,
    isAuthenticated,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    createTenant: createTenantMutation.mutate,
    createTenantAsync: createTenantMutation.mutateAsync,
    isCreatingTenant: createTenantMutation.isPending,
    createTenantError: createTenantMutation.error,
    logout,
  };
}
