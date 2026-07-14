// Vendor List — قطعات آسانسور با برندها و قیمت‌ها (ریال)
// ساختار: هر نوع قطعه دارای چند برند با قیمت متفاوت

export interface VendorBrand {
  id: string;
  name: string;
  price: number; // قیمت واحد به ریال
  origin: "ایران" | "آرکل" | "مستورد" | "چین";
  inStock: boolean;
}

export interface PartType {
  id: string; // کلید قطعه
  name: string; // نام فارسی
  unit: string; // واحد شمارش
  icon: string; // نام آیکون lucide
  brands: VendorBrand[];
}

export const PART_CATALOG: PartType[] = [
  {
    id: "motor",
    name: "موتور گیرلس",
    unit: "عدد",
    icon: "cog",
    brands: [
      { id: "arcel-motor", name: "آرکل (ترکیه)", price: 185_000_000, origin: "آرکل", inStock: true },
      { id: "tavan-motor", name: "توان‌فرد (ایران)", price: 142_000_000, origin: "ایران", inStock: true },
      { id: "sinoa-motor", name: "سینوا (ایتالیا)", price: 268_000_000, origin: "مستورد", inStock: true },
    ],
  },
  {
    id: "rail",
    name: "ریل T90",
    unit: "شاخه",
    icon: "align-vertical-justify-center",
    brands: [
      { id: "savadkuh-rail", name: "ساوادکوه (ایران)", price: 4_800_000, origin: "ایران", inStock: true },
      { id: "mehrabadi-rail", name: "مهرآبادی (ایران)", price: 4_200_000, origin: "ایران", inStock: true },
      { id: "imported-rail", name: "مستورد (ترکیه)", price: 7_500_000, origin: "مستورد", inStock: false },
    ],
  },
  {
    id: "cable",
    name: "سیم بکسل",
    unit: "متر",
    icon: "cable",
    brands: [
      { id: "karaj-cable", name: "کرج‌کابل (ایران)", price: 320_000, origin: "ایران", inStock: true },
      { id: "tehran-cable", name: "تهران‌کابل (ایران)", price: 295_000, origin: "ایران", inStock: true },
    ],
  },
  {
    id: "door",
    name: "درب اتوماتیک طبقات",
    unit: "ست",
    icon: "door-closed",
    brands: [
      { id: "arcel-door", name: "آرکل (ترکیه)", price: 38_000_000, origin: "آرکل", inStock: true },
      { id: "aria-door", name: "آریا (ایران)", price: 24_500_000, origin: "ایران", inStock: true },
      { id: "tlt-door", name: "TLT (آلمان)", price: 52_000_000, origin: "مستورد", inStock: true },
    ],
  },
  {
    id: "cabin",
    name: "کابین",
    unit: "عدد",
    icon: "square-stack",
    brands: [
      { id: "arcel-cabin", name: "آرکل (ترکیه)", price: 95_000_000, origin: "آرکل", inStock: true },
      { id: "domestic-cabin", name: "ساخت داخل", price: 62_000_000, origin: "ایران", inStock: true },
    ],
  },
  {
    id: "panel",
    name: "تابلو فرمان",
    unit: "عدد",
    icon: "cpu",
    brands: [
      { id: "arcel-panel", name: "آرکل (ترکیه)", price: 48_000_000, origin: "آرکل", inStock: true },
      { id: "delta-panel", name: "دلتا (ایران)", price: 32_000_000, origin: "ایران", inStock: true },
      { id: "ilia-panel", name: "ایلیا (ایران)", price: 28_000_000, origin: "ایران", inStock: true },
    ],
  },
  {
    id: "shoe",
    name: "کفشک راهنما",
    unit: "عدد",
    icon: "circle-dot",
    brands: [
      { id: "arcel-shoe", name: "آرکل (ترکیه)", price: 1_800_000, origin: "آرکل", inStock: true },
      { id: "nn-shoe", name: "NN (چین)", price: 980_000, origin: "چین", inStock: true },
    ],
  },
  {
    id: "button",
    name: "کلیدهای کابین و طبقات",
    unit: "ست",
    icon: "grid-2x2",
    brands: [
      { id: "arcel-button", name: "آرکل (ترکیه)", price: 2_400_000, origin: "آرکل", inStock: true },
      { id: "gate-button", name: "گیت (ایران)", price: 1_650_000, origin: "ایران", inStock: true },
    ],
  },
];

export const PART_MAP: Record<string, PartType> = Object.fromEntries(
  PART_CATALOG.map((p) => [p.id, p])
);

export function findBrand(partId: string, brandId: string): VendorBrand | undefined {
  return PART_MAP[partId]?.brands.find((b) => b.id === brandId);
}

// قالب‌بندی مبلغ به ریال (با جداکننده هزارگان فارسی)
export function formatRial(n: number): string {
  if (!isFinite(n)) return "۰";
  return n.toLocaleString("fa-IR") + " ریال";
}

// قالب‌بندی فشرده (میلیارد/میلیون)
export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toLocaleString("fa-IR", { maximumFractionDigits: 1 }) + "B";
  }
  if (n >= 1_000_000) {
    return (n / 1_000_000).toLocaleString("fa-IR", { maximumFractionDigits: 0 }) + "M";
  }
  return n.toLocaleString("fa-IR");
}
