import { create } from "zustand";
import { useProjectStore } from "./project-store";

export type Stage = 1 | 2 | 3 | 4;
export type RequesterType = "marketer" | "customer" | "internal";

// وضعیت پیش‌فاکتور
// draft: پیش‌نویس (مرحله ثبت درخواست)
// in_progress: در حال انجام (مرحله صدور پیش‌فاکتور)
// approved: تأیید شده (تبدیل به قرارداد)
// rejected: تأیید نشده (رد درخواست)
export type QuoteStatus = "draft" | "in_progress" | "approved" | "rejected";

// اطلاعات رد درخواست
export interface Rejection {
  reason: string;
  by: string;
  at: string;
}

export interface ExtraCost {
  id: string;
  label: string;
  amount: number;
}

export interface ContractData {
  commitments: string;
  conditions: string;
  duration: string;
  prepayment: number;
  paymentTerms: string;
  finalSpecs: string;
}

export interface HistoryEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
  stage: Stage;
}

// نماینده کارفرما
export interface Representative {
  id: string;
  name: string;
  role: string; // سمت در پروژه
  phone: string; // شماره تماس
}

// موقعیت جغرافیایی ساختمان (انتخاب از روی نقشه)
export interface GeoLocation {
  lat: number;
  lng: number;
}

// مشخصات هر آسانسور
export interface ElevatorInfo {
  id: string;
  name: string; // نام/شناسه آسانسور مثلاً "آسانسور ۱"
}

export interface QuotationRequest {
  id: string;
  code: string;
  stage: Stage;
  quoteStatus: QuoteStatus; // وضعیت پیش‌فاکتور (مستقل از stage)
  rejection?: Rejection;    // جزئیات رد درخواست
  requester: RequesterType;
  requesterName: string;
  projectId: string;
  // مرحله ۱
  customer: string;
  customerId?: string;
  projectName: string;
  elevators: ElevatorInfo[]; // لیست آسانسورها با نام
  address: string;
  location?: GeoLocation;
  representatives: Representative[];
  buildingType: string;
  building: { floors: number; unitsPerFloor: number; elevatorCount: number };
  createdAt: string;
  // مرحله ۲
  partBrands: Record<string, string>;
  extras: ExtraCost[];
  profitPercent: number;
  discountAmount: number;
  issuedAt?: string;
  approvedByCustomer: boolean;
  // مرحله ۳
  contract?: ContractData;
  contractSignedAt?: string;
  // مرحله ۴
  status: "draft" | "active";
  activatedAt?: string;
  history: HistoryEntry[];
}

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

function buildElevators(count: number): ElevatorInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: uid(),
    name: `آسانسور ${(i + 1).toLocaleString("fa-IR")}`,
  }));
}

function seed(): QuotationRequest[] {
  const mk = (
    id: string,
    code: string,
    stage: Stage,
    projectId: string,
    customer: string,
    floors: number,
    elev: number,
    requester: RequesterType,
    quoteStatus: QuoteStatus = "draft",
    status: "draft" | "active" = "draft"
  ): QuotationRequest => ({
    id,
    code,
    stage,
    quoteStatus,
    requester,
    requesterName: requester === "customer" ? customer : requester === "marketer" ? "محمد احمدی" : "احمدی",
    projectId,
    customer,
    projectName: `پروژه ${customer}`,
    elevators: buildElevators(elev),
    address: "تهران، شهرک غرب",
    location: { lat: 35.7448, lng: 51.3753 },
    representatives: [],
    buildingType: "مسکونی",
    building: { floors, unitsPerFloor: 4, elevatorCount: elev },
    createdAt: now(),
    partBrands: {},
    extras: [],
    profitPercent: 18,
    discountAmount: 0,
    approvedByCustomer: stage >= 3,
    status,
    history: [
      { id: uid(), at: now(), actor: "احمدی", action: "ثبت درخواست پیش‌فاکتور", stage: 1 },
    ],
  });

  const r1 = mk("q-14025", "PF-14025", 2, "p-parsian", "شرکت پارسیان", 12, 4, "marketer", "in_progress");
  r1.history.push({ id: uid(), at: now(), actor: "مدیر فنی", action: "تکمیل برداشت اطلاعات آسانسورها", stage: 1 });

  const r2 = mk("q-14024", "PF-14024", 1, "p-almas", "برج الماس", 8, 2, "internal", "draft");

  const r3 = mk("q-14023", "PF-14023", 4, "p-sepehr", "سپهر گروپ", 6, 1, "customer", "approved", "active");
  r3.activatedAt = now();

  const r4 = mk("q-14022", "PF-14022", 1, "p-aryan", "آریان ساز", 5, 2, "marketer", "rejected");
  r4.rejection = { reason: "بودجه پروژه تأمین نشد", by: "کارفرما", at: now() };
  r4.history.push({ id: uid(), at: now(), actor: "کارفرما", action: "رد درخواست پیش‌فاکتور", detail: "بودجه پروژه تأمین نشد", stage: 1 });

  return [r1, r2, r3, r4];
}

interface QuotationsState {
  requests: QuotationRequest[];
  selectedId: string | null;
  select: (id: string | null) => void;
  createRequest: (input: {
    requester: RequesterType;
    requesterName: string;
    customer: string;
    customerId?: string;
    projectName: string;
    elevators: ElevatorInfo[];
    address: string;
    location?: GeoLocation;
    representatives: Representative[];
  }) => string;
  updateRequest: (id: string, patch: Partial<QuotationRequest>) => void;
  deleteRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string, by: string) => void;
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

// محاسبه quoteStatus بر اساس stage
function stageToQuoteStatus(stage: Stage): QuoteStatus {
  if (stage === 1) return "draft";
  if (stage === 2) return "in_progress";
  if (stage >= 3) return "approved";
  return "draft";
}

export const useQuotations = create<QuotationsState>((set, get) => ({
  requests: seed(),
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  createRequest: (input) => {
    const id = uid();
    const code = nextCode(get().requests);
    const defaultBuilding = { floors: 8, unitsPerFloor: 4, elevatorCount: input.elevators.length || 1 };
    const projectId = useProjectStore.getState().createDraftProject({
      customer: input.customer,
      projectName: input.projectName,
      address: input.address,
      buildingType: "—",
      floors: defaultBuilding.floors,
      unitsPerFloor: defaultBuilding.unitsPerFloor,
      elevatorCount: defaultBuilding.elevatorCount,
      quotationId: id,
    });
    const req: QuotationRequest = {
      id,
      code,
      stage: 1,
      quoteStatus: "draft",
      requester: input.requester,
      requesterName: input.requesterName,
      projectId,
      customer: input.customer,
      customerId: input.customerId,
      projectName: input.projectName,
      elevators: input.elevators,
      address: input.address,
      location: input.location,
      representatives: input.representatives,
      buildingType: "—",
      building: defaultBuilding,
      createdAt: now(),
      partBrands: {},
      extras: [],
      profitPercent: 18,
      discountAmount: 0,
      approvedByCustomer: false,
      status: "draft",
      history: [
        {
          id: uid(),
          at: now(),
          actor: input.requesterName,
          action: "ثبت درخواست پیش‌فاکتور",
          detail: `مشتری: ${input.customer} • ${(input.elevators.length || 1).toLocaleString("fa-IR")} آسانسور • پروژه موقت ایجاد شد`,
          stage: 1,
        },
      ],
    };
    set((s) => ({ requests: [req, ...s.requests], selectedId: id }));
    return id;
  },
  updateRequest: (id, patch) =>
    set((s) => ({
      requests: s.requests.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  deleteRequest: (id) =>
    set((s) => ({
      requests: s.requests.filter((r) => r.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),
  rejectRequest: (id, reason, by) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              quoteStatus: "rejected" as QuoteStatus,
              rejection: { reason, by, at: now() },
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: by,
                  action: "رد درخواست پیش‌فاکتور",
                  detail: reason,
                  stage: r.stage,
                },
              ],
            }
          : r
      ),
    })),
  setPartBrand: (id, partId, brandId) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              partBrands: {
                ...r.partBrands,
                [partId]: brandId ?? "",
              },
            }
          : r
      ),
    })),
  addExtra: (id, label, amount) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? { ...r, extras: [...r.extras, { id: uid(), label, amount }] }
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
  approveByCustomer: (id) =>
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              approvedByCustomer: true,
              stage: Math.max(r.stage, 3) as Stage,
              quoteStatus: "approved" as QuoteStatus,
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "مشتری",
                  action: "تأیید پیش‌فاکتور توسط مشتری",
                  stage: 3,
                },
              ],
            }
          : r
      ),
    })),
  saveContract: (id, contract) => {
    const req = get().requests.find((r) => r.id === id);
    if (!req) return;
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              contract,
              stage: Math.max(r.stage, 3) as Stage,
              quoteStatus: "approved" as QuoteStatus,
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "احمدی",
                  action: "ثبت قرارداد",
                  detail: `مدت اجرا: ${contract.duration}`,
                  stage: 3,
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
                  stage: 3,
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
    useProjectStore.getState().activateProject(req.projectId);
    set((s) => ({
      requests: s.requests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "active",
              stage: 4,
              quoteStatus: "approved" as QuoteStatus,
              activatedAt: now(),
              history: [
                ...r.history,
                {
                  id: uid(),
                  at: now(),
                  actor: "سیستم",
                  action: "تبدیل به پروژه اجرایی فعال",
                  detail: "پروژه از Draft به Active تغییر یافت",
                  stage: 4,
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
        r.id === id
          ? {
              ...r,
              stage,
              // وقتی به صدور پیش‌فاکتور رفتیم، وضعیت را in_progress کن (اگر رد نشده)
              quoteStatus:
                r.quoteStatus === "rejected"
                  ? "rejected"
                  : stageToQuoteStatus(stage),
            }
          : r
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

export const STAGE_LABELS: Record<Stage, string> = {
  1: "ثبت درخواست",
  2: "صدور پیش‌فاکتور",
  3: "تبدیل به قرارداد",
  4: "پروژه اجرایی",
};

export const STAGE_SHORT: Record<Stage, string> = {
  1: "درخواست",
  2: "صدور",
  3: "قرارداد",
  4: "اجرایی",
};

export const REQUESTER_LABELS: Record<RequesterType, string> = {
  marketer: "بازاریاب",
  customer: "مشتری",
  internal: "کاربر داخلی",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "پیش‌نویس",
  in_progress: "در حال انجام",
  approved: "تایید شده",
  rejected: "تایید نشده",
};

export const QUOTE_STATUS_TONE: Record<
  QuoteStatus,
  "slate" | "amber" | "emerald" | "rose"
> = {
  draft: "slate",
  in_progress: "amber",
  approved: "emerald",
  rejected: "rose",
};
