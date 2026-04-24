import { apiClient } from "@/lib/api-client";
import type {
  ApproveLeaveRequestDto,
  AttritionRisk,
  AttritionSummary,
  CreateEmployeeDto,
  CreateLeaveRequestDto,
  Employee,
  EmployeeFilters,
  EmployeeStatus,
  HeadcountSummary,
  HeadcountTrendPoint,
  LeaveRequest,
  PayrollSummary,
} from "../types";

export const hrService = {
  async getKpis() {
    return apiClient.get("/hr/kpis");
  },

  async getEmployees(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: EmployeeStatus;
    search?: string;
  }): Promise<Employee[]> {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.department) queryParams.department = params.department;
    if (params?.status) queryParams.status = params.status;
    if (params?.search) queryParams.search = params.search;
    return apiClient.get<Employee[]>("/hr/employees", queryParams);
  },

  async getDepartments(): Promise<string[]> {
    return apiClient.get<string[]>("/hr/departments");
  },

  async getLeaveRequests(params?: { status?: string }): Promise<LeaveRequest[]> {
    const queryParams: Record<string, string> = {};
    if (params?.status) queryParams.status = params.status;
    return apiClient.get<LeaveRequest[]>("/hr/leave-requests", queryParams);
  },

  async getHeadcount(filters?: EmployeeFilters): Promise<HeadcountSummary> {
    const params: Record<string, string> = {};
    if (filters?.department) params.department = filters.department;
    if (filters?.from) params.from = filters.from;
    if (filters?.to) params.to = filters.to;
    return apiClient.get<HeadcountSummary>("/hr/headcount", params);
  },

  async getHeadcountTrend(months = 12): Promise<HeadcountTrendPoint[]> {
    return apiClient.get<HeadcountTrendPoint[]>("/hr/headcount/trend", {
      months: String(months),
    });
  },

  async getAttrition(from?: string, to?: string): Promise<AttritionSummary> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return apiClient.get<AttritionSummary>("/hr/attrition", params);
  },

  async getAttritionRisk(): Promise<AttritionRisk[]> {
    return apiClient.get<AttritionRisk[]>("/hr/attrition/risk");
  },

  async getPayrollSummary(department?: string): Promise<PayrollSummary> {
    const params: Record<string, string> = {};
    if (department) params.department = department;
    return apiClient.get<PayrollSummary>("/hr/payroll/summary", params);
  },

  async getPayrollBreakdown(): Promise<PayrollSummary["byDepartment"]> {
    return apiClient.get("/hr/payroll/breakdown");
  },

  async listEmployees(
    filters?: EmployeeFilters,
    limit = 50,
    offset = 0,
  ): Promise<Employee[]> {
    const params: Record<string, string> = {
      limit: String(limit),
      offset: String(offset),
    };
    if (filters?.department) params.department = filters.department;
    if (filters?.status) params.status = filters.status;
    if (filters?.from) params.from = filters.from;
    if (filters?.to) params.to = filters.to;
    return apiClient.get<Employee[]>("/hr/employees", params);
  },

  async upsertEmployee(dto: CreateEmployeeDto): Promise<Employee> {
    return apiClient.post<Employee>("/hr/employees", dto);
  },

  async listLeaveRequests(params?: {
    employeeId?: string;
    status?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }): Promise<LeaveRequest[]> {
    const queryParams: Record<string, string> = {};
    if (params?.employeeId) queryParams.employeeId = params.employeeId;
    if (params?.status) queryParams.status = params.status;
    if (params?.from) queryParams.from = params.from;
    if (params?.to) queryParams.to = params.to;
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.offset) queryParams.offset = String(params.offset);
    return apiClient.get<LeaveRequest[]>("/hr/leave-requests", queryParams);
  },

  async createLeaveRequest(dto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    return apiClient.post<LeaveRequest>("/hr/leave-requests", dto);
  },

  async approveLeaveRequest(
    id: string,
    dto: ApproveLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return apiClient.post<LeaveRequest>(
      `/hr/leave-requests/${id}/approve`,
      dto,
    );
  },
};
