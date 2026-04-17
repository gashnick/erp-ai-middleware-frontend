import type { TenantPlan } from "./types";

export function getTenantPlanLabel(plan: TenantPlan): string {
  const labels: Record<TenantPlan, string> = {
    starter: "Starter",
    growth: "Growth",
    enterprise: "Enterprise",
  };
  return labels[plan];
}

export function getTenantInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function isStorageNearLimit(usedMb: number, maxMb: number): boolean {
  return usedMb / maxMb >= 0.85;
}
