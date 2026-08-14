import type {
  ContractRecord,
  CreatorConfirmation,
  InvoiceRecord,
  OutreachDeal,
  PublishRecord,
  ReviewThread,
  SampleSelection,
  Shipment,
} from "@/lib/types";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
const daysAhead = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();

/* ────────────────────────────────
 * 建联：7 位达人分布在 询价 / 议价 / 内审 / 客户审 / done
 * ──────────────────────────────── */
export const initialOutreachDeals: OutreachDeal[] = [
  {
    // cr-1 Creator One：完整走完 R1 报价→议价→成交→内审→客户审，已通过
    creatorId: "cr-1",
    stage: "done",
    round: 1,
    currentQuote: 8000,
    ceiling: 9000,
    events: [
      {
        id: "ev-1-1",
        round: 1,
        kind: "quote_received",
        amount: 9000,
        at: daysAgo(5),
        note: { zh: "首轮报价", en: "First-round quote" },
      },
      {
        id: "ev-1-2",
        round: 1,
        kind: "counter_offer",
        amount: 7500,
        at: daysAgo(4),
        note: { zh: "打包 3 条视频议价", en: "Counter with a 3-video bundle" },
      },
      {
        id: "ev-1-3",
        round: 1,
        kind: "price_agreed",
        amount: 8000,
        at: daysAgo(3),
        byHuman: true,
      },
      { id: "ev-1-4", round: 1, kind: "internal_approved", at: daysAgo(3) },
      {
        id: "ev-1-5",
        round: 1,
        kind: "client_approved",
        at: daysAgo(2),
        note: { zh: "客户 Vivian 确认", en: "Confirmed by client Vivian" },
      },
    ],
  },
  {
    // cr-2 Nina：R1 报价超天花板 → 议价中（转人工）
    creatorId: "cr-2",
    stage: "negotiation",
    round: 1,
    currentQuote: 11000,
    ceiling: 9000,
    events: [
      {
        id: "ev-2-1",
        round: 1,
        kind: "quote_received",
        amount: 11000,
        at: daysAgo(4),
        note: { zh: "报价超天花板，转人工议价", en: "Quote exceeds ceiling; escalated to human" },
      },
      {
        id: "ev-2-2",
        round: 1,
        kind: "counter_offer",
        amount: 8500,
        at: hoursAgo(3),
        note: { zh: "我方 counter，等待回复", en: "Our counter, awaiting reply" },
        byHuman: true,
      },
    ],
  },
  {
    // cr-3 Guozi Sis：客户 R1 打回价格 → 议价 R2 达成 → 客户 R2 审核中
    creatorId: "cr-3",
    stage: "client_review",
    round: 2,
    currentQuote: 10500,
    ceiling: 9000,
    events: [
      { id: "ev-3-1", round: 1, kind: "quote_received", amount: 12000, at: daysAgo(6) },
      {
        id: "ev-3-2",
        round: 1,
        kind: "price_agreed",
        amount: 11500,
        at: daysAgo(5),
        byHuman: true,
      },
      { id: "ev-3-3", round: 1, kind: "internal_approved", at: daysAgo(5) },
      {
        id: "ev-3-4",
        round: 1,
        kind: "client_rejected",
        at: daysAgo(4),
        note: {
          zh: "客户认为超预算，要求压到 $10.5k 内",
          en: "Client says over budget; asked to bring it under $10.5k",
        },
      },
      {
        id: "ev-3-5",
        round: 2,
        kind: "counter_offer",
        amount: 10500,
        at: daysAgo(3),
        byHuman: true,
      },
      { id: "ev-3-6", round: 2, kind: "price_agreed", amount: 10500, at: daysAgo(2) },
      { id: "ev-3-7", round: 2, kind: "internal_approved", at: daysAgo(1) },
    ],
  },
  {
    // cr-4 Yoga Anna：价格达成，内审中
    creatorId: "cr-4",
    stage: "internal_review",
    round: 1,
    currentQuote: 8200,
    ceiling: 9000,
    events: [
      { id: "ev-4-1", round: 1, kind: "quote_received", amount: 8500, at: daysAgo(3) },
      { id: "ev-4-2", round: 1, kind: "counter_offer", amount: 8000, at: daysAgo(2) },
      { id: "ev-4-3", round: 1, kind: "price_agreed", amount: 8200, at: daysAgo(1) },
    ],
  },
  {
    // cr-5 Leo Park：议价 R1 进行中
    creatorId: "cr-5",
    stage: "negotiation",
    round: 1,
    currentQuote: 4200,
    ceiling: 9000,
    events: [
      { id: "ev-5-1", round: 1, kind: "quote_received", amount: 4200, at: daysAgo(2) },
      {
        id: "ev-5-2",
        round: 1,
        kind: "counter_offer",
        amount: 3800,
        at: hoursAgo(20),
        note: { zh: "尝试争取 usage rights 打包", en: "Trying to bundle usage rights" },
      },
    ],
  },
  {
    // cr-6 Ariana：询价已发出，等报价
    creatorId: "cr-6",
    stage: "inquiry",
    round: 1,
    ceiling: 9000,
    events: [
      {
        id: "ev-6-1",
        round: 1,
        kind: "outreach_sent",
        at: daysAgo(1),
        note: { zh: "询价邮件已发（4 必要素）", en: "Inquiry email sent (4 essentials)" },
      },
    ],
  },
  {
    // cr-7 Jade：报价刚回，待发起议价
    creatorId: "cr-7",
    stage: "inquiry",
    round: 1,
    currentQuote: 5200,
    ceiling: 9000,
    events: [
      { id: "ev-7-1", round: 1, kind: "outreach_sent", at: daysAgo(2) },
      {
        id: "ev-7-2",
        round: 1,
        kind: "quote_received",
        amount: 5200,
        at: hoursAgo(5),
        note: { zh: "主动询问 brief 与档期", en: "Proactively asked about brief and schedule" },
      },
    ],
  },
];

/* ────────────────────────────────
 * 确认合作：cr-1 全确认、cr-4 部分、cr-5 刚开始
 * ──────────────────────────────── */
export const initialConfirmations: CreatorConfirmation[] = [
  {
    creatorId: "cr-1",
    finalQuote: 8000,
    creatorReplied: true,
    items: {
      overview: true,
      compensation: true,
      sample_rights: true,
      sample_eta: true,
      production_time: true,
      publish_time: true,
      payment_terms: true,
    },
  },
  {
    creatorId: "cr-4",
    finalQuote: 8200,
    creatorReplied: false,
    items: {
      overview: true,
      compensation: true,
      sample_rights: true,
      sample_eta: false,
      production_time: true,
      publish_time: true,
      payment_terms: false,
    },
  },
  {
    creatorId: "cr-5",
    finalQuote: 3800,
    creatorReplied: false,
    items: {
      overview: true,
      compensation: true,
      sample_rights: false,
      sample_eta: false,
      production_time: false,
      publish_time: false,
      payment_terms: false,
    },
  },
];

/* ────────────────────────────────
 * 合同签署
 * ──────────────────────────────── */
export const initialContracts: ContractRecord[] = [
  {
    creatorId: "cr-1",
    amount: 8000,
    needNda: true,
    ndaStatus: "completed",
    agreementStatus: "completed",
    payoutInfoComplete: true,
  },
  {
    creatorId: "cr-4",
    amount: 8200,
    needNda: true,
    ndaStatus: "creator_signed",
    agreementStatus: "sent",
    payoutInfoComplete: false,
    payoutMissing: [
      { zh: "SWIFT Code", en: "SWIFT code" },
      { zh: "银行地址", en: "Bank address" },
    ],
  },
  {
    creatorId: "cr-5",
    amount: 3800,
    needNda: false,
    ndaStatus: "not_sent",
    agreementStatus: "not_sent",
    payoutInfoComplete: false,
    payoutMissing: [{ zh: "收款账户信息未提交", en: "Payout details not submitted" }],
  },
];

/* ────────────────────────────────
 * 寄样管理：选品 + 物流
 * ──────────────────────────────── */
export const initialSampleSelections: SampleSelection[] = [
  {
    creatorId: "cr-1",
    mode: "direct_mail",
    status: "ordered",
    products: [
      { zh: "水光精华 30ml", en: "Glow Serum 30ml" },
      { zh: "晚安修护面膜", en: "Overnight Repair Mask" },
    ],
    address: {
      name: "Creator One",
      phone: "+1 415 555 0132",
      line1: "88 King St, Apt 12F",
      city: "San Francisco, CA",
      postcode: "94107",
      country: "US",
    },
  },
  {
    creatorId: "cr-4",
    mode: "credit_order",
    status: "merchant_review",
    products: [
      { zh: "瑜伽紧身裤（黑 M）", en: "Yoga Leggings (Black, M)" },
      { zh: "运动水杯 750ml", en: "Sports Bottle 750ml" },
    ],
    creditUsd: 150,
    creditUsedUsd: 128,
    unitLimit: 3,
    unitsUsed: 2,
    address: {
      name: "Anna Roberts",
      phone: "+1 646 555 0188",
      line1: "220 5th Ave",
      city: "New York, NY",
      postcode: "10001",
      country: "US",
    },
    note: {
      zh: "第二次选品：换色请求待商家确认",
      en: "2nd selection: color swap awaiting merchant approval",
    },
  },
  {
    creatorId: "cr-5",
    mode: "coupon",
    status: "pending_selection",
    products: [],
    unitLimit: 2,
    unitsUsed: 0,
    address: {
      name: "Leo Park",
      line1: "1500 Broadway",
      city: "Los Angeles, CA",
      country: "US",
      // phone / postcode 缺失 → 完整度校验标红
    },
  },
];

export const initialShipments: Shipment[] = [
  {
    creatorId: "cr-1",
    status: "in_transit",
    tracking: "SF1234567890",
    note: { zh: "今天 14:00 到达旧金山转运中心", en: "Arrived at SF hub today at 14:00" },
  },
];

/* ────────────────────────────────
 * 脚本确认 / 审核视频
 * ──────────────────────────────── */
export const initialScriptThreads: ReviewThread[] = [
  {
    // cr-1：V1 客户打回（结构化意见）→ V2 客户审核中
    creatorId: "cr-1",
    kind: "script",
    deadline: daysAgo(1),
    status: "in_review",
    versions: [
      {
        version: 1,
        submittedAt: daysAgo(3),
        ai: "approved",
        internal: "approved",
        client: "rejected",
        aiFindings: [
          { zh: "✅ 覆盖全部 3 个必讲卖点", en: "✅ Covers all 3 must-mention selling points" },
          { zh: "✅ 无禁忌词命中", en: "✅ No taboo terms detected" },
        ],
        feedback: [
          {
            category: "structure",
            text: {
              zh: "开头铺垫太长，前 3 秒要直接给冲突点",
              en: "Opening drags; put the conflict hook in the first 3 seconds",
            },
          },
          {
            category: "cta",
            text: {
              zh: "结尾 CTA 需引导到 bio link，而不是评论区",
              en: "End CTA should drive to the bio link, not the comments",
            },
          },
        ],
      },
      {
        version: 2,
        submittedAt: hoursAgo(6),
        ai: "approved",
        internal: "approved",
        client: "running",
        aiFindings: [
          { zh: "✅ Hook 已前置至 0-3s", en: "✅ Hook moved up to 0-3s" },
          { zh: "✅ CTA 指向 bio link", en: "✅ CTA points to the bio link" },
        ],
      },
    ],
  },
  {
    // cr-4：Brief 已下发，等交稿（还有 2 天）
    creatorId: "cr-4",
    kind: "script",
    deadline: daysAhead(2),
    status: "waiting_submission",
    versions: [],
  },
  {
    // cr-5：V1 内审中
    creatorId: "cr-5",
    kind: "script",
    deadline: daysAgo(0.5),
    status: "in_review",
    versions: [
      {
        version: 1,
        submittedAt: hoursAgo(4),
        ai: "approved",
        internal: "running",
        client: "pending",
        aiFindings: [
          { zh: "✅ 结构完整（hook-展示-CTA）", en: "✅ Solid structure (hook–demo–CTA)" },
          {
            zh: "⚠️ 未提及第 2 个必讲卖点「48h 持妆」",
            en: "⚠️ Missing selling point #2: '48h wear'",
          },
        ],
      },
    ],
  },
];

export const initialVideoThreads: ReviewThread[] = [
  {
    // cr-1：视频 V1 AI 预审完成，等内审
    creatorId: "cr-1",
    kind: "video",
    deadline: daysAhead(1),
    status: "in_review",
    versions: [
      {
        version: 1,
        submittedAt: hoursAgo(2),
        ai: "approved",
        internal: "running",
        client: "pending",
        aiFindings: [
          { zh: "✅ 3 秒 hook 强劲", en: "✅ Strong 3-second hook" },
          { zh: "✅ 卖点完整覆盖", en: "✅ All selling points covered" },
          {
            zh: "⚠️ 第 18s 出现竞品 logo，建议剪掉",
            en: "⚠️ Competitor logo appears at 18s — recommend cutting it",
          },
        ],
      },
    ],
  },
  {
    // cr-4：等交片
    creatorId: "cr-4",
    kind: "video",
    deadline: daysAhead(4),
    status: "waiting_submission",
    versions: [],
  },
];

/* ────────────────────────────────
 * 发布回传 + 结算付款
 * ──────────────────────────────── */
export const initialPublishRecords: PublishRecord[] = [
  {
    creatorId: "cr-1",
    promisedAt: daysAgo(1),
    publishedAt: hoursAgo(8),
    link: "https://www.tiktok.com/@creator_one/video/7381",
    adCode: "ADX-9F4K2M",
    checks: { link: true, adCode: true, bioLink: false },
  },
  {
    creatorId: "cr-4",
    promisedAt: daysAhead(2),
    checks: { link: false, adCode: false, bioLink: false },
  },
];

export const initialInvoices: InvoiceRecord[] = [
  {
    creatorId: "cr-1",
    amount: 8000,
    fields: { payee: true, project: true, amount: true, payout_info: true, title: false },
    receivedAt: daysAgo(7),
    dueInDays: 25,
    paid: false,
    reminders: [
      {
        at: daysAgo(2),
        note: { zh: "已提醒补齐发票抬头", en: "Reminded to complete the invoice title" },
      },
    ],
    deliverablesMissing: [{ zh: "bio link 尚未挂上", en: "Bio link not yet added" }],
  },
];
