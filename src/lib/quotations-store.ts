import { create } from "zustand";
import { useProjectStore } from "./project-store";

export type Stage = 1 | 2 | 3 | 4 | 5;
export type RequesterType = "marketer" | "customer" | "internal";

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

export interface QuotationRequest {
  id: string;
  code: string;
  stage: Stage;
  requester: RequesterType;
  requesterName: string;
  projectId: string; // 🔗 پروژه مرتبط در بخش فنی و مهندسی
  // مرحله ۱
  customer: string;
  address: string;
  buildingType: string;
  building: { floors: number; unitsPerFloor: number; elevatorCount: number };
  createdAt: string;
  // مرحله ۳ — برندها و هزینه‌ها روی پیش‌فاکتور
  partBrands: Record<string, string>; // partId -> brandId
  extras: ExtraCost[];
  profitPercent: number;
  discountAmount: number;
  issuedAt?: string;
  approvedByCustomer: boolean;
  // مرحله ۴
  contract?: ContractData;
  contractSignedAt?: string;
  // مرحله ۵
  status: "draft" | "active";
  activatedAt?: string;
  history: HistoryEntry[];
}

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

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
    status: "draft" | "active" = "draft"
  ): QuotationRequest => ({
    id,
    code,
    stage,
    requester,
    requesterName: requester === "customer" ? customer : "احمدی",
    projectId,
    customer,
    address: "تهران، شهرک غرب",
    buildingType: "مسکونی",
    building: { floors, unitsPerFloor: 4, elevatorCount: elev },
    createdAt: now(),
    partBrands: {},
    extras: [],
    profitPercent: 18,
    discountAmount: 0,
    approvedByCustomer: stage >= 4,
    status,
    history: [
      { id: uid(), at: now(), actor: "احمدی", action: "ثبت درخواست پیش‌فاکتور", stage: 1 },
    ],
  });

  const r1 = mk("q-14025", "PF-14025", 3, "p-parsian", "شرکت پارسیان", 12, 4, "marketer");
  r1.history.push({ id: uid(), at: now(), actor: "مدیر فنی", action: "تکمیل برداشت اطلاعات آسانسورها", stage: 2 });

  const r2 = mk("q-14024", "PF-14024", 1, "p-almas", "برج الماس", 8, 2, "internal");

  const r3 = mk("q-14023", "PF-14023", 5, "p-sepehr", "سپهر گروپ", 6, 1, "customer", "active");
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
    building: { floors: number; unitsPerFloor: number; elevatorCount: number };
  }) => string;
  updateRequest: (id: string, patch: Partial<QuotationRequest>) => void;
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
    // 🔗 ایجاد پروژه موقت (Draft) در بخش فنی و مهندسی
    const projectId = useProjectStore.getState().createDraftProject({
      customer: input.customer,
      address: input.address,
      buildingType: input.buildingType,
      floors: input.building.floors,
      unitsPerFloor: input.building.unitsPerFloor,
      elevatorCount: input.building.elevatorCount,
      quotationId: id,
    });
    const req: QuotationRequest = {
      id,
      code,
      stage: 1,
      requester: input.requester,
      requesterName: input.requesterName,
      projectId,
      customer: input.customer,
      address: input.address,
      buildingType: input.buildingType,
      building: input.building,
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
          detail: `مشتری: ${input.customer} • پروژه موقت ایجاد شد`,
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
    // 🔗 فعال‌سازی پروژه مرتبط در بخش فنی و مهندسی
    useProjectStore.getState().activateProject(req.projectId);
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
                  detail: "پروژه از Draft به Active تغییر یافت",
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
      requests: s.requests.map((r) => (r.id === id ? { ...r, stage } : r)),
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
  2: "ارجاع به فنی",
  3: "صدور پیش‌فاکتور",
  4: "تبدیل به قرارداد",
  5: "پروژه اجرایی",
};

export const STAGE_SHORT: Record<Stage, string> = {
  1: "درخواست",
  2: "ارجاع",
  3: "صدور",
  4: "قرارداد",
  5: "اجرایی",
};

export const REQUESTER_LABELS: Record<RequesterType, string> = {
  marketer: "بازاریاب",
  customer: "مشتری",
  internal: "کاربر داخلی",
};
