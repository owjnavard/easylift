import { create } from "zustand";
import type { BuildingInfo, SurveyData, PartRequirement } from "./parts-engine";
import { computeParts } from "./parts-engine";

export type Stage = 1 | 2 | 3 | 4 | 5;
export type RequesterType = "marketer" | "customer" | "internal";
export type ProjectStatus = "draft" | "active";

export interface PartLine {
  partId: string;
  qty: number;
  brandId: string | null;
  formula: string;
}

export interface ExtraCost {
  id: string;
  label: string;
  amount: number;
}

export interface ContractData {
  commitments: string; // تعهدات طرفین
  conditions: string; // شرایط قرارداد
  duration: string; // مدت اجرا
  prepayment: number; // پیش‌پرداخت (ریال)
  paymentTerms: string; // شرایط پرداخت
  finalSpecs: string; // مشخصات نهایی پروژه
}

export interface HistoryEntry {
  id: string;
  at: string; // ISO
  actor: string;
  action: string;
  detail?: string;
  stage: Stage;
}

export interface QuotationRequest {
  id: string;
  code: string; // PF-xxxxx
  stage: Stage;
  status: ProjectStatus;
  requester: RequesterType;
  requesterName: string;
  // مرحله ۱
  customer: string;
  address: string;
  buildingType: string;
  building: BuildingInfo;
  createdAt: string;
  // مرحله ۲
  survey?: SurveyData;
  surveyNote?: string;
  // مرحله ۳
  parts: PartLine[];
  extras: ExtraCost[];
  profitPercent: number;
  discountAmount: number;
  issuedAt?: string;
  approvedByCustomer: boolean;
  // مرحله ۴
  contract?: ContractData;
  contractSignedAt?: string;
  // مرحله ۵
  activatedAt?: string;
  history: HistoryEntry[];
}

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

function seed(): QuotationRequest[] {
  const mk = (
    code: string,
    stage: Stage,
    customer: string,
    floors: number,
    elev: number,
    requester: RequesterType
  ): QuotationRequest => ({
    id: uid(),
    code,
    stage,
    status: stage >= 5 ? "active" : "draft",
    requester,
    requesterName: requester === "customer" ? customer : "احمدی",
    customer,
    address: "تهران، شهرک غرب",
    buildingType: "مسکونی",
    building: { floors, unitsPerFloor: 4, elevatorCount: elev },
    createdAt: now(),
    parts: [],
    extras: [],
    profitPercent: 18,
    discountAmount: 0,
    approvedByCustomer: false,
    history: [
      { id: uid(), at: now(), actor: "احمدی", action: "ثبت درخواست پیش‌فاکتور", stage: 1 },
    ],
  });

  const r1 = mk("PF-14025", 3, "شرکت پارسیان", 12, 4, "marketer");
  r1.survey = { pitWidth: 170, pitDepth: 1.6, floorHeight: 3.2, headroom: 3.8 };
  r1.parts = computeParts(r1.building, r1.survey).map((p) => ({
    ...p,
    brandId: null,
  }));
  r1.history.push({ id: uid(), at: now(), actor: "مدیر فنی", action: "برداشت اطلاعات تکمیل شد", stage: 2 });

  const r2 = mk("PF-14024", 1, "برج الماس", 8, 2, "internal");
  const r3 = mk("PF-14023", 5, "سپهر گروپ", 6, 1, "customer");
  r3.status = "active";
  r3.activatedAt = now();

  return [r1, r2, r3];
}

interface QuotationsState {
  requests: QuotationRequest[];
  selectedId: string | null;
  select: (id: string | null) => void;
  createRequest: (input: {
    requester: RequesterType;
    requesterName: string;
    customer: string;
    address: string;
    buildingType: string;
    building: BuildingInfo;
  }) => string;
  updateRequest: (id: string, patch: Partial<QuotationRequest>) => void;
  saveSurvey: (id: string, survey: SurveyData, note?: string) => void;
  recomputeParts: (id: string) => void;
  setPartBrand: (id: string, partId: string, brandId: string | null) => void;
  addExtra: (id: string, label: string, amount: number) => void;
  removeExtra: (id: string, extraId: string) => void;
  setProfit: (id: string, percent: number) => void;
  setDiscount: (id: string, amount: number) => void;
  approveByCustomer: (id: string) => void;
  saveContract: (id: string, contract: ContractData) => void;
  signContract: (id: string) => void;
  activate: (id: string) => void;
  goToStage: (id: string, stage: Stage) => void;
  log: (id: string, actor: string, action: string, detail?: string) => void;
}

function nextCode(reqs: QuotationRequest[]): string {
  const max = reqs.reduce((m, r) => {
    const n = parseInt(r.code.replace(/\D/g, ""), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 14000);
  return `PF-${max + 1}`;
}

export const useQuotations = create<QuotationsState>((set, get) => ({
  requests: seed(),
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  createRequest: (input) => {
    const id = uid();
    const code = nextCode(get().requests);
    const req: QuotationRequest = {
      id,
      code,
      stage: 1,
      status: "draft",
      requester: input.requester,
      requesterName: input.requesterName,
      customer: input.customer,
      address: input.address,
      buildingType: input.buildingType,
      building: input.building,
      createdAt: now(),
      parts: [],
      extras: [],
      profitPercent: 18,
      discountAmount: 0,
      approvedByCustomer: false,
      history: [
        {
          id: uid(),
          at: now(),
          actor: input.requesterName,
          action: "ثبت درخواست پیش‌فاکتور",
          detail: `مشتری: ${input.customer}`,
          stage: 1,
        },
      ],
    };
    set((s) => ({ requests: [req, ...s.requests], selectedId: id }));
    return id;
  },
  updateRequest: (id, patch) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    })),
  saveSurvey: (id, survey, note) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    // محاسبه قطعات بر اساس فرمول‌ها
    const computed: PartRequirement[] = computeParts(req.building, survey);
    // حفظ برندهای انتخابی قبلی اگر قطعه موجود باشد
    const parts: PartLine[] = computed.map((p) => {
      const existing = req.parts.find((x) => x.partId === p.partId);
      return {
        partId: p.partId,
        qty: p.qty,
        brandId: existing?.brandId ?? null,
        formula: p.formula,
      };
    });
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              survey,
              surveyNote: note,
              parts,
              stage: Math.max(r.stage, 2) as Stage,
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "مدیر فنی",
                  action: "ثبت برداشت اطلاعات آسانسور",
                  detail: `${req.building.floors} طبقه، ارتفاع طبقه ${survey.floorHeight}م`,
                  stage: 2,
                },
              ],
            }
          : r
      ),
    }));
  },
  recomputeParts: (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req || !req.survey) return;
    const computed = computeParts(req.building, req.survey);
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              parts: computed.map((p) => {
                const existing = r.parts.find((x) => x.partId === p.partId);
                return {
                  partId: p.partId,
                  qty: p.qty,
                  brandId: existing?.brandId ?? null,
                  formula: p.formula,
                };
              }),
            }
          : r
      ),
    }));
  },
  setPartBrand: (id, partId, brandId) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              parts: r.parts.map((p) =>
                p.partId === partId ? { ...p, brandId } : p
              ),
            }
          : r
      ),
    })),
  addExtra: (id, label, amount) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              extras: [...r.extras, { id: uid(), label, amount }],
            }
          : r
      ),
    })),
  removeExtra: (id, extraId) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? { ...r, extras: r.extras.filter((e) => e.id !== extraId) }
          : r
      ),
    })),
  setProfit: (id, percent) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id ? { ...r, profitPercent: percent } : r
      ),
    })),
  setDiscount: (id, amount) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id ? { ...r, discountAmount: amount } : r
      ),
    })),
  approveByCustomer: (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              approvedByCustomer: true,
              stage: Math.max(r.stage, 4) as Stage,
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "مشتری",
                  action: "تأیید پیش‌فاکتور توسط مشتری",
                  stage: 4,
                },
              ],
            }
          : r
      ),
    }));
  },
  saveContract: (id, contract) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              contract,
              stage: Math.max(r.stage, 4) as Stage,
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "احمدی",
                  action: "ثبت قرارداد",
                  detail: `مدت اجرا: ${contract.duration}`,
                  stage: 4,
                },
              ],
            }
          : r
      ),
    }));
  },
  signContract: (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              contractSignedAt: now(),
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "مشتری",
                  action: "امضای الکترونیکی قرارداد",
                  stage: 4,
                },
              ],
            }
          : r
      ),
    }));
  },
  activate: (id) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "active",
              stage: 5,
              activatedAt: now(),
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "سیستم",
                  action: "تبدیل به پروژه اجرایی فعال",
                  detail: "وضعیت از Draft به Active تغییر یافت",
                  stage: 5,
                },
              ],
            }
          : r
      ),
    }));
  },
  goToStage: (id, stage) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id ? { ...r, stage } : r
      ),
    })),
  log: (id, actor, action, detail) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              history: [
                ...r.history,
                { id: uid(), at: now(), actor, action, detail, stage: r.stage },
              ],
            }
          : r
      ),
    })),
}));

// انتخابگرها
export const STAGE_LABELS: Record<Stage, string> = {
  1: "ثبت درخواست",
  2: "برداشت اطلاعات",
  3: "صدور پیش‌فاکتور",
  4: "تبدیل به قرارداد",
  5: "پروژه اجرایی",
};

export const STAGE_SHORT: Record<Stage, string> = {
  1: "درخواست",
  2: "برداشت",
  3: "صدور",
  4: "قرارداد",
  5: "اجرایی",
};

export const REQUESTER_LABELS: Record<RequesterType, string> = {
  marketer: "بازاریاب",
  customer: "مشتری",
  internal: "کاربر داخلی",
};
