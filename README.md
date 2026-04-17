# CID ERP — Frontend

Enterprise-grade, multitenant ERP frontend built with Next.js 15 App Router.

---

## Stack

| Concern       | Library                    |
| ------------- | -------------------------- |
| Framework     | Next.js 15 (App Router)    |
| Language      | TypeScript (strict)        |
| Server state  | TanStack Query v5          |
| UI state      | Zustand v5                 |
| UI components | shadcn/ui + Radix UI       |
| Styling       | Tailwind CSS v3            |
| Charts        | Recharts                   |
| Forms         | React Hook Form + Zod      |
| Auth          | JWT via Next.js middleware |

---

## Folder Structure

```
src/
├── app/                  # Next.js App Router pages + layouts
│   ├── (auth)/           # Login, register — no sidebar
│   └── (dashboard)/      # All authed routes — AppLayout
├── features/             # Vertical feature slices
│   ├── auth/
│   ├── chat/
│   ├── finance/
│   ├── hr/
│   ├── ops/
│   └── tenant/
├── shared/               # Cross-feature primitives (UI + layout only)
│   ├── layout/           # AppLayout, Sidebar, Topbar
│   └── ui/               # KpiCard, ChartCard, DataTable, StatusBadge
├── lib/                  # Infrastructure: api-client, ws-client
├── hooks/                # App-wide hooks (useDebounce, useMediaQuery)
├── store/                # App-wide Zustand (ui.store)
├── types/                # Shared TypeScript types
└── utils/                # Pure functions (formatCurrency, formatDate, cn)
```

Each feature slice follows this internal structure:

```
features/<name>/
├── components/   # UI only — no API calls, no business logic
├── hooks/        # React Query + Zustand orchestration
├── services/     # API calls only — fully typed
├── store/        # Zustand slice for UI state
├── types.ts      # Feature-specific types
└── utils.ts      # Zod schemas + pure helpers
```

---

## Architecture Rules (Hard Constraints)

### Data flow

```
Page → Feature Component → Hook → Service → apiClient → API
                                ↓
                           Zustand store (UI state only)
```

### What goes where

| Layer         | Allowed                                   | Forbidden                                  |
| ------------- | ----------------------------------------- | ------------------------------------------ |
| `components/` | JSX, props, Tailwind                      | fetch, business logic, direct store writes |
| `hooks/`      | useQuery, useMutation, store reads/writes | JSX                                        |
| `services/`   | apiClient calls, typed responses          | UI logic, store access                     |
| `store/`      | Zustand state, UI-only                    | API calls, server state                    |
| `shared/ui/`  | Generic render components                 | Domain knowledge, API calls                |

### State management split

- **React Query** → anything from the server (invoices, KPIs, chat history)
- **Zustand** → UI-only state (sidebar open/closed, active tenant, chat message stream)
- Never use Zustand to cache server data
- Never use React Query for purely local UI state

---

## Key Files

| File                                        | Purpose                                                               |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `src/lib/api-client.ts`                     | Single source of all HTTP calls. Auto-injects auth + tenant headers.  |
| `src/middleware.ts`                         | JWT guard on all dashboard routes. Redirects to `/login` if no token. |
| `src/app/providers.tsx`                     | QueryClient configuration. One place for global query defaults.       |
| `src/features/auth/store/auth.store.ts`     | Persisted tokens. Writes access_token to localStorage for api-client. |
| `src/features/tenant/store/tenant.store.ts` | Active tenant. Writes x-tenant-schema for api-client.                 |

---

## Design System

| Token   | Value      | Usage                            |
| ------- | ---------- | -------------------------------- |
| Primary | `#2563EB`  | Buttons, links, active states    |
| AI      | `#7C3AED`  | Chat AI bubble, AI badge         |
| Success | `#16A34A`  | Paid status, positive trends     |
| Danger  | `#DC2626`  | Overdue, errors, negative trends |
| Neutral | Gray scale | Everything else                  |

Rules:

- No gradients
- No random colors — every color must map to a semantic meaning
- Trend up = green, trend down = red, trend neutral = gray
- AI interface = purple everywhere

---

## Getting Started

```bash
npm install
npm run dev
```

Type-check only:

```bash
npm run type-check
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=your api url
NEXT_PUBLIC_WS_URL=uri
```
