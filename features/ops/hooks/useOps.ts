import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { opsService } from '../services/ops.service'
import type { OrderStatus, TaskStatus } from '../types'

export function useOpsKpis() {
  return useQuery({
    queryKey: ['ops', 'kpis'],
    queryFn: opsService.getKpis,
    staleTime: 30_000,
  })
}

export function useOrders(params?: {
  limit?: number
  status?: OrderStatus
  search?: string
}) {
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ['ops', 'orders', { page, ...params }],
    queryFn: () => opsService.getOrders({ page, ...params }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  })

  return { ...query, page, setPage, totalPages: query.data?.totalPages ?? 1 }
}

export function useTasks(params?: {
  status?: TaskStatus
  priority?: string
}) {
  return useQuery({
    queryKey: ['ops', 'tasks', params],
    queryFn: () => opsService.getTasks(params),
    staleTime: 15_000,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      opsService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['ops', 'kpis'] })
    },
  })
}
