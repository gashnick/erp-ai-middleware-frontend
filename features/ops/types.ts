export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done'

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  description: string
  status: OrderStatus
  priority: TaskPriority
  assignedTo: string
  dueDate: string
  createdAt: string
  value: number
  currency: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string
  dueDate: string
  orderId?: string
}

export interface OpsKpis {
  openOrdersCount: number
  completedTodayCount: number
  overdueTasksCount: number
  averageCompletionDays: number
  orderVelocityChangePercentage: number
  statusBreakdown: OrderStatusCount[]
}

export interface OrderStatusCount {
  status: OrderStatus
  count: number
}
