import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { hrService } from '../services/hr.service'
import type { EmploymentStatus } from '../types'

export function useHrKpis() {
  return useQuery({
    queryKey: ['hr', 'kpis'],
    queryFn: hrService.getKpis,
    staleTime: 30_000,
  })
}

export function useEmployees(params?: {
  limit?: number
  department?: string
  status?: EmploymentStatus
  search?: string
}) {
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ['hr', 'employees', { page, ...params }],
    queryFn: () => hrService.getEmployees({ page, ...params }),
    staleTime: 15_000,
    placeholderData: (prev) => prev,
  })

  return {
    ...query,
    page,
    setPage,
    totalPages: query.data?.totalPages ?? 1,
  }
}

export function useDepartments() {
  return useQuery({
    queryKey: ['hr', 'departments'],
    queryFn: hrService.getDepartments,
    staleTime: 60_000 * 5,
  })
}

export function useLeaveRequests(status?: string) {
  return useQuery({
    queryKey: ['hr', 'leave-requests', status],
    queryFn: () => hrService.getLeaveRequests({ status }),
    staleTime: 15_000,
  })
}
