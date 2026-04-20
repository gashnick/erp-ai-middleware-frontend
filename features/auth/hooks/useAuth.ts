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

  // Step 1 — Register: creates user, no tokens returned, redirect to login
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: () => {
      router.push("/login");
    },
  });

  // Step 2 — Login: returns system-level access_token, user has no tenant yet
  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: async (data) => {
      setTokens(data.access_token, "");
      setUser(data.user);

      if (!data.user.tenantId) {
        router.push("/login/setup-company");
        return;
      }

      router.push("/dashboard");
    },
  });

  // Step 3 — Create Tenant: uses system token, returns tenant-scoped token
  // Backend: generateTenantSession → { access_token, refresh_token, user: { id, email, tenantId, role } }
  const createTenantMutation = useMutation({
    mutationFn: (payload: CreateTenantRequest) =>
      authService.createTenant(payload),
    onSuccess: (data) => {
      // Replace system token with tenant-scoped token
      setTokens(data.auth.accessToken, data.auth.refreshToken);

      // Update user in store — they now have a tenant
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          tenantId: data.tenantId,
        });
      }

      const tenant = {
        id: data.organization.id,
        name: data.organization.name,
        schemaName: data.schemaName,
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
