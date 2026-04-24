"use client";

import { QuarantineStatusSummary } from "@/features/quarantine/components/QuarantineStatusSummary";
import { QuarantineTable } from "@/features/quarantine/components/QuarantineTable";

export default function QuarantinePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Quarantine Manager
        </h1>
        <p className="text-sm text-gray-500">
          Review and retry failed import records
        </p>
      </div>

      <QuarantineStatusSummary />

      <QuarantineTable />
    </div>
  );
}
