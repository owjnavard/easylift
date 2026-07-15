// پیکربندی گروه‌های مخاطبین

export interface ContactGroup {
  id: string;
  label: string;
  icon: string; // آیکون emoji
}

// گروه‌های پیش‌فرض — با قابلیت اضافه کردن گروه جدید
export const DEFAULT_GROUPS: ContactGroup[] = [
  { id: "customer", label: "مشتری", icon: "👤" },
  { id: "supplier", label: "تأمین‌کننده", icon: "🏭" },
  { id: "contractor", label: "پیمانکار", icon: "👷" },
  { id: "staff", label: "پرسنل", icon: "🧑‍💼" },
  { id: "marketer", label: "بازاریاب", icon: "📣" },
];

// نوع شخص
export type PersonType = "individual" | "legal";

export const PERSON_TYPE_LABELS: Record<PersonType, string> = {
  individual: "حقیقی",
  legal: "حقوقی",
};

// تب‌های اطلاعات مخاطب (نوار ابزار)
export interface ContactTab {
  id: string;
  label: string;
  icon: string; // نام آیکون lucide
}

export const CONTACT_TABS: ContactTab[] = [
  { id: "info", label: "اطلاعات", icon: "info" },
  { id: "bank", label: "اطلاعات بانکی", icon: "credit-card" },
  { id: "phone", label: "تلفن", icon: "phone" },
  { id: "address", label: "آدرس", icon: "home" },
  { id: "docs", label: "مدارک", icon: "file-text" },
];
