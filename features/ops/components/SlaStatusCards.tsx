"use client";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { useSlaStatus, useCreateSlaConfig } from "../hooks/useOps";
import { SLA_METRICS } from "../types";
import type { SlaState, CreateSlaConfigDto } from "../types";
import { cn } from "@/utils/cn";
import { useState } from "react";

const STATE_CONFIG: Record<
  SlaState,
  { icon: React.ElementType; colorClass: string; barClass: string }
> = {
  ok: {
    icon: CheckCircle,
    colorClass: "text-green-600",
    barClass: "bg-green-500",
  },
  warning: {
    icon: AlertTriangle,
    colorClass: "text-yellow-600",
    barClass: "bg-yellow-500",
  },
  breached: {
    icon: XCircle,
    colorClass: "text-red-600",
    barClass: "bg-red-500",
  },
};

export function SlaStatusCards() {
  const { data, isLoading } = useSlaStatus();
  const createMutation = useCreateSlaConfig();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateSlaConfigDto>({
    name: "",
    metric: SLA_METRICS[0]?.value ?? "",
    targetValue: 100,
    warningPct: 80,
  });

  function handleCreate() {
    createMutation.mutate(form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({
          name: "",
          metric: SLA_METRICS[0]?.value ?? "",
          targetValue: 100,
          warningPct: 80,
        });
      },
    });
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Summary badges */}
      {data && (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-green-700">
            <CheckCircle className="h-3.5 w-3.5" /> {data.ok} OK
          </span>
          <span className="flex items-center gap-1.5 text-xs text-yellow-700">
            <AlertTriangle className="h-3.5 w-3.5" /> {data.warning} Warning
          </span>
          <span className="flex items-center gap-1.5 text-xs text-red-700">
            <XCircle className="h-3.5 w-3.5" /> {data.breached} Breached
          </span>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="ml-auto flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add SLA Rule
          </button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-900">New SLA Rule</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Rule name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
            />
            <select
              value={form.metric}
              onChange={(e) => setForm({ ...form, metric: e.target.value })}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
            >
              {SLA_METRICS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Target value"
              value={form.targetValue}
              onChange={(e) =>
                setForm({ ...form, targetValue: Number(e.target.value) })
              }
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Warning % (default 80)"
              value={form.warningPct}
              onChange={(e) =>
                setForm({ ...form, warningPct: Number(e.target.value) })
              }
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!form.name || !form.metric || createMutation.isPending}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              Create
            </button>
          </div>
        </div>
      )}

      {/* SLA cards */}
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center">
          <p className="text-sm text-gray-400">No SLA rules configured yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Add a rule to start monitoring
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((item) => {
            const config = STATE_CONFIG[item.state];
            const Icon = config.icon;
            const pct = Math.min(item.usedPct ?? 0, 100);

            return (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.metric}
                    </p>
                  </div>
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 mt-0.5",
                      config.colorClass,
                    )}
                  />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      config.barClass,
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Actual:{" "}
                    <span className="font-medium text-gray-900">
                      {item.actualValue ?? "—"}
                    </span>
                  </span>
                  <span>
                    Target:{" "}
                    <span className="font-medium text-gray-900">
                      {item.targetValue}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
