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
  /** Desktop sidebar collapse (icon rail) */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  /** Mobile drawer */
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  /** AI panel — desktop collapse + mobile sheet */
  aiCollapsed: boolean;
  toggleAI: () => void;
  mobileAiOpen: boolean;
  setMobileAiOpen: (v: boolean) => void;
}

export const useNav = create<NavState>((set) => ({
  page: "dashboard",
  setPage: (page) => set({ page, mobileNavOpen: false }),
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  mobileNavOpen: false,
  setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
  aiCollapsed: false,
  toggleAI: () => set((s) => ({ aiCollapsed: !s.aiCollapsed })),
  mobileAiOpen: false,
  setMobileAiOpen: (v) => set({ mobileAiOpen: v }),
}));

export interface NavItem {
  key: PageKey;
  label: string;
  title: string;
  /** lucide icon name */
  icon: string;
  /** short label shown in collapsed rail tooltip */
  short: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "داشبورد", title: "داشبورد", icon: "gauge", short: "داشبورد" },
  { key: "contacts", label: "مخاطبین", title: "مدیریت مخاطبین", icon: "users", short: "مخاطبین" },
  { key: "quotations", label: "پیش‌فاکتورها", title: "پیش‌فاکتورها", icon: "receipt", short: "فاکتور" },
  { key: "contracts", label: "قراردادها", title: "قراردادها", icon: "file-signature", short: "قرارداد" },
  { key: "technical", label: "فنی و مهندسی", title: "فنی و مهندسی", icon: "cog", short: "فنی" },
  { key: "commerce", label: "بازرگانی", title: "بازرگانی", icon: "shopping-cart", short: "بازرگانی" },
  { key: "accounting", label: "حسابداری", title: "حسابداری", icon: "calculator", short: "مالی" },
  { key: "warehouse", label: "انبار", title: "انبار", icon: "warehouse", short: "انبار" },
  { key: "settings", label: "تنظیمات", title: "تنظیمات", icon: "settings", short: "تنظیمات" },
];
