"use client";

import { Plus, FileText, FileSpreadsheet, Pen, FileSignature } from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  Toolbar,
  FilterSelect,
  DataTable,
  StatBar,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";

interface Contract {
  no: string;
  client: string;
  quote: string;
  amount: string;
  date: string;
  status: "active" | "unsigned";
  progress: number;
}

const rows: Contract[] = [
  { no: "CT-1405-021", client: "شرکت پارسیان", quote: "PF-14025", amount: "8.4B", date: "1405/04/25", status: "active", progress: 72 },
  { no: "CT-1405-020", client: "برج آریا", quote: "PF-14024", amount: "5.2B", date: "1405/04/18", status: "unsigned", progress: 25 },
  { no: "CT-1405-019", client: "سپهر گروپ", quote: "PF-14023", amount: "2.1B", date: "1405/04/12", status: "active", progress: 55 },
];

const columns: Column<Contract>[] = [
  {
    key: "no",
    header: "شماره",
    align: "right",
    render: (r) => (
      <span className="font-mono font-bold text-emerald-600">{r.no}</span>
    ),
  },
  { key: "client", header: "کارفرما", align: "center" },
  { key: "quote", header: "پیش‌فاکتور", align: "center", render: (r) => (
    <span className="font-mono text-xs text-slate-500">{r.quote}</span>
  ) },
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
      r.status === "active" ? (
        <StatusBadge tone="emerald">فعال</StatusBadge>
      ) : (
        <StatusBadge tone="amber">امضا نشده</StatusBadge>
      ),
  },
  {
    key: "progress",
    header: "پیشرفت",
    align: "center",
    render: (r) => (
      <div className="mx-auto w-24">
        <StatBar
          percent={r.progress}
          barClass={r.status === "active" ? "bg-emerald-500" : "bg-amber-500"}
        />
      </div>
    ),
  },
];

export function ContractsPage() {
  return (
    <div>
      <PageHeader
        icon={FileSignature}
        title="مدیریت قراردادها"
        subtitle="ثبت، پیگیری و مدیریت قراردادهای فروش آسانسور"
        searchPlaceholder="جستجوی شماره قرارداد..."
        actionLabel="قرارداد جدید"
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="قراردادهای فعال" value="۶۲" icon={FileSignature} />
          <KpiCard tone="amber" label="در انتظار امضا" value="۸" icon={FileText} />
          <KpiCard tone="sky" label="در حال اجرا" value="۳۹" icon={FileText} />
          <KpiCard tone="emerald" label="ارزش قراردادها" value="۵۱۲B" icon={FileText} />
        </section>

        <Toolbar
          filters={
            <>
              <FilterSelect>
                <option>همه وضعیت‌ها</option>
                <option>فعال</option>
                <option>پایان یافته</option>
              </FilterSelect>
              <FilterSelect>
                <option>همه پروژه‌ها</option>
                <option>پارسیان</option>
                <option>الماس</option>
              </FilterSelect>
              <FilterSelect>
                <option>همه مدیران فروش</option>
                <option>احمدی</option>
              </FilterSelect>
            </>
          }
          actions={
            <>
              <button className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-rose-500 transition hover:bg-slate-50">
                <FileText className="size-4" />
              </button>
              <button className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-emerald-600 transition hover:bg-slate-50">
                <FileSpreadsheet className="size-4" />
              </button>
            </>
          }
        />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="el-card-hover p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-mono font-bold text-emerald-600">CT-1405-021</h3>
                <p className="mt-0.5 text-xs text-slate-500">شرکت پارسیان</p>
              </div>
              <StatusBadge tone="emerald">فعال</StatusBadge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">💰 8.4B ریال</div>
              <div>🛗 ۴ آسانسور</div>
              <div>📅 ۱۴۰۵/۰۴/۲۵</div>
              <div>👤 احمدی</div>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-slate-500">پیشرفت اجرا</span>
                <span className="font-semibold text-slate-700">۷۲٪</span>
              </div>
              <StatBar percent={72} barClass="bg-emerald-500" />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                جزئیات
              </button>
              <button className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200">
                <Pen className="size-4" />
              </button>
            </div>
          </Panel>

          <Panel className="el-card-hover p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-mono font-bold text-emerald-600">CT-1405-020</h3>
                <p className="mt-0.5 text-xs text-slate-500">برج آریا</p>
              </div>
              <StatusBadge tone="amber">در انتظار امضا</StatusBadge>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">💰 5.2B ریال</div>
              <div>📅 ۱۴۰۵/۰۴/۱۸</div>
              <div>👤 رضایی</div>
              <div className="font-mono">📝 PF-14024</div>
            </div>
            <button className="mt-4 w-full rounded-lg bg-slate-100 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
              مشاهده قرارداد
            </button>
          </Panel>

          <EasyAiCard
            insights={[
              "۲ قرارداد منتظر امضای کارفرما هستند.",
              "۱ قرارداد موعد پیش‌پرداخت را رد کرده است.",
              "پیشنهاد ارسال یادآوری برای مشتری.",
            ]}
            ctaLabel="اقدام هوشمند"
          />
        </section>

        <DataTable columns={columns} data={rows} onRowClick={() => {}} />
      </div>
    </div>
  );
}
