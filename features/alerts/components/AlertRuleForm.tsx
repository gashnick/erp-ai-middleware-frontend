"use client";

import { useState } from "react";
import { AlertRule, CreateAlertRuleDto, AlertMetric, AlertOperator } from "../types";
import { ALERT_METRICS, ALERT_OPERATORS, ALERT_SEVERITIES, ALERT_CHANNELS } from "../utils/alertMetrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface AlertRuleFormProps {
  rule?: AlertRule;
  onSubmit: (dto: CreateAlertRuleDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AlertRuleForm({
  rule,
  onSubmit,
  onCancel,
  isLoading,
}: AlertRuleFormProps) {
  const [formData, setFormData] = useState<CreateAlertRuleDto>({
    name: rule?.name || "",
    metric: rule?.metric || "cash_balance",
    operator: rule?.operator || "lt",
    threshold: rule?.threshold || 0,
    threshold_max: rule?.threshold_max,
    severity: rule?.severity || "medium",
    channels: rule?.channels || ["in_app"],
    is_active: rule?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedMetric = ALERT_METRICS[formData.metric];
  const selectedOperator = ALERT_OPERATORS[formData.operator];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Rule name is required";
    }
    if (formData.threshold < 0) {
      newErrors.threshold = "Threshold must be non-negative";
    }
    if (
      formData.operator === "between" &&
      (!formData.threshold_max || formData.threshold_max <= formData.threshold)
    ) {
      newErrors.threshold_max =
        "Max threshold must be greater than min threshold";
    }
    if (formData.channels.length === 0) {
      newErrors.channels = "Select at least one notification channel";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleChannel = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel as any)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel as any],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rule Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Rule Name
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., Low Cash Balance Alert"
          className="mt-1"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Metric Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Metric
        </label>
        <select
          value={formData.metric}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              metric: e.target.value as AlertMetric,
              operator: "lt", // Reset operator when metric changes
            }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        >
          {Object.entries(ALERT_METRICS).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {selectedMetric.description}
        </p>
      </div>

      {/* Operator Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Condition
        </label>
        <select
          value={formData.operator}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              operator: e.target.value as AlertOperator,
            }))
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          disabled={isLoading}
        >
          {selectedMetric.supportedOperators.map((op) => (
            <option key={op} value={op}>
              {ALERT_OPERATORS[op].label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {selectedOperator.description}
        </p>
      </div>

      {/* Threshold Input */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">
            {formData.operator === "between" ? "Min Threshold" : "Threshold"}
          </label>
          <Input
            type="number"
            value={formData.threshold}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                threshold: parseFloat(e.target.value) || 0,
              }))
            }
            placeholder="0"
            className="mt-1"
            disabled={isLoading}
          />
          {errors.threshold && (
            <p className="mt-1 text-sm text-red-600">{errors.threshold}</p>
          )}
        </div>

        {formData.operator === "between" && (
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Max Threshold
            </label>
            <Input
              type="number"
              value={formData.threshold_max || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  threshold_max: parseFloat(e.target.value) || undefined,
                }))
              }
              placeholder="0"
              className="mt-1"
              disabled={isLoading}
            />
            {errors.threshold_max && (
              <p className="mt-1 text-sm text-red-600">{errors.threshold_max}</p>
            )}
          </div>
        )}
      </div>

      {/* Severity Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Severity
        </label>
        <div className="mt-2 flex gap-2">
          {Object.entries(ALERT_SEVERITIES).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, severity: key as any }))
              }
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                formData.severity === key
                  ? `${config.color} ${config.bgColor} ring-2 ring-offset-2 ring-gray-400`
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50",
              )}
              disabled={isLoading}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Channels */}
      <div>
        <label className="block text-sm font-medium text-gray-900">
          Notification Channels
        </label>
        <div className="mt-2 space-y-2">
          {ALERT_CHANNELS.map((channel) => (
            <label
              key={channel.id}
              className="flex items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={formData.channels.includes(channel.id as any)}
                onChange={() => toggleChannel(channel.id)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-900">
                {channel.label}
              </span>
            </label>
          ))}
        </div>
        {errors.channels && (
          <p className="mt-1 text-sm text-red-600">{errors.channels}</p>
        )}
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
          }
          disabled={isLoading}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <label className="text-sm font-medium text-gray-900">
          Activate this rule immediately
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-gray-200 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
        </Button>
      </div>
    </form>
  );
}
