import type { LText } from "@/lib/i18n/dict";

export type CampaignStatus = "draft" | "active" | "paused" | "closed";

export type CampaignGoal =
  | "brand_awareness"
  | "content_production"
  | "conversion_sales"
  | "engagement";

export type CampaignCurrency = "USD" | "CNY" | "EUR" | "GBP";

export interface CampaignProduct {
  id: string;
  name: string;
  currency: CampaignCurrency;
  value: number;
  image?: string;
  productLink?: string;
  description?: string;
}

export interface CampaignCompensation {
  flatFee?: {
    currency: CampaignCurrency;
    minFee: number;
    maxFee: number;
    totalBudget: number;
  };
  commission?: {
    rate: number;
    affiliateLink?: string;
  };
  freeProducts: CampaignProduct[];
  giftCard?: {
    name: string;
    currency: CampaignCurrency;
    value: number;
    description?: string;
  };
}

export interface CampaignCreatorRequirements {
  regions: string[];
  languages: string[];
  categories: string[];
  minimumFollowers: number;
  contentTypes: string[];
}

export interface CampaignAttachment {
  id: string;
  name: string;
  size?: number;
  url?: string;
}

/** 十步流程：Brief理解 → 达人匹配 → 达人建联 → 确认合作 → 合同签署 → 寄样管理 → 脚本确认 → 审核视频 → 发布回传 → 效果监控 */
export type CampaignStep =
  | "brief"
  | "matching"
  | "outreach"
  | "confirm"
  | "contract"
  | "sample"
  | "script"
  | "video"
  | "publish"
  | "tracking";

/** @deprecated 旧建联模型，仅为过渡期兼容保留 */
export type CreatorDealStage =
  | "interested"
  | "submitted"
  | "internal_review"
  | "client_review"
  | "negotiating"
  | "won"
  | "handoff";

/* ────────────────────────────────
 * 建联（多轮询价 / 议价 / 内审 / 客户审）
 * ──────────────────────────────── */

/** 建联二级阶段 tab；done = 通过全部审核，流入确认合作 */
export type OutreachStage =
  | "inquiry"
  | "negotiation"
  | "internal_review"
  | "client_review"
  | "done";

export type OutreachEventKind =
  | "outreach_sent" // 已触达 / 发出询价
  | "quote_received" // 达人报价
  | "counter_offer" // 我方议价
  | "price_agreed" // 价格达成
  | "internal_approved"
  | "internal_rejected"
  | "client_approved"
  | "client_rejected"; // 客户打回 → 回流议价，轮次 +1

export interface OutreachEvent {
  id: string;
  round: number;
  kind: OutreachEventKind;
  amount?: number;
  at: string;
  note?: LText;
  byHuman?: boolean;
}

export interface OutreachDeal {
  creatorId: string;
  stage: OutreachStage;
  round: number; // 当前轮次（客户打回后 +1）
  currentQuote?: number;
  ceiling: number;
  events: OutreachEvent[];
}

/* ────────────────────────────────
 * 确认合作（7 项确认清单 + 达人回复）
 * ──────────────────────────────── */

export type ConfirmItemKey =
  | "overview" // 项目概要
  | "compensation" // 报酬及交付权益
  | "sample_rights" // 样品选择权益
  | "sample_eta" // 样品到货时间
  | "production_time" // 内容制作时间
  | "publish_time" // 发布时间
  | "payment_terms"; // 付款方式

export interface CreatorConfirmation {
  creatorId: string;
  finalQuote: number;
  items: Record<ConfirmItemKey, boolean>;
  creatorReplied: boolean; // 达人已回复"确认"
}

/* ────────────────────────────────
 * 合同签署（合作信 + NDA + 收款信息校验）
 * ──────────────────────────────── */

export type SignStatus = "not_sent" | "sent" | "creator_signed" | "completed";

export interface ContractRecord {
  creatorId: string;
  amount: number;
  needNda: boolean; // 保密项目优先签 NDA
  ndaStatus: SignStatus;
  agreementStatus: SignStatus; // 合作信
  payoutInfoComplete: boolean;
  payoutMissing?: LText[]; // 收款信息缺失字段
}

/* ────────────────────────────────
 * 寄样管理（达人选品 + 物流追踪）
 * ──────────────────────────────── */

/** 品牌直邮 / 优惠券购买 / 限定额度下单 */
export type SampleMode = "direct_mail" | "coupon" | "credit_order";

export type SampleSelectionStatus =
  | "pending_selection" // 待选品
  | "feedback_received" // 已反馈
  | "merchant_review" // 商家确认 / 二次选品
  | "pending_order" // 待下单
  | "ordered"; // 已确认下单 → 流入物流追踪

export interface SampleAddress {
  name?: string;
  phone?: string;
  line1?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export interface SampleSelection {
  creatorId: string;
  mode: SampleMode;
  status: SampleSelectionStatus;
  products: LText[];
  creditUsd?: number; // 限定额度
  creditUsedUsd?: number;
  unitLimit?: number; // 件数上限
  unitsUsed?: number;
  address: SampleAddress;
  note?: LText;
}

export type ShipmentStatus = "to_ship" | "in_transit" | "delivered";

export interface Shipment {
  creatorId: string;
  status: ShipmentStatus;
  tracking?: string;
  note: LText;
}

/* ────────────────────────────────
 * 审核链（脚本确认 & 审核视频共用）
 * ──────────────────────────────── */

export type ReviewGate = "ai" | "internal" | "client";
export type GateStatus = "pending" | "running" | "approved" | "rejected";

/** 结构化打回意见的 5 个类别 */
export type FeedbackCategory =
  | "structure" // 内容结构
  | "selling_points" // 必讲卖点
  | "must_shoot" // 必拍内容
  | "taboo" // 内容禁忌
  | "cta"; // CTA

export interface StructuredFeedback {
  category: FeedbackCategory;
  text: LText;
}

export interface ReviewVersion {
  version: number; // V1 / V2 / …
  submittedAt: string;
  ai: GateStatus;
  internal: GateStatus;
  client: GateStatus;
  aiFindings?: LText[]; // AI 预审结论
  feedback?: StructuredFeedback[]; // 打回意见（发送给达人）
}

export type ReviewThreadStatus =
  | "waiting_submission" // 等达人交稿
  | "in_review"
  | "changes_requested"
  | "approved";

export interface ReviewThread {
  creatorId: string;
  kind: "script" | "video";
  deadline: string; // 承诺交稿时间
  status: ReviewThreadStatus;
  versions: ReviewVersion[];
}

/* ────────────────────────────────
 * 发布回传（发布确认 + 结算付款）
 * ──────────────────────────────── */

export interface PublishRecord {
  creatorId: string;
  promisedAt: string; // 承诺发布时间
  publishedAt?: string;
  link?: string;
  adCode?: string;
  checks: {
    link: boolean;
    adCode: boolean;
    bioLink: boolean;
  };
}

/** Invoice 五要素：收款方名称 / 项目名称 / 金额 / 收款信息 / 发票抬头 */
export type InvoiceFieldKey = "payee" | "project" | "amount" | "payout_info" | "title";

export interface InvoiceRecord {
  creatorId: string;
  amount: number;
  fields: Record<InvoiceFieldKey, boolean>;
  receivedAt?: string; // 收到 invoice → 账期 30 个工作日倒计时
  dueInDays?: number;
  paid: boolean;
  reminders: { at: string; note: LText }[]; // 催收记录
  deliverablesMissing?: LText[]; // 交付遗漏检查
}

/* ────────────────────────────────
 * Lookalike 扩量任务（Mia 接管）
 * ──────────────────────────────── */

export interface LookalikeTask {
  id: string;
  sourceCreatorId: string;
  sourceStep: CampaignStep;
  createdAt: string;
  status: "running" | "done";
  batchId?: string; // 完成后生成的匹配批次
}

export interface Employee {
  id: string;
  name: string;
  role: LText;
  avatar: string;
  online: boolean;
  joinedAt: string;
  skills: LText[];
  bio: LText;
  stats: {
    autoTasks: number;
    chatTasks: number;
    projects: number;
  };
}

export interface Campaign {
  id: string;
  name: LText;
  brand: LText;
  image?: string;
  description?: LText;
  goal: CampaignGoal;
  category: string;
  status: CampaignStatus;
  startAt: string;
  endAt: string;
  ownerId: string;
  proposed: number;
  collaborating: number;
  delivered: number;
  budget: number;
  spent: number;
  platforms: string[];
  briefSummary: LText;
  compensation: CampaignCompensation;
  creatorRequirements: CampaignCreatorRequirements;
  termsAndConditions?: string;
  attachments: CampaignAttachment[];
  client?: LText;
  contact?: LText;
  quoteCeilingUsd?: number;
  quoteCeilingLocked?: boolean;
  automation?: "full" | "semi" | "manual";
  aiWorkflow?: {
    autoFollowUp: boolean;
    emailTemplates: {
      outreach: string;
      followUp: string;
      finalReminder: string;
    };
  };
  toggles: {
    poolFirst: boolean;
    sampling: boolean;
    adCode: boolean;
  };
  step: CampaignStep;
  updatedAt: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: number;
  engagement: number; // percent
  platform: string;
  fitScore: number; // 0-100
  reason: LText;
  averageQuote?: number;
  collaborations?: number;
}

/** @deprecated 旧建联轮次模型，改用 OutreachEvent */
export interface DealRound {
  round: 1 | 2 | "final" | "handoff";
  ourQuote?: number;
  theirQuote?: number;
  at: string;
  note?: LText;
  byHuman?: boolean;
}

/** @deprecated 旧建联交易模型，改用 OutreachDeal */
export interface CreatorDeal {
  creatorId: string;
  campaignId: string;
  stage: CreatorDealStage;
  rounds: DealRound[];
  ceiling: number;
  finalQuote?: number;
}

/* ────────────────────────────────
 * 客户排重达人库（客户上传私域名单 → 本地脱敏 → 排重 → 撞我方库 → 归属打标）
 * ──────────────────────────────── */

export interface DedupClient {
  id: string;
  name: LText;
}

/**
 * 单条名单的撞库结论：
 * - matched      我方库已有 → 重合，客户不必重复付费触达
 * - client_only  客户独有 → 可入我方库并打上该客户归属标
 * - duplicate    批内重复 → 客户名单自身脏数据
 * - invalid      无法解析（空行 / 过短 / 纯符号）
 */
export type DedupMatchStatus = "matched" | "client_only" | "duplicate" | "invalid";

export interface DedupEntry {
  id: string;
  /** 原始标识，仅存在于浏览器内存，不参与展示（除非内部显式展开且留痕） */
  raw: string;
  /** 无盐 md5，跨批次稳定，用于排重与撞库 */
  matchKey: string;
  status: DedupMatchStatus;
  /** 命中我方库时的达人 id */
  creatorId?: string;
}

export interface DedupBatch {
  id: string;
  clientId: string;
  fileName: string;
  uploadedAt: string;
  /** 该批展示指纹的盐 —— 换批即换指纹 */
  salt: string;
  entries: DedupEntry[];
}

/** 内部展开原文的留痕记录 */
export interface RevealRecord {
  entryId: string;
  by: string;
  at: string;
}

export interface ApprovalItem {
  id: string;
  kind: "matching" | "outreach" | "video" | "contract" | "quote";
  campaignId: string;
  title: LText;
  reason: LText;
  count: number;
  ts: string;
}

export interface MailItem {
  id: string;
  from: string;
  subject: string;
  preview: string;
  ts: string;
  unread: boolean;
  campaignId?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "employee";
  content: string;
  ts: string;
  card?: {
    kind: "campaign" | "mail" | "creator-list";
    title: string;
    summary: string;
    href?: string;
  };
}
