"use client";

import { Package, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { OrdersTable } from "@/features/ops/components/OrdersTable";
import { OpsStatusChart } from "@/features/ops/components/OpsStatusChart";
import { useOpsKpis } from "@/features/ops/hooks/useOps";

export default function OpsPage() {
  const { data: kpis, isLoading } = useOpsKpis();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Operations</h1>
        <p className="text-sm text-gray-500">
          Order management and task tracking
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard
          label="Open Orders"
          value={kpis ? String(kpis.openOrdersCount) : "—"}
          icon={Package}
          isLoading={isLoading}
        />
        <KpiCard
          label="Completed Today"
          value={kpis ? String(kpis.completedTodayCount) : "—"}
          trend={
            kpis
              ? {
                  direction:
                    kpis.orderVelocityChangePercentage >= 0 ? "up" : "down",
                  percentage: Math.abs(kpis.orderVelocityChangePercentage),
                  label: "vs yesterday",
                }
              : undefined
          }
          icon={CheckCircle}
          isLoading={isLoading}
        />
        <KpiCard
          label="Overdue Tasks"
          value={kpis ? String(kpis.overdueTasksCount) : "—"}
          icon={AlertTriangle}
          isLoading={isLoading}
        />
        <KpiCard
          label="Avg. Completion"
          value={kpis ? `${kpis.averageCompletionDays}d` : "—"}
          icon={Clock}
          isLoading={isLoading}
        />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <OpsStatusChart />
        </div>
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Upcoming Deadlines
          </h3>
          <p className="mt-2 text-xs text-gray-400">
            Timeline widget — wire to /ops/orders?sort=dueDate&limit=5
          </p>
        </div>
      </div>

      {/* Orders */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Orders</h2>
        </div>
        <OrdersTable />
      </div>
    </div>
  );
}
