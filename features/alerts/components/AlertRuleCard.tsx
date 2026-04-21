"use client";

import { AlertRule } from "../types";
import { SeverityBadge } from "./SeverityBadge";
import { getMetricConfig, ALERT_CHANNELS } from "../utils/alertMetrics";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Power } from "lucide-react";
import { cn } from "@/utils/cn";

interface AlertRuleCardProps {
  rule: AlertRule;
  onEdit: (rule: AlertRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
  isDeleting?: boolean;
}

export function AlertRuleCard({
  rule,
  onEdit,
  onDelete,
  onToggle,
  isDeleting,
}: AlertRuleCardProps) {
  const metricConfig = getMetricConfig(rule.metric);

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        rule.is_active
          ? "border-gray-200 bg-white"
          : "border-gray-100 bg-gray-50",
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{rule.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{metricConfig.label}</p>
        </div>
        <SeverityBadge severity={rule.severity} size="sm" />
      </div>

      {/* Threshold Info */}
      <div className="mb-3 rounded-md bg-gray-50 p-3">
        <p className="text-sm text-gray-600">
          Alert when <span className="font-medium">{metricConfig.label}</span>{" "}
          is{" "}
          <span className="font-medium">
            {rule.operator === "between"
              ? `between ${rule.threshold} and ${rule.threshold_max}`
              : `${rule.operator} ${rule.threshold}`}
          </span>
          {metricConfig.unit && (
            <span className="text-gray-500"> {metricConfig.unit}</span>
          )}
        </p>
      </div>

      {/* Channels */}
      <div className="mb-4 flex flex-wrap gap-2">
        {rule.channels.map((channel) => {
          const channelConfig = ALERT_CHANNELS.find((c) => c.id === channel);
          return (
            <span
              key={channel}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
            >
              {channelConfig?.label}
            </span>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(rule)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(rule.id)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant={rule.is_active ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle(rule.id, !rule.is_active)}
          className="gap-2"
        >
          <Power className="h-4 w-4" />
          {rule.is_active ? "Active" : "Inactive"}
        </Button>
      </div>
    </div>
  );
}
