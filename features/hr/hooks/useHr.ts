import { useQuery } from '@tanstack/react-query'
import { hrService } from '../services/hr.service'
import type { Employee, EmployeeStatus, HeadcountSummary } from '../types'

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
  status?: EmployeeStatus
  search?: string
}) {
  const query = useQuery({
    queryKey: ['hr', 'employees', params],
    queryFn: () => hrService.getEmployees(params),
    staleTime: 15_000,
  })

  return query
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
    queryFn: () => hrService.listLeaveRequests({ status }),
    staleTime: 15_000,
  })
}

export function useHeadcount() {
  return useQuery({
    queryKey: ['hr', 'headcount'],
    queryFn: () => hrService.getHeadcount(),
    staleTime: 30_000,
  })
}
