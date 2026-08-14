"use client";
import {
  initialConfirmations,
  initialContracts,
  initialInvoices,
  initialOutreachDeals,
  initialPublishRecords,
  initialSampleSelections,
  initialScriptThreads,
  initialShipments,
  initialVideoThreads,
} from "@/lib/mock/pipeline";
import type {
  CampaignStep,
  ConfirmItemKey,
  ContractRecord,
  CreatorConfirmation,
  GateStatus,
  InvoiceFieldKey,
  InvoiceRecord,
  LookalikeTask,
  OutreachDeal,
  OutreachEvent,
  PublishRecord,
  ReviewGate,
  ReviewThread,
  SampleMode,
  SampleSelection,
  Shipment,
  StructuredFeedback,
} from "@/lib/types";
import { create } from "zustand";

let eventSeq = 100;
const nextId = (prefix: string) => `${prefix}-${++eventSeq}`;
const now = () => new Date().toISOString();

const emptyConfirmItems: Record<ConfirmItemKey, boolean> = {
  overview: false,
  compensation: false,
  sample_rights: false,
  sample_eta: false,
  production_time: false,
  publish_time: false,
  payment_terms: false,
};

function makeEvent(
  round: number,
  kind: OutreachEvent["kind"],
  extra?: Partial<OutreachEvent>,
): OutreachEvent {
  return { id: nextId("ev"), round, kind, at: now(), ...extra };
}

interface PipelineState {
  /* 建联 */
  outreachDeals: OutreachDeal[];
  simulateQuote: (creatorId: string, amount: number) => void;
  moveToNegotiation: (creatorId: string) => void;
  counterOffer: (creatorId: string, amount: number) => void;
  agreePrice: (creatorId: string, amount: number) => void;
  reviewInternal: (creatorId: string, ok: boolean) => void;
  reviewClient: (creatorId: string, ok: boolean) => void;

  /* 确认合作 */
  confirmations: CreatorConfirmation[];
  toggleConfirmItem: (creatorId: string, key: ConfirmItemKey) => void;
  simulateCreatorReply: (creatorId: string) => void;

  /* 合同签署 */
  contracts: ContractRecord[];
  sendDoc: (creatorId: string, doc: "nda" | "agreement") => void;
  advanceSign: (creatorId: string, doc: "nda" | "agreement") => void;
  completePayoutInfo: (creatorId: string) => void;

  /* 寄样管理 */
  enabledSampleModes: SampleMode[];
  toggleSampleMode: (mode: SampleMode) => void;
  sampleSelections: SampleSelection[];
  setCreatorSampleMode: (creatorId: string, mode: SampleMode) => void;
  advanceSelection: (creatorId: string) => void;
  requestReselection: (creatorId: string) => void;
  confirmSampleOrder: (creatorId: string) => void;
  shipments: Shipment[];
  advanceShipment: (creatorId: string) => void;

  /* 审核链（脚本 / 视频） */
  scriptThreads: ReviewThread[];
  videoThreads: ReviewThread[];
  submitVersion: (creatorId: string, kind: "script" | "video") => void;
  approveGate: (creatorId: string, kind: "script" | "video", gate: ReviewGate) => void;
  rejectGate: (
    creatorId: string,
    kind: "script" | "video",
    gate: ReviewGate,
    feedback: StructuredFeedback[],
  ) => void;

  /* 发布回传 + 结算 */
  publishRecords: PublishRecord[];
  markPublished: (creatorId: string) => void;
  togglePublishCheck: (creatorId: string, key: "link" | "adCode" | "bioLink") => void;
  invoices: InvoiceRecord[];
  receiveInvoice: (creatorId: string) => void;
  toggleInvoiceField: (creatorId: string, key: InvoiceFieldKey) => void;
  markPaid: (creatorId: string) => void;
  addReminder: (creatorId: string) => void;

  /* Lookalike（Mia 接管） */
  lookalikeTasks: LookalikeTask[];
  lookalikeUnseen: number;
  startLookalike: (sourceCreatorId: string, sourceStep: CampaignStep) => void;
  clearLookalikeUnseen: () => void;
}

/* 客户审核通过后，为达人补齐下游记录 */
function ensureConfirmation(
  list: CreatorConfirmation[],
  creatorId: string,
  finalQuote: number,
): CreatorConfirmation[] {
  if (list.some((c) => c.creatorId === creatorId)) return list;
  return [
    ...list,
    { creatorId, finalQuote, creatorReplied: false, items: { ...emptyConfirmItems } },
  ];
}

function ensureContract(
  list: ContractRecord[],
  creatorId: string,
  amount: number,
): ContractRecord[] {
  if (list.some((c) => c.creatorId === creatorId)) return list;
  return [
    ...list,
    {
      creatorId,
      amount,
      needNda: true,
      ndaStatus: "not_sent",
      agreementStatus: "not_sent",
      payoutInfoComplete: false,
      payoutMissing: [{ zh: "收款账户信息未提交", en: "Payout details not submitted" }],
    },
  ];
}

function ensureSelection(list: SampleSelection[], creatorId: string): SampleSelection[] {
  if (list.some((s) => s.creatorId === creatorId)) return list;
  return [
    ...list,
    {
      creatorId,
      mode: "direct_mail",
      status: "pending_selection",
      products: [],
      address: {},
    },
  ];
}

function ensureThread(
  list: ReviewThread[],
  creatorId: string,
  kind: "script" | "video",
): ReviewThread[] {
  if (list.some((t) => t.creatorId === creatorId)) return list;
  return [
    ...list,
    {
      creatorId,
      kind,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "waiting_submission",
      versions: [],
    },
  ];
}

function ensurePublish(list: PublishRecord[], creatorId: string): PublishRecord[] {
  if (list.some((p) => p.creatorId === creatorId)) return list;
  return [
    ...list,
    {
      creatorId,
      promisedAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      checks: { link: false, adCode: false, bioLink: false },
    },
  ];
}

function ensureInvoice(list: InvoiceRecord[], creatorId: string, amount: number): InvoiceRecord[] {
  if (list.some((i) => i.creatorId === creatorId)) return list;
  return [
    ...list,
    {
      creatorId,
      amount,
      fields: { payee: false, project: false, amount: false, payout_info: false, title: false },
      paid: false,
      reminders: [],
    },
  ];
}

export const usePipelineStore = create<PipelineState>((set, get) => {
  const patchDeal = (creatorId: string, fn: (d: OutreachDeal) => OutreachDeal) =>
    set((s) => ({
      outreachDeals: s.outreachDeals.map((d) => (d.creatorId === creatorId ? fn(d) : d)),
    }));

  const patchThread = (
    creatorId: string,
    kind: "script" | "video",
    fn: (t: ReviewThread) => ReviewThread,
  ) =>
    set((s) => {
      const key = kind === "script" ? "scriptThreads" : "videoThreads";
      return {
        [key]: s[key].map((t) => (t.creatorId === creatorId ? fn(t) : t)),
      } as Partial<PipelineState>;
    });

  return {
    /* ── 建联 ── */
    outreachDeals: initialOutreachDeals,

    simulateQuote: (creatorId, amount) =>
      patchDeal(creatorId, (d) => ({
        ...d,
        currentQuote: amount,
        events: [...d.events, makeEvent(d.round, "quote_received", { amount })],
      })),

    moveToNegotiation: (creatorId) => patchDeal(creatorId, (d) => ({ ...d, stage: "negotiation" })),

    counterOffer: (creatorId, amount) =>
      patchDeal(creatorId, (d) => ({
        ...d,
        currentQuote: amount,
        events: [...d.events, makeEvent(d.round, "counter_offer", { amount, byHuman: true })],
      })),

    agreePrice: (creatorId, amount) =>
      patchDeal(creatorId, (d) => ({
        ...d,
        stage: "internal_review",
        currentQuote: amount,
        events: [...d.events, makeEvent(d.round, "price_agreed", { amount, byHuman: true })],
      })),

    reviewInternal: (creatorId, ok) =>
      patchDeal(creatorId, (d) => ({
        ...d,
        stage: ok ? "client_review" : "negotiation",
        events: [
          ...d.events,
          makeEvent(d.round, ok ? "internal_approved" : "internal_rejected", {
            note: ok
              ? undefined
              : { zh: "内审打回，回到议价", en: "Internal rejection — back to negotiation" },
          }),
        ],
      })),

    reviewClient: (creatorId, ok) => {
      const deal = get().outreachDeals.find((d) => d.creatorId === creatorId);
      if (!deal) return;
      if (ok) {
        patchDeal(creatorId, (d) => ({
          ...d,
          stage: "done",
          events: [...d.events, makeEvent(d.round, "client_approved")],
        }));
        // 通过 → 流入确认合作
        set((s) => ({
          confirmations: ensureConfirmation(s.confirmations, creatorId, deal.currentQuote ?? 0),
        }));
      } else {
        // 客户打回 → 回流议价，轮次 +1
        patchDeal(creatorId, (d) => ({
          ...d,
          stage: "negotiation",
          round: d.round + 1,
          events: [
            ...d.events,
            makeEvent(d.round, "client_rejected", {
              note: {
                zh: "客户打回，进入下一轮议价",
                en: "Client rejected — next negotiation round",
              },
            }),
          ],
        }));
      }
    },

    /* ── 确认合作 ── */
    confirmations: initialConfirmations,

    toggleConfirmItem: (creatorId, key) =>
      set((s) => {
        const confirmations = s.confirmations.map((c) =>
          c.creatorId === creatorId ? { ...c, items: { ...c.items, [key]: !c.items[key] } } : c,
        );
        const c = confirmations.find((x) => x.creatorId === creatorId);
        const allDone = !!c && c.creatorReplied && Object.values(c.items).every(Boolean);
        return {
          confirmations,
          contracts: allDone ? ensureContract(s.contracts, creatorId, c.finalQuote) : s.contracts,
        };
      }),

    simulateCreatorReply: (creatorId) =>
      set((s) => {
        const confirmations = s.confirmations.map((c) =>
          c.creatorId === creatorId ? { ...c, creatorReplied: true } : c,
        );
        const c = confirmations.find((x) => x.creatorId === creatorId);
        const allDone = !!c && Object.values(c.items).every(Boolean);
        return {
          confirmations,
          contracts: allDone ? ensureContract(s.contracts, creatorId, c.finalQuote) : s.contracts,
        };
      }),

    /* ── 合同签署 ── */
    contracts: initialContracts,

    sendDoc: (creatorId, doc) =>
      set((s) => ({
        contracts: s.contracts.map((c) =>
          c.creatorId === creatorId
            ? { ...c, [doc === "nda" ? "ndaStatus" : "agreementStatus"]: "sent" }
            : c,
        ),
      })),

    advanceSign: (creatorId, doc) =>
      set((s) => {
        const key = doc === "nda" ? "ndaStatus" : "agreementStatus";
        const contracts = s.contracts.map((c) => {
          if (c.creatorId !== creatorId) return c;
          const cur = c[key];
          const next =
            cur === "sent" ? "creator_signed" : cur === "creator_signed" ? "completed" : cur;
          return { ...c, [key]: next };
        });
        return withContractDone(s, contracts, creatorId);
      }),

    completePayoutInfo: (creatorId) =>
      set((s) => {
        const contracts = s.contracts.map((c) =>
          c.creatorId === creatorId
            ? { ...c, payoutInfoComplete: true, payoutMissing: undefined }
            : c,
        );
        return withContractDone(s, contracts, creatorId);
      }),

    /* ── 寄样管理 ── */
    enabledSampleModes: ["direct_mail", "coupon", "credit_order"],
    toggleSampleMode: (mode) =>
      set((s) => ({
        enabledSampleModes: s.enabledSampleModes.includes(mode)
          ? s.enabledSampleModes.filter((m) => m !== mode)
          : [...s.enabledSampleModes, mode],
      })),

    sampleSelections: initialSampleSelections,

    setCreatorSampleMode: (creatorId, mode) =>
      set((s) => ({
        sampleSelections: s.sampleSelections.map((x) =>
          x.creatorId === creatorId ? { ...x, mode } : x,
        ),
      })),

    advanceSelection: (creatorId) =>
      set((s) => ({
        sampleSelections: s.sampleSelections.map((x) => {
          if (x.creatorId !== creatorId) return x;
          const order: SampleSelection["status"][] = [
            "pending_selection",
            "feedback_received",
            "merchant_review",
            "pending_order",
          ];
          const i = order.indexOf(x.status);
          if (i < 0 || i === order.length - 1) return x;
          const next = { ...x, status: order[i + 1] };
          // 演示：反馈到达时补一个默认选品
          if (next.status === "feedback_received" && next.products.length === 0) {
            next.products = [{ zh: "水光精华 30ml", en: "Glow Serum 30ml" }];
            next.unitsUsed = Math.min((next.unitsUsed ?? 0) + 1, next.unitLimit ?? 99);
          }
          return next;
        }),
      })),

    requestReselection: (creatorId) =>
      set((s) => ({
        sampleSelections: s.sampleSelections.map((x) =>
          x.creatorId === creatorId
            ? {
                ...x,
                status: "feedback_received",
                note: {
                  zh: "商家驳回，达人二次选品中",
                  en: "Merchant rejected — creator reselecting",
                },
              }
            : x,
        ),
      })),

    confirmSampleOrder: (creatorId) =>
      set((s) => {
        const sel = s.sampleSelections.find((x) => x.creatorId === creatorId);
        if (!sel) return {};
        return {
          sampleSelections: s.sampleSelections.map((x) =>
            x.creatorId === creatorId ? { ...x, status: "ordered" } : x,
          ),
          // 确认下单 → 自动流入物流追踪
          shipments: s.shipments.some((sh) => sh.creatorId === creatorId)
            ? s.shipments
            : [
                ...s.shipments,
                {
                  creatorId,
                  status: "to_ship",
                  note: {
                    zh: "地址已确认，等仓库出货",
                    en: "Address confirmed; awaiting warehouse dispatch",
                  },
                },
              ],
        };
      }),

    shipments: initialShipments,

    advanceShipment: (creatorId) =>
      set((s) => ({
        shipments: s.shipments.map((sh) => {
          if (sh.creatorId !== creatorId) return sh;
          if (sh.status === "to_ship")
            return {
              ...sh,
              status: "in_transit" as const,
              tracking: sh.tracking ?? `SF${Math.floor(Math.random() * 1e10)}`,
              note: { zh: "已揽收，运输中", en: "Picked up; in transit" },
            };
          if (sh.status === "in_transit")
            return {
              ...sh,
              status: "delivered" as const,
              note: { zh: "已签收，可开拍", en: "Delivered — ready to shoot" },
            };
          return sh;
        }),
      })),

    /* ── 审核链 ── */
    scriptThreads: initialScriptThreads,
    videoThreads: initialVideoThreads,

    submitVersion: (creatorId, kind) =>
      patchThread(creatorId, kind, (t) => ({
        ...t,
        status: "in_review",
        versions: [
          ...t.versions,
          {
            version: t.versions.length + 1,
            submittedAt: now(),
            ai: "approved",
            internal: "running",
            client: "pending",
            aiFindings:
              kind === "script"
                ? [
                    {
                      zh: "✅ 结构完整（hook-展示-CTA）",
                      en: "✅ Solid structure (hook–demo–CTA)",
                    },
                    { zh: "✅ 覆盖全部必讲卖点", en: "✅ All selling points covered" },
                  ]
                : [
                    { zh: "✅ 3 秒 hook 强劲", en: "✅ Strong 3-second hook" },
                    { zh: "✅ 无竞品露出 / 禁忌词", en: "✅ No competitor exposure / taboo terms" },
                  ],
          },
        ],
      })),

    approveGate: (creatorId, kind, gate) => {
      patchThread(creatorId, kind, (t) => {
        const versions = t.versions.map((v, i) => {
          if (i !== t.versions.length - 1) return v;
          const next = { ...v, [gate]: "approved" as GateStatus };
          // 上一关通过 → 下一关进入 running
          if (gate === "ai" && next.internal === "pending") next.internal = "running";
          if (gate === "internal" && next.client === "pending") next.client = "running";
          return next;
        });
        const last = versions[versions.length - 1];
        const allApproved = !!last && last.client === "approved";
        return { ...t, versions, status: allApproved ? "approved" : t.status };
      });
      // 客户审核通过 → 流入下一步
      if (gate === "client") {
        set((s) => {
          if (kind === "script") {
            return { videoThreads: ensureThread(s.videoThreads, creatorId, "video") };
          }
          return { publishRecords: ensurePublish(s.publishRecords, creatorId) };
        });
      }
    },

    rejectGate: (creatorId, kind, gate, feedback) =>
      patchThread(creatorId, kind, (t) => ({
        ...t,
        status: "changes_requested",
        versions: t.versions.map((v, i) =>
          i === t.versions.length - 1 ? { ...v, [gate]: "rejected" as GateStatus, feedback } : v,
        ),
      })),

    /* ── 发布回传 + 结算 ── */
    publishRecords: initialPublishRecords,

    markPublished: (creatorId) =>
      set((s) => ({
        publishRecords: s.publishRecords.map((p) =>
          p.creatorId === creatorId
            ? {
                ...p,
                publishedAt: now(),
                link: p.link ?? "https://www.tiktok.com/@creator/video/7419",
                checks: { ...p.checks, link: true },
              }
            : p,
        ),
      })),

    togglePublishCheck: (creatorId, key) =>
      set((s) => {
        const publishRecords = s.publishRecords.map((p) => {
          if (p.creatorId !== creatorId) return p;
          const checks = { ...p.checks, [key]: !p.checks[key] };
          return {
            ...p,
            checks,
            adCode: key === "adCode" && checks.adCode ? (p.adCode ?? "ADX-7Q2W9L") : p.adCode,
          };
        });
        const p = publishRecords.find((x) => x.creatorId === creatorId);
        const allChecked = !!p?.publishedAt && p.checks.link && p.checks.adCode && p.checks.bioLink;
        const amount =
          s.contracts.find((c) => c.creatorId === creatorId)?.amount ??
          s.confirmations.find((c) => c.creatorId === creatorId)?.finalQuote ??
          0;
        return {
          publishRecords,
          invoices: allChecked ? ensureInvoice(s.invoices, creatorId, amount) : s.invoices,
        };
      }),

    invoices: initialInvoices,

    receiveInvoice: (creatorId) =>
      set((s) => ({
        invoices: s.invoices.map((i) =>
          i.creatorId === creatorId
            ? {
                ...i,
                receivedAt: now(),
                dueInDays: 30,
                fields: {
                  payee: true,
                  project: true,
                  amount: true,
                  payout_info: true,
                  title: true,
                },
              }
            : i,
        ),
      })),

    toggleInvoiceField: (creatorId, key) =>
      set((s) => ({
        invoices: s.invoices.map((i) =>
          i.creatorId === creatorId ? { ...i, fields: { ...i.fields, [key]: !i.fields[key] } } : i,
        ),
      })),

    markPaid: (creatorId) =>
      set((s) => ({
        invoices: s.invoices.map((i) => (i.creatorId === creatorId ? { ...i, paid: true } : i)),
      })),

    addReminder: (creatorId) =>
      set((s) => ({
        invoices: s.invoices.map((i) =>
          i.creatorId === creatorId
            ? {
                ...i,
                reminders: [
                  ...i.reminders,
                  {
                    at: now(),
                    note: { zh: "已发送付款提醒邮件", en: "Payment reminder email sent" },
                  },
                ],
              }
            : i,
        ),
      })),

    /* ── Lookalike ── */
    lookalikeTasks: [],
    lookalikeUnseen: 0,

    startLookalike: (sourceCreatorId, sourceStep) => {
      // 同一达人重复点击不重复建任务
      if (get().lookalikeTasks.some((t) => t.sourceCreatorId === sourceCreatorId)) return;
      const id = nextId("lk");
      set((s) => ({
        lookalikeTasks: [
          ...s.lookalikeTasks,
          { id, sourceCreatorId, sourceStep, createdAt: now(), status: "running" },
        ],
      }));
      // 模拟 Mia 接管 ~2s 后生成批次
      setTimeout(() => {
        set((s) => ({
          lookalikeTasks: s.lookalikeTasks.map((t) =>
            t.id === id ? { ...t, status: "done", batchId: `batch-${id}` } : t,
          ),
          lookalikeUnseen: s.lookalikeUnseen + 1,
        }));
      }, 2000);
    },

    clearLookalikeUnseen: () => set({ lookalikeUnseen: 0 }),
  };
});

/** 合同双文件签署完成 + 收款信息完整 → 流入寄样 & 脚本确认 */
function withContractDone(
  s: PipelineState,
  contracts: ContractRecord[],
  creatorId: string,
): Partial<PipelineState> {
  const c = contracts.find((x) => x.creatorId === creatorId);
  const done =
    !!c &&
    c.agreementStatus === "completed" &&
    (!c.needNda || c.ndaStatus === "completed") &&
    c.payoutInfoComplete;
  return {
    contracts,
    sampleSelections: done ? ensureSelection(s.sampleSelections, creatorId) : s.sampleSelections,
    scriptThreads: done ? ensureThread(s.scriptThreads, creatorId, "script") : s.scriptThreads,
  };
}
