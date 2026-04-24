export type EntityType =
  | "invoice"
  | "contact"
  | "expense"
  | "bank_transaction"
  | "product"
  | "employee"
  | "asset";

export type JobStatus = "processing" | "completed" | "failed";

export interface UploadResponse {
  jobId: string;
  status: JobStatus;
  message: string;
}

export interface ImportJob {
  status: JobStatus;
  // processing state
  entityType?: EntityType;
  filename?: string;
  // completed state
  total?: number;
  synced?: number;
  quarantined?: number;
  // failed state
  error?: string;
}

export interface QuarantineRecord {
  id: string;
  entityType: EntityType;
  originalData: Record<string, unknown>;
  fixedData?: Record<string, unknown>;
  errors: ValidationError[];
  status: "new" | "reviewed" | "fixed" | "retry_failed";
  severity: "warning" | "error" | "critical";
  jobId: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ValidationError {
  field: string;
  value: unknown;
  expectedType: string;
  message: string;
  suggestion?: string;
}

export interface QuarantineResponse {
  data: QuarantineRecord[];
  total: number;
}

export interface BuildGraphResponse {
  message: string;
}

export interface EntityTypeConfig {
  label: string;
  description: string;
  expectedHeaders: string[];
  icon: string;
}

export const ENTITY_TYPE_CONFIG: Record<EntityType, EntityTypeConfig> = {
  invoice: {
    label: "Invoices",
    description: "Customer invoices and billing records",
    expectedHeaders: [
      "invoice_number",
      "customer_name",
      "amount",
      "due_date",
      "status",
    ],
    icon: "🧾",
  },
  contact: {
    label: "Contacts",
    description: "Customers, vendors and partners",
    expectedHeaders: ["name", "email", "phone", "type", "address"],
    icon: "👤",
  },
  expense: {
    label: "Expenses",
    description: "Company expenses and purchases",
    expectedHeaders: ["date", "category", "vendor", "amount", "currency"],
    icon: "💳",
  },
  bank_transaction: {
    label: "Bank Transactions",
    description: "Bank statement transactions",
    expectedHeaders: ["date", "description", "amount", "type", "balance"],
    icon: "🏦",
  },
  product: {
    label: "Products",
    description: "Product and inventory catalog",
    expectedHeaders: ["name", "sku", "price", "currency", "category"],
    icon: "📦",
  },
  employee: {
    label: "Employees",
    description: "Employee records and payroll",
    expectedHeaders: [
      "external_id",
      "name",
      "department",
      "role",
      "status",
      "start_date",
      "salary",
      "currency",
    ],
    icon: "👥",
  },
  asset: {
    label: "Assets",
    description: "Infrastructure, fleet, warehouse and facilities assets",
    expectedHeaders: [
      "external_id",
      "name",
      "category",
      "status",
      "uptime_pct",
      "last_service",
      "next_service",
      "metadata",
    ],
    icon: "⚙️",
  },
};
