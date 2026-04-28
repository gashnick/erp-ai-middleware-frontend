"use client";

import { useState } from "react";
import { Check, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import {
  useSubscription,
  useUpgradePlan,
  useDowngradePlan,
} from "../hooks/useSubscription";
import { PLAN_CONFIG, PLAN_ORDER, type PlanSlug } from "../types";
import { cn } from "@/utils/cn";

export function PlanSelector() {
  const { data: current, isLoading } = useSubscription();
  const upgradeMutation = useUpgradePlan();
  const downgradeMutation = useDowngradePlan();
  const [confirmPlan, setConfirmPlan] = useState<PlanSlug | null>(null);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!current) return null;

  const currentOrder = PLAN_ORDER[current.planSlug];
  const plans = Object.entries(PLAN_CONFIG) as [
    PlanSlug,
    (typeof PLAN_CONFIG)[PlanSlug],
  ][];

  function handlePlanChange(slug: PlanSlug) {
    const targetOrder = PLAN_ORDER[slug];
    if (targetOrder > currentOrder) {
      upgradeMutation.mutate(slug, { onSuccess: () => setConfirmPlan(null) });
    } else {
      downgradeMutation.mutate(slug, { onSuccess: () => setConfirmPlan(null) });
    }
  }

  const isPending = upgradeMutation.isPending || downgradeMutation.isPending;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">
        Available Plans
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {plans.map(([slug, config]) => {
          const isCurrent = slug === current.planSlug;
          const targetOrder = PLAN_ORDER[slug];
          const isUpgrade = targetOrder > currentOrder;
          const isDowngrade = targetOrder < currentOrder;

          return (
            <div
              key={slug}
              className={cn(
                "rounded-lg border p-4 transition-shadow",
                isCurrent
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:shadow-sm",
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">
                  {config.label}
                </span>
                {isCurrent && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">
                    <Check className="h-2.5 w-2.5" /> Current
                  </span>
                )}
              </div>

              {/* Price */}
              <p className="mb-3 text-xl font-bold text-gray-900">
                ${config.priceMonthly}
                <span className="text-xs font-normal text-gray-400">/mo</span>
              </p>

              {/* Features */}
              <ul className="mb-4 space-y-1">
                {config.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-gray-600"
                  >
                    <Check className="h-3 w-3 flex-shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Action */}
              {!isCurrent && (
                <>
                  {confirmPlan === slug ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">
                        {isDowngrade
                          ? "⚠️ This will reduce your features and seat limit."
                          : "✅ Your new features activate immediately."}
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePlanChange(slug)}
                          disabled={isPending}
                          className="flex flex-1 items-center justify-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isPending && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmPlan(null)}
                          className="rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmPlan(slug)}
                      disabled={isPending}
                      className={cn(
                        "flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                        isUpgrade
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      {isUpgrade ? (
                        <>
                          <ArrowUp className="h-3 w-3" /> Upgrade
                        </>
                      ) : (
                        <>
                          <ArrowDown className="h-3 w-3" /> Downgrade
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
