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
