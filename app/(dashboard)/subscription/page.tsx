"use client";

import { useState } from "react";
import { CurrentPlanCard } from "@/features/subscription/components/CurrentPlanCard";
import { UsageSummaryCards } from "@/features/subscription/components/UsageSummaryCards";
import { PlanSelector } from "@/features/subscription/components/PlanSelector";
import { SeatsManagement } from "@/features/subscription/components/SeatsManagement";
import { cn } from "@/utils/cn";

type ActiveTab = "overview" | "plans" | "seats";

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Subscription</h1>
        <p className="text-sm text-gray-500">
          Manage your plan, usage and team seats
        </p>
      </div>

      <CurrentPlanCard />

      <div>
        <div className="mb-4 flex items-center gap-1 border-b border-gray-200">
          {(["overview", "plans", "seats"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize",
                activeTab === tab
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {tab === "overview"
                ? "Usage"
                : tab === "plans"
                  ? "Change Plan"
                  : "Manage Seats"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <UsageSummaryCards />}
        {activeTab === "plans" && <PlanSelector />}
        {activeTab === "seats" && <SeatsManagement />}
      </div>
    </div>
  );
}
