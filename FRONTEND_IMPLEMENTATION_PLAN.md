# Frontend Implementation Plan - CID ERP Middleware

**Last Updated**: April 18, 2026  
**Status**: In Progress  
**Current Phase**: Phase 1 - Core Business Features

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Critical Features (Week 1-2)](#phase-1-critical-features-week-1-2)
3. [Phase 2: Domain Features (Week 3)](#phase-2-domain-features-week-3)
4. [Phase 3: Utility & Advanced (Week 4)](#phase-3-utility--advanced-week-4)
5. [Shared Components & Services](#shared-components--services)
6. [File Structure](#file-structure)

---

## Overview

This document outlines all frontend features needed based on the Postman API collection. Features are organized by priority level and implementation phase.

### Priority Levels

- 🔴 **CRITICAL**: Core business value, blocks other features
- 🟡 **HIGH**: Important functionality, separate concerns
- 🟢 **MEDIUM**: Utility features, nice-to-have

---

## Phase 1: Critical Features (Week 1-2)

### 1.1 Finance Dashboard 🔴 CRITICAL

**Why First**: Shows immediate ROI to customers, primary landing page after login

**Endpoints**:

```
GET /dashboard/finance
GET /finance/invoices (paginated)
GraphQL: revenueByMonth, expenseBreakdown, cashPosition
```

**Components to Create**:

```
features/finance/
├── components/
│   ├── FinanceDashboard.tsx          (Main container)
│   ├── KpiSection.tsx                (KPI Cards layout)
│   ├── KpiCard.tsx                   (Individual KPI card - Cash, Revenue, etc)
│   ├── RevenueChart.tsx              (Monthly revenue chart)
│   ├── CashFlowChart.tsx             (Cash flow visualization)
│   ├── InvoiceAgingTable.tsx         (AR/AP aging breakdown)
│   ├── RecentTransactionsTable.tsx   (Latest transactions)
│   ├── ExpenseBreakdownChart.tsx     (Expense by category pie chart)
│   ├── PeriodSelector.tsx            (Month/Quarter/Year filter)
│   └── EmptyStateFinance.tsx         (No data placeholder)
├── hooks/
│   ├── useFinanceDashboard.ts        (Main data hook)
│   ├── useCashBalance.ts
│   ├── useRevenueChart.ts
│   ├── useExpenses.ts
│   └── useInvoiceAging.ts
├── services/
│   └── finance.service.ts            (API calls)
├── types/
│   └── finance.types.ts              (TypeScript interfaces)
└── utils/
    └── formatters.ts                 (Currency, date formatting)
```

**Data Types to Define**:

```typescript
interface CashBalance {
  balance: number;
  currency: string;
  asOf: string;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

interface KpiMetric {
  label: string;
  value: number;
  currency?: string;
  trend: number; // percentage
  period: string;
}

interface RevenueByMonth {
  month: number;
  year: number;
  revenue: number;
  currency: string;
}

interface ExpenseBreakdown {
  category: string;
  vendorId: string;
  vendorName: string;
  total: number;
  currency: string;
  percentage: number;
}

interface InvoiceAging {
  bucket: string; // "0-30", "31-60", "61-90", "90+"
  count: number;
  amount: number;
  currency: string;
}
```

**UI/UX Requirements**:

- Responsive grid layout (1 col mobile, 2-3 col tablet, 4 col desktop)
- Real-time updates every 60 seconds (configurable)
- Loading skeletons for each card
- Error boundaries with retry buttons
- Period selector (Today, This Week, This Month, This Quarter, YTD, Custom Range)
- Export to PDF button

**API Integration**:

```typescript
// finance.service.ts should implement:
- getDashboardMetrics(tenantId, period)
- getRevenueByMonth(year)
- getExpenseBreakdown(from, to)
- getCashPosition(asOf?)
- getInvoiceAging()
- getInvoices(filters, pagination)
```

---

### 1.2 Alert Rules Management 🔴 CRITICAL

**Why Second**: Monitoring is critical for operational safety

**Endpoints**:

```
POST /alerts/rules                 (Create)
GET /alerts/rules                  (List)
GET /alerts/rules/:id              (Get one)
PUT /alerts/rules/:id              (Update)
DELETE /alerts/rules/:id           (Delete)
GET /alerts/events                 (Open alerts)
GET /alerts/events/open
POST /alerts/events/:id/acknowledge
POST /alerts/events/:id/resolve
```

**Components to Create**:

```
features/alerts/
├── components/
│   ├── AlertsHub.tsx               (Main container with tabs)
│   ├── AlertRulesPanel.tsx         (Rules list & management)
│   ├── AlertRuleForm.tsx           (Create/Edit form)
│   ├── AlertRuleCard.tsx           (Rule display card)
│   ├── OpenAlertsPanel.tsx         (Active alerts)
│   ├── AlertEventCard.tsx          (Individual alert event)
│   ├── AlertNotificationCenter.tsx (Notification bell/panel)
│   ├── AlertEventDetailModal.tsx   (Full alert info modal)
│   ├── MetricSelector.tsx          (Dropdown for alert metrics)
│   ├── ThresholdInput.tsx          (Number input with helper)
│   ├── ChannelSelector.tsx         (Multi-select channels)
│   │   └── Options: in_app, email, sms, slack
│   ├── SeverityBadge.tsx           (Visual severity indicator)
│   ├── AcknowledgeButton.tsx
│   ├── ResolveButton.tsx
│   └── EmptyStateAlerts.tsx        (No alerts placeholder)
├── hooks/
│   ├── useAlertRules.ts
│   ├── useAlertEvents.ts
│   ├── useAlertNotifications.ts    (WebSocket for real-time)
│   └── useAlertFilters.ts
├── services/
│   └── alerts.service.ts
├── types/
│   └── alerts.types.ts
└── utils/
    ├── alertMetrics.ts             (Metric definitions & validation)
    └── operators.ts                (Operators: gt, lt, eq, etc)
```

**Data Types to Define**:

```typescript
type AlertMetric =
  | "cash_balance"
  | "revenue"
  | "expenses"
  | "invoice_overdue"
  | "employee_count"
  | "asset_uptime";

type AlertOperator = "gt" | "lt" | "eq" | "gte" | "lte" | "between";
type AlertSeverity = "low" | "medium" | "high" | "critical";
type AlertChannel = "in_app" | "email" | "sms" | "slack";
type AlertEventStatus = "open" | "acknowledged" | "resolved";

interface AlertRule {
  id: string;
  name: string;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  severity: AlertSeverity;
  channels: AlertChannel[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AlertEvent {
  id: string;
  ruleId: string;
  metric: AlertMetric;
  currentValue: number;
  threshold: number;
  severity: AlertSeverity;
  status: AlertEventStatus;
  detectedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  message: string;
}
```

**UI/UX Requirements**:

- Tab view: "Active Rules" | "Open Alerts" | "History"
- Real-time notifications (WebSocket)
- Drag-to-dismiss alerts
- Bulk acknowledge/resolve
- Rule templates/presets
- Rule duplication

**API Integration**:

```typescript
// alerts.service.ts should implement:
-createAlertRule(rule) -
  listAlertRules(filters) -
  getAlertRule(id) -
  updateAlertRule(id, updates) -
  deleteAlertRule(id) -
  getOpenAlerts(filters) -
  acknowledgeAlert(eventId) -
  resolveAlert(eventId) -
  getAlertHistory(filters, pagination);
```

---

### 1.3 CSV Upload & Data Import Workflow 🔴 CRITICAL

**Why Third**: Core data ingestion flow, blocks knowledge graph building

**Endpoints**:

```
POST /connectors/csv-upload         (Upload file)
GET /connectors/jobs/:id            (Check job progress)
POST /connectors/build-graph        (Build knowledge graph)
POST /quarantine/:id/retry          (Retry failed records)
```

**Components to Create**:

```
features/import/
├── pages/
│   └── ImportPage.tsx              (Full page container)
├── components/
│   ├── UploadDropzone.tsx          (Main drag-drop area)
│   ├── EntityTypeSelector.tsx      (Radio/dropdown: invoice, transaction, etc)
│   ├── JobProgressTracker.tsx      (Real-time job progress)
│   ├── JobStatusCard.tsx           (Single job status display)
│   ├── JobResultSummary.tsx        (Success/failure counts)
│   ├── ErrorVisualization.tsx      (Error list/details)
│   ├── BuildGraphButton.tsx
│   ├── QuarantinePreview.tsx       (Preview bad records)
│   ├── ImportHistory.tsx           (Past imports list)
│   ├── FileValidator.tsx           (Pre-upload validation UI)
│   └── EmptyStateImport.tsx
├── hooks/
│   ├── useFileUpload.ts
│   ├── useJobProgress.ts           (Poll job status)
│   ├── useImportHistory.ts
│   └── useValidation.ts
├── services/
│   └── import.service.ts
├── types/
│   └── import.types.ts
└── utils/
    ├── fileValidation.ts
    ├── csvParser.ts                (Client-side preview)
    └── entityTypeConfig.ts         (Supported entities & fields)
```

**Data Types to Define**:

```typescript
type EntityType =
  | "invoice"
  | "bank_transaction"
  | "expense"
  | "contact"
  | "product";

interface ImportJob {
  jobId: string;
  fileName: string;
  entityType: EntityType;
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  errorCount: number;
  status: "pending" | "processing" | "completed" | "failed";
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdby: string;
}

interface ImportError {
  recordIndex: number;
  rowData: Record<string, any>;
  error: string;
  fields: string[];
  severity: "warning" | "error";
}

interface FieldMapping {
  csvColumn: string;
  entityField: string;
  dataType: string;
  required: boolean;
}

interface EntityTypeConfig {
  type: EntityType;
  requiredFields: string[];
  optionalFields: string[];
  expectedHeaders: string[];
}
```

**UI/UX Requirements**:

- Drag-drop file upload
- CSV preview before upload (first 5 rows)
- Real-time progress bar with ETA
- Live error feed as records are validated
- Separate tabs: Pending | Completed | Failed
- Download error report (CSV)
- Retry button for failed job
- Build Knowledge Graph trigger

**API Integration**:

```typescript
// import.service.ts should implement:
- uploadCsv(file, entityType): Promise<uploadResponse>
- getJobStatus(jobId): Promise<ImportJob>
- getJobErrors(jobId, pagination): Promise<ImportError[]>
- buildKnowledgeGraph(): Promise<buildResponse>
- retryJob(jobId): Promise<ImportJob>
```

---

### 1.4 Quarantine Manager 🔴 CRITICAL

**Why Fourth**: Handles failed imports gracefully, enables data recovery

**Endpoints**:

```
GET /quarantine                     (List all)
GET /quarantine/status              (Summary)
POST /quarantine/:id/retry          (Retry with fixes)
```

**Components to Create**:

```
features/quarantine/
├── pages/
│   └── QuarantinePage.tsx
├── components/
│   ├── QuarantineHub.tsx            (Main container)
│   ├── QuarantineStatusSummary.tsx  (Stats cards: total, by type, by severity)
│   ├── QuarantineTable.tsx          (Records list)
│   ├── QuarantineRow.tsx            (Expandable row with preview)
│   ├── QuarantineDetailModal.tsx    (Full record + error + fix UI)
│   ├── DataFixEditor.tsx            (Inline JSON/form editor)
│   ├── ErrorReasonDisplay.tsx       (Shows validation error)
│   ├── RetryButton.tsx
│   ├── BulkRetryUI.tsx              (Multi-select + retry all)
│   ├── QuarantineFilters.tsx        (Filter by status, entity type, date)
│   ├── QuarantineTimeline.tsx       (Visual timeline of quarantine)
│   └── EmptyStateQuarantine.tsx
├── hooks/
│   ├── useQuarantine.ts
│   ├── useQuarantineFilters.ts
│   └── useQuarantineRetry.ts
├── services/
│   └── quarantine.service.ts
├── types/
│   └── quarantine.types.ts
└── utils/
    ├── errorParser.ts              (Parse validation errors)
    └── dataFixer.ts                (Suggest fixes)
```

**Data Types to Define**:

```typescript
type QuarantineStatus = "new" | "reviewed" | "fixed" | "retry_failed";

interface QuarantineRecord {
  id: string;
  entityType: EntityType;
  originalData: Record<string, any>;
  fixedData?: Record<string, any>;
  errors: ValidationError[];
  status: QuarantineStatus;
  severity: "warning" | "error" | "critical";
  jobId: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface ValidationError {
  field: string;
  value: any;
  expectedType: string;
  message: string;
  suggestion?: string;
}

interface QuarantineStats {
  total: number;
  byStatus: Record<QuarantineStatus, number>;
  bySeverity: Record<string, number>;
  byEntityType: Record<EntityType, number>;
}
```

**UI/UX Requirements**:

- Status badges (New, Reviewed, Fixed, Retry Failed)
- Severity color coding
- Side-by-side comparison (original vs fixed data)
- Form builder for data entry
- Keyboard shortcuts for navigation
- Batch operations (select multiple, retry all)
- Export quarantine as CSV

**API Integration**:

```typescript
// quarantine.service.ts should implement:
-listQuarantineRecords(filters, pagination) -
  getQuarantineStatus() -
  getQuarantineRecord(id) -
  retryQuarantineRecord(id, fixedData) -
  retryMultiple(ids, fixedDataMap) -
  deleteQuarantineRecord(id);
```

---

### 1.5 AI Insights & Anomalies Detection 🟡 HIGH

**Why Fifth**: Provides AI differentiation, real business value

**Endpoints**:

```
POST /insights/scan                 (Trigger scan)
GET /insights                       (List insights)
GET /insights/:id                   (Get detail)
POST /insights/:id/feedback         (Rate usefulness)
```

**Components to Create**:

```
features/insights/
├── components/
│   ├── InsightsHub.tsx             (Main container)
│   ├── InsightsList.tsx            (Grid/list view)
│   ├── InsightCard.tsx             (Individual insight preview)
│   ├── InsightDetailModal.tsx      (Full insight details)
│   ├── InsightTypeIcon.tsx         (Visual indicator by type)
│   ├── ConfidenceScore.tsx         (Circular progress with %)
│   ├── AnomalyImpactBadge.tsx      (Shows severity/importance)
│   ├── RelatedRecordsPreview.tsx   (Shows related invoices, etc)
│   ├── FeedbackRatingWidget.tsx    (Helpful/Not helpful + comment)
│   ├── ScanButton.tsx              (Trigger new scan)
│   ├── InsightFilters.tsx          (Filter by type, score, date)
│   ├── InsightTimeline.tsx         (When insights were detected)
│   └── EmptyStateInsights.tsx
├── hooks/
│   ├── useInsights.ts
│   ├── useInsightScan.ts
│   ├── useInsightFeedback.ts
│   └── useInsightFilters.ts
├── services/
│   └── insights.service.ts
├── types/
│   └── insights.types.ts
└── utils/
    ├── insightTypeConfig.ts        (Definitions and colors)
    └── scoreInterpreter.ts         (Score -> human language)
```

**Data Types to Define**:

```typescript
type InsightType =
  | "DUPLICATE_INVOICE"
  | "EXPENSE_SPIKE"
  | "UNUSUALLY_HIGH_VENDOR"
  | "INVOICE_OVERDUE"
  | "CASH_PATTERN_CHANGE"
  | "EMPLOYEE_ANOMALY";

type FeedbackRating = "helpful" | "not_helpful" | "already_known";

interface Insight {
  id: string;
  type: InsightType;
  score: number; // 0-1
  confidence: number; // 0-1
  explanation: string;
  relatedIds: string[]; // Related entity IDs
  relatedType: string; // 'invoice', 'expense', etc
  detectedAt: string;
  metadata?: Record<string, any>;
}

interface InsightFeedback {
  insightId: string;
  rating: FeedbackRating;
  comment?: string;
  submittedAt: string;
}
```

**UI/UX Requirements**:

- Sort by confidence score, newness, type
- Color-coded by insight type
- Related records preview (clickable)
- Detailed explanation with metrics
- One-click feedback submission
- Integration with alerts (create alert from insight)

**API Integration**:

```typescript
// insights.service.ts should implement:
-triggerAnomalyScan() -
  listInsights(filters, pagination) -
  getInsight(id) -
  submitInsightFeedback(id, rating, comment);
```

---

### 1.6 Subscription & Seats Management 🟡 HIGH

**Why Sixth**: SaaS critical - revenue and compliance

**Endpoints**:

```
GET /subscription                   (Get plan)
GET /subscription/usage             (Feature usage)
GET /subscription/seats             (Seats list)
PUT /subscription/upgrade           (Upgrade plan)
PUT /subscription/downgrade         (Downgrade plan)
POST /subscription/seats/:id/activate
POST /subscription/seats/:id/deactivate
GET /subscription-plans             (Available plans)
```

**Components to Create**:

```
features/subscription/
├── pages/
│   └── SubscriptionPage.tsx
├── components/
│   ├── SubscriptionHub.tsx         (Main container)
│   ├── CurrentPlanCard.tsx         (Active plan display)
│   ├── PlanUpgradeCard.tsx         (CTA to upgrade)
│   ├── UsageSummaryCards.tsx       (Feature usage overview)
│   ├── UsageProgressBar.tsx        (Per-feature progress)
│   ├── SeatsManagement.tsx         (Seats list and management)
│   ├── SeatRow.tsx                 (Individual seat with toggle)
│   ├── ActivateButton.tsx
│   ├── DeactivateButton.tsx
│   ├── PlanComparisonTable.tsx     (Features by plan matrix)
│   ├── PlanSelector.tsx            (Grid/tabs of available plans)
│   ├── UpgradeConfirmModal.tsx     (Confirmation before upgrade)
│   ├── PricingCard.tsx             (Single plan card)
│   ├── FeatureBadge.tsx            (Feature included/not included)
│   ├── UsageAlertBanner.tsx        (Near-limit warning)
│   └── EmptyStateSubscription.tsx
├── hooks/
│   ├── useSubscription.ts
│   ├── useUsage.ts
│   ├── useSeats.ts
│   └── usePlanUpgrade.ts
├── services/
│   └── subscription.service.ts
├── types/
│   └── subscription.types.ts
└── utils/
    ├── planComparison.ts           (Plan data and helpers)
    └── usageFormatter.ts
```

**Data Types to Define**:

```typescript
type PlanSlug = "free" | "starter" | "professional" | "enterprise";

interface SubscriptionPlan {
  slug: PlanSlug;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "annual";
  maxSeats: number;
  features: Feature[];
  limits: Record<string, number>; // api_calls, storage, etc
}

interface CurrentSubscription {
  planSlug: PlanSlug;
  maxSeats: number;
  activatedSeats: number;
  renewalDate: string;
  autoRenew: boolean;
}

interface UsageSummary {
  feature: string;
  used: number;
  limit?: number; // null = unlimited
  percentage: number;
  resetDate: string;
}

interface Seat {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  isActive: boolean;
  addedAt: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}
```

**UI/UX Requirements**:

- Current plan prominently displayed
- Usage bars with color coding (green < 70%, yellow 70-90%, red > 90%)
- Feature-by-feature comparison table (feature parity)
- Seat activation/deactivation with confirmation
- Upgrade path suggestions
- Billing history link
- Calendar showing renewal date

**API Integration**:

```typescript
// subscription.service.ts should implement:
- getCurrentPlan(): Promise<CurrentSubscription>
- getUsageSummary(): Promise<UsageSummary[]>
- getSeats(pagination): Promise<Seat[]>
- upgradePlan(planSlug): Promise<UpgradeResponse>
- downgradePlan(planSlug): Promise<DowngradeResponse>
- activateSeat(userId): Promise<Seat>
- deactivateSeat(userId): Promise<Seat>
- getAvailablePlans(): Promise<SubscriptionPlan[]>
```

---

## Phase 2: Domain Features (Week 3)

### 2.1 HR Dashboard 🟡 HIGH

**Endpoints**: `GET /hr/headcount*`, `/hr/attrition*`, `/hr/payroll/*`, `/hr/employees`

**Components to Create**:

```
features/hr/
├── pages/
│   └── HrDashboardPage.tsx
├── components/
│   ├── HrDashboard.tsx             (Main container)
│   ├── HeadcountOverview.tsx       (Current count + trends)
│   ├── HeadcountChart.tsx          (Line chart over time)
│   ├── DepartmentBreakdown.tsx     (Bar chart by dept)
│   ├── AttritionCards.tsx          (Attrition rate, risks)
│   ├── AttritionRiskTable.tsx      (Employees at risk)
│   ├── PayrollSummary.tsx          (Total spend, avg salary)
│   ├── PayrollByDepartment.tsx     (Breakdown chart)
│   ├── EmployeesTable.tsx          (All employees list)
│   ├── EmployeeRowActions.tsx      (Edit, view details)
│   ├── AddEmployeeForm.tsx         (Create employee)
│   ├── EditEmployeeForm.tsx        (Update employee)
│   ├── EmployeeDetailModal.tsx     (Full profile view)
│   ├── FilterPanelHr.tsx           (Dept, Status, Date filters)
│   └── EmptyStateHr.tsx
├── hooks/
│   ├── useHeadcount.ts
│   ├── useAttrition.ts
│   ├── usePayroll.ts
│   ├── useEmployees.ts
│   └── useHrFilters.ts
├── services/
│   └── hr.service.ts
├── types/
│   └── hr.types.ts
└── utils/
    └── hrFormatters.ts
```

**Key Features**:

- 12-month headcount trend line
- Department breakdown pie/bar chart
- Attrition risk scoring and indicators
- Payroll cost trends
- Employee list with search/filter
- Add/Edit employee modal
- Department and status filters
- Date range selector

---

### 2.2 Operations Dashboard 🟡 HIGH

**Endpoints**: `GET /ops/inventory/*`, `/ops/assets`, `/ops/orders/pipeline`, `/ops/sla/*`

**Components to Create**:

```
features/ops/
├── pages/
│   └── OpsDashboardPage.tsx
├── components/
│   ├── OpsDashboard.tsx            (Main container)
│   ├── InventorySummary.tsx        (Key metrics)
│   ├── AssetsTable.tsx             (All assets list)
│   ├── AssetStatusChart.tsx        (Online/Offline pie)
│   ├── AssetCategoryBreakdown.tsx  (By category bar chart)
│   ├── OrdersPipeline.tsx          (Kanban/stages view)
│   ├── OrderStageColumn.tsx        (Single stage column)
│   ├── OrderCard.tsx               (Draggable order card)
│   ├── SlaStatusCards.tsx          (SLA health indicators)
│   ├── SlaBreachesTable.tsx        (Breached SLAs)
│   ├── SlaConfigForm.tsx           (Create/Edit SLA)
│   ├── CreateSlaButton.tsx
│   ├── AssetFilters.tsx            (Status, category filters)
│   ├── OrderFilters.tsx            (Stage, status filters)
│   └── EmptyStateOps.tsx
├── hooks/
│   ├── useInventory.ts
│   ├── useAssets.ts
│   ├── useOrderPipeline.ts
│   ├── useSlaStatus.ts
│   └── useOpsFilters.ts
├── services/
│   └── ops.service.ts
├── types/
│   └── ops.types.ts
└── utils/
    └── opsFormatters.ts
```

**Key Features**:

- Inventory summary cards
- Asset status filtering and search
- Orders in Kanban view (drag-drop between stages)
- SLA status at a glance
- SLA breach alerts
- Create/edit SLA config modal

---

### 2.3 Chat Assistant 🟡 MEDIUM

**Endpoints**: WebSocket chat, `POST /chat/sessions`, `GET /chat/sessions/:id`

**Components to Create**:

```
features/chat/
├── pages/
│   └── ChatPage.tsx
├── components/
│   ├── ChatInterface.tsx           (Main container)
│   ├── ChatWindow.tsx              (Messages display)
│   ├── ChatMessage.tsx             (Individual message)
│   ├── ChatInput.tsx               (Input box)
│   ├── ChatSessionList.tsx         (Sessions sidebar)
│   ├── SessionCard.tsx             (Session item)
│   ├── NewChatButton.tsx
│   ├── ClearHistoryButton.tsx
│   ├── ChatLoading.tsx             (Streaming indicator)
│   ├── ChatError.tsx               (Error message display)
│   ├── MessageStreamAnimation.tsx  (Typing effect)
│   └── EmptyStateChat.tsx
├── hooks/
│   ├── useChat.ts                  (Main chat logic)
│   ├── useChatSessions.ts
│   ├── useChatStream.ts            (WebSocket connection)
│   └── useChatHistory.ts
├── services/
│   └── chat.service.ts
├── types/
│   └── chat.types.ts
└── utils/
    ├── messageParser.ts            (Parse responses)
    └── formatMessage.ts
```

**Key Features**:

- Real-time message streaming with typing effect
- Session history
- New chat button
- Clear history
- Message search
- Copy message to clipboard
- Markdown rendering for responses

---

## Phase 3: Utility & Advanced (Week 4)

### 3.1 Reports & Exports 🟢 MEDIUM

**Endpoints**: `POST/GET /reports/schedules`, `POST /reports/generate`, `GET /reports/download/:token`

**Components**:

- Report scheduler (create/edit schedules)
- Format selector (PDF, CSV, XLSX)
- Recipient email list
- CronExpression builder UI
- On-demand report generator
- Export history viewer
- Download links

---

### 3.2 Invoices Management 🟢 MEDIUM

**Endpoints**: `POST/GET /invoices`

**Components**:

- Invoice create form
- Invoices list with filters
- Invoice detail view
- Status badges (paid, unpaid, overdue)
- Download invoice button

---

### 3.3 ADMIN - Model & Prompt Management 🟢 LOW

**Endpoints**: `GET/PUT /ADMIN/model-config/*`, `POST /ADMIN/prompt-templates/*`

**Components**:

- Active model display (OpenAI/Gemini)
- Model history timeline
- Model switcher with version
- Prompt template versions list
- Publish new prompt form
- Rollback controls

---

### 3.4 WhatsApp Channel Configuration 🟢 LOW

**Endpoints**: `POST/GET /whatsapp/configs`, `/whatsapp/link`, `/whatsapp/sessions`

**Components**:

- WhatsApp config form
- Phone number linking (OTP flow)
- Link status indicator
- Active sessions list
- Configuration status badge

---

### 3.5 Tenant Management (ADMIN) 🟢 LOW

**Endpoints**: `GET /tenants`, `GET /tenants/:id`, `DELETE /tenants/:id`

**Components**:

- Tenants list
- Tenant details view
- Delete confirmation modal
- Tenant stats

---

## Shared Components & Services

### Core Services to Create:

```
lib/
├── api-client.ts                   ✅ (Exists - extend)
│   ├── Add request interceptors for token refresh
│   ├── Add error handling
│   └── Add request/response logging
├── hooks/
│   ├── usePagination.ts            (Reusable pagination)
│   ├── useFilters.ts               (Reusable filtering)
│   ├── useLocalStorage.ts          (Persistent state)
│   ├── useDebounce.ts              ✅ (Exists)
│   ├── useAsync.ts                 (Data fetching)
│   └── useWebSocket.ts             (Real-time updates)
├── utils/
│   ├── validators.ts               (Form validation)
│   ├── formatters.ts               ✅ (Partial - extend)
│   ├── chartColors.ts              (Consistent colors)
│   ├── constants.ts                (App constants)
│   └── permissions.ts              (Role-based access)
└── services/
    ├── notification.service.ts     (Toast/alerts)
    ├── storage.service.ts          (LocalStorage wrapper)
    └── analytics.service.ts        (Track user actions)
```

### Shared UI Components:

```
components/
├── ui/ (shadcn/ui based)
│   ├── button.tsx                  ✅
│   ├── dialog.tsx                  ✅
│   ├── dropdown-menu.tsx           ✅
│   ├── select.tsx                  ✅
│   ├── tabs.tsx                    ✅
│   ├── tooltip.tsx                 ✅
│   ├── input.tsx                   (Add)
│   ├── label.tsx                   (Add)
│   ├── table.tsx                   (Add)
│   ├── card.tsx                    (Add)
│   ├── badge.tsx                   (Add)
│   ├── progress.tsx                (Add)
│   ├── popover.tsx                 (Add)
│   ├── modal.tsx                   (Add)
│   └── loading-skeleton.tsx        (Add)
└── shared/
    ├── DataTable.tsx               ✅ (Exists - extend)
    ├── KpiCard.tsx                 ✅ (Exists - extend)
    ├── ChartCard.tsx               ✅ (Exists - extend)
    ├── StatusBadge.tsx             ✅ (Exists - extend)
    ├── EmptyState.tsx              (Add)
    ├── ErrorBoundary.tsx           (Add)
    ├── LoadingScreen.tsx           (Add)
    ├── ConfirmDialog.tsx           (Add)
    ├── FilterPanel.tsx             (Add)
    ├── SearchInput.tsx             (Add)
    ├── DateRangePicker.tsx         (Add)
    ├── FileUpload.tsx              (Add - for imports)
    └── ExportButton.tsx            (Add)
```

---

## File Structure

```
app/
├── (auth)/
│   ├── layout.tsx        ✅
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx      ✅
│   ├── register/
│   │   └── page.tsx      ✅
│   └── login/
│       └── setup-company/
│           └── page.tsx  ✅
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── finance/
│   │   └── page.tsx      (Create - Phase 1)
│   ├── alerts/
│   │   └── page.tsx      (Create - Phase 1)
│   ├── import/
│   │   └── page.tsx      (Create - Phase 1)
│   ├── quarantine/
│   │   └── page.tsx      (Create - Phase 1)
│   ├── insights/
│   │   └── page.tsx      (Create - Phase 1)
│   ├── subscription/
│   │   └── page.tsx      (Create - Phase 1)
│   ├── hr/
│   │   └── page.tsx      (Create - Phase 2)
│   ├── ops/
│   │   └── page.tsx      (Create - Phase 2)
│   ├── chat/
│   │   └── page.tsx      (Create - Phase 2)
│   ├── reports/
│   │   └── page.tsx      (Create - Phase 3)
│   ├── ADMIN/
│   │   └── page.tsx      (Create - Phase 3)
│   └── settings/
│       └── page.tsx
└── api/
    └── [...route]/
        └── route.ts

features/
├── auth/                 ✅
├── finance/             (Create - Phase 1)
├── alerts/              (Create - Phase 1)
├── import/              (Create - Phase 1)
├── quarantine/          (Create - Phase 1)
├── insights/            (Create - Phase 1)
├── subscription/        (Create - Phase 1)
├── hr/                  (Create - Phase 2)
├── ops/                 (Create - Phase 2)
├── chat/                (Create - Phase 2)
├── reports/             (Create - Phase 3)
├── ADMIN/               (Create - Phase 3)
├── whatsapp/            (Create - Phase 3)
├── invoices/            (Create - Phase 3)
└── tenant/              (Partial - extend)

components/
├── ui/                  (shadcn/ui components)
├── shared/              (Reusable components)
└── layout/              ✅

lib/                      (Extend)
hooks/                    (Extend)
utils/                    (Extend)
types/                    (Extend)
store/                    ✅
styles/
└── globals.css           ✅
```

---

## Implementation Checklist

### Phase 1 - Week 1-2

**Finance Dashboard**

- [ ] Create component structure
- [ ] Implement data hooks
- [ ] Build KPI cards layout
- [ ] Create revenue/expense charts
- [ ] Add period selector
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Responsive design
- [ ] Integrate with API

**Alert Rules Management**

- [ ] Create alerts hub
- [ ] Build rule form
- [ ] Implement rules list
- [ ] Create event notifications
- [ ] Add acknowledge/resolve UI
- [ ] Implement real-time updates (WebSocket)
- [ ] Add filters and search
- [ ] Notification center bell

**CSV Import Workflow**

- [ ] Create upload dropzone
- [ ] Add entity type selector
- [ ] Build job progress tracker
- [ ] Implement job polling
- [ ] Error visualization
- [ ] Result summary
- [ ] Build graph trigger

**Quarantine Manager**

- [ ] Quarantine records table
- [ ] Detail modal with editor
- [ ] Data fix UI
- [ ] Retry functionality
- [ ] Bulk operations
- [ ] Filters and search
- [ ] Status summary

**AI Insights**

- [ ] Insight cards layout
- [ ] Confidence score visualization
- [ ] Insight detail modal
- [ ] Feedback rating widget
- [ ] Filters and sorting
- [ ] Scan trigger

**Subscription Management**

- [ ] Current plan display
- [ ] Usage summary cards
- [ ] Seats management table
- [ ] Plan comparison modal
- [ ] Upgrade/downgrade flow
- [ ] Activate/deactivate seats

### Phase 2 - Week 3

**HR Dashboard**

- [ ] Headcount charts
- [ ] Department breakdown
- [ ] Attrition indicators
- [ ] Payroll summaries
- [ ] Employees CRUD
- [ ] Filters

**Ops Dashboard**

- [ ] Inventory summaries
- [ ] Assets table and charts
- [ ] Orders Kanban view
- [ ] SLA status cards
- [ ] SLA configuration form

**Chat Assistant**

- [ ] Chat interface
- [ ] Message streaming
- [ ] Session management
- [ ] WebSocket connection
- [ ] History persistence

### Phase 3 - Week 4

**Reports & Exports**

- [ ] Schedule creator
- [ ] On-demand generation
- [ ] Format selector
- [ ] Download links

**Invoices CRUD**

- [ ] Create form
- [ ] List view
- [ ] Detail view
- [ ] Status tracking

**ADMIN Features**

- [ ] Model management
- [ ] Prompt versioning
- [ ] WhatsApp config
- [ ] Tenant management

---

## API Integration Notes

### Authentication

- Add Bearer token to all requests
- Handle token refresh on 401
- Store tokens securely

### Error Handling

- Implement global error boundary
- Show user-friendly error messages
- Log errors to monitoring service
- Retry logic for failed requests

### Real-Time Updates

- WebSocket for alerts and notifications
- WebSocket for chat messages
- Poll for import job progress (5s interval)
- Poll for task completion (configurable)

### Performance

- Implement virtual scrolling for large tables
- Lazy load charts and heavy components
- Debounce search inputs
- Cache API responses
- Optimize re-renders

---

## Design System Requirements

- **Colors**: Use Tailwind with custom palette
- **Typography**: Consistent font hierarchy
- **Spacing**: 8px base unit grid
- **Breakpoints**: Mobile first responsive
- **Icons**: lucide-react icons
- **Animations**: Smooth transitions
- **Accessibility**: WCAG 2.1 AA compliance

---

## Testing Strategy

- Unit tests for hooks and utils
- Integration tests for features
- E2E tests for critical flows
- Visual regression tests for shared components

---

**Total Estimated Timeline**: 4 weeks (Phases 1-3)

**Next Step**: Prioritize and start with Feature 1.1 (Finance Dashboard)
