"use client";

import { Plus, FileText, FileSpreadsheet, Printer } from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  Toolbar,
  FilterSelect,
  DataTable,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";

interface Quote {
  no: string;
  customer: string;
  date: string;
  elevators: number;
  amount: string;
  status: "pending" | "approved";
  seller: string;
}

const rows: Quote[] = [
  { no: "PF-14025", customer: "شرکت پارسیان", date: "1405/04/20", elevators: 4, amount: "8.4B", status: "pending", seller: "احمدی" },
  { no: "PF-14024", customer: "برج الماس", date: "1405/04/18", elevators: 2, amount: "5.2B", status: "approved", seller: "کریمی" },
  { no: "PF-14023", customer: "سپهر گروپ", date: "1405/04/15", elevators: 1, amount: "2.1B", status: "approved", seller: "رضایی" },
  { no: "PF-14022", customer: "برج آریا", date: "1405/04/10", elevators: 3, amount: "6.8B", status: "pending", seller: "احمدی" },
];

const columns: Column<Quote>[] = [
  {
    key: "no",
    header: "شماره",
    align: "right",
    render: (r) => <span className="font-bold text-slate-800">{r.no}</span>,
  },
  { key: "customer", header: "مشتری", align: "center" },
  { key: "date", header: "تاریخ", align: "center" },
  { key: "elevators", header: "آسانسور", align: "center" },
  { key: "amount", header: "مبلغ", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "pending" ? (
        <StatusBadge tone="amber">در انتظار</StatusBadge>
      ) : (
        <StatusBadge tone="green">تأیید</StatusBadge>
      ),
  },
  { key: "seller", header: "فروشنده", align: "center" },
];

export function QuotationsPage() {
  return (
    <div>
      <PageHeader
        title="مدیریت پیش‌فاکتورها"
        subtitle="ثبت، محاسبه و پیگیری پیش‌فاکتورهای فروش"
        searchPlaceholder="جستجوی شماره یا مشتری..."
        actionLabel="پیش‌فاکتور جدید"
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="پیش‌فاکتورهای فعال" value="۸۴" />
          <KpiCard label="در انتظار تأیید" value="۱۷" />
          <KpiCard label="تبدیل به قرارداد" value="۴۲" />
          <KpiCard label="ارزش کل" value="۲۸۶B" />
        </section>

        <Toolbar
          filters={
            <>
              <FilterSelect>
                <option>همه وضعیت‌ها</option>
                <option>در انتظار</option>
                <option>تأیید شده</option>
              </FilterSelect>
              <FilterSelect>
                <option>همه فروشندگان</option>
                <option>احمدی</option>
                <option>کریمی</option>
              </FilterSelect>
              <FilterSelect>
                <option>امروز</option>
                <option>این ماه</option>
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

        {/* Quote cards */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel className="transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800">PF-14025</h3>
                <p className="text-sm text-slate-500">شرکت پارسیان</p>
              </div>
              <StatusBadge tone="amber">در انتظار</StatusBadge>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>🛗 ۴ آسانسور</div>
              <div>🏢 ۱۲ توقف</div>
              <div>📅 1405/04/20</div>
              <div>💰 8.4B</div>
            </div>
            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                مشاهده
              </button>
              <button className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200">
                <Printer className="size-4" />
              </button>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800">PF-14024</h3>
                <p className="text-sm text-slate-500">برج الماس</p>
              </div>
              <StatusBadge tone="green">تأیید شده</StatusBadge>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div>💰 5.2B ریال</div>
              <div>🛗 ۲ آسانسور</div>
              <div>👤 رضایی</div>
            </div>
            <button className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
              ویرایش
            </button>
          </Panel>

          <EasyAiCard
            insights={[
              "۴ پیش‌فاکتور هنوز پیگیری نشده‌اند.",
              "۲ مورد احتمال تبدیل به قرارداد بالایی دارند.",
              "AI پیشنهاد تخفیف برای مشتری پارسیان ارائه کرده است.",
            ]}
            ctaLabel="تحلیل هوشمند"
          />
        </section>

        <DataTable columns={columns} data={rows} onRowClick={() => {}} />
      </div>
    </div>
  );
}
