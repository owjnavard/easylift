"use client";

import {
  PackageOpen,
  Truck,
  ArrowRightLeft,
  ClipboardCheck,
  QrCode,
  Plus,
  Warehouse,
} from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  DataTable,
  StatBar,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";

interface Item {
  code: string;
  name: string;
  stock: number;
  location: string;
  status: "ok" | "low" | "out";
}

const rows: Item[] = [
  { code: "IT-001", name: "موتور گیرلس", stock: 12, location: "A-12", status: "ok" },
  { code: "IT-014", name: "ریل T90", stock: 3, location: "B-04", status: "low" },
  { code: "IT-032", name: "تابلو فرمان", stock: 0, location: "C-02", status: "out" },
  { code: "IT-045", name: "کفشک", stock: 5, location: "B-08", status: "low" },
  { code: "IT-051", name: "سیم بکسل", stock: 2, location: "D-01", status: "low" },
];

const columns: Column<Item>[] = [
  {
    key: "code",
    header: "کد",
    align: "right",
    render: (r) => (
      <span className="font-mono font-semibold text-emerald-600">{r.code}</span>
    ),
  },
  { key: "name", header: "نام کالا", align: "center", render: (r) => (
    <span className="font-medium text-slate-800">{r.name}</span>
  ) },
  {
    key: "stock",
    header: "موجودی",
    align: "center",
    render: (r) => (
      <span className="font-semibold text-slate-700">
        {r.stock.toLocaleString("fa-IR")}
      </span>
    ),
  },
  { key: "location", header: "محل", align: "center", render: (r) => (
    <span className="font-mono text-xs text-slate-500">{r.location}</span>
  ) },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "ok" ? (
        <StatusBadge tone="emerald">موجود</StatusBadge>
      ) : r.status === "low" ? (
        <StatusBadge tone="amber">کم</StatusBadge>
      ) : (
        <StatusBadge tone="rose">اتمام</StatusBadge>
      ),
  },
];

const quickActions = [
  { icon: PackageOpen, label: "ورود کالا", tone: "text-emerald-600 bg-emerald-50" },
  { icon: Truck, label: "خروج کالا", tone: "text-rose-600 bg-rose-50" },
  { icon: ArrowRightLeft, label: "انتقال", tone: "text-sky-600 bg-sky-50" },
  { icon: ClipboardCheck, label: "انبارگردانی", tone: "text-amber-600 bg-amber-50" },
  { icon: QrCode, label: "بارکد", tone: "text-violet-600 bg-violet-50" },
];

export function WarehousePage() {
  return (
    <div>
      <PageHeader
        icon={Warehouse}
        title="مدیریت انبار"
        subtitle="مدیریت کالا، ورود و خروج، موجودی و حواله‌ها"
        searchPlaceholder="جستجوی کالا..."
        actionLabel="ثبت کالا"
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="کالاهای انبار" value="۸۴۲" icon={Warehouse} />
          <KpiCard tone="emerald" label="ورودی امروز" value="۱۸" icon={PackageOpen} />
          <KpiCard tone="sky" label="خروجی امروز" value="۱۱" icon={Truck} />
          <KpiCard tone="rose" label="کمبود موجودی" value="۹" icon={ClipboardCheck} />
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className="el-card-hover flex flex-col items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm"
            >
              <span className={`grid size-10 place-items-center rounded-xl ${a.tone}`}>
                <a.icon className="size-5" />
              </span>
              <span className="text-xs font-bold text-slate-700">{a.label}</span>
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <h3 className="text-sm font-bold text-slate-900">موجودی کالاها</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {rows.length} قلم
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
              <h3 className="text-sm font-bold text-slate-900">هشدار موجودی</h3>
              <div className="mt-4 space-y-3">
                {[
                  { n: "ریل T90", q: 3 },
                  { n: "کفشک", q: 5 },
                  { n: "سیم بکسل", q: 2 },
                ].map((x) => (
                  <div
                    key={x.n}
                    className="flex items-center justify-between rounded-lg bg-rose-50/60 px-3 py-2"
                  >
                    <span className="text-xs text-slate-600">{x.n}</span>
                    <span className="font-bold text-rose-600">
                      {x.q.toLocaleString("fa-IR")}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <EasyAiCard
              insights={[
                "۹ قلم کالا به نقطه سفارش رسیده‌اند.",
                "پیشنهاد ثبت سفارش برای ریل T90.",
                "موتور گیرلس تا ۱۲ روز دیگر تمام می‌شود.",
              ]}
              ctaLabel="پیشنهاد خرید"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Panel className="p-5">
            <p className="text-xs text-slate-500">ارزش موجودی</p>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900">۱۸۴B</h3>
            <div className="mt-3">
              <StatBar percent={80} barClass="bg-emerald-500" />
            </div>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-500">ورود این ماه</p>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900">۱۲۴</h3>
            <div className="mt-3">
              <StatBar percent={60} barClass="bg-sky-500" />
            </div>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-500">خروج این ماه</p>
            <h3 className="mt-2 text-2xl font-extrabold text-slate-900">۹۷</h3>
            <div className="mt-3">
              <StatBar percent={45} barClass="bg-amber-500" />
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

void Plus;
