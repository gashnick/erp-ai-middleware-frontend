"use client";

import { TenantForm } from "@/features/auth/components/TenantForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { TenantFormValues } from "@/features/auth/utils";

export default function SetupCompanyPage() {
  const { createTenant, isCreatingTenant, createTenantError } = useAuth();

  function handleSubmit(values: TenantFormValues) {
    createTenant({
      companyName: values.companyName,
      subscriptionPlan: values.subscriptionPlan,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <span className="text-lg font-bold text-white">C</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create your company
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up your first organization to get started
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <TenantForm
            onSubmit={handleSubmit}
            isSubmitting={isCreatingTenant}
            errorMessage={
              createTenantError instanceof Error
                ? createTenantError.message
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
