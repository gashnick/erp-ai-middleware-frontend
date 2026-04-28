"use client";

import { CalendarDays, Users, Zap } from "lucide-react";
import { useSubscription } from "../hooks/useSubscription";
import { PLAN_CONFIG } from "../types";
import { cn } from "@/utils/cn";

export function CurrentPlanCard() {
  const { data, isLoading } = useSubscription();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl bg-gray-100" />;
  }

  if (!data) return null;

  const config = PLAN_CONFIG[data.planSlug];
  const isTrialing = data.status === "trial";
  const periodEnd = new Date(data.currentPeriodEnd).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className={cn("rounded-xl border p-5", config.color)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide opacity-70">
              Current Plan
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold">{data.planName}</h2>
          {isTrialing && data.trialEndsAt && (
            <span className="mt-1 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
              Trial ends{" "}
              {new Date(data.trialEndsAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            ${config.priceMonthly}
            <span className="text-sm font-normal opacity-60">/mo</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 opacity-60" />
          <span>
            {data.maxSeats === 999 ? "Unlimited" : data.maxSeats} seats
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 opacity-60" />
          <span>Renews {periodEnd}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {config.features.map((f) => (
          <span
            key={f}
            className="rounded-full bg-white/50 px-2.5 py-0.5 text-xs font-medium"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
