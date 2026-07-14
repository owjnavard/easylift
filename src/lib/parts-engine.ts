// موتور محاسبه قطعات — فرمول‌های ثبت‌شده
// ورودی: اطلاعات برداشت آسانسور → خروجی: تعداد هر قطعه

export interface SurveyData {
  pitWidth: number; // عرض چاه (سانتی‌متر)
  pitDepth: number; // عمق چاله (متر)
  floorHeight: number; // ارتفاع هر طبقه (متر)
  headroom: number; // ارتفاع اورهد (متر)
}

export interface BuildingInfo {
  floors: number; // تعداد طبقات
  unitsPerFloor: number; // تعداد واحد در هر طبقه
  elevatorCount: number; // تعداد دستگاه آسانسور
}

export interface PartRequirement {
  partId: string;
  qty: number;
  formula: string; // توضیح فرمول محاسبه
}

const RAIL_SEGMENT = 3; // طول هر شاخه ریل (متر)

/**
 * محاسبه قطعات موردنیاز بر اساس فرمول‌های فنی ثبت‌شده.
 * این تابع مرجع واحد محاسبه است و در صدور پیش‌فاکتور استفاده می‌شود.
 */
export function computeParts(
  building: BuildingInfo,
  survey: SurveyData
): PartRequirement[] {
  const { floors, elevatorCount } = building;
  const { floorHeight, pitDepth, headroom } = survey;

  // ارتفاع کل سفر = تعداد طبقات × ارتفاع طبقه
  const travel = floors * floorHeight;
  // طول ریل هر مسیر = سفر + عمق چاله + اورهد؛ دو مسیر ریل
  const railTotalLength = (travel + pitDepth + headroom) * 2;
  const railCount = Math.ceil(railTotalLength / RAIL_SEGMENT);
  // طول سیم بکسل = ۲ × ارتفاع سفر (بازگشت + رفت)
  const cableLength = travel * 2;
  // تعداد کلیدها: (طبقات + توقف پایین/بالا) × آسانسور
  const buttonSets = (floors + 1) * elevatorCount;
  // کفشک: ۴ عدد به ازای هر آسانسور
  const shoeCount = 4 * elevatorCount;

  return [
    {
      partId: "motor",
      qty: elevatorCount,
      formula: `۱ عدد به ازای هر آسانسور (${elevatorCount} دستگاه)`,
    },
    {
      partId: "rail",
      qty: railCount,
      formula: `۲ مسیر × (سفر ${travel}م + چاله ${pitDepth}م + اورهد ${headroom}م) ÷ شاخه ${RAIL_SEGMENT}م = ${railTotalLength}م`,
    },
    {
      partId: "cable",
      qty: cableLength,
      formula: `۲ × ارتفاع سفر (${travel}م)`,
    },
    {
      partId: "door",
      qty: floors * elevatorCount,
      formula: `${floors} طبقه × ${elevatorCount} آسانسور`,
    },
    {
      partId: "cabin",
      qty: elevatorCount,
      formula: `۱ عدد به ازای هر آسانسور`,
    },
    {
      partId: "panel",
      qty: elevatorCount,
      formula: `۱ عدد به ازای هر آسانسور`,
    },
    {
      partId: "shoe",
      qty: shoeCount,
      formula: `۴ عدد × ${elevatorCount} آسانسور`,
    },
    {
      partId: "button",
      qty: buttonSets,
      formula: `(طبقات ${floors} + ۱) × ${elevatorCount} آسانسور`,
    },
  ];
}
