"use client";

import { useState } from "react";
import { InventorySummaryCards } from "@/features/ops/components/InventorySummaryCards";
import { OpsStatusChart } from "@/features/ops/components/OpsStatusChart";
import { OrdersPipelineChart } from "@/features/ops/components/OrdersPipelineChart";
import { SlaStatusCards } from "@/features/ops/components/SlaStatusCards";
import { AssetsTable } from "@/features/ops/components/AssetsTable";
import { cn } from "@/utils/cn";

type ActiveTab = "overview" | "assets" | "sla";

export default function OpsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Operations</h1>
        <p className="text-sm text-gray-500">
          Asset management, orders pipeline and SLA monitoring
        </p>
      </div>

      <InventorySummaryCards />

      <div>
        <div className="mb-4 flex items-center gap-1 border-b border-gray-200">
          {(["overview", "assets", "sla"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "assets"
                  ? "Assets"
                  : "SLA Rules"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <OpsStatusChart />
            <OrdersPipelineChart />
          </div>
        )}

        {activeTab === "assets" && <AssetsTable />}
        {activeTab === "sla" && <SlaStatusCards />}
      </div>
    </div>
  );
}
