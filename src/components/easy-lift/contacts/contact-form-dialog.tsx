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
  Camera,
  Trash2,
  Mail,
  Hash,
  MapPin,
  FileSpreadsheet,
  StickyNote,
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
  CONTACT_TABS,
  type PersonType,
  type ContactGroup,
} from "@/lib/contact-groups";

export interface ContactFormData {
  personType: PersonType;
  groups: string[];
  firstName: string;
  lastName: string;
  fatherName: string;
  companyName: string;
  customerType: string;
  description: string;
  taxType: string;
  taxCode: string;
  postalCode: string;
  idNumber: string;
  nationalId: string;
  accountNumber: string;
  iban: string;
  phone: string;
  mobile: string;
  email: string;
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
  email: "",
  city: "",
  address: "",
};

export function ContactFormDialog({
  open,
  onOpenChange,
  onSave,
  editData,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: ContactFormData) => void;
  editData?: ContactFormData | null;
}) {
  // key برای بازنشانی state هنگام تغییر editData
  const formKey = editData
    ? `edit-${editData.personType}-${editData.groups.join(",")}`
    : "new";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ContactFormInner
        key={formKey}
        onOpenChange={onOpenChange}
        onSave={onSave}
        editData={editData}
      />
    </Dialog>
  );
}

function ContactFormInner({
  onOpenChange,
  onSave,
  editData,
}: {
  onOpenChange: (v: boolean) => void;
  onSave: (data: ContactFormData) => void;
  editData?: ContactFormData | null;
}) {
  const initial = editData ?? EMPTY_FORM;
  const [personType, setPersonType] = useState<PersonType>(initial.personType);
  const [groups, setGroups] = useState<string[]>(initial.groups);
  const [activeTab, setActiveTab] = useState("info");
  const [customGroups, setCustomGroups] = useState<ContactGroup[]>([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupLabel, setNewGroupLabel] = useState("");
  const [form, setForm] = useState<ContactFormData>(initial);

  const allGroups = [...DEFAULT_GROUPS, ...customGroups];
  const isEdit = !!editData;

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
    setGroups((prev) => [...prev, newGroup.id]);
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
  }

  const displayName =
    personType === "individual"
      ? `${form.firstName} ${form.lastName}`.trim()
      : form.companyName;

  return (
    <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-h-[92vh] sm:rounded-3xl">
      {/* ===== Header with gradient ===== */}
      <DialogHeader className="relative flex-row items-center justify-between overflow-hidden border-b border-slate-100 bg-gradient-to-l from-emerald-600 to-teal-500 p-4 text-white">
        <div className="absolute -left-8 -top-8 size-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-4 size-28 rounded-full bg-white/10" />
        <DialogTitle className="relative flex items-center gap-2.5 text-base font-bold">
          <span className="grid size-8 place-items-center rounded-xl bg-white/20">
            {isEdit ? <User className="size-4" /> : <Plus className="size-4" />}
          </span>
          {isEdit ? "ویرایش مخاطب" : "ثبت مخاطب جدید"}
        </DialogTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="relative grid size-8 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
          aria-label="بستن"
        >
          <X className="size-5" />
        </button>
      </DialogHeader>

      <div className="max-h-[78vh] overflow-y-auto">
        {/* ===== Avatar + person type ===== */}
        <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/40 p-5">
          <div className="relative">
            <div className="grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-3xl font-black text-white shadow-lg shadow-emerald-200">
              {(displayName || "؟").charAt(0)}
            </div>
            <button
              className="absolute -bottom-1 -left-1 grid size-7 place-items-center rounded-full border-2 border-white bg-slate-800 text-white shadow-md transition hover:bg-slate-700"
              aria-label="تغییر تصویر"
              title="تغییر تصویر"
            >
              <Camera className="size-3.5" />
            </button>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-xs font-bold text-slate-500">
              نوع شخص
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPersonType("individual")}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition",
                  personType === "individual"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                )}
              >
                <User className="size-4" />
                حقیقی
                {personType === "individual" ? (
                  <CheckCircle2 className="size-4" />
                ) : null}
              </button>
              <button
                onClick={() => setPersonType("legal")}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition",
                  personType === "legal"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                )}
              >
                <Building2 className="size-4" />
                حقوقی
                {personType === "legal" ? (
                  <CheckCircle2 className="size-4" />
                ) : null}
              </button>
            </div>
          </div>
        </div>

        {/* ===== Groups ===== */}
        <div className="border-b border-slate-100 p-5">
          <div className="mb-3 flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Hash className="size-3.5 text-emerald-600" />
              گروه‌ها (انتخاب چندگانه)
            </label>
            <button
              onClick={() => setShowAddGroup(!showAddGroup)}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-100"
            >
              <Plus className="size-3" />
              گروه جدید
            </button>
          </div>

          {showAddGroup ? (
            <div className="mb-3 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50/30 p-2">
              <input
                value={newGroupLabel}
                onChange={(e) => setNewGroupLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomGroup()}
                placeholder="نام گروه جدید..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                autoFocus
              />
              <button
                onClick={addCustomGroup}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 className="size-3" />
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
                    "group inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition",
                    selected
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <span className="text-base">{g.icon}</span>
                  {g.label}
                  {selected ? (
                    <span className="grid size-4 place-items-center rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 className="size-3" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Tab bar ===== */}
        <div className="sticky top-0 z-10 flex items-center gap-1 overflow-x-auto border-b border-slate-100 bg-white px-3 py-2 shadow-sm">
          {CONTACT_TABS.map((t) => {
            const Icon = TAB_ICONS[t.icon] ?? Info;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition",
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ===== Tab content ===== */}
        <div className="p-5">
          {activeTab === "info" && (
            <div className="space-y-4">
              {personType === "individual" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <FormField
                    icon={User}
                    label="نام"
                    value={form.firstName}
                    onChange={(v) => set("firstName", v)}
                    placeholder="مثال: محمد"
                  />
                  <FormField
                    icon={User}
                    label="نام خانوادگی"
                    value={form.lastName}
                    onChange={(v) => set("lastName", v)}
                    placeholder="مثال: احمدی"
                  />
                  <FormField
                    icon={User}
                    label="نام پدر"
                    value={form.fatherName}
                    onChange={(v) => set("fatherName", v)}
                    placeholder="مثال: علی"
                  />
                </div>
              ) : (
                <FormField
                  icon={Building2}
                  label="نام شرکت"
                  required
                  value={form.companyName}
                  onChange={(v) => set("companyName", v)}
                  placeholder="مثال: شرکت پارسیان"
                />
              )}

              <FormSelect
                icon={FileSpreadsheet}
                label="نوع مشتری"
                value={form.customerType}
                onChange={(v) => set("customerType", v)}
                options={["عادی", "ویژه", "تخفیف‌دار", "عمده‌فروش"]}
              />

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <StickyNote className="size-3.5 text-emerald-600" />
                  توضیحات
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="توضیحات..."
                  className="h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <FormSelect
                  icon={Hash}
                  label="نوع مالیات"
                  value={form.taxType}
                  onChange={(v) => set("taxType", v)}
                  options={["ارزش افزوده", "مقطوع", "معاف"]}
                />
                <FormField
                  icon={Hash}
                  label="کد مالیاتی"
                  value={form.taxCode}
                  onChange={(v) => set("taxCode", v)}
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                />
                <FormField
                  icon={Hash}
                  label="کد پستی"
                  value={form.postalCode}
                  onChange={(v) => set("postalCode", v)}
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField
                  icon={FileText}
                  label="شماره شناسنامه"
                  value={form.idNumber}
                  onChange={(v) => set("idNumber", v)}
                  placeholder="—"
                />
                <FormField
                  icon={Hash}
                  label="کد ملی / شماره ثبت"
                  value={form.nationalId}
                  onChange={(v) => set("nationalId", v)}
                  placeholder="—"
                />
                <FormField
                  icon={CreditCard}
                  label="شماره حساب"
                  value={form.accountNumber}
                  onChange={(v) => set("accountNumber", v)}
                  placeholder="—"
                />
                <FormField
                  icon={CreditCard}
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
                  icon={Phone}
                  label="تلفن ثابت"
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                  placeholder="۰۲۱۸۸۷۷۶۶۵۵"
                />
                <FormField
                  icon={Phone}
                  label="موبایل"
                  value={form.mobile}
                  onChange={(v) => set("mobile", v)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
              </div>
              <FormField
                icon={Mail}
                label="ایمیل"
                value={form.email}
                onChange={(v) => set("email", v)}
                placeholder="example@mail.com"
              />
            </div>
          )}

          {activeTab === "address" && (
            <div className="space-y-4">
              <FormField
                icon={MapPin}
                label="شهر"
                value={form.city}
                onChange={(v) => set("city", v)}
                placeholder="مثال: تهران"
              />
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <MapPin className="size-3.5 text-emerald-600" />
                  آدرس کامل
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="آدرس کامل..."
                  className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FileText className="size-7" />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-700">
                مدارک مخاطب
              </p>
              <p className="mt-1 text-xs text-slate-400">
                تصاویر مدارک (کارت ملی، مجوز،...) را اینجا آپلود کنید
              </p>
              <button className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                <Plus className="size-3.5" />
                انتخاب فایل
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50 p-4">
        {isEdit ? (
          <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">
            <Trash2 className="size-3.5" />
            حذف مخاطب
          </button>
        ) : (
          <span className="text-[11px] text-slate-400">
            فیلدهای ستاره‌دار الزامی هستند
          </span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
          >
            <Save className="size-3.5" />
            {isEdit ? "ذخیره تغییرات" : "ذخیره مخاطب"}
          </button>
        </div>
      </div>
    </DialogContent>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600">
        {Icon ? <Icon className="size-3.5 text-emerald-600" /> : null}
        {label}
        {required ? <span className="text-rose-500">*</span> : null}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  icon: Icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600">
        {Icon ? <Icon className="size-3.5 text-emerald-600" /> : null}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pl-9 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">— انتخاب —</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}
