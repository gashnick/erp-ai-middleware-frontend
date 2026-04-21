"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Bell, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTenantStore } from "@/features/tenant/store/tenant.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useToastStore } from "@/store/toast.store";
import { TenantSwitcher } from "@/features/tenant/components/TenantSwitcher";

export function Topbar() {
  const router = useRouter();
  const activeTenant = useTenantStore((s) => s.activeTenant);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const addToast = useToastStore((s) => s.addToast);

  const handleLogout = () => {
    clearAuth();
    addToast("You have been signed out.", "info", 3000);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Tenant switcher */}
      <TenantSwitcher />

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-gray-500 hover:text-gray-900"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                A
              </div>
              <span className="hidden sm:block text-sm font-medium">ADMIN</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
              Signed in as ADMIN
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <User className="h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm text-red-600 cursor-pointer focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
