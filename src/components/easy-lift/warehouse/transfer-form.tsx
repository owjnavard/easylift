"use client";

import { useState } from "react";
import { X, CheckCircle2, ArrowRightLeft, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TransferDraft {
  code: string;
  name: string;
  quantity: string;
  unit: string;
  fromWarehouse: string;
  toWarehouse: string;
  carrier: string;
  date: string;
  notes: string;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-slate-600">
      {children}
      {required && <span className="mr-0.5 text-rose-500">*</span>}
    </label>
  );
}

function Input({ id, value, onChange, placeholder, dir, error }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: "ltr" | "rtl"; error?: string }) {
  return (
    <>
      <input
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} dir={dir}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2",
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
        )}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </>
  );
}

function Select({ id, value, onChange, options, placeholder, error }: { id: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; error?: string }) {
  return (
    <>
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2",
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-sky-400 focus:ring-sky-100"
        )}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </>
  );
}

const WAREHOUSES = ["انبار مرکزی", "انبار شعبه تهران", "انبار شعبه اصفهان", "انبار موقت"];
const UNITS = ["عدد", "متر", "کیلوگرم", "لیتر", "جفت", "دست", "بسته", "رول"];

export function TransferForm({
  open, onClose, onSave,
}: { open: boolean; onClose: () => void; onSave: (draft: TransferDraft) => void }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("عدد");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [carrier, setCarrier] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = "کد کالا الزامی است";
    if (!name.trim()) e.name = "نام کالا الزامی است";
    if (!quantity.trim() || isNaN(Number(quantity))) e.quantity = "مقدار معتبر وارد کنید";
    if (!fromWarehouse) e.fromWarehouse = "انبار مبدا الزامی است";
    if (!toWarehouse) e.toWarehouse = "انبار مقصد الزامی است";
    if (fromWarehouse && toWarehouse && fromWarehouse === toWarehouse) e.toWarehouse = "انبار مبدا و مقصد نباید یکسان باشند";
    if (!date) e.date = "تاریخ الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ code, name, quantity, unit, fromWarehouse, toWarehouse, carrier, date, notes });
    setSaved(true);
    setTimeout(() => { setSaved(false); reset(); onClose(); }, 900);
  };

  const reset = () => {
    setCode(""); setName(""); setQuantity(""); setUnit("عدد");
    setFromWarehouse(""); setToWarehouse(""); setCarrier(""); setDate(""); setNotes(""); setErrors({});
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={handleClose} aria-hidden="true"
      />
      <aside
        role="dialog" aria-modal="true" aria-label="انتقال کالا"
        className={cn("fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <ArrowRightLeft className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">انتقال کالا</h2>
              <p className="text-xs text-slate-500">جابجایی کالا بین انبارها</p>
            </div>
          </div>
          <button onClick={handleClose} className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="بستن">
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form id="transfer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5" noValidate>
          <div className="space-y-5">
            {/* Warehouse selector — visual arrow */}
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-600">مسیر انتقال <span className="text-rose-500">*</span></p>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Select id="tf-from" value={fromWarehouse} onChange={setFromWarehouse} options={WAREHOUSES} placeholder="انبار مبدا..." error={errors.fromWarehouse} />
                </div>
                <div className="flex shrink-0 items-center pt-2.5">
                  <ArrowLeft className="size-5 text-sky-400" />
                </div>
                <div className="flex-1">
                  <Select id="tf-to" value={toWarehouse} onChange={setToWarehouse} options={WAREHOUSES} placeholder="انبار مقصد..." error={errors.toWarehouse} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tf-code" required>کد کالا</Label>
                <Input id="tf-code" value={code} onChange={setCode} placeholder="IT-001" dir="ltr" error={errors.code} />
              </div>
              <div>
                <Label htmlFor="tf-name" required>نام کالا</Label>
                <Input id="tf-name" value={name} onChange={setName} placeholder="موتور گیرلس" error={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tf-qty" required>مقدار</Label>
                <Input id="tf-qty" value={quantity} onChange={setQuantity} placeholder="۰" dir="ltr" error={errors.quantity} />
              </div>
              <div>
                <Label htmlFor="tf-unit">واحد</Label>
                <Select id="tf-unit" value={unit} onChange={setUnit} options={UNITS} />
              </div>
            </div>

            <div>
              <Label htmlFor="tf-carrier">مسئول انتقال</Label>
              <Input id="tf-carrier" value={carrier} onChange={setCarrier} placeholder="نام راننده یا مسئول..." />
            </div>

            <div>
              <Label htmlFor="tf-date" required>تاریخ انتقال</Label>
              <Input id="tf-date" value={date} onChange={setDate} placeholder="۱۴۰۳/۰۱/۰۱" dir="ltr" error={errors.date} />
            </div>

            <div>
              <Label htmlFor="tf-notes">توضیحات</Label>
              <textarea
                id="tf-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="توضیحات اضافه..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {saved ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-sky-50 py-3 text-sm font-semibold text-sky-700">
              <CheckCircle2 className="size-5" />
              انتقال کالا ثبت شد
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                انصراف
              </button>
              <button type="submit" form="transfer-form" className="flex-1 rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.98]">
                ثبت انتقال
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
