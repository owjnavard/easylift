"use client";

import {
  ShoppingCart,
  FileText,
  Truck,
  Factory,
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
    render: (r) => <span className="font-semibold text-slate-800">{r.code}</span>,
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
        <StatusBadge tone="green">تأیید</StatusBadge>
      ) : (
        <StatusBadge tone="red">رد شده</StatusBadge>
      ),
  },
];

const quickActions = [
  { icon: ShoppingCart, label: "ثبت درخواست خرید", tone: "text-blue-600" },
  { icon: FileText, label: "ثبت استعلام", tone: "text-green-600" },
  { icon: Truck, label: "ثبت سفارش خرید", tone: "text-orange-500" },
  { icon: Factory, label: "تأمین‌کنندگان", tone: "text-purple-600" },
];

export function CommercePage() {
  return (
    <div>
      <PageHeader
        title="مدیریت بازرگانی"
        subtitle="مدیریت خرید، استعلام، سفارشات و تأمین‌کنندگان"
        searchPlaceholder="جستجو..."
        actionLabel="درخواست خرید"
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="درخواست خرید" value="۲۸" />
          <KpiCard label="سفارش خرید" value="۱۴" />
          <KpiCard label="تأمین‌کننده" value="۵۷" />
          <Panel className="p-6">
            <p className="text-sm text-slate-500">در انتظار تأیید</p>
            <h3 className="mt-4 text-5xl font-black text-orange-500">۹</h3>
          </Panel>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:shadow-xl lg:p-8"
            >
              <a.icon className={`mx-auto size-8 ${a.tone}`} />
              <div className="mt-4 font-bold text-slate-700">{a.label}</div>
            </button>
          ))}
        </section>

        {/* Content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel padded={false} className="overflow-hidden">
              <div className="border-b border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800">
                  آخرین درخواست‌های خرید
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
              <h3 className="font-bold text-slate-800">تأمین‌کنندگان برتر</h3>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">آسانبر نوین</span>
                  <span className="font-semibold text-green-600">۹۸٪</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">سپهر آسانسور</span>
                  <span className="font-semibold text-green-600">۹۴٪</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">پارس لیفت</span>
                  <span className="font-semibold text-green-600">۹۱٪</span>
                </div>
              </div>
            </Panel>

            <EasyAiCard
              insights={[
                "قیمت موتور گیرلس ۷٪ کاهش یافته است.",
                "بهترین تأمین‌کننده برای ریل T90 شرکت پارس لیفت است.",
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
