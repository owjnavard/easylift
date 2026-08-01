"use client";

import { useState } from "react";
import { X, CheckCircle2, ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StocktakingItem {
  code: string;
  name: string;
  systemQty: string;
  physicalQty: string;
  unit: string;
  note: string;
}

export interface StocktakingDraft {
  warehouse: string;
  supervisor: string;
  date: string;
  items: StocktakingItem[];
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

function Input({ id, value, onChange, placeholder, dir, error, className }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; dir?: "ltr" | "rtl"; error?: string; className?: string }) {
  return (
    <>
      <input
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} dir={dir}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2",
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-amber-400 focus:ring-amber-100",
          className
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
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-amber-400 focus:ring-amber-100"
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

const emptyItem = (): StocktakingItem => ({ code: "", name: "", systemQty: "", physicalQty: "", unit: "عدد", note: "" });

export function StocktakingForm({
  open, onClose, onSave,
}: { open: boolean; onClose: () => void; onSave: (draft: StocktakingDraft) => void }) {
  const [warehouse, setWarehouse] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState<StocktakingItem[]>([emptyItem()]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const updateItem = (idx: number, field: keyof StocktakingItem, val: string) => {
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, [field]: val } : it));
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (idx: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!warehouse) e.warehouse = "انبار الزامی است";
    if (!date) e.date = "تاریخ الزامی است";
    const hasEmpty = items.some((it) => !it.code.trim() || !it.name.trim() || !it.physicalQty.trim());
    if (hasEmpty) e.items = "کد، نام و موجودی فیزیکی برای همه اقلام الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ warehouse, supervisor, date, items, notes });
    setSaved(true);
    setTimeout(() => { setSaved(false); reset(); onClose(); }, 900);
  };

  const reset = () => {
    setWarehouse(""); setSupervisor(""); setDate(""); setItems([emptyItem()]); setNotes(""); setErrors({});
  };

  const handleClose = () => { reset(); onClose(); };

  /* difference indicator */
  const diff = (item: StocktakingItem): { value: number; positive: boolean } | null => {
    const sys = parseFloat(item.systemQty);
    const phy = parseFloat(item.physicalQty);
    if (isNaN(sys) || isNaN(phy)) return null;
    return { value: phy - sys, positive: phy >= sys };
  };

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={handleClose} aria-hidden="true"
      />
      <aside
        role="dialog" aria-modal="true" aria-label="انبارگردانی"
        className={cn("fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "translate-x-full")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <ClipboardCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">انبارگردانی</h2>
              <p className="text-xs text-slate-500">ثبت موجودی فیزیکی و تطبیق با سیستم</p>
            </div>
          </div>
          <button onClick={handleClose} className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="بستن">
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form id="stocktaking-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5" noValidate>
          <div className="space-y-5">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="st-wh" required>انبار</Label>
                <Select id="st-wh" value={warehouse} onChange={setWarehouse} options={WAREHOUSES} placeholder="انتخاب انبار..." error={errors.warehouse} />
              </div>
              <div>
                <Label htmlFor="st-date" required>تاریخ انبارگردانی</Label>
                <Input id="st-date" value={date} onChange={setDate} placeholder="۱۴۰۳/۰۱/۰۱" dir="ltr" error={errors.date} />
              </div>
            </div>

            <div>
              <Label htmlFor="st-sup">مسئول انبارگردانی</Label>
              <Input id="st-sup" value={supervisor} onChange={setSupervisor} placeholder="نام مسئول..." />
            </div>

            {/* Items list */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600">اقلام کالا <span className="text-rose-500">*</span></p>
                <button
                  type="button" onClick={addItem}
                  className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                >
                  <Plus className="size-3.5" />
                  افزودن قلم
                </button>
              </div>

              {errors.items && <p className="mb-2 text-xs text-rose-500">{errors.items}</p>}

              <div className="space-y-3">
                {items.map((item, idx) => {
                  const d = diff(item);
                  return (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">قلم {(idx + 1).toLocaleString("fa-IR")}</span>
                        {items.length > 1 && (
                          <button type="button" onClick={() => removeItem(idx)} className="grid size-6 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500">کد کالا</label>
                          <input
                            value={item.code} onChange={(e) => updateItem(idx, "code", e.target.value)}
                            placeholder="IT-001" dir="ltr"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500">نام کالا</label>
                          <input
                            value={item.name} onChange={(e) => updateItem(idx, "name", e.target.value)}
                            placeholder="نام کالا..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500">موجودی سیستم</label>
                          <input
                            value={item.systemQty} onChange={(e) => updateItem(idx, "systemQty", e.target.value)}
                            placeholder="۰" dir="ltr"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500">موجودی فیزیکی</label>
                          <input
                            value={item.physicalQty} onChange={(e) => updateItem(idx, "physicalQty", e.target.value)}
                            placeholder="۰" dir="ltr"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-slate-500">واحد</label>
                          <select
                            value={item.unit} onChange={(e) => updateItem(idx, "unit", e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                          >
                            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        {d !== null && (
                          <div className="flex items-end">
                            <span className={cn(
                              "w-full rounded-lg px-2.5 py-2 text-center text-xs font-bold",
                              d.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                            )}>
                              اختلاف: {d.value > 0 ? "+" : ""}{d.value} {item.unit}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <input
                          value={item.note} onChange={(e) => updateItem(idx, "note", e.target.value)}
                          placeholder="یادداشت این قلم..."
                          className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="st-notes">توضیحات کلی</Label>
              <textarea
                id="st-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                placeholder="توضیحات کلی انبارگردانی..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {saved ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 py-3 text-sm font-semibold text-amber-700">
              <CheckCircle2 className="size-5" />
              انبارگردانی ثبت شد
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                انصراف
              </button>
              <button type="submit" form="stocktaking-form" className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98]">
                ثبت انبارگردانی
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
