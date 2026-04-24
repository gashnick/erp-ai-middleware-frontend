"use client";

import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuarantineStatus } from "../hooks/useQuarantine";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  isLoading: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  isLoading,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </span>
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-md ${colorClass}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-2 h-7 w-16 animate-pulse rounded bg-gray-100" />
      ) : (
        <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
          {value}
        </p>
      )}
    </div>
  );
}

export function QuarantineStatusSummary() {
  const { data, isLoading } = useQuarantineStatus();

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Total Records"
        value={data?.total ?? 0}
        icon={AlertTriangle}
        colorClass="bg-gray-100 text-gray-500"
        isLoading={isLoading}
      />
      <StatCard
        label="Pending"
        value={data?.pending ?? 0}
        icon={Clock}
        colorClass="bg-yellow-100 text-yellow-600"
        isLoading={isLoading}
      />
      <StatCard
        label="Reviewed"
        value={data?.reviewed ?? 0}
        icon={CheckCircle}
        colorClass="bg-blue-100 text-blue-600"
        isLoading={isLoading}
      />
      <StatCard
        label="Dismissed"
        value={data?.dismissed ?? 0}
        icon={XCircle}
        colorClass="bg-gray-100 text-gray-400"
        isLoading={isLoading}
      />
    </div>
  );
}
