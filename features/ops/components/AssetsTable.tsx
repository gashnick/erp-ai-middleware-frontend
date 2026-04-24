"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/shared/ui/DataTable";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useAssets, useAssetCategories } from "../hooks/useOps";
import { cn } from "@/utils/cn";
import type { Asset, AssetStatus } from "../types";

const STATUS_BADGE_MAP: Record<
  AssetStatus,
  { label: string; variant: "success" | "warning" | "error" | "neutral" }
> = {
  operational: { label: "Operational", variant: "success" },
  maintenance: { label: "Maintenance", variant: "warning" },
  offline: { label: "Offline", variant: "error" },
  retired: { label: "Retired", variant: "neutral" },
};

const COLUMNS: DataTableColumn<Asset>[] = [
  {
    key: "name",
    label: "Asset",
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-400">{row.category}</p>
      </div>
    ),
  },
  {
    key: "uptimePct",
    label: "Uptime",
    align: "right",
    render: (row) => (
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          row.uptimePct == null
            ? "text-gray-400"
            : row.uptimePct >= 90
              ? "text-green-600"
              : row.uptimePct >= 70
                ? "text-yellow-600"
                : "text-red-600",
        )}
      >
        {row.uptimePct != null ? `${row.uptimePct}%` : "—"}
      </span>
    ),
  },
  {
    key: "nextService",
    label: "Next Service",
    render: (row) => (
      <span className="text-xs text-gray-500">
        {row.nextService
          ? new Date(row.nextService).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const config = STATUS_BADGE_MAP[row.status];
      return <StatusBadge label={config.label} variant={config.variant} />;
    },
  },
];

export function AssetsTable() {
  const [activeStatus, setActiveStatus] = useState<AssetStatus | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const { data: assets, isLoading } = useAssets({
    status: activeStatus,
    category: selectedCategory,
    limit: 50,
  });
  const { data: categories } = useAssetCategories();

  const STATUS_TABS: { label: string; value: AssetStatus | undefined }[] = [
    { label: "All", value: undefined },
    { label: "Operational", value: "operational" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Offline", value: "offline" },
    { label: "Retired", value: "retired" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 border-b border-gray-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={String(tab.value)}
              type="button"
              onClick={() => setActiveStatus(tab.value)}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeStatus === tab.value
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(e.target.value || undefined)}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-300 focus:outline-none"
        >
          <option value="">All categories</option>
          {(categories ?? []).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <DataTable<Asset>
        columns={COLUMNS}
        rows={assets ?? []}
        isLoading={isLoading}
        emptyMessage="No assets found."
      />
    </div>
  );
}
