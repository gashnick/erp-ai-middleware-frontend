"use client";

import { cn } from "@/utils/cn";
import { ENTITY_TYPE_CONFIG, type EntityType } from "../types";

interface EntityTypeSelectorProps {
  value: EntityType | null;
  onChange: (type: EntityType) => void;
  isDisabled?: boolean;
}

export function EntityTypeSelector({
  value,
  onChange,
  isDisabled = false,
}: EntityTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {(
        Object.entries(ENTITY_TYPE_CONFIG) as [
          EntityType,
          (typeof ENTITY_TYPE_CONFIG)[EntityType],
        ][]
      ).map(([type, config]) => (
        <button
          key={type}
          type="button"
          disabled={isDisabled}
          onClick={() => onChange(type)}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
            isDisabled && "cursor-not-allowed opacity-50",
            value === type
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50",
          )}
          aria-pressed={value === type}
        >
          <span className="text-xl leading-none">{config.icon}</span>
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                value === type ? "text-blue-700" : "text-gray-900",
              )}
            >
              {config.label}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 leading-tight">
              {config.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
