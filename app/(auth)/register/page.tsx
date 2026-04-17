"use client";

import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { RegisterFormValues } from "@/features/auth/utils";

export default function RegisterPage() {
  const { register, isRegistering, registerError } = useAuth();

  function handleSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...payload } = values;
    register({
      ...payload,
      fullName: payload.fullName,
      role: payload.role as "admin" | "analyst" | "viewer",
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">Get started with CID ERP</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <RegisterForm
            onSubmit={handleSubmit}
            isSubmitting={isRegistering}
            errorMessage={
              registerError instanceof Error ? registerError.message : undefined
            }
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
