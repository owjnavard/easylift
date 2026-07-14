// پیکربندی فیلدهای هر مرحله از برداشت اطلاعات آسانسور
// هر مرحله دارای فیلدهای اختصاصی خود است که در پنل ورودی نمایش داده می‌شود

export interface StageField {
  key: string; // کلید ذخیره در survey
  label: string; // برچسب فارسی
  unit: string; // واحد
  step?: number; // گام عددی
  placeholder?: string;
}

export interface StageConfig {
  id: number;
  label: string; // نام مرحله
  icon: string; // آیکون emoji
  fields: StageField[];
}

export const SURVEY_STAGES: StageConfig[] = [
  {
    id: 1,
    label: "چاله",
    icon: "⛏️",
    fields: [
      { key: "pitWidth", label: "عرض چاه", unit: "cm", placeholder: "۱۷۰" },
      { key: "pitDepth", label: "عمق چاله", unit: "m", step: 0.1, placeholder: "۱.۶" },
      { key: "pitLength", label: "طول چاله", unit: "cm", placeholder: "۲۱۰" },
      { key: "pitFloorThickness", label: "ضخامت کف چاله", unit: "cm", step: 0.5, placeholder: "۲۰" },
    ],
  },
  {
    id: 2,
    label: "آهنکشی",
    icon: "🔧",
    fields: [
      { key: "ironProfileType", label: "نوع پروفیل", unit: "", placeholder: "UPN ۱۴۰" },
      { key: "ironBeamCount", label: "تعداد تیر", unit: "عدد", placeholder: "۴" },
      { key: "ironBeamSpan", label: "فاصله تیرها", unit: "cm", placeholder: "۸۰" },
      { key: "ironBracketCount", label: "تعداد براکت", unit: "عدد", placeholder: "۱۲" },
    ],
  },
  {
    id: 3,
    label: "ریل",
    icon: "📏",
    fields: [
      { key: "railType", label: "نوع ریل", unit: "", placeholder: "T90" },
      { key: "railCount", label: "تعداد شاخه ریل", unit: "شاخه", placeholder: "۱۲" },
      { key: "railLength", label: "طول هر شاخه", unit: "m", placeholder: "۳" },
      { key: "railBracketSpacing", label: "فاصله براکت‌ها", unit: "m", step: 0.1, placeholder: "۲.۵" },
    ],
  },
  {
    id: 4,
    label: "درب",
    icon: "🚪",
    fields: [
      { key: "doorType", label: "نوع درب", unit: "", placeholder: "اتوماتیک تلسکوپی" },
      { key: "doorWidth", label: "عرض دهانه درب", unit: "cm", placeholder: "۸۰" },
      { key: "doorHeight", label: "ارتفاع درب", unit: "cm", placeholder: "۲۱۰" },
      { key: "doorCount", label: "تعداد درب طبقات", unit: "عدد", placeholder: "۸" },
      { key: "doorGlassThickness", label: "ضخامت شیشه", unit: "mm", step: 0.5, placeholder: "۸" },
    ],
  },
  {
    id: 5,
    label: "کابین",
    icon: "📦",
    fields: [
      { key: "cabinWidth", label: "عرض کابین", unit: "cm", placeholder: "۱۱۰" },
      { key: "cabinDepth", label: "عمق کابین", unit: "cm", placeholder: "۱۴۰" },
      { key: "cabinHeight", label: "ارتفاع کابین", unit: "cm", placeholder: "۲۳۰" },
      { key: "cabinFloorThickness", label: "ضخامت کف کابین", unit: "cm", step: 0.5, placeholder: "۴" },
      { key: "cabinCeilingType", label: "نوع سقف کابین", unit: "", placeholder: "استیل سوراخ‌دار" },
    ],
  },
  {
    id: 6,
    label: "مکانیک",
    icon: "⚙️",
    fields: [
      { key: "motorType", label: "نوع موتور", unit: "", placeholder: "گیرلس" },
      { key: "motorPower", label: "توان موتور", unit: "kW", step: 0.5, placeholder: "۱۱" },
      { key: "ropeDiameter", label: "قطر سیم بکسل", unit: "mm", step: 0.5, placeholder: "۱۰" },
      { key: "ropeCount", label: "تعداد سیم بکسل", unit: "عدد", placeholder: "۶" },
      { key: "counterweightType", label: "نوع پادوزن", unit: "", placeholder: "چدنی" },
    ],
  },
  {
    id: 7,
    label: "راه‌اندازی",
    icon: "✅",
    fields: [
      { key: "panelType", label: "نوع تابلو فرمان", unit: "", placeholder: "VVVF" },
      { key: "panelBrand", label: "برند تابلو", unit: "", placeholder: "آرکل" },
      { key: "buttonType", label: "نوع کلیدها", unit: "", placeholder: "دیجیتال" },
      { key: "emergencyLight", label: "چراغ اضطراری", unit: "", placeholder: "دارد" },
      { key: "alarmSystem", label: "سیستم آلارم", unit: "", placeholder: "دارد" },
    ],
  },
];

export const STAGE_LABELS = SURVEY_STAGES.map((s) => s.label);

// انواع نمای نقشه
export const VIEW_TYPES = [
  { id: "top", label: "نمای بالا" },
  { id: "front", label: "نمای جلو" },
  { id: "right", label: "نمای راست" },
  { id: "left", label: "نمای چپ" },
  { id: "back", label: "نمای پشت" },
  { id: "3d", label: "نمای سه‌بعدی" },
] as const;

export type ViewType = (typeof VIEW_TYPES)[number]["id"];

// انواع نقشه
export const MAP_TYPES = [
  { id: "pit", label: "نقشه چاله", stage: 1 },
  { id: "iron", label: "نقشه آهنکشی", stage: 2 },
  { id: "rail", label: "نقشه ریل‌گذاری", stage: 3 },
  { id: "door", label: "نقشه درب", stage: 4 },
  { id: "cabin", label: "نقشه کابین", stage: 5 },
  { id: "overhead", label: "نقشه اورهد", stage: 1 },
  { id: "shaft", label: "نقشه چاهک", stage: 1 },
  { id: "tunnel-light", label: "نقشه چراغ تونلی", stage: 6 },
] as const;

export type MapType = (typeof MAP_TYPES)[number]["id"];

// فرمت‌های خروجی نقشه
export const EXPORT_FORMATS = [
  { id: "pdf", label: "PDF", icon: "FileText" },
  { id: "dwg", label: "DWG", icon: "Box" },
  { id: "png", label: "PNG", icon: "ImageIcon" },
  { id: "print", label: "چاپ", icon: "Printer" },
] as const;

// کلید پیش‌فرض همه فیلدها (برای مقدار اولیه survey)
export function defaultSurveyValues(): Record<string, number | string> {
  const obj: Record<string, number | string> = {};
  for (const stage of SURVEY_STAGES) {
    for (const f of stage.fields) {
      // تشخیص عددی/متنی بر اساس واحد
      if (f.unit === "" ) {
        obj[f.key] = "";
      } else {
        obj[f.key] = 0;
      }
    }
  }
  // مقادیر پیش‌فرض منطقی برای فیلدهای اصلی
  obj.pitWidth = 170;
  obj.pitDepth = 1.6;
  obj.pitLength = 210;
  obj.floorHeight = 3.2;
  obj.headroom = 3.8;
  return obj;
}
