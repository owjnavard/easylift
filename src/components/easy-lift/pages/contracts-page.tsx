"use client";

import { Plus, FileText, FileSpreadsheet, Pen } from "lucide-react";
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
    render: (r) => <span className="font-bold text-slate-800">{r.no}</span>,
  },
  { key: "client", header: "کارفرما", align: "center" },
  { key: "quote", header: "پیش‌فاکتور", align: "center" },
  { key: "amount", header: "مبلغ", align: "center" },
  { key: "date", header: "تاریخ", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "active" ? (
        <StatusBadge tone="green">فعال</StatusBadge>
      ) : (
        <StatusBadge tone="amber">امضا نشده</StatusBadge>
      ),
  },
  {
    key: "progress",
    header: "پیشرفت",
    align: "center",
    render: (r) => (
      <div className="mx-auto w-28">
        <StatBar
          percent={r.progress}
          barClass={r.status === "active" ? "bg-blue-600" : "bg-amber-500"}
        />
      </div>
    ),
  },
];

export function ContractsPage() {
  return (
    <div>
      <PageHeader
        title="مدیریت قراردادها"
        subtitle="ثبت، پیگیری و مدیریت قراردادهای فروش آسانسور"
        searchPlaceholder="جستجوی شماره قرارداد..."
        actionLabel="قرارداد جدید"
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="قراردادهای فعال" value="۶۲" />
          <KpiCard label="در انتظار امضا" value="۸" />
          <KpiCard label="در حال اجرا" value="۳۹" />
          <KpiCard label="ارزش قراردادها" value="۵۱۲B" />
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
              <button className="grid size-11 place-items-center rounded-xl bg-slate-100 text-red-500 transition hover:bg-slate-200">
                <FileText className="size-5" />
              </button>
              <button className="grid size-11 place-items-center rounded-xl bg-slate-100 text-green-600 transition hover:bg-slate-200">
                <FileSpreadsheet className="size-5" />
              </button>
            </>
          }
        />

        {/* Contract cards */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel className="transition hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">CT-1405-021</h3>
                <p className="text-sm text-slate-500">شرکت پارسیان</p>
              </div>
              <StatusBadge tone="green">فعال</StatusBadge>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>💰 8.4B ریال</div>
              <div>🛗 ۴ آسانسور</div>
              <div>📅 1405/04/25</div>
              <div>👤 احمدی</div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">پیشرفت اجرا</span>
                <span className="font-semibold">۷۲٪</span>
              </div>
              <StatBar percent={72} barClass="bg-blue-600" />
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                جزئیات
              </button>
              <button className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200">
                <Pen className="size-4" />
              </button>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800">CT-1405-020</h3>
                <p className="text-sm text-slate-500">برج آریا</p>
              </div>
              <StatusBadge tone="amber">در انتظار امضا</StatusBadge>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div>💰 5.2B ریال</div>
              <div>📅 1405/04/18</div>
              <div>👤 رضایی</div>
              <div>📝 پیش‌فاکتور PF-14024</div>
            </div>
            <button className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
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
