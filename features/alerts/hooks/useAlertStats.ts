import { useAlertRules } from "./useAlertRules";
import { useOpenAlerts } from "./useAlertEvents";
import type { AlertStats } from "../types";

export function useAlertStats(): {
  data: AlertStats | undefined;
  isLoading: boolean;
} {
  const { data: rulesData, isLoading: rulesLoading } = useAlertRules();
  const { data: eventsData, isLoading: eventsLoading } = useOpenAlerts();

  const rules = rulesData?.data ?? [];
  const events = eventsData?.data ?? [];

  const data: AlertStats | undefined =
    rulesData && eventsData
      ? {
          total_rules: rulesData.total,
          active_rules: rules.filter((r) => r.is_active).length,
          open_events: eventsData.total,
          by_severity: {
            low: events.filter((e) => e.severity === "low").length,
            medium: events.filter((e) => e.severity === "medium").length,
            high: events.filter((e) => e.severity === "high").length,
            critical: events.filter((e) => e.severity === "critical").length,
          },
        }
      : undefined;

  return { data, isLoading: rulesLoading || eventsLoading };
}
