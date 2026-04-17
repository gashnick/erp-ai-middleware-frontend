import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  activeRoute: string;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setActiveRoute: (route: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  activeRoute: "/dashboard",
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setActiveRoute: (route) => set({ activeRoute: route }),
}));
