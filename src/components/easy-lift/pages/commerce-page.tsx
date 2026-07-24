"use client";

import {
  ShoppingCart,
  FileText,
  Truck,
  Factory,
  Store,
} from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  DataTable,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";

interface Purchase {
  code: string;
  item: string;
  project: string;
  qty: number;
  status: "pending" | "approved" | "rejected";
}

const rows: Purchase[] = [
  { code: "PR-1205", item: "ریل T90", project: "پارسیان", qty: 12, status: "pending" },
  { code: "PR-1204", item: "موتور گیرلس", project: "الماس", qty: 2, status: "approved" },
  { code: "PR-1203", item: "تابلو فرمان", project: "سپهر", qty: 4, status: "rejected" },
  { code: "PR-1202", item: "کفشک", project: "پارسیان", qty: 48, status: "approved" },
];

const columns: Column<Purchase>[] = [
  {
    key: "code",
    header: "کد",
    align: "right",
    render: (r) => (
      <span className="font-mono font-semibold text-emerald-600">{r.code}</span>
    ),
  },
  { key: "item", header: "کالا", align: "center" },
  { key: "project", header: "پروژه", align: "center" },
  { key: "qty", header: "تعداد", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "pending" ? (
        <StatusBadge tone="amber">در انتظار</StatusBadge>
      ) : r.status === "approved" ? (
        <StatusBadge tone="emerald">تأیید</StatusBadge>
      ) : (
        <StatusBadge tone="rose">رد شده</StatusBadge>
      ),
  },
];

const quickActions = [
  { icon: ShoppingCart, label: "درخواست خرید", tone: "text-emerald-600 bg-emerald-50" },
  { icon: FileText, label: "ثبت استعلام", tone: "text-sky-600 bg-sky-50" },
  { icon: Truck, label: "سفارش خرید", tone: "text-amber-600 bg-amber-50" },
  { icon: Factory, label: "تأمین‌کنندگان", tone: "text-violet-600 bg-violet-50" },
];

export function CommercePage() {
  return (
    <div>
      <PageHeader
        icon={Store}
        title="مدیریت بازرگانی"
        subtitle="مدیریت خرید، استعلام، سفارشات و تأمین‌کنندگان"
        searchPlaceholder="جستجو..."
        actionLabel="درخواست خرید"
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="درخواست خرید" value="۲۸" icon={ShoppingCart} />
          <KpiCard tone="sky" label="سفارش خرید" value="۱۴" icon={Truck} />
          <KpiCard tone="violet" label="تأمین‌کننده" value="۵۷" icon={Factory} />
          <KpiCard tone="amber" label="در انتظار تأیید" value="۹" icon={FileText} />
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className="el-card-hover flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-right shadow-sm"
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${a.tone}`}>
                <a.icon className="size-5" />
              </span>
              <span className="text-sm font-bold text-slate-700">{a.label}</span>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-900">
                  آخرین درخواست‌های خرید
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {rows.length} مورد
                </span>
              </div>
              <DataTable
                columns={columns}
                data={rows}
                onRowClick={() => {}}
                className="rounded-none border-0 shadow-none"
              />
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel className="p-5">
              <h3 className="text-sm font-bold text-slate-900">
                تأمین‌کنندگان برتر
              </h3>
              <div className="mt-4 space-y-3.5">
                {[
                  { n: "آسانبر نوین", q: 98 },
                  { n: "سپهر آسانسور", q: 94 },
                  { n: "پارس لیفت", q: 91 },
                ].map((s) => (
                  <div key={s.n}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-600">{s.n}</span>
                      <span className="font-semibold text-emerald-600">
                        {s.q.toLocaleString("fa-IR")}٪
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/70">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${s.q}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <EasyAiCard
              insights={[
                "قیمت موتور گیرلس ۷٪ کاهش یافته است.",
                "بهترین تأمین‌کننده ریل T90 پارس لیفت است.",
                "۳ درخواست خرید نیاز به تأیید مدیر دارند.",
              ]}
              ctaLabel="تحلیل هوشمند"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
