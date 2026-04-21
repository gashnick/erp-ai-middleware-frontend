// Finance Dashboard Type Definitions

export interface CashBalance {
  current: number;
  currency: string;
  asOf: string;
  trend: "up" | "down" | "neutral";
  changePercentage: number;
}

export interface KpiMetric {
  label: string;
  value: number;
  currency?: string;
  trend: number;
  period: string;
  icon?: string;
}

export interface RevenueByMonth {
  month: string; // "Nov 2025" — string from backend
  revenue: number;
  expenses: number;
}

export interface ExpenseBreakdown {
  category: string;
  total: number;
  count: number;
  currency: string;
  percentage: number;
}

export interface InvoiceAging {
  bucket: string; // "0-30", "31-60", "61-90", "90+"
  count: number;
  amount: number;
  currency: string;
}

// Matches actual bank_transactions table columns
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
  month: string; // "Jan 2026" — string from backend
  inflow: number;
  outflow: number;
  net: number;
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

export type InvoiceStatus =
  | "paid"
  | "pending"
  | "overdue"
  | "draft"
  | "sent"
  | "void";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string | null;
  amount: number;
  currency: string;
  dueDate: string | null;
  issuedAt: string | null;
  status: InvoiceStatus;
}

export interface FinanceDashboardFilters {
  period: "today" | "week" | "month" | "quarter" | "ytd" | "custom";
  dateRange?: DateRange;
  currencies?: string[];
}

export interface DashboardKpis {
  cashBalance: CashBalance;
  totalRevenue: number;
  totalExpenses: number;
  pendingInvoicesCount: number;
  overdueInvoicesCount: number;
  revenueChangePercentage: number;
}
