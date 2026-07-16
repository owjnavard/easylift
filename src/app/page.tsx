"use client";

import { useMemo } from "react";
import {
  Menu,
  Search,
  Bell,
  X,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Receipt,
  FileSignature,
  Cog,
  ShoppingCart,
  Calculator,
  Warehouse as WarehouseIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS, useNav } from "@/lib/nav-store";
import { cn } from "@/lib/utils";
import { AiChatPanel } from "@/components/easy-lift/ai-chat-panel";

import { DashboardPage } from "@/components/easy-lift/pages/dashboard-page";
import { ContactsPage } from "@/components/easy-lift/pages/contacts-page";
import { QuotationsPage } from "@/components/easy-lift/pages/quotations-page";
import { ContractsPage } from "@/components/easy-lift/pages/contracts-page";
import { TechnicalPage } from "@/components/easy-lift/pages/technical-page";
import { ProjectPage } from "@/components/easy-lift/pages/project-page";
import { CommercePage } from "@/components/easy-lift/pages/commerce-page";
import { AccountingPage } from "@/components/easy-lift/pages/accounting-page";
import { WarehousePage } from "@/components/easy-lift/pages/warehouse-page";
import { SettingsPage } from "@/components/easy-lift/pages/settings-page";

const ICONS: Record<string, LucideIcon> = {
  gauge: LayoutDashboard,
  users: Users,
  receipt: Receipt,
  "file-signature": FileSignature,
  cog: Cog,
  "shopping-cart": ShoppingCart,
  calculator: Calculator,
  warehouse: WarehouseIcon,
  settings: Settings,
};

function PageRouter() {
  const page = useNav((s) => s.page);
  switch (page) {
    case "dashboard":
      return <DashboardPage />;
    case "contacts":
      return <ContactsPage />;
    case "quotations":
      return <QuotationsPage />;
    case "contracts":
      return <ContractsPage />;
    case "technical":
      return <TechnicalPage />;
    case "project":
      return <ProjectPage />;
    case "commerce":
      return <CommercePage />;
    case "accounting":
      return <AccountingPage />;
    case "warehouse":
      return <WarehousePage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}

function SidebarContent({ collapsed = false }: { collapsed?: boolean }) {
  const page = useNav((s) => s.page);
  const setPage = useNav((s) => s.setPage);
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-3">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon] ?? LayoutDashboard;
        const active = page === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            className={cn(
              "el-nav-link flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300",
              active && "active !text-white",
              collapsed && "justify-center px-0"
            )}
            title={item.label}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}

export default function Home() {
  const {
    page,
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
    toggleAI,
    aiCollapsed,
    setMobileAiOpen,
  } = useNav();

  const currentTitle = useMemo(
    () => NAV_ITEMS.find((n) => n.key === page)?.title ?? "داشبورد",
    [page]
  );

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#F6F7F9]">
      {/* ===== Header ===== */}
      <header className="z-40 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* mobile menu */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            aria-label="باز کردن منو"
          >
            <Menu className="size-5" />
          </button>
          {/* desktop collapse */}
          <button
            onClick={toggleSidebar}
            className="hidden size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:grid"
            aria-label="جمع کردن منو"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black text-emerald-400">
              EL
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-extrabold leading-tight text-slate-900">
                Easy Lift
              </div>
              <div className="text-[10px] font-medium leading-tight text-emerald-600">
                SaaS ERP
              </div>
            </div>
          </div>
        </div>

        {/* breadcrumb — hidden on small */}
        <div className="hidden min-w-0 flex-1 items-center gap-1.5 text-sm text-slate-400 md:flex">
          <span className="font-medium text-slate-500">پنل مدیریت</span>
          <ChevronLeft className="size-3.5" />
          <span className="font-semibold text-slate-800">{currentTitle}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="جستجو..."
              className="w-40 rounded-xl border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm outline-none transition focus:w-56 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 lg:w-56"
            />
          </div>
          <button
            className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
            aria-label="اعلان‌ها"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          {/* AI toggle for tablets */}
          <button
            onClick={toggleAI}
            className="hidden size-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-emerald-600 transition hover:bg-emerald-50 lg:grid xl:hidden"
            aria-label="پنل هوش مصنوعی"
          >
            <Sparkles className="size-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold text-slate-800">
                محمد احمدی
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                آنلاین
              </div>
            </div>
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white">
              م
            </div>
          </div>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar (graphite) */}
        <aside
          className={cn(
            "relative hidden shrink-0 flex-col bg-[#14171e] text-slate-300 transition-[width] duration-300 ease-in-out lg:flex",
            sidebarCollapsed ? "w-[74px]" : "w-64"
          )}
        >
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-4">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Sparkles className="size-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-xs font-bold text-white">
                  منوی اصلی
                </div>
                <div className="truncate text-[10px] text-slate-500">
                  Easy Lift ERP
                </div>
              </div>
            )}
          </div>
          <SidebarContent collapsed={sidebarCollapsed} />
          <div className="border-t border-white/5 p-2.5">
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white",
                sidebarCollapsed && "justify-center px-0"
              )}
              title="خروج"
            >
              <LogOut className="size-5 shrink-0" />
              {!sidebarCollapsed && <span>خروج</span>}
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-[#14171e] text-slate-300 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-black text-emerald-400">
                    EL
                  </div>
                  <div>
                    <div className="text-sm font-extrabold leading-tight text-white">
                      Easy Lift
                    </div>
                    <div className="text-[10px] leading-tight text-emerald-400">
                      SaaS ERP
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="بستن منو"
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarContent />
              <div className="border-t border-white/5 p-2.5">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white">
                  <LogOut className="size-5" />
                  <span>خروج</span>
                </button>
              </div>
            </aside>
          </div>
        ) : null}

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <PageRouter />
          </div>
        </main>

        {/* AI Panel (desktop rail) */}
        <AiChatPanel />
      </div>

      {/* ===== Footer (sticky bottom) ===== */}
      <footer className="flex h-9 shrink-0 items-center justify-between gap-3 border-t border-slate-200/80 bg-white px-4 text-[11px] text-slate-500 sm:px-6">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>Easy Lift ERP v2.4.1</span>
          <span className="hidden text-slate-300 sm:inline">•</span>
          <span className="hidden sm:inline">© ۱۴۰۵</span>
        </div>
        <div className="hidden sm:block">همه حقوق محفوظ است</div>
        {/* AI button (mobile + tablet) */}
        <button
          onClick={() => setMobileAiOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 transition hover:bg-emerald-100 xl:hidden"
        >
          <Sparkles className="size-3.5" />
          Easy AI
        </button>
      </footer>
    </div>
  );
}

/* unused import suppression */
void PanelRightClose;
void PanelRightOpen;
