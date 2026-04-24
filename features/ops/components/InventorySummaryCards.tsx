"use client";

import { Package, Wrench, WifiOff, Archive } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { useInventorySummary } from "../hooks/useOps";

export function InventorySummaryCards() {
  const { data, isLoading } = useInventorySummary();

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <KpiCard
        label="Operational"
        value={data ? String(data.operational) : "—"}
        icon={Package}
        isLoading={isLoading}
      />
      <KpiCard
        label="Maintenance"
        value={data ? String(data.maintenance) : "—"}
        icon={Wrench}
        isLoading={isLoading}
      />
      <KpiCard
        label="Offline"
        value={data ? String(data.offline) : "—"}
        icon={WifiOff}
        isLoading={isLoading}
      />
      <KpiCard
        label="Retired"
        value={data ? String(data.retired) : "—"}
        icon={Archive}
        isLoading={isLoading}
      />
    </div>
  );
}
