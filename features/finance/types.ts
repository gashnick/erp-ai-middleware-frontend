export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
}

export interface CashBalance {
  current: number;
  currency: string;
  changePercentage: number;
  trend: "up" | "down" | "neutral";
  asOf: string;
  balance?: number;
  trendPercent?: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface DashboardKpis {
  cashBalance: CashBalance;
  totalRevenue: number;
  totalExpenses: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
  revenueChangePercentage: number;
}

// Extended types for comprehensive dashboard
export interface KpiMetric {
  label: string;
  value: number;
  currency?: string;
  trend: number;
  period: string;
  icon?: string;
}

export interface RevenueByMonth {
  month: number;
  year: number;
  revenue: number;
  currency: string;
  label?: string;
}

export interface ExpenseBreakdown {
  category: string;
  vendorId: string;
  vendorName: string;
  total: number;
  currency: string;
  percentage: number;
}

export interface InvoiceAging {
  id: string; // bucket key serves as id for DataTable
  bucket: string;
  count: number;
  amount: number;
  currency: string;
  percentage: number;
}

export interface RecentTransaction {
  id: string;
  type: "invoice" | "expense" | "payment" | "deposit";
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "failed";
  counterparty?: string;
}

export interface CashFlowData {
  month: number;
  year: number;
  inflow: number;
  outflow: number;
  netCashFlow: number;
  currency: string;
  label?: string;
}

export interface FinanceDashboardData {
  cashBalance: CashBalance;
  kpis: KpiMetric[];
  revenueByMonth: RevenueByMonth[];
  expenseBreakdown: ExpenseBreakdown[];
  invoiceAging: InvoiceAging[];
  recentTransactions: RecentTransaction[];
  cashFlow: CashFlowData[];
  currency: string;
  refreshedAt: string;
}

export interface PeriodOption {
  label: string;
  value: "today" | "week" | "month" | "quarter" | "ytd" | "custom";
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FinanceDashboardFilters {
  period: "today" | "week" | "month" | "quarter" | "ytd" | "custom";
  dateRange?: DateRange;
  currencies?: string[];
}
