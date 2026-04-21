"use client";

import { AlertSeverity } from "../types";
import { getSeverityConfig } from "../utils/alertMetrics";
import { cn } from "@/utils/cn";

interface SeverityBadgeProps {
  severity: AlertSeverity;
  size?: "sm" | "md" | "lg";
}

export function SeverityBadge({ severity, size = "md" }: SeverityBadgeProps) {
  const config = getSeverityConfig(severity);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.bgColor,
        config.color,
        sizeClasses[size],
      )}
    >
      {config.label}
    </span>
  );
}
