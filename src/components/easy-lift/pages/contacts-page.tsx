"use client";

import { Phone, MapPin, Mail, Building2, Plus } from "lucide-react";
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

interface Contact {
  name: string;
  group: string;
  phone: string;
  city: string;
  projects: number;
  status: "active" | "partner";
}

const rows: Contact[] = [
  { name: "شرکت پارسیان", group: "کارفرما", phone: "02188776655", city: "تهران", projects: 8, status: "active" },
  { name: "آسانبر نوین", group: "تأمین‌کننده", phone: "02122334455", city: "اصفهان", projects: 12, status: "partner" },
  { name: "برج آریا", group: "کارفرما", phone: "02144556677", city: "تهران", projects: 3, status: "active" },
  { name: "سپهر آسانسور", group: "تأمین‌کننده", phone: "03155667788", city: "اصفهان", projects: 9, status: "partner" },
  { name: "پارس لیفت", group: "تأمین‌کننده", phone: "02166778899", city: "کرج", projects: 6, status: "active" },
];

const columns: Column<Contact>[] = [
  {
    key: "name",
    header: "نام",
    align: "right",
    render: (r) => <span className="font-semibold text-slate-800">{r.name}</span>,
  },
  { key: "group", header: "گروه", align: "center" },
  { key: "phone", header: "تلفن", align: "center" },
  { key: "city", header: "شهر", align: "center" },
  { key: "projects", header: "پروژه", align: "center" },
  {
    key: "status",
    header: "وضعیت",
    align: "center",
    render: (r) =>
      r.status === "active" ? (
        <StatusBadge tone="green">فعال</StatusBadge>
      ) : (
        <StatusBadge tone="blue">همکار</StatusBadge>
      ),
  },
];

export function ContactsPage() {
  return (
    <div>
      <PageHeader
        title="مدیریت مخاطبین"
        subtitle="کارفرمایان، پیمانکاران، تأمین‌کنندگان و پرسنل"
        searchPlaceholder="جستجوی مخاطب..."
        actionLabel="ثبت مخاطب جدید"
      />

      <div className="space-y-6 p-4 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard tone="gradient" label="کل مخاطبین" value="۱۲۴۸" />
          <KpiCard label="کارفرما" value="۳۲۰" />
          <KpiCard label="تأمین‌کننده" value="۱۸۵" />
          <KpiCard label="پرسنل" value="۷۴" />
        </section>

        <Toolbar
          filters={
            <>
              <FilterSelect>
                <option>همه گروه‌ها</option>
                <option>کارفرما</option>
                <option>تأمین‌کننده</option>
                <option>پیمانکار</option>
              </FilterSelect>
              <FilterSelect>
                <option>همه شهرها</option>
                <option>تهران</option>
                <option>اصفهان</option>
                <option>کرج</option>
              </FilterSelect>
              <FilterSelect>
                <option>فعال</option>
                <option>غیرفعال</option>
              </FilterSelect>
            </>
          }
          actions={
            <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              <Plus className="size-4" />
              ثبت مخاطب جدید
            </button>
          }
        />

        {/* Contact cards */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel className="transition hover:shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-600">
                  پ
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    شرکت پارسیان
                  </h3>
                  <p className="text-sm text-slate-500">کارفرما</p>
                </div>
              </div>
              <StatusBadge tone="green">فعال</StatusBadge>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-slate-400" /> 02188776655
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-slate-400" /> تهران
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-slate-400" /> info@test.com
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-slate-400" /> ۸ پروژه
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                مشاهده
              </button>
              <button className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
                ویرایش
              </button>
            </div>
          </Panel>

          <Panel className="transition hover:shadow-xl">
            <div className="flex gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-cyan-100 text-xl font-bold text-cyan-600">
                آ
              </div>
              <div>
                <h3 className="font-bold text-slate-800">آسانبر نوین</h3>
                <p className="text-sm text-slate-500">تأمین‌کننده</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-slate-400" /> 02122334455
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-slate-400" /> sales@novin.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-slate-400" /> اصفهان
              </div>
            </div>
            <button className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
              مشاهده اطلاعات
            </button>
          </Panel>

          <EasyAiCard
            insights={[
              "۳ مخاطب تکراری شناسایی شد.",
              "۲ شماره موبایل ناقص است.",
              "۵ ایمیل نامعتبر است.",
            ]}
            ctaLabel="بررسی توسط AI"
          />
        </section>

        {/* Table */}
        <DataTable columns={columns} data={rows} onRowClick={() => {}} />
      </div>
    </div>
  );
}
