// src/shared/ui/ToastContainer.tsx
"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "@/store/toast.store";
import { cn } from "@/utils/cn";

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    icon: React.ElementType;
    classes: string;
  }
> = {
  success: {
    icon: CheckCircle,
    classes: "bg-green-50 border-green-200 text-green-800",
  },
  error: { icon: XCircle, classes: "bg-red-50 border-red-200 text-red-800" },
  warning: {
    icon: AlertTriangle,
    classes: "bg-yellow-50 border-yellow-200 text-yellow-800",
  },
  info: { icon: Info, classes: "bg-blue-50 border-blue-200 text-blue-800" },
};

function ToastItem({
  id,
  message,
  variant,
}: {
  id: string;
  message: string;
  variant: ToastVariant;
}) {
  const removeToast = useToastStore((s) => s.removeToast);
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md text-sm",
        "animate-in slide-in-from-right-5 duration-200",
        config.classes,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={() => removeToast(id)}
        className="shrink-0 opacity-60 hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
