"use client";

import { AlertsHub } from "@/features/alerts/components/AlertsHub";

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Alert Management</h1>
        <p className="text-sm text-gray-500">
          Create and manage alert rules to monitor your business metrics
        </p>
      </div>

      {/* Alerts Hub */}
      <AlertsHub />
    </div>
  );
}
