"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { tenantSchema, type TenantFormValues } from "../utils";
import { cn } from "@/utils/cn";

interface TenantFormProps {
  onSubmit: (values: TenantFormValues) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export function TenantForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="companyName"
          className="text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          id="companyName"
          type="text"
          autoComplete="off"
          {...register("companyName")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.companyName
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          placeholder="Acme Corporation"
          aria-invalid={!!errors.companyName}
          aria-describedby={
            errors.companyName ? "companyName-error" : undefined
          }
        />
        {errors.companyName && (
          <p
            id="companyName-error"
            className="text-xs text-red-600"
            role="alert"
          >
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subscriptionPlan"
          className="text-sm font-medium text-gray-700"
        >
          Subscription Plan
        </label>
        <select
          id="subscriptionPlan"
          {...register("subscriptionPlan")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.subscriptionPlan
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          aria-invalid={!!errors.subscriptionPlan}
          aria-describedby={
            errors.subscriptionPlan ? "subscriptionPlan-error" : undefined
          }
        >
          <option value="">Select a plan</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
        {errors.subscriptionPlan && (
          <p
            id="subscriptionPlan-error"
            className="text-xs text-red-600"
            role="alert"
          >
            {errors.subscriptionPlan.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <div
          className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "mt-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5",
          "bg-blue-600 text-sm font-medium text-white transition-colors",
          "hover:bg-blue-700 active:bg-blue-800",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {isSubmitting ? "Creating company…" : "Create Company"}
      </button>
    </form>
  );
}
