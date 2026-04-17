import { apiClient } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/api.types'
import type { Employee, HrKpis, LeaveRequest } from '../types'

export const hrService = {
  async getKpis(): Promise<HrKpis> {
    return apiClient.get<HrKpis>('/hr/dashboard/kpis')
  },

  async getEmployees(params?: {
    page?: number
    limit?: number
    department?: string
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Employee>> {
    return apiClient.get<PaginatedResponse<Employee>>('/hr/employees', {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.department ? { department: params.department } : {}),
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.search ? { search: params.search } : {}),
    })
  },

  async getEmployee(id: string): Promise<Employee> {
    return apiClient.get<Employee>(`/hr/employees/${id}`)
  },

  async getLeaveRequests(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<PaginatedResponse<LeaveRequest>> {
    return apiClient.get<PaginatedResponse<LeaveRequest>>('/hr/leave-requests', {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.status ? { status: params.status } : {}),
    })
  },

  async getDepartments(): Promise<string[]> {
    return apiClient.get<string[]>('/hr/departments')
  },
}
