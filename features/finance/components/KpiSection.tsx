"use client";

import { KpiMetric } from "../types";
import { KpiCard } from "@/shared/ui/KpiCard";

interface KpiSectionProps {
  kpis: KpiMetric[];
  loading?: boolean;
}

/**
 * Displays grid of KPI cards for financial metrics
 */
export function KpiSection({ kpis, loading = false }: KpiSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.label}
          label={kpi.label}
          value={
            kpi.currency
              ? `${kpi.currency} ${kpi.value.toLocaleString()}`
              : kpi.value.toLocaleString()
          }
          trend={{
            direction: kpi.trend >= 0 ? "up" : "down",
            percentage: Math.abs(kpi.trend),
            label: `${Math.abs(kpi.trend)}% vs last period`,
          }}
          isLoading={loading}
        />
      ))}
    </div>
  );
}
