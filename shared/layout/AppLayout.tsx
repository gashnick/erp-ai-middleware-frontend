"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useUiStore } from "@/store/ui.store";
import { cn } from "@/utils/cn";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isSidebarOpen = useUiStore((s) => s.isSidebarOpen);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <Sidebar />

      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-200",
          isSidebarOpen ? "ml-60" : "ml-16",
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
