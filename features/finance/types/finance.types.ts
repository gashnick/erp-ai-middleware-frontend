// Finance Dashboard Type Definitions

export interface CashBalance {
  balance: number;
  currency: string;
  asOf: string;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

export interface KpiMetric {
  label: string;
  value: number;
  currency?: string;
  trend: number; // percentage
  period: string;
  icon?: string;
}

export interface RevenueByMonth {
  month: number;
  year: number;
  revenue: number;
  currency: string;
  label?: string; // Formatted label like "Jan 2024"
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
  bucket: string; // "0-30", "31-60", "61-90", "90+"
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

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName?: string;
  customerName?: string;
  amount: number;
  currency: string;
  dueDate: string;
  issuedDate: string;
  status: "paid" | "unpaid" | "overdue" | "draft";
  description?: string;
}

export interface FinanceDashboardFilters {
  period: "today" | "week" | "month" | "quarter" | "ytd" | "custom";
  dateRange?: DateRange;
  currencies?: string[];
}
