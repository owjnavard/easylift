import { create } from "zustand";

export type PageKey =
  | "dashboard"
  | "contacts"
  | "quotations"
  | "contracts"
  | "technical"
  | "project"
  | "elevator"
  | "commerce"
  | "accounting"
  | "warehouse"
  | "settings";

interface NavState {
  page: PageKey;
  setPage: (page: PageKey) => void;
  /** Controls sidebar collapse (desktop) */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  /** Controls AI panel collapse */
  aiCollapsed: boolean;
  toggleAI: () => void;
  /** Mobile sidebar open */
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
}

export const useNav = create<NavState>((set) => ({
  page: "dashboard",
  setPage: (page) => set({ page, mobileNavOpen: false }),
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  aiCollapsed: false,
  toggleAI: () => set((s) => ({ aiCollapsed: !s.aiCollapsed })),
  mobileNavOpen: false,
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
}));

export interface NavItem {
  key: PageKey;
  label: string;
  title: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "داشبورد", title: "داشبورد", icon: "gauge-high" },
  { key: "contacts", label: "مخاطبین", title: "مخاطبین", icon: "users" },
  {
    key: "quotations",
    label: "پیش‌فاکتورها",
    title: "پیش‌فاکتورها",
    icon: "file-invoice",
  },
  {
    key: "contracts",
    label: "قراردادها",
    title: "قراردادها",
    icon: "file-contract",
  },
  {
    key: "technical",
    label: "فنی و مهندسی",
    title: "فنی و مهندسی",
    icon: "gears",
  },
  { key: "commerce", label: "بازرگانی", title: "بازرگانی", icon: "store" },
  {
    key: "accounting",
    label: "حسابداری",
    title: "حسابداری",
    icon: "calculator",
  },
  { key: "warehouse", label: "انبار", title: "انبار", icon: "warehouse" },
  { key: "settings", label: "تنظیمات", title: "تنظیمات", icon: "gear" },
];
