"use client";

import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore } from "@/store/toast.store";
import { cn } from "@/utils/cn";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  const iconMap = {
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgMap = {
    error: "bg-red-50 border-red-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200",
  };

  const textMap = {
    error: "text-red-900",
    success: "text-green-900",
    warning: "text-yellow-900",
    info: "text-blue-900",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4",
            bgMap[toast.type],
          )}
        >
          {iconMap[toast.type]}
          <p className={cn("flex-1 text-sm font-medium", textMap[toast.type])}>
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
