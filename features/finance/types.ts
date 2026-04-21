export type InvoiceStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "draft"
  | "sent"
  | "void";

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  amount: string | number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  invoice_date: string | null;
  is_encrypted: boolean;
  external_id: string | null;
  created_at: string;
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
  pending_invoices_count: number;
  overdue_invoices_count: number;
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
  type: "credit" | "debit";
  amount: number;
  currency: string;
  description: string | null;
  transactionDate: string | null;
  reference: string | null;
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
