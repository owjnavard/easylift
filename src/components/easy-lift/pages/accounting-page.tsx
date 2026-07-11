"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const incomeData = [
  { m: "فر", in: 32, out: 18 },
  { m: "ار", in: 45, out: 22 },
  { m: "خر", in: 38, out: 25 },
  { m: "تی", in: 52, out: 30 },
  { m: "مر", in: 61, out: 35 },
  { m: "شه", in: 48, out: 28 },
];

interface Txn {
  no: string;
  type: "receipt" | "payment";
  party: string;
  project: string;
  amount: string;
  date: string;
  status: "done" | "pending";
}

const rows: Txn[] = [
  { no: "TX-5012", type: "receipt", party: "شرکت پارسیان", project: "پارسیان", amount: "1.2B", date: "1405/04/25", status: "done" },
  { no: "TX-5011", type: "payment", party: "آسانبر نوین", project: "پارسیان", amount: "640M", date: "1405/04/24", status: "done" },
  { no: "TX-5010", type: "payment", party: "پارس لیفت", project: "الماس", amount: "320M", date: "1405/04/22", status: "pending" },
  { no: "TX-5009", type: "receipt", party: "برج آریا", project: "آریا", amount: "800M", date: "1405/04/20", status: "done" },
];

const columns: Column<Txn>[] = [
  {
    key: "no",
    header: "شماره",
    align: "right",
    render: (r) => <span className="font-bold text-slate-800">{r.no}</span>,
  },
  {
    key: "type",
    header: "نوع",
    align: "center",
    render: (r) =>
      r.type === "receipt" ? (
        <span className="inline-flex items-center gap-1 text-green-600">
          <ArrowDownLeft className="size-4" /> دریافت
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-red-500">
          <ArrowUpRight className="size-4" /> پرداخت
        </span>
      ),
  },
  { key: "party", header: "طرف حساب", align: "center" },
  { key: "project", header: "پروژه", align: "center" },
  { key: "amount", header: "مبلغ", align: "center" },
  { key: "date", header: "تاریخ", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "done" ? (
        <StatusBadge tone="green">انجام شد</StatusBadge>
      ) : (
        <StatusBadge tone="amber">در انتظار</StatusBadge>
      ),
  },
];

const quickActions = [
  { icon: ArrowDownLeft, label: "ثبت دریافت", tone: "text-green-600" },
  { icon: ArrowUpRight, label: "ثبت پرداخت", tone: "text-red-500" },
  { icon: FileText, label: "فاکتور خرید", tone: "text-blue-600" },
  { icon: Receipt, label: "فاکتور فروش", tone: "text-purple-600" },
];

export function AccountingPage() {
  return (
    <div>
      <PageHeader
        title="حسابداری"
        subtitle="مدیریت دریافت‌ها، پرداخت‌ها، فاکتورها و سود و زیان پروژه‌ها"
        searchPlaceholder="جستجوی تراکنش..."
        actionLabel="ثبت تراکنش"
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="درآمد ماه" value="۴۸B" />
          <Panel className="p-6">
            <p className="text-sm text-slate-500">هزینه‌ها</p>
            <h3 className="mt-4 text-5xl font-black text-red-500">۲۱B</h3>
          </Panel>
          <Panel className="p-6">
            <p className="text-sm text-slate-500">سود خالص</p>
            <h3 className="mt-4 text-5xl font-black text-green-600">۲۷B</h3>
          </Panel>
          <KpiCard label="فاکتورهای معوق" value="۹" />
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              className="rounded-3xl bg-white p-6 text-center shadow-sm transition hover:shadow-xl"
            >
              <a.icon className={`mx-auto size-8 ${a.tone}`} />
              <div className="mt-4 font-bold text-slate-700">{a.label}</div>
            </button>
          ))}
        </section>

        {/* Chart + AI */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                دریافت و پرداخت
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-green-500" /> دریافت
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" /> پرداخت
                </span>
              </div>
            </div>
            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#EEF2FF"
                  />
                  <XAxis
                    dataKey="m"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e2e8f0",
                      fontFamily: "var(--font-vazirmatn)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="in" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="out" fill="#f87171" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <EasyAiCard
            insights={[
              "سود پروژه پارسیان ۱۸٪ بالاتر از پیش‌بینی است.",
              "۲ فاکتور خرید بدون تأیید حسابداری باقی مانده.",
              "پیشنهاد تسویه حساب با پارس لیفت تا پایان هفته.",
            ]}
            ctaLabel="گزارش سود و زیان"
          />
        </section>

        {/* Transactions */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-slate-800">
            آخرین تراکنش‌ها
          </h3>
          <DataTable columns={columns} data={rows} onRowClick={() => {}} />
        </div>

        {/* Profit cards */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-green-100 text-green-600">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">سود پروژه پارسیان</p>
                <h4 className="text-2xl font-black text-slate-800">۳.۲B</h4>
              </div>
            </div>
          </Panel>
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                <Wallet className="size-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">سود پروژه الماس</p>
                <h4 className="text-2xl font-black text-slate-800">۱.۱B</h4>
              </div>
            </div>
          </Panel>
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-red-100 text-red-500">
                <TrendingDown className="size-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">زیان پروژه سپهر</p>
                <h4 className="text-2xl font-black text-slate-800">۱۸۰M</h4>
              </div>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
