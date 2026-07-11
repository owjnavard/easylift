"use client";

import { useMemo } from "react";
import {
  Menu,
  Search,
  Bell,
  X,
  ChevronRight,
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
import { ElevatorPage } from "@/components/easy-lift/pages/elevator-page";
import { CommercePage } from "@/components/easy-lift/pages/commerce-page";
import { AccountingPage } from "@/components/easy-lift/pages/accounting-page";
import { WarehousePage } from "@/components/easy-lift/pages/warehouse-page";
import { SettingsPage } from "@/components/easy-lift/pages/settings-page";

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
    case "elevator":
      return <ElevatorPage />;
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

export default function Home() {
  const {
    page,
    setPage,
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
  } = useNav();

  const currentTitle = useMemo(
    () => NAV_ITEMS.find((n) => n.key === page)?.title ?? "داشبورد",
    [page]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F4F7FE]">
      {/* ===== Header ===== */}
      <header className="z-50 flex h-20 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="hidden rounded-2xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:block"
            aria-label="جمع کردن منو"
          >
            <Menu className="size-6" />
          </button>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="rounded-2xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="باز کردن منو"
          >
            <Menu className="size-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-lg font-black text-white">
              EL
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Easy Lift
              </h1>
              <p className="-mt-0.5 text-[11px] font-medium text-blue-600">
                SaaS ERP
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden flex-1 items-center gap-2 text-base font-semibold text-slate-700 md:flex">
          <span className="text-slate-400">🏠</span>
          <span>{currentTitle}</span>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="جستجو در سیستم..."
              className="w-56 rounded-3xl bg-slate-100 px-5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-200 lg:w-80"
            />
          </div>
          <button
            className="relative text-xl text-slate-600 transition hover:text-blue-600"
            aria-label="اعلان‌ها"
          >
            <Bell className="size-6" />
            <span className="absolute -left-1 -top-1 grid size-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              ۳
            </span>
          </button>
          <div className="flex cursor-pointer items-center gap-2.5">
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium text-slate-800">
                محمد احمدی
              </div>
              <div className="text-[11px] text-emerald-600">آنلاین</div>
            </div>
            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-100 text-lg">
              👷
            </div>
          </div>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar (desktop) */}
        <aside
          className={cn(
            "hidden shrink-0 flex-col bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] text-white transition-all duration-300 lg:flex",
            sidebarCollapsed ? "w-[68px]" : "w-72"
          )}
        >
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {NAV_ITEMS.map((item) => {
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={cn(
                    "el-nav-link flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm",
                    active && "active"
                  )}
                  title={item.label}
                >
                  <span className="grid w-5 shrink-0 place-items-center">
                    <NavIcon name={item.icon} />
                  </span>
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileNavOpen(false)}
            />
            <aside className="absolute right-0 top-0 flex h-full w-72 flex-col bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-xl bg-white/15 font-black">
                    EL
                  </div>
                  <span className="font-bold">Easy Lift</span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-white/10"
                  aria-label="بستن منو"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {NAV_ITEMS.map((item) => {
                  const active = page === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setPage(item.key)}
                      className={cn(
                        "el-nav-link flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm",
                        active && "active"
                      )}
                    >
                      <span className="grid w-5 shrink-0 place-items-center">
                        <NavIcon name={item.icon} />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        ) : null}

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <PageRouter />
          </div>
        </main>

        {/* AI Panel */}
        <aside className="hidden w-[340px] shrink-0 overflow-hidden border-l-0 xl:block">
          <AiChatPanel />
        </aside>
      </div>

      {/* ===== Footer (sticky bottom) ===== */}
      <footer className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-2.5 text-[11px] text-slate-500">
        <div>Easy Lift ERP v2.4.1 © ۱۴۰۵</div>
        <div className="hidden sm:block">همه حقوق محفوظ است</div>
        <button
          onClick={() => useNav.getState().toggleAI()}
          className="flex items-center gap-1 text-purple-600 transition hover:text-purple-700 xl:hidden"
        >
          <span>Easy AI</span>
          <ChevronRight className="size-3" />
        </button>
      </footer>
    </div>
  );
}

/* ---- inline icon mapper (lucide) ---- */
import {
  LayoutDashboard,
  Users,
  FileText,
  FileSignature,
  Cog,
  Store,
  Calculator,
  Warehouse as WarehouseIcon,
  Settings,
} from "lucide-react";

function NavIcon({ name }: { name: string }) {
  const cls = "size-5";
  switch (name) {
    case "gauge-high":
      return <LayoutDashboard className={cls} />;
    case "users":
      return <Users className={cls} />;
    case "file-invoice":
      return <FileText className={cls} />;
    case "file-contract":
      return <FileSignature className={cls} />;
    case "gears":
      return <Cog className={cls} />;
    case "store":
      return <Store className={cls} />;
    case "calculator":
      return <Calculator className={cls} />;
    case "warehouse":
      return <WarehouseIcon className={cls} />;
    case "gear":
      return <Settings className={cls} />;
    default:
      return <LayoutDashboard className={cls} />;
  }
}
