"use client";

import { useState, useRef, useCallback } from "react";
import {
  X,
  CheckCircle2,
  ImagePlus,
  Trash2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface ProductDraft {
  code: string;
  name: string;
  category: string;
  unit: string;
  imageDataUrl: string | null;
  notes: string;
}

const CATEGORIES = [
  "انتخاب کنید",
  "موتور و محرک",
  "ریل و قاب",
  "تابلو فرمان",
  "کابین و بدنه",
  "قطعات ایمنی",
  "سیم و کابل",
  "روغن و مواد",
  "سایر",
];

const UNITS = [
  "انتخاب کنید",
  "عدد",
  "متر",
  "کیلوگرم",
  "لیتر",
  "جفت",
  "دست",
  "بسته",
  "رول",
];

/* ------------------------------------------------------------------ */
/* Field helpers                                                       */
/* ------------------------------------------------------------------ */
function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-slate-600">
      {children}
      {required && <span className="mr-0.5 text-rose-500">*</span>}
    </label>
  );
}

function FieldInput({
  id,
  value,
  onChange,
  placeholder,
  error,
  dir,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
        )}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </>
  );
}

function FieldSelect({
  id,
  value,
  onChange,
  options,
  error,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  return (
    <>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2",
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"
        )}
      >
        {options.map((o) => (
          <option key={o} value={o === "انتخاب کنید" ? "" : o} disabled={o === "انتخاب کنید"}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ProductForm                                                         */
/* ------------------------------------------------------------------ */
export function ProductForm({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (product: ProductDraft) => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  /* image pick */
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  /* drop zone */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  /* validate */
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!code.trim()) errs.code = "کد کالا الزامی است";
    if (!name.trim()) errs.name = "نام کالا الزامی است";
    if (!category) errs.category = "دسته‌بندی را انتخاب کنید";
    if (!unit) errs.unit = "واحد را انتخاب کنید";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ code, name, category, unit, imageDataUrl, notes });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      reset();
      onClose();
    }, 900);
  };

  const reset = () => {
    setCode(""); setName(""); setCategory(""); setUnit("");
    setImageDataUrl(null); setNotes(""); setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="ثبت کالای جدید"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Package className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">ثبت کالای جدید</h2>
              <p className="text-xs text-slate-500">اطلاعات کالا را وارد کنید</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="بستن"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form
          id="product-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 py-5"
          noValidate
        >
          <div className="space-y-5">
            {/* Row: code + name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="p-code" required>کد کالا</Label>
                <FieldInput
                  id="p-code"
                  value={code}
                  onChange={setCode}
                  placeholder="IT-001"
                  dir="ltr"
                  error={errors.code}
                />
              </div>
              <div>
                <Label htmlFor="p-name" required>نام کالا</Label>
                <FieldInput
                  id="p-name"
                  value={name}
                  onChange={setName}
                  placeholder="موتور گیرلس"
                  error={errors.name}
                />
              </div>
            </div>

            {/* Row: category + unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="p-cat" required>دسته‌بندی</Label>
                <FieldSelect
                  id="p-cat"
                  value={category}
                  onChange={setCategory}
                  options={CATEGORIES}
                  error={errors.category}
                />
              </div>
              <div>
                <Label htmlFor="p-unit" required>واحد</Label>
                <FieldSelect
                  id="p-unit"
                  value={unit}
                  onChange={setUnit}
                  options={UNITS}
                  error={errors.unit}
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <Label htmlFor="p-image">تصویر کالا</Label>
              {imageDataUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageDataUrl}
                    alt="تصویر کالا"
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageDataUrl(null)}
                    className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-rose-600 shadow-sm backdrop-blur-sm transition hover:bg-rose-50"
                  >
                    <Trash2 className="size-3" />
                    حذف
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <ImagePlus className="size-8 text-slate-300" />
                  <p className="text-xs text-slate-500">
                    کلیک کنید یا تصویر را اینجا بکشید
                  </p>
                  <p className="text-[11px] text-slate-400">PNG، JPG — حداکثر ۵MB</p>
                </div>
              )}
              <input
                ref={fileRef}
                id="p-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={handleFile}
              />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="p-notes">توضیحات / یادداشت</Label>
              <textarea
                id="p-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="هر توضیح اضافه‌ای درباره کالا..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 py-4">
          {saved ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="size-5" />
              کالا با موفقیت ثبت شد
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                form="product-form"
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                ثبت کالا
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
