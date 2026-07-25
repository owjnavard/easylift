"use client";

import { useMemo, useState } from "react";
import {
  User,
  MapPin,
  ArrowLeft,
  FolderKanban,
  Hash,
  CalendarDays,
  ChevronDown,
  Check,
  Plus,
  UserPlus,
  Trash2,
  Users,
  Phone,
  Briefcase,
  Search,
} from "lucide-react";
import { Panel } from "@/components/easy-lift";
import {
  useQuotations,
  REQUESTER_LABELS,
  type Representative,
  type GeoLocation,
} from "@/lib/quotations-store";
import { useContacts } from "@/lib/contacts-store";
import {
  ContactFormDialog,
  type ContactFormData,
} from "@/components/easy-lift/contacts/contact-form-dialog";
import { LocationMapPicker } from "./location-map-picker";
import { cn } from "@/lib/utils";

const uid = () => Math.random().toString(36).slice(2, 10);

function faDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function Step1Request({ id }: { id: string }) {
  const req = useQuotations((s) => s.requests.find((r) => r.id === id)!);
  const updateRequest = useQuotations((s) => s.updateRequest);
  const goToStage = useQuotations((s) => s.goToStage);
  const contacts = useContacts((s) => s.contacts);
  const addContact = useContacts((s) => s.addContact);

  const [customerId, setCustomerId] = useState(req.customerId ?? "");
  const [customer, setCustomer] = useState(req.customer);
  const [projectName, setProjectName] = useState(req.projectName);
  const [address, setAddress] = useState(req.address);
  const [location, setLocation] = useState<GeoLocation | undefined>(req.location);
  const [representatives, setRepresentatives] = useState<Representative[]>(
    req.representatives ?? []
  );

  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const canProceed = customer.trim() && projectName.trim() && address.trim();

  function pickContact(cId: string, name: string) {
    setCustomerId(cId);
    setCustomer(name);
  }

  function handleNewContact(data: ContactFormData) {
    const c = addContact(data);
    pickContact(c.id, c.name);
  }

  function addRep() {
    setRepresentatives((r) => [
      ...r,
      { id: uid(), name: "", role: "", phone: "" },
    ]);
  }
  function updateRep(rid: string, patch: Partial<Representative>) {
    setRepresentatives((r) =>
      r.map((x) => (x.id === rid ? { ...x, ...patch } : x))
    );
  }
  function removeRep(rid: string) {
    setRepresentatives((r) => r.filter((x) => x.id !== rid));
  }

  function next() {
    updateRequest(id, {
      customer,
      customerId: customerId || undefined,
      projectName,
      address,
      location,
      representatives: representatives.filter(
        (r) => r.name.trim() || r.role.trim() || r.phone.trim()
      ),
    });
    goToStage(id, 2);
  }

  return (
    <Panel className="p-5 sm:p-6">
      {/* header: شماره و تاریخ */}
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">ثبت درخواست پیش‌فاکتور</h3>
          <p className="mt-1 text-xs text-slate-500">
            اطلاعات اولیه درخواست وارد شود. پس از ثبت، یک پروژه موقت (Draft) در بخش «فنی و مهندسی» ایجاد می‌گردد.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
            <Hash className="size-3.5 text-emerald-600" />
            <span className="text-slate-500">شماره پیش‌فاکتور:</span>
            <span className="font-mono font-bold text-emerald-700">{req.code}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
            <CalendarDays className="size-3.5 text-slate-500" />
            <span className="text-slate-500">تاریخ:</span>
            <span className="font-semibold text-slate-700">{faDate(req.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* درخواست‌کننده — غیرقابل انتخاب، خودکار تعیین می‌شود */}
        <FieldGroup label="درخواست‌کننده" icon={User}>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold",
                req.requester === "marketer" && "bg-sky-100 text-sky-700",
                req.requester === "customer" && "bg-violet-100 text-violet-700",
                req.requester === "internal" && "bg-emerald-100 text-emerald-700"
              )}
            >
              {REQUESTER_LABELS[req.requester]}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {req.requesterName || "—"}
            </span>
            <span className="mr-auto text-[10px] text-slate-400">
              {req.requester === "internal"
                ? "این درخواست توسط کاربر داخلی سیستم ثبت شده است"
                : "این درخواست از پنل درخواست‌کننده ثبت شده است"}
            </span>
          </div>
        </FieldGroup>

        {/* مشتری + نام پروژه */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="نام مشتری" icon={User}>
            <ContactPicker
              contacts={contacts}
              selectedId={customerId}
              selectedName={customer}
              onPick={pickContact}
              onCreateNew={() => setContactDialogOpen(true)}
            />
          </FieldGroup>
          <FieldGroup label="نام پروژه" icon={FolderKanban}>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="مثال: برج مسکونی نیلوفر"
              className={cn(inputCls, !projectName.trim() && "border-rose-200 bg-rose-50/40")}
            />
          </FieldGroup>
        </div>

        {/* آدرس ساختمان + نقشه */}
        <FieldGroup label="آدرس ساختمان" icon={MapPin}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="آدرس را وارد کنید یا از روی نقشه انتخاب کنید"
            className={cn(inputCls, "mb-2", !address.trim() && "border-rose-200 bg-rose-50/40")}
          />
          <LocationMapPicker
            value={location}
            onChange={setLocation}
            onAddressResolved={(addr) => setAddress(addr)}
          />
        </FieldGroup>

        {/* نمایندگان کارفرما */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Users className="size-4 text-emerald-600" />
              مشخصات نماینده کارفرما
              {representatives.length > 0 && (
                <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] text-emerald-700">
                  {representatives.length.toLocaleString("fa-IR")}
                </span>
              )}
            </div>
            <button
              onClick={addRep}
              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              <UserPlus className="size-3.5" />
              افزودن نماینده
            </button>
          </div>

          {representatives.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-xs text-slate-400">
              هنوز نماینده‌ای اضافه نشده است. می‌توانید چند نماینده ثبت کنید.
            </p>
          ) : (
            <div className="space-y-2.5">
              {representatives.map((rep, i) => (
                <div
                  key={rep.id}
                  className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                >
                  <RepField
                    icon={User}
                    value={rep.name}
                    onChange={(v) => updateRep(rep.id, { name: v })}
                    placeholder="نام نماینده"
                  />
                  <RepField
                    icon={Briefcase}
                    value={rep.role}
                    onChange={(v) => updateRep(rep.id, { role: v })}
                    placeholder="سمت در پروژه"
                  />
                  <RepField
                    icon={Phone}
                    value={rep.phone}
                    onChange={(v) => updateRep(rep.id, { phone: v })}
                    placeholder="شماره تماس"
                    dir="ltr"
                  />
                  <button
                    onClick={() => removeRep(rep.id)}
                    className="grid size-9 shrink-0 place-items-center self-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    title="حذف نماینده"
                    aria-label={`حذف نماینده ${i + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{req.code}</span>
          <span>•</span>
          <span>وضعیت: Draft</span>
        </div>
        <button
          onClick={next}
          disabled={!canProceed}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ثبت و ادامه به صدور پیش‌فاکتور
          <ArrowLeft className="size-4" />
        </button>
      </div>

      <ContactFormDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        onSave={handleNewContact}
      />
    </Panel>
  );
}

/* --- انتخاب مخاطب از لیست + ایجاد مخاطب جدید --- */
function ContactPicker({
  contacts,
  selectedId,
  selectedName,
  onPick,
  onCreateNew,
}: {
  contacts: { id: string; name: string; group: string }[];
  selectedId: string;
  selectedName: string;
  onPick: (id: string, name: string) => void;
  onCreateNew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return contacts;
    const s = q.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(s));
  }, [contacts, q]);

  const hasValue = Boolean(selectedName.trim());

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100",
          hasValue ? "border-slate-200 text-slate-800" : "border-rose-200 bg-rose-50/40 text-slate-400"
        )}
      >
        <span className={cn(!hasValue && "text-slate-400")}>
          {hasValue ? selectedName : "انتخاب مشتری از مخاطبین…"}
        </span>
        <ChevronDown className={cn("size-4 text-slate-400 transition", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="relative border-b border-slate-100 p-2">
              <Search className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجوی مخاطب…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-8 pl-2 text-xs outline-none focus:border-emerald-400"
              />
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-3 text-center text-xs text-slate-400">مخاطبی یافت نشد</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onPick(c.id, c.name);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-right text-sm text-slate-700 transition hover:bg-emerald-50"
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.group}</span>
                    </span>
                    {selectedId === c.id && <Check className="size-4 text-emerald-600" />}
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onCreateNew();
              }}
              className="flex w-full items-center gap-1.5 border-t border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <Plus className="size-3.5" />
              ایجاد مخاطب جدید
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function RepField({
  icon: Icon,
  value,
  onChange,
  placeholder,
  dir,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-8 pl-2 text-xs outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100";

function FieldGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        <Icon className="size-3.5 text-emerald-600" />
        {label}
      </label>
      {children}
    </div>
  );
}
