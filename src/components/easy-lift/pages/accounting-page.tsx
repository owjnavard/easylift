"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
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
  { m: "فروردین", in: 32, out: 18 },
  { m: "اردیبهشت", in: 45, out: 22 },
  { m: "خرداد", in: 38, out: 25 },
  { m: "تیر", in: 52, out: 30 },
  { m: "مرداد", in: 61, out: 35 },
  { m: "شهریور", in: 48, out: 28 },
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
    render: (r) => (
      <span className="font-mono font-semibold text-slate-800">{r.no}</span>
    ),
  },
  {
    key: "type",
    header: "نوع",
    align: "center",
    render: (r) =>
      r.type === "receipt" ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
          <ArrowDownLeft className="size-3.5" /> دریافت
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-500">
          <ArrowUpRight className="size-3.5" /> پرداخت
        </span>
      ),
  },
  { key: "party", header: "طرف حساب", align: "center" },
  { key: "project", header: "پروژه", align: "center" },
  {
    key: "amount",
    header: "مبلغ",
    align: "center",
    render: (r) => <span className="font-semibold text-slate-800">{r.amount}</span>,
  },
  { key: "date", header: "تاریخ", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "done" ? (
        <StatusBadge tone="emerald">انجام شد</StatusBadge>
      ) : (
        <StatusBadge tone="amber">در انتظار</StatusBadge>
      ),
  },
];

const quickActions = [
  { icon: ArrowDownLeft, label: "ثبت دریافت", tone: "text-emerald-600 bg-emerald-50" },
  { icon: ArrowUpRight, label: "ثبت پرداخت", tone: "text-rose-600 bg-rose-50" },
  { icon: FileText, label: "فاکتور خرید", tone: "text-sky-600 bg-sky-50" },
  { icon: Receipt, label: "فاکتور فروش", tone: "text-violet-600 bg-violet-50" },
];

export function AccountingPage() {
  return (
    <div>
      <PageHeader
        icon={Calculator}
        title="حسابداری"
        subtitle="مدیریت دریافت‌ها، پرداخت‌ها، فاکتورها و سود و زیان پروژه‌ها"
        searchPlaceholder="جستجوی تراکنش..."
        actionLabel="ثبت تراکنش"
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="درآمد ماه" value="۴۸B" icon={Wallet} />
          <KpiCard tone="rose" label="هزینه‌ها" value="۲۱B" icon={ArrowUpRight} />
          <KpiCard tone="emerald" label="سود خالص" value="۲۷B" icon={TrendingUp} />
          <KpiCard tone="amber" label="فاکتورهای معوق" value="۹" icon={Receipt} />
        </section>

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
          <Panel className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                دریافت و پرداخت
              </h3>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-emerald-500" /> دریافت
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-rose-400" /> پرداخت
                </span>
              </div>
            </div>
            <div className="mt-4 h-56 w-full sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeData}
                  margin={{ top: 10, right: 8, left: -22, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eef2f1"
                  />
                  <XAxis
                    dataKey="m"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontFamily: "var(--font-vazirmatn)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="in" fill="#059669" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="out" fill="#fb7185" radius={[5, 5, 0, 0]} />
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

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            آخرین تراکنش‌ها
          </h3>
          <DataTable columns={columns} data={rows} onRowClick={() => {}} />
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Panel className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="size-5" />
              </span>
              <div>
                <p className="text-xs text-slate-500">سود پروژه پارسیان</p>
                <h4 className="text-xl font-extrabold text-slate-900">۳.۲B</h4>
              </div>
            </div>
          </Panel>
          <Panel className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Wallet className="size-5" />
              </span>
              <div>
                <p className="text-xs text-slate-500">سود پروژه الماس</p>
                <h4 className="text-xl font-extrabold text-slate-900">۱.۱B</h4>
              </div>
            </div>
          </Panel>
          <Panel className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-500">
                <TrendingDown className="size-5" />
              </span>
              <div>
                <p className="text-xs text-slate-500">زیان پروژه سپهر</p>
                <h4 className="text-xl font-extrabold text-slate-900">۱۸۰M</h4>
              </div>
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}
