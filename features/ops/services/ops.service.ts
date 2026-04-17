import { apiClient } from '@/lib/api-client'
import type { PaginatedResponse } from '@/types/api.types'
import type { OpsKpis, Order, Task } from '../types'

export const opsService = {
  async getKpis(): Promise<OpsKpis> {
    return apiClient.get<OpsKpis>('/ops/dashboard/kpis')
  },

  async getOrders(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>('/ops/orders', {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.search ? { search: params.search } : {}),
    })
  },

  async getTasks(params?: {
    page?: number
    limit?: number
    status?: string
    priority?: string
  }): Promise<PaginatedResponse<Task>> {
    return apiClient.get<PaginatedResponse<Task>>('/ops/tasks', {
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 20),
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.priority ? { priority: params.priority } : {}),
    })
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return apiClient.patch<Order>(`/ops/orders/${id}/status`, { status })
  },
}
