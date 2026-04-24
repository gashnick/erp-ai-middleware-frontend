"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Briefcase,
  Upload,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useUiStore } from "@/store/ui.store";
import { cn } from "@/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Finance", href: "/finance", icon: BarChart3 },
  { label: "HR", href: "/hr", icon: Users },
  { label: "Operations", href: "/ops", icon: Briefcase },
  { label: "Import Data", href: "/import", icon: Upload },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Quarantine", href: "/quarantine", icon: ShieldAlert },
  { label: "AI Chat", href: "/chat", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200",
        isSidebarOpen ? "w-60" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-blue-600">
            <span className="text-xs font-bold text-white">C</span>
          </div>
          {isSidebarOpen && (
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              CID ERP
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500",
                )}
              />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
