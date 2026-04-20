"use client";

import Link from "next/link";
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
            Set up your organization to get started
          </p>
        </div>

        {/* Progress steps */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-3 w-3 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Account</span>
          </div>
          <div className="h-px w-6 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
              <span className="text-[10px] font-bold text-white">2</span>
            </div>
            <span className="text-xs font-medium text-gray-900">Company</span>
          </div>
          <div className="h-px w-6 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
              <span className="text-[10px] font-medium text-gray-400">3</span>
            </div>
            <span className="text-xs text-gray-400">Dashboard</span>
          </div>
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

        {/* Back link */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Wrong account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in with a different account
          </Link>
        </p>
      </div>
    </div>
  );
}
