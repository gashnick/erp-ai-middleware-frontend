"use client";

import { useOpenAlerts } from "../hooks/useAlertEvents";
import { AlertEventCard } from "./AlertEventCard";
import { useAcknowledgeAlertEvent, useResolveAlertEvent } from "../hooks/useAlertEvents";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function AlertsCard() {
  const { data: alertsData, isLoading } = useOpenAlerts({ limit: 3 });
  const acknowledgeAlert = useAcknowledgeAlertEvent();
  const resolveAlert = useResolveAlertEvent();

  const alerts = alertsData?.data || [];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
        </div>
        <a
          href="/alerts"
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </a>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-md bg-gray-100"
            />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-md bg-green-50 p-4 text-center">
          <p className="text-sm text-green-900">All clear!</p>
          <p className="text-xs text-green-700">No open alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertEventCard
              key={alert.id}
              event={alert}
              onAcknowledge={(id) => acknowledgeAlert.mutate(id)}
              onResolve={(id) => resolveAlert.mutate(id)}
              isLoading={acknowledgeAlert.isPending || resolveAlert.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
