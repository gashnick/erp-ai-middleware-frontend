export type EmploymentStatus = 'active' | 'on_leave' | 'terminated' | 'probation'
export type Department = string
export type EmployeeRole = 'employee' | 'manager' | 'director' | 'executive'

export interface Employee {
  id: string
  employeeNumber: string
  firstName: string
  lastName: string
  email: string
  department: Department
  role: EmployeeRole
  jobTitle: string
  status: EmploymentStatus
  startDate: string
  salary: number
  currency: string
  managerId?: string
}

export interface HrKpis {
  totalHeadcount: number
  activeEmployees: number
  onLeaveCount: number
  newHiresThisMonth: number
  attritionRate: number
  headcountChangePercentage: number
  departmentBreakdown: DepartmentCount[]
}

export interface DepartmentCount {
  department: string
  count: number
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: 'annual' | 'sick' | 'parental' | 'unpaid'
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'rejected'
  days: number
}
