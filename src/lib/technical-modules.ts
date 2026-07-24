// پیکربندی ماژول‌های بخش فنی و مهندسی

// ===== ماژول ۲: محاسبات تعداد و نوع کالا =====

export interface ElevatorType {
  id: string;
  label: string;
  capacity: string;
  speed: string;
}

// انواع آسانسور برای dropdown
export const ELEVATOR_TYPES: ElevatorType[] = [
  { id: "passenger-6", label: "مسافربری ۶ نفر", capacity: "۴۵۰ کیلوگرم", speed: "1.0 m/s" },
  { id: "passenger-8", label: "مسافربری ۸ نفر", capacity: "۶۰۰ کیلوگرم", speed: "1.0 m/s" },
  { id: "passenger-10", label: "مسافربری ۱۰ نفر", capacity: "۷۵۰ کیلوگرم", speed: "1.6 m/s" },
  { id: "passenger-13", label: "مسافربری ۱۳ نفر", capacity: "۱۰۰۰ کیلوگرم", speed: "1.6 m/s" },
  { id: "passenger-16", label: "مسافربری ۱۶ نفر", capacity: "۱۲۰۰ کیلوگرم", speed: "1.6 m/s" },
  { id: "passenger-21", label: "مسافربری ۲۱ نفر", capacity: "۱۶۰۰ کیلوگرم", speed: "2.0 m/s" },
  { id: "cargo", label: "باربری", capacity: "۲۰۰۰ کیلوگرم", speed: "0.5 m/s" },
  { id: "stretcher", label: "برانکاردی", capacity: "۶۰۰ کیلوگرم", speed: "1.0 m/s" },
  { id: "panorama", label: "پانوراما", capacity: "۱۰۰۰ کیلوگرم", speed: "1.6 m/s" },
];

export interface PartCalcItem {
  id: string;
  partName: string;
  unit: string;
  formula: string; // فرمول محاسبه
  surveyFields: string[]; // فیلدهای برداشت اطلاعات که در فرمول استفاده می‌شوند
}

// فیلدهای برداشت اطلاعات موجود (برای انتخاب در فرمول)
export const SURVEY_FIELD_OPTIONS = [
  { value: "pitWidth", label: "عرض چاه" },
  { value: "pitDepth", label: "عمق چاله" },
  { value: "pitLength", label: "طول چاله" },
  { value: "floorHeight", label: "ارتفاع طبقه" },
  { value: "headroom", label: "ارتفاع اورهد" },
  { value: "floors", label: "تعداد طبقات" },
  { value: "elevatorCount", label: "تعداد آسانسور" },
  { value: "cabinWidth", label: "عرض کابین" },
  { value: "cabinDepth", label: "عمق کابین" },
  { value: "cabinHeight", label: "ارتفاع کابین" },
  { value: "doorWidth", label: "عرض درب" },
  { value: "doorHeight", label: "ارتفاع درب" },
  { value: "doorCount", label: "تعداد درب" },
  { value: "railType", label: "نوع ریل" },
  { value: "railLength", label: "طول ریل" },
];

// ===== ماژول ۳: محاسبات استاندارد =====

export interface StandardCalcType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

// انواع محاسبات استاندارد
export const STANDARD_CALC_TYPES: StandardCalcType[] = [
  {
    id: "overhead",
    label: "اورهد",
    icon: "📏",
    description: "محاسبه ارتفاع اورهد بر اساس سرعت و نوع ترمز",
  },
  {
    id: "pit",
    label: "پیت",
    icon: "⬇️",
    description: "محاسبه عمق چاله بر اساس سرعت و ظرفیت",
  },
  {
    id: "cabin-capacity",
    label: "ظرفیت کابین",
    icon: "📦",
    description: "محاسبه ظرفیت کابین بر اساس مساحت کف",
  },
  {
    id: "rail",
    label: "ریل",
    icon: "🛤️",
    description: "محاسبه نوع و تعداد ریل بر اساس بار و ارتفاع",
  },
  {
    id: "rope",
    label: "سیم بکسل",
    icon: "🔗",
    description: "محاسبه قطر و تعداد سیم بکسل",
  },
  {
    id: "motor",
    label: "موتور",
    icon: "⚙️",
    description: "محاسبه توان موتور بر اساس ظرفیت و سرعت",
  },
  {
    id: "alpha-angle",
    label: "زاویه آلفا",
    icon: "📐",
    description: "محاسبه زاویه آلفای سیم بکسل",
  },
];

export interface StandardCondition {
  id: string;
  param: string;
  operator: string;
  value: string;
  result: string;
  unit: string;
}
