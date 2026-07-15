"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Save,
  X,
  Plus,
  Info,
  CreditCard,
  Phone,
  Home,
  FileText,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  DEFAULT_GROUPS,
  PERSON_TYPE_LABELS,
  CONTACT_TABS,
  type PersonType,
  type ContactGroup,
} from "@/lib/contact-groups";

export interface ContactFormData {
  personType: PersonType;
  groups: string[];
  // اطلاعات پایه
  firstName: string;
  lastName: string;
  fatherName: string;
  companyName: string;
  customerType: string;
  description: string;
  // اطلاعات بانکی/مالیاتی
  taxType: string;
  taxCode: string;
  postalCode: string;
  idNumber: string;
  nationalId: string;
  accountNumber: string;
  iban: string;
  // تلفن
  phone: string;
  mobile: string;
  // آدرس
  city: string;
  address: string;
}

const TAB_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  bank: CreditCard,
  phone: Phone,
  address: Home,
  docs: FileText,
};

const EMPTY_FORM: ContactFormData = {
  personType: "individual",
  groups: [],
  firstName: "",
  lastName: "",
  fatherName: "",
  companyName: "",
  customerType: "",
  description: "",
  taxType: "",
  taxCode: "",
  postalCode: "",
  idNumber: "",
  nationalId: "",
  accountNumber: "",
  iban: "",
  phone: "",
  mobile: "",
  city: "",
  address: "",
};

export function ContactFormDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: ContactFormData) => void;
}) {
  const [personType, setPersonType] = useState<PersonType>("individual");
  const [groups, setGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [customGroups, setCustomGroups] = useState<ContactGroup[]>([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupLabel, setNewGroupLabel] = useState("");
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);

  const allGroups = [...DEFAULT_GROUPS, ...customGroups];

  function toggleGroup(id: string) {
    setGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function addCustomGroup() {
    if (!newGroupLabel.trim()) return;
    const newGroup: ContactGroup = {
      id: `custom-${Date.now()}`,
      label: newGroupLabel.trim(),
      icon: "🏷️",
    };
    setCustomGroups((prev) => [...prev, newGroup]);
    setNewGroupLabel("");
    setShowAddGroup(false);
  }

  function set<K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    onSave({ ...form, personType, groups });
    onOpenChange(false);
    setPersonType("individual");
    setGroups([]);
    setActiveTab("info");
    setForm(EMPTY_FORM);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-h-[90vh] sm:rounded-2xl">
        <DialogHeader className="flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <User className="size-5 text-emerald-600" />
            ثبت مخاطب جدید
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto">
          {/* ===== Top: avatar + person type ===== */}
          <div className="flex items-center gap-4 border-b border-slate-100 p-4">
            <div className="relative">
              <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl font-bold text-white">
                {(form.firstName || form.companyName || "؟").charAt(0)}
              </div>
              <button
                className="absolute -bottom-1 -left-1 grid size-6 place-items-center rounded-full border-2 border-white bg-slate-700 text-white"
                aria-label="تغییر تصویر"
              >
                <Plus className="size-3" />
              </button>
            </div>

            <div className="flex-1">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">
                نوع شخص
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPersonType("individual")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                    personType === "individual"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {personType === "individual" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                  حقیقی
                </button>
                <button
                  onClick={() => setPersonType("legal")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition",
                    personType === "legal"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {personType === "legal" ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Building2 className="size-3.5" />
                  )}
                  حقوقی
                </button>
              </div>
            </div>
          </div>

          {/* ===== Groups (multi-select) ===== */}
          <div className="border-b border-slate-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-500">
                گروه‌ها (قابل انتخاب چندگانه)
              </label>
              <button
                onClick={() => setShowAddGroup(!showAddGroup)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 transition hover:text-emerald-700"
              >
                <Plus className="size-3" />
                افزودن گروه
              </button>
            </div>

            {showAddGroup ? (
              <div className="mb-2 flex gap-2">
                <input
                  value={newGroupLabel}
                  onChange={(e) => setNewGroupLabel(e.target.value)}
                  placeholder="نام گروه جدید..."
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  autoFocus
                />
                <button
                  onClick={addCustomGroup}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  افزودن
                </button>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {allGroups.map((g) => {
                const selected = groups.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => toggleGroup(g.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                      selected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <span>{g.icon}</span>
                    {g.label}
                    {selected ? <CheckCircle2 className="size-3" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===== Tab bar ===== */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 bg-slate-50/50 px-4 py-2">
            {CONTACT_TABS.map((t) => {
              const Icon = TAB_ICONS[t.icon] ?? Info;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    active
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Icon className="size-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* ===== Tab content ===== */}
          <div className="p-4">
            {activeTab === "info" && (
              <div className="space-y-4">
                {personType === "individual" ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <FormField
                      label="نام"
                      value={form.firstName}
                      onChange={(v) => set("firstName", v)}
                      placeholder="مثال: محمد"
                    />
                    <FormField
                      label="نام خانوادگی"
                      value={form.lastName}
                      onChange={(v) => set("lastName", v)}
                      placeholder="مثال: احمدی"
                    />
                    <FormField
                      label="نام پدر"
                      value={form.fatherName}
                      onChange={(v) => set("fatherName", v)}
                      placeholder="مثال: علی"
                    />
                  </div>
                ) : (
                  <FormField
                    label="نام شرکت"
                    required
                    value={form.companyName}
                    onChange={(v) => set("companyName", v)}
                    placeholder="مثال: شرکت پارسیان"
                  />
                )}

                <FormSelect
                  label="نوع مشتری"
                  value={form.customerType}
                  onChange={(v) => set("customerType", v)}
                  options={["عادی", "ویژه", "تخفیف‌دار", "عمده‌فروش"]}
                />

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    توضیحات
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="توضیحات..."
                    className="h-20 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            )}

            {activeTab === "bank" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <FormSelect
                    label="نوع مالیات"
                    value={form.taxType}
                    onChange={(v) => set("taxType", v)}
                    options={["ارزش افزوده", "مقطوع", "معاف"]}
                  />
                  <FormField
                    label="کد مالیاتی"
                    value={form.taxCode}
                    onChange={(v) => set("taxCode", v)}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                  />
                  <FormField
                    label="کد پستی"
                    value={form.postalCode}
                    onChange={(v) => set("postalCode", v)}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormField
                    label="شماره شناسنامه"
                    value={form.idNumber}
                    onChange={(v) => set("idNumber", v)}
                    placeholder="—"
                  />
                  <FormField
                    label="کد ملی / شماره ثبت"
                    value={form.nationalId}
                    onChange={(v) => set("nationalId", v)}
                    placeholder="—"
                  />
                  <FormField
                    label="شماره حساب"
                    value={form.accountNumber}
                    onChange={(v) => set("accountNumber", v)}
                    placeholder="—"
                  />
                  <FormField
                    label="شماره شبا"
                    value={form.iban}
                    onChange={(v) => set("iban", v)}
                    placeholder="IR—"
                  />
                </div>
              </div>
            )}

            {activeTab === "phone" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormField
                    label="تلفن ثابت"
                    value={form.phone}
                    onChange={(v) => set("phone", v)}
                    placeholder="۰۲۱۸۸۷۷۶۶۵۵"
                  />
                  <FormField
                    label="موبایل"
                    value={form.mobile}
                    onChange={(v) => set("mobile", v)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="space-y-4">
                <FormField
                  label="شهر"
                  value={form.city}
                  onChange={(v) => set("city", v)}
                  placeholder="مثال: تهران"
                />
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                    آدرس کامل
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="آدرس کامل..."
                    className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            )}

            {activeTab === "docs" && (
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                <FileText className="mx-auto size-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">
                  مدارک مخاطب
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  تصاویر مدارک (کارت ملی، مجوز،...) را اینجا آپلود کنید
                </p>
                <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                  <Plus className="size-3.5" />
                  انتخاب فایل
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            <Save className="size-3.5" />
            ذخیره مخاطب
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pl-8 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">— انتخاب —</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

void PERSON_TYPE_LABELS;
