"use client";

import { Users } from "lucide-react";
import {
  useSeats,
  useActivateSeat,
  useDeactivateSeat,
} from "../hooks/useSubscription";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { cn } from "@/utils/cn";

export function SeatsManagement() {
  const { data, isLoading } = useSeats();
  const activateMutation = useActivateSeat();
  const deactivateMutation = useDeactivateSeat();

  const isPending = activateMutation.isPending || deactivateMutation.isPending;

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!data) return null;

  const usagePct = data.max > 0 ? Math.round((data.used / data.max) * 100) : 0;
  const barColor =
    usagePct >= 90
      ? "bg-red-500"
      : usagePct >= 70
        ? "bg-yellow-500"
        : "bg-blue-500";

  return (
    <div>
      {/* Seat usage bar */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              Seat Usage
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums text-gray-900">
            {data.used} / {data.max === 999 ? "∞" : data.max}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${Math.min(usagePct, 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">{usagePct}% of seats used</p>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Last Login
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Seat
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.users.map((user) => (
              <tr
                key={user.id}
                className={cn(
                  "transition-colors",
                  !user.seatActive && "opacity-60",
                )}
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs capitalize text-gray-600">
                    {user.role.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={user.seatActive ? "Active" : "Inactive"}
                    variant={user.seatActive ? "success" : "neutral"}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      user.seatActive
                        ? deactivateMutation.mutate(user.id)
                        : activateMutation.mutate(user.id)
                    }
                    className={cn(
                      "text-xs font-medium transition-colors disabled:opacity-40",
                      user.seatActive
                        ? "text-red-600 hover:text-red-700"
                        : "text-blue-600 hover:text-blue-700",
                    )}
                  >
                    {user.seatActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
