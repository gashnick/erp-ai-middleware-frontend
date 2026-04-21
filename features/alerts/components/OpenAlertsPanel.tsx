"use client";

import { AlertEvent } from "../types";
import { AlertEventCard } from "./AlertEventCard";

interface OpenAlertsPanelProps {
  events: AlertEvent[];
  isLoading: boolean;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  isProcessing?: boolean;
}

export function OpenAlertsPanel({
  events,
  isLoading,
  onAcknowledge,
  onResolve,
  isProcessing,
}: OpenAlertsPanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Open Alerts</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-green-50 p-8 text-center">
          <p className="text-lg font-medium text-green-900">All Clear!</p>
          <p className="mt-1 text-sm text-green-700">
            No open alerts at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <AlertEventCard
              key={event.id}
              event={event}
              onAcknowledge={onAcknowledge}
              onResolve={onResolve}
              isLoading={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  );
}
