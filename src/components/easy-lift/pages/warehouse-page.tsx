"use client";

import {
  PackageOpen,
  Truck,
  ArrowRightLeft,
  ClipboardCheck,
  QrCode,
  Plus,
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
    render: (r) => <span className="font-semibold text-slate-800">{r.code}</span>,
  },
  { key: "name", header: "نام کالا", align: "center" },
  { key: "stock", header: "موجودی", align: "center" },
  { key: "location", header: "محل", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "ok" ? (
        <StatusBadge tone="green">موجود</StatusBadge>
      ) : r.status === "low" ? (
        <StatusBadge tone="amber">کم</StatusBadge>
      ) : (
        <StatusBadge tone="red">اتمام</StatusBadge>
      ),
  },
];

const quickActions = [
  { icon: PackageOpen, label: "ورود کالا", tone: "text-blue-600" },
  { icon: Truck, label: "خروج کالا", tone: "text-red-500" },
  { icon: ArrowRightLeft, label: "انتقال", tone: "text-green-600" },
  { icon: ClipboardCheck, label: "انبارگردانی", tone: "text-orange-500" },
  { icon: QrCode, label: "بارکد", tone: "text-purple-600" },
];

export function WarehousePage() {
  return (
    <div>
      <PageHeader
        title="مدیریت انبار"
        subtitle="مدیریت کالا، ورود و خروج، موجودی و حواله‌ها"
        searchPlaceholder="جستجوی کالا..."
        actionLabel="ثبت کالا"
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="کالاهای انبار" value="۸۴۲" />
          <KpiCard label="ورودی امروز" value="۱۸" />
          <KpiCard label="خروجی امروز" value="۱۱" />
          <Panel className="p-6">
            <p className="text-sm text-slate-500">کمبود موجودی</p>
            <h3 className="mt-4 text-5xl font-black text-red-500">۹</h3>
          </Panel>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className="rounded-3xl bg-white p-5 text-center shadow-sm transition hover:shadow-xl lg:p-6"
            >
              <a.icon className={`mx-auto size-7 ${a.tone}`} />
              <p className="mt-4 text-sm font-bold text-slate-700">{a.label}</p>
            </button>
          ))}
        </section>

        {/* Content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel padded={false} className="overflow-hidden">
              <div className="border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800">
                  موجودی کالاها
                </h3>
              </div>
              <DataTable
                columns={columns}
                data={rows}
                onRowClick={() => {}}
                className="rounded-none shadow-none"
              />
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel className="p-6">
              <h3 className="font-bold text-slate-800">هشدار موجودی</h3>
              <div className="mt-5 space-y-4 text-sm">
                {[
                  { n: "ریل T90", q: 3 },
                  { n: "کفشک", q: 5 },
                  { n: "سیم بکسل", q: 2 },
                ].map((x) => (
                  <div key={x.n} className="flex justify-between">
                    <span className="text-slate-600">{x.n}</span>
                    <span className="font-bold text-red-500">
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

        {/* Bottom stat cards */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Panel className="p-6">
            <p className="text-sm text-slate-500">ارزش موجودی</p>
            <h3 className="mt-4 text-3xl font-black text-slate-800">۱۸۴B</h3>
            <div className="mt-5">
              <StatBar percent={80} barClass="bg-blue-600" />
            </div>
          </Panel>
          <Panel className="p-6">
            <p className="text-sm text-slate-500">ورود این ماه</p>
            <h3 className="mt-4 text-3xl font-black text-slate-800">۱۲۴</h3>
            <div className="mt-5">
              <StatBar percent={60} barClass="bg-green-500" />
            </div>
          </Panel>
          <Panel className="p-6">
            <p className="text-sm text-slate-500">خروج این ماه</p>
            <h3 className="mt-4 text-3xl font-black text-slate-800">۹۷</h3>
            <div className="mt-5">
              <StatBar percent={45} barClass="bg-orange-500" />
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
