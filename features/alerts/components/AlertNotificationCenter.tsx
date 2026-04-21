"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import { useOpenAlerts } from "../hooks/useAlertEvents";
import { useAcknowledgeAlertEvent, useResolveAlertEvent } from "../hooks/useAlertEvents";
import { SeverityBadge } from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";
import { formatDateSafe } from "@/utils/formatDate";

export function AlertNotificationCenter() {
  const [open, setOpen] = useState(false);
  const { data: alertsData } = useOpenAlerts({ limit: 5 });
  const acknowledgeAlert = useAcknowledgeAlertEvent();
  const resolveAlert = useResolveAlertEvent();

  const openAlerts = alertsData?.data || [];
  const openCount = openAlerts.filter((a) => a.status === "open").length;

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert.mutate(id);
  };

  const handleResolve = (id: string) => {
    resolveAlert.mutate(id);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-gray-500 hover:text-gray-900"
          aria-label="View alerts"
        >
          <Bell className="h-4 w-4" />
          {openCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {openCount > 9 ? "9+" : openCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-900">Alerts</h3>
          <p className="text-xs text-gray-500">
            {openCount} open {openCount === 1 ? "alert" : "alerts"}
          </p>
        </div>

        {/* Alerts List */}
        <div className="max-h-96 overflow-y-auto">
          {openAlerts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No open alerts</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {openAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "px-4 py-3 transition-colors hover:bg-gray-50",
                    alert.status === "open" && "bg-yellow-50/50",
                  )}
                >
                  {/* Alert Header */}
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDateSafe(alert.detected_at)}
                      </p>
                    </div>
                    <SeverityBadge severity={alert.severity} size="sm" />
                  </div>

                  {/* Alert Value */}
                  <div className="mb-3 text-xs text-gray-600">
                    <span className="font-medium">{alert.current_value}</span>
                    {" vs threshold "}
                    <span className="font-medium">{alert.threshold}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {alert.status === "open" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={acknowledgeAlert.isPending}
                        className="flex-1 text-xs"
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                      disabled={resolveAlert.isPending}
                      className="flex-1 text-xs"
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {openAlerts.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-2">
            <a
              href="/alerts"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View all alerts →
            </a>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
