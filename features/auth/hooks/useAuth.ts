import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useTenantStore } from "@/features/tenant/store/tenant.store";
import type { LoginRequest } from "../types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setTokens, setUser, clearAuth } =
    useAuthStore();
  const { setAvailableTenants, setActiveTenant } = useTenantStore();

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

      if (tenants[0]) {
        setActiveTenant(tenants[0]);
      }

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
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
