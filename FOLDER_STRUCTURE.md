# CID ERP — Production Folder Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   ├── hr/
│   │   │   └── page.tsx
│   │   ├── ops/
│   │   │   └── page.tsx
│   │   ├── finance/
│   │   │   └── page.tsx
│   │   └── layout.tsx              # AppLayout wraps all dashboard routes
│   ├── api/                         # Next.js Route Handlers (BFF)
│   │   └── [...route]/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx                   # Root layout (fonts, providers)
│   └── providers.tsx                # QueryClientProvider, etc.
│
├── features/                        # Feature-driven vertical slices
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── store/
│   │   │   └── auth.store.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardGrid.tsx
│   │   │   └── RevenueKpiSection.tsx
│   │   ├── hooks/
│   │   │   ├── useDashboardKpis.ts
│   │   │   └── useRevenueChart.ts
│   │   ├── services/
│   │   │   └── dashboard.service.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── hooks/
│   │   │   ├── useChatSession.ts
│   │   │   └── useChatScroll.ts
│   │   ├── services/
│   │   │   └── chat.service.ts
│   │   ├── store/
│   │   │   └── chat.store.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── finance/
│   │   ├── components/
│   │   │   ├── CashBalanceCard.tsx
│   │   │   ├── InvoicesTable.tsx
│   │   │   └── RevenueChart.tsx
│   │   ├── hooks/
│   │   │   ├── useCashBalance.ts
│   │   │   └── useInvoices.ts
│   │   ├── services/
│   │   │   └── finance.service.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── hr/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── ops/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   └── tenant/
│       ├── components/
│       │   └── TenantSwitcher.tsx
│       ├── hooks/
│       │   └── useTenantContext.ts
│       ├── services/
│       │   └── tenant.service.ts
│       ├── store/
│       │   └── tenant.store.ts
│       ├── types.ts
│       └── utils.ts
│
├── shared/                          # Cross-feature, truly reusable primitives
│   ├── ui/                          # Base UI components (no business logic)
│   │   ├── KpiCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── DataTable.tsx
│   │   └── StatusBadge.tsx
│   └── layout/
│       ├── AppLayout.tsx
│       ├── Sidebar.tsx
│       └── Topbar.tsx
│
├── lib/                             # Infrastructure / third-party wrappers
│   ├── api-client.ts                # Axios/fetch instance + interceptors
│   ├── query-client.ts              # React Query config
│   └── ws-client.ts                 # WebSocket / SSE client
│
├── hooks/                           # App-wide shared hooks (not feature-specific)
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── store/                           # App-wide Zustand stores (not feature-specific)
│   └── ui.store.ts                  # sidebarOpen, theme, etc.
│
├── types/                           # Shared global types
│   ├── api.types.ts                 # Generic API envelope types
│   ├── auth.types.ts
│   └── common.types.ts
│
└── utils/                           # Pure helper functions (no side effects)
    ├── formatCurrency.ts
    ├── formatDate.ts
    └── cn.ts                        # Tailwind class merging (clsx + twMerge)
```
