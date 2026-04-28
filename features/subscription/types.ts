export type PlanSlug = "free" | "basic" | "standard" | "enterprise";
export type SubscriptionStatus = "active" | "trial" | "cancelled" | "past_due";

export interface SubscriptionDetails {
  tenantId: string;
  planName: string;
  planSlug: PlanSlug;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  maxSeats: number;
}

export interface UsageSummary {
  feature: string;
  used: number;
  limit: number | null;
  percentage: number;
  resetDate?: string;
}

export interface SeatCount {
  used: number;
  max: number;
}

export interface SeatUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  seatActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface SeatsResponse extends SeatCount {
  users: SeatUser[];
}

export interface ChangePlanResponse extends SubscriptionDetails {}

export const PLAN_CONFIG: Record<
  PlanSlug,
  {
    label: string;
    maxSeats: number;
    priceMonthly: number;
    features: string[];
    color: string;
  }
> = {
  free: {
    label: "Free",
    maxSeats: 2,
    priceMonthly: 0,
    features: ["2 seats", "Finance dashboard", "CSV import", "Basic alerts"],
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  basic: {
    label: "Basic",
    maxSeats: 5,
    priceMonthly: 29,
    features: ["5 seats", "All Free features", "HR dashboard", "Ops dashboard"],
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  standard: {
    label: "Standard",
    maxSeats: 15,
    priceMonthly: 99,
    features: [
      "15 seats",
      "All Basic features",
      "AI insights",
      "Reports & exports",
      "Priority support",
    ],
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  enterprise: {
    label: "Enterprise",
    maxSeats: 999,
    priceMonthly: 299,
    features: [
      "Unlimited seats",
      "All Standard features",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export const PLAN_ORDER: Record<PlanSlug, number> = {
  free: 0,
  basic: 1,
  standard: 2,
  enterprise: 3,
};
