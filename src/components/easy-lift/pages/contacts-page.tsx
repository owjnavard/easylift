"use client";

import { useState } from "react";
import {
  Phone,
  MapPin,
  Mail,
  Building2,
  Plus,
  Users,
  User,
  Search,
  Pencil,
  Eye,
  ChevronLeft,
} from "lucide-react";
import {
  EasyAiCard,
  PageHeader,
  Panel,
  StatusBadge,
  Toolbar,
  FilterSelect,
  type Column,
} from "@/components/easy-lift";
import { KpiCard } from "@/components/easy-lift/kpi-card";
import {
  ContactFormDialog,
  type ContactFormData,
} from "@/components/easy-lift/contacts/contact-form-dialog";
import { DEFAULT_GROUPS } from "@/lib/contact-groups";
import { useContacts, type Contact } from "@/lib/contacts-store";
import { cn } from "@/lib/utils";

export function ContactsPage() {
  const contacts = useContacts((s) => s.contacts);
  const addContact = useContacts((s) => s.addContact);
  const updateContact = useContacts((s) => s.updateContact);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<ContactFormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.group.toLowerCase().includes(q)
    );
  });

  const selected = contacts.find((c) => c.id === selectedId);

  function openCreate() {
    setEditData(null);
    setEditingId(null);
    setDialogOpen(true);
  }

  function openEdit(contact: Contact) {
    setEditData(contact.formData);
    setEditingId(contact.id);
    setDialogOpen(true);
  }

  function handleSave(data: ContactFormData) {
    if (editingId) {
      updateContact(editingId, data);
    } else {
      addContact(data);
    }
  }

  const columns: Column<Contact>[] = [
    {
      key: "name",
      header: "نام",
      align: "right",
      render: (r) => (
        <button
          onClick={() => setSelectedId(r.id)}
          className="flex items-center gap-3 text-right"
        >
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white",
              r.personType === "legal"
                ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                : "bg-gradient-to-br from-sky-500 to-indigo-500"
            )}
          >
            {r.name.charAt(0)}
          </span>
          <div>
            <div className="font-bold text-slate-800">{r.name}</div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              {r.personType === "legal" ? (
                <>
                  <Building2 className="size-3" /> حقوقی
                </>
              ) : (
                <>
                  <User className="size-3" /> حقیقی
                </>
              )}
            </div>
          </div>
        </button>
      ),
    },
    {
      key: "group",
      header: "گروه",
      align: "center",
      render: (r) => (
        <div className="flex flex-wrap justify-center gap-1">
          {r.groupIds.map((gid) => {
            const g = DEFAULT_GROUPS.find((x) => x.id === gid);
            return (
              <span
                key={gid}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
              >
                <span>{g?.icon}</span>
                {g?.label}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      key: "phone",
      header: "تلفن",
      align: "center",
      render: (r) => (
        <span dir="ltr" className="font-mono text-xs text-slate-600">
          {r.phone}
        </span>
      ),
    },
    {
      key: "city",
      header: "شهر",
      align: "center",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="size-3 text-slate-400" />
          {r.city}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      align: "center",
      render: (r) =>
        r.status === "active" ? (
          <StatusBadge tone="emerald">فعال</StatusBadge>
        ) : (
          <StatusBadge tone="sky">همکار</StatusBadge>
        ),
    },
    {
      key: "actions",
      header: "",
      align: "left",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setSelectedId(r.id)}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
            title="مشاهده"
          >
            <Eye className="size-4" />
          </button>
          <button
            onClick={() => openEdit(r)}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
            title="ویرایش"
          >
            <Pencil className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        icon={Users}
        title="مدیریت مخاطبین"
        subtitle="کارفرمایان، پیمانکاران، تأمین‌کنندگان و پرسنل"
        searchPlaceholder="جستجوی مخاطب..."
        actionLabel="ثبت مخاطب جدید"
        onAction={openCreate}
      />

      <div className="space-y-5 p-4 sm:p-6 lg:p-8">
        {/* KPI */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard tone="hero" label="کل مخاطبین" value={contacts.length.toLocaleString("fa-IR")} icon={Users} />
          <KpiCard tone="emerald" label="مشتری" value={contacts.filter((c) => c.groupIds.includes("customer")).length.toLocaleString("fa-IR")} icon={Building2} />
          <KpiCard tone="sky" label="تأمین‌کننده" value={contacts.filter((c) => c.groupIds.includes("supplier")).length.toLocaleString("fa-IR")} icon={Building2} />
          <KpiCard tone="violet" label="پرسنل و بازاریاب" value={contacts.filter((c) => c.groupIds.includes("staff") || c.groupIds.includes("marketer")).length.toLocaleString("fa-IR")} icon={User} />
        </section>

        <Toolbar
          filters={
            <>
              <FilterSelect>
                <option>همه گروه‌ها</option>
                {DEFAULT_GROUPS.map((g) => (
                  <option key={g.id}>{g.label}</option>
                ))}
              </FilterSelect>
              <FilterSelect>
                <option>همه</option>
                <option>حقیقی</option>
                <option>حقوقی</option>
              </FilterSelect>
            </>
          }
          actions={
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="size-4" />
              ثبت مخاطب جدید
            </button>
          }
        />

        {/* Main layout: table + detail panel */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Table */}
          <div className="lg:col-span-2">
            <Panel padded={false} className="overflow-hidden">
              {/* search */}
              <div className="border-b border-slate-100 p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در نام، تلفن، شهر، گروه..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-slate-50/80">
                    <tr className="border-b border-slate-200/70">
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">نام</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">گروه</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">تلفن</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">شهر</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70",
                          selectedId === c.id && "bg-emerald-50/50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold text-white",
                                c.personType === "legal"
                                  ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                                  : "bg-gradient-to-br from-sky-500 to-indigo-500"
                              )}
                            >
                              {c.name.charAt(0)}
                            </span>
                            <div>
                              <div className="font-bold text-slate-800">{c.name}</div>
                              <div className="text-[10px] text-slate-400">
                                {c.personType === "legal" ? "حقوقی" : "حقیقی"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-center gap-1">
                            {c.groupIds.slice(0, 2).map((gid) => {
                              const g = DEFAULT_GROUPS.find((x) => x.id === gid);
                              return (
                                <span
                                  key={gid}
                                  className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                                >
                                  <span>{g?.icon}</span>
                                  {g?.label}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span dir="ltr" className="font-mono text-xs text-slate-600">
                            {c.phone}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-slate-600">
                          {c.city}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(c.id);
                              }}
                              className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(c);
                              }}
                              className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                            >
                              <Pencil className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* Detail panel */}
          <div className="space-y-5">
            {selected ? (
              <Panel className="overflow-hidden p-0">
                {/* header */}
                <div className="relative overflow-hidden bg-gradient-to-l from-emerald-600 to-teal-500 p-5 text-white">
                  <div className="absolute -left-6 -top-6 size-24 rounded-full bg-white/10" />
                  <div className="relative flex items-center gap-3">
                    <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl font-black">
                      {selected.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">{selected.name}</h3>
                      <p className="mt-0.5 text-xs text-emerald-50">
                        {selected.personType === "legal" ? "شخص حقوقی" : "شخص حقیقی"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* info */}
                <div className="space-y-3 p-5">
                  {/* groups */}
                  <div>
                    <div className="mb-2 text-[11px] font-bold text-slate-500">گروه‌ها</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.groupIds.map((gid) => {
                        const g = DEFAULT_GROUPS.find((x) => x.id === gid);
                        return (
                          <span
                            key={gid}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                          >
                            <span>{g?.icon}</span>
                            {g?.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* contact info */}
                  <div className="space-y-2.5 border-t border-slate-100 pt-3">
                    <InfoRow icon={Phone} label="تلفن" value={selected.phone} ltr />
                    {selected.mobile ? (
                      <InfoRow icon={Phone} label="موبایل" value={selected.mobile} ltr />
                    ) : null}
                    {selected.email ? (
                      <InfoRow icon={Mail} label="ایمیل" value={selected.email} ltr />
                    ) : null}
                    <InfoRow icon={MapPin} label="شهر" value={selected.city} />
                    {selected.address ? (
                      <div className="flex gap-2 text-xs">
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                        <div>
                          <div className="text-slate-400">آدرس</div>
                          <div className="mt-0.5 text-slate-700">{selected.address}</div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => openEdit(selected)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <Pencil className="size-3.5" />
                      ویرایش
                    </button>
                    <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                      <Eye className="size-3.5" />
                      مشاهده کامل
                    </button>
                  </div>
                </div>
              </Panel>
            ) : (
              <Panel className="p-8 text-center">
                <Users className="mx-auto size-12 text-slate-200" />
                <p className="mt-3 text-sm font-medium text-slate-400">
                  یک مخاطب را انتخاب کنید
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  برای مشاهده جزئیات روی مخاطب کلیک کنید
                </p>
              </Panel>
            )}

            <EasyAiCard
              insights={[
                "۳ مخاطب تکراری شناسایی شد.",
                "۲ شماره موبایل ناقص است.",
                "۵ ایمیل نامعتبر است.",
              ]}
              ctaLabel="بررسی توسط AI"
            />
          </div>
        </div>
      </div>

      {/* Contact form dialog */}
      <ContactFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="size-3.5 shrink-0 text-slate-400" />
      <span className="text-slate-400">{label}</span>
      <span className="ms-auto font-semibold text-slate-700" dir={ltr ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
