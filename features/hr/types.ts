export type EmployeeStatus = "active" | "on_leave" | "terminated";

export type LeaveType = "annual" | "sick" | "personal" | "unpaid" | "maternity" | "paternity";

export type LeaveRequestStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveRequestStatus;
  reason?: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  approverNotes?: string;
  createdAt: string;
}

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ApproveLeaveRequestDto {
  status: "approved" | "rejected";
  approverNotes?: string;
}

export interface Employee {
  id: string;
  externalId: string | null;
  name: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  startDate: string;
  endDate: string | null;
  salary: number | null;
  currency: string;
  createdAt: string;
}

export interface DepartmentHeadcount {
  department: string;
  total: number;
  active: number;
  onLeave: number;
  terminated: number;
}

export interface HeadcountSummary {
  total: number;
  active: number;
  onLeave: number;
  terminated: number;
  byDepartment: DepartmentHeadcount[];
}

export interface HeadcountTrendPoint {
  period: string;
  total: number;
  active: number;
  terminated: number;
}

export interface AttritionRisk {
  employeeId: string;
  name: string;
  department: string;
  role: string;
  tenureMonths: number;
  riskReason: string;
}

export interface AttritionSummary {
  period: string;
  terminations: number;
  avgHeadcount: number;
  rate: number;
  riskFlags: AttritionRisk[];
}

export interface DepartmentPayroll {
  department: string;
  headcount: number;
  total: number;
  currency: string;
  avgSalary: number;
}

export interface PayrollSummary {
  total: number;
  currency: string;
  headcount: number;
  avgSalary: number;
  byDepartment: DepartmentPayroll[];
}

export interface CreateEmployeeDto {
  externalId?: string;
  name: string;
  department: string;
  role: string;
  status?: EmployeeStatus;
  startDate: string;
  endDate?: string;
  salary?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface EmployeeFilters {
  department?: string;
  status?: EmployeeStatus;
  from?: string;
  to?: string;
}
