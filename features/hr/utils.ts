import type { EmploymentStatus, Employee } from "./types";

export function getEmploymentStatusConfig(status: EmploymentStatus): {
  label: string;
  variant: "success" | "warning" | "error" | "neutral";
} {
  const map: Record<
    EmploymentStatus,
    { label: string; variant: "success" | "warning" | "error" | "neutral" }
  > = {
    active: { label: "Active", variant: "success" },
    on_leave: { label: "On Leave", variant: "warning" },
    probation: { label: "Probation", variant: "neutral" },
    terminated: { label: "Terminated", variant: "error" },
  };
  return map[status];
}

export function getEmployeeFullName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`;
}

export function getEmployeeInitials(employee: Employee): string {
  return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
}

export function calculateTenureYears(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
}
