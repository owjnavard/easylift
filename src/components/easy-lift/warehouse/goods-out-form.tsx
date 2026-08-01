"use client";

import { useState } from "react";
import { X, CheckCircle2, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export type GoodsOutType = "فروش" | "امانی" | "مصرف" | "تولید" | "برگشت کالا";
const OUT_TYPES: GoodsOutType[] = ["فروش", "امانی", "مصرف", "تولید", "برگشت کالا"];

export interface GoodsOutDraft {
  type: GoodsOutType;
  code: string;
  name: string;
  quantity: string;
  unit: string;
  warehouse: string;
  receiver: string;
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
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
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
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
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

export function GoodsOutForm({
  open, onClose, onSave,
}: { open: boolean; onClose: () => void; onSave: (draft: GoodsOutDraft) => void }) {
  const [type, setType] = useState<GoodsOutType>("فروش");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("عدد");
  const [warehouse, setWarehouse] = useState("");
  const [receiver, setReceiver] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!code.trim()) e.code = "کد کالا الزامی است";
    if (!name.trim()) e.name = "نام کالا الزامی است";
    if (!quantity.trim() || isNaN(Number(quantity))) e.quantity = "مقدار معتبر وارد کنید";
    if (!warehouse) e.warehouse = "انبار را انتخاب کنید";
    if (!date) e.date = "تاریخ الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ type, code, name, quantity, unit, warehouse, receiver, date, notes });
    setSaved(true);
    setTimeout(() => { setSaved(false); reset(); onClose(); }, 900);
  };

  const reset = () => {
    setType("فروش"); setCode(""); setName(""); setQuantity(""); setUnit("عدد");
    setWarehouse(""); setReceiver(""); setDate(""); setNotes(""); setErrors({});
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={handleClose} aria-hidden="true"
      />
      <aside
        role="dialog" aria-modal="true" aria-label="خروج کالا"
        className={cn("fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600">
              <Truck className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">خروج کالا</h2>
              <p className="text-xs text-slate-500">ثبت حواله خروج از انبار</p>
            </div>
          </div>
          <button onClick={handleClose} className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="بستن">
            <X className="size-4" />
          </button>
        </div>

        {/* Type tabs */}
        <div className="shrink-0 border-b border-slate-100 px-5 py-3">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {OUT_TYPES.map((t) => (
              <button
                key={t} type="button" onClick={() => setType(t)}
                className={cn(
                  "flex-1 rounded-lg py-1.5 text-[11px] font-bold transition",
                  type === t ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form id="goods-out-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5" noValidate>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="go-code" required>کد کالا</Label>
                <Input id="go-code" value={code} onChange={setCode} placeholder="IT-001" dir="ltr" error={errors.code} />
              </div>
              <div>
                <Label htmlFor="go-name" required>نام کالا</Label>
                <Input id="go-name" value={name} onChange={setName} placeholder="موتور گیرلس" error={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="go-qty" required>مقدار</Label>
                <Input id="go-qty" value={quantity} onChange={setQuantity} placeholder="۰" dir="ltr" error={errors.quantity} />
              </div>
              <div>
                <Label htmlFor="go-unit">واحد</Label>
                <Select id="go-unit" value={unit} onChange={setUnit} options={UNITS} />
              </div>
            </div>

            <div>
              <Label htmlFor="go-wh" required>انبار مبدا</Label>
              <Select id="go-wh" value={warehouse} onChange={setWarehouse} options={WAREHOUSES} placeholder="انتخاب انبار..." error={errors.warehouse} />
            </div>

            {(type === "فروش" || type === "امانی") && (
              <div>
                <Label htmlFor="go-recv">تحویل‌گیرنده / طرف حساب</Label>
                <Input id="go-recv" value={receiver} onChange={setReceiver} placeholder="نام شرکت یا فرد..." />
              </div>
            )}

            <div>
              <Label htmlFor="go-date" required>تاریخ خروج</Label>
              <Input id="go-date" value={date} onChange={setDate} placeholder="۱۴۰۳/۰۱/۰۱" dir="ltr" error={errors.date} />
            </div>

            <div>
              <Label htmlFor="go-notes">توضیحات</Label>
              <textarea
                id="go-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="توضیحات اضافه..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {saved ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-sm font-semibold text-rose-700">
              <CheckCircle2 className="size-5" />
              حواله خروج ثبت شد
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                انصراف
              </button>
              <button type="submit" form="goods-out-form" className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.98]">
                ثبت خروج
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
