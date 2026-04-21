"use client";

import { AlertEvent } from "../types";
import { SeverityBadge } from "./SeverityBadge";
import { getMetricConfig } from "../utils/alertMetrics";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatDateSafe } from "@/utils/formatDate";

interface AlertEventCardProps {
  event: AlertEvent;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  isLoading?: boolean;
}

export function AlertEventCard({
  event,
  onAcknowledge,
  onResolve,
  isLoading,
}: AlertEventCardProps) {
  const metricConfig = getMetricConfig(event.metric);
  const isOpen = event.status === "open";
  const isAcknowledged = event.status === "acknowledged";

  const statusIcon = {
    open: <Clock className="h-5 w-5 text-yellow-600" />,
    acknowledged: <Clock className="h-5 w-5 text-blue-600" />,
    resolved: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  }[event.status];

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        isOpen && "border-yellow-200 bg-yellow-50",
        isAcknowledged && "border-blue-200 bg-blue-50",
        event.status === "resolved" && "border-green-200 bg-green-50",
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          {statusIcon}
          <div>
            <h3 className="font-semibold text-gray-900">{event.message}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {metricConfig.label} • Detected{" "}
              {formatDateSafe(event.detected_at)}
            </p>
          </div>
        </div>
        <SeverityBadge severity={event.severity} size="sm" />
      </div>

      {/* Metric Details */}
      <div className="mb-4 grid grid-cols-3 gap-3 rounded-md bg-white/50 p-3">
        <div>
          <p className="text-xs text-gray-500">Current Value</p>
          <p className="font-semibold text-gray-900">
            {event.current_value} {metricConfig.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Threshold</p>
          <p className="font-semibold text-gray-900">
            {event.threshold} {metricConfig.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-semibold capitalize text-gray-900">
            {event.status}
          </p>
        </div>
      </div>

      {/* Timeline */}
      {(event.acknowledged_at || event.resolved_at) && (
        <div className="mb-4 space-y-1 text-xs text-gray-600">
          {event.acknowledged_at && (
            <p>Acknowledged {formatDateSafe(event.acknowledged_at)}</p>
          )}
          {event.resolved_at && (
            <p>Resolved {formatDateSafe(event.resolved_at)}</p>
          )}
        </div>
      )}

      {/* Actions */}
      {event.status !== "resolved" && (
        <div className="flex gap-2">
          {isOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAcknowledge(event.id)}
              disabled={isLoading}
              className="flex-1"
            >
              Acknowledge
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={() => onResolve(event.id)}
            disabled={isLoading}
            className="flex-1"
          >
            Resolve
          </Button>
        </div>
      )}
    </div>
  );
}
