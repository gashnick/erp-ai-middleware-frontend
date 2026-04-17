import type { OrderStatus, TaskPriority } from "./types";

export function getOrderStatusConfig(status: OrderStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "info" | "neutral";
} {
  const map: Record<
    OrderStatus,
    {
      label: string;
      variant: "success" | "warning" | "error" | "info" | "neutral";
    }
  > = {
    completed: { label: "Completed", variant: "success" },
    in_progress: { label: "In Progress", variant: "info" },
    confirmed: { label: "Confirmed", variant: "warning" },
    draft: { label: "Draft", variant: "neutral" },
    cancelled: { label: "Cancelled", variant: "error" },
  };
  return map[status];
}

export function getPriorityWeight(priority: TaskPriority): number {
  const weights: Record<TaskPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  return weights[priority];
}

export function sortByPriority<T extends { priority: TaskPriority }>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority),
  );
}

export function isOrderOverdue(dueDate: string, status: OrderStatus): boolean {
  return (
    status !== "completed" &&
    status !== "cancelled" &&
    new Date(dueDate) < new Date()
  );
}
