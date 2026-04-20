"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { registerSchema, type RegisterFormValues } from "../utils";
import { cn } from "@/utils/cn";

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export function RegisterForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          {...register("fullName")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.fullName
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          placeholder="John Doe"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-xs text-red-600" role="alert">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.email
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="phoneNumber"
          className="text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          {...register("phoneNumber")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.phoneNumber
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          placeholder="+254700000000"
          aria-invalid={!!errors.phoneNumber}
          aria-describedby={
            errors.phoneNumber ? "phoneNumber-error" : undefined
          }
        />
        {errors.phoneNumber && (
          <p
            id="phoneNumber-error"
            className="text-xs text-red-600"
            role="alert"
          >
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.role
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          aria-invalid={!!errors.role}
          aria-describedby={errors.role ? "role-error" : undefined}
        >
          <option value="">Select a role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="ANALYST">ANALYST</option>
          <option value="viewer">Viewer</option>
        </select>
        {errors.role && (
          <p id="role-error" className="text-xs text-red-600" role="alert">
            {errors.role.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.password
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={cn(
            "rounded-md border px-3 py-2 text-sm outline-none transition-colors",
            "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            errors.confirmPassword
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white",
          )}
          placeholder="••••••••"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
        />
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="text-xs text-red-600"
            role="alert"
          >
            {errors.confirmPassword.message}
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
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
