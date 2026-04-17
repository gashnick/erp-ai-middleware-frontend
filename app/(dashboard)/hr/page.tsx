"use client";

import { useState } from "react";
import { Users, UserCheck, UserMinus, UserPlus } from "lucide-react";
import { KpiCard } from "@/shared/ui/KpiCard";
import { EmployeesTable } from "@/features/hr/components/EmployeesTable";
import { HeadcountChart } from "@/features/hr/components/HeadcountChart";
import { LeaveRequestsTable } from "@/features/hr/components/LeaveRequestsTable";
import { useHrKpis } from "@/features/hr/hooks/useHr";
import { cn } from "@/utils/cn";

type ActiveTab = "employees" | "leave";

export default function HrPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("employees");
  const { data: kpis, isLoading } = useHrKpis();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Human Resources</h1>
        <p className="text-sm text-gray-500">
          Workforce overview and management
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard
          label="Total Headcount"
          value={kpis ? String(kpis.totalHeadcount) : "—"}
          trend={
            kpis
              ? {
                  direction:
                    kpis.headcountChangePercentage >= 0 ? "up" : "down",
                  percentage: Math.abs(kpis.headcountChangePercentage),
                  label: "vs last month",
                }
              : undefined
          }
          icon={Users}
          isLoading={isLoading}
        />
        <KpiCard
          label="Active Employees"
          value={kpis ? String(kpis.activeEmployees) : "—"}
          icon={UserCheck}
          isLoading={isLoading}
        />
        <KpiCard
          label="On Leave"
          value={kpis ? String(kpis.onLeaveCount) : "—"}
          icon={UserMinus}
          isLoading={isLoading}
        />
        <KpiCard
          label="New Hires (MTD)"
          value={kpis ? String(kpis.newHiresThisMonth) : "—"}
          icon={UserPlus}
          isLoading={isLoading}
        />
      </div>

      {/* Chart */}
      <HeadcountChart />

      {/* Tabs */}
      <div>
        <div className="mb-3 flex items-center gap-1 border-b border-gray-200">
          {(["employees", "leave"] as ActiveTab[]).map((tab) => (
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
              {tab === "employees" ? "Employees" : "Leave Requests"}
            </button>
          ))}
        </div>

        {activeTab === "employees" ? (
          <EmployeesTable />
        ) : (
          <LeaveRequestsTable />
        )}
      </div>
    </div>
  );
}
