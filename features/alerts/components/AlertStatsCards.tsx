"use client";

import { AlertStats } from "../types";
import { AlertCircle, CheckCircle2, Settings, TrendingUp } from "lucide-react";

interface AlertStatsCardsProps {
  stats: AlertStats;
}

export function AlertStatsCards({ stats }: AlertStatsCardsProps) {
  const cards = [
    {
      label: "Open Alerts",
      value: stats.open_events,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Active Rules",
      value: stats.active_rules,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Rules",
      value: stats.total_rules,
      icon: Settings,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Critical Alerts",
      value: stats.by_severity.critical || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-lg border border-gray-200 p-4 ${card.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <Icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
