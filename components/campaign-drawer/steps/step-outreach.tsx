"use client";
import { Badge } from "@/components/ui/badge";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign, OutreachDeal, OutreachStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Bot,
  Building2,
  Check,
  Handshake,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { LookalikeButton } from "../shared/lookalike-button";
import { RoundTimeline } from "../shared/round-timeline";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至确认合作", en: "Advance to deal confirmation" },
  stageInquiry: { zh: "询价", en: "Inquiry" },
  stageNegotiation: { zh: "议价", en: "Negotiation" },
  stageInternal: { zh: "内部审核", en: "Internal Review" },
  stageClient: { zh: "客户审核", en: "Client Review" },
  stageDone: { zh: "已通过", en: "Approved" },
  round: { zh: "轮", en: "R" },
  currentQuote: { zh: "当前报价", en: "Current quote" },
  ceiling: { zh: "报价天花板", en: "Quote ceiling" },
  emptyStage: { zh: "该阶段暂无达人", en: "No creators in this stage" },
  selectHint: {
    zh: "从左侧选择一位达人查看轮次时间线",
    en: "Select a creator to view the round timeline",
  },
  timeline: { zh: "轮次时间线", en: "Round Timeline" },
  actSimQuote: { zh: "模拟达人报价", en: "Simulate creator quote" },
  actCounter: { zh: "发起议价 (-8%)", en: "Counter offer (-8%)" },
  actAgree: { zh: "达成价格 → 内审", en: "Agree price → internal review" },
  actInternalOk: { zh: "内审通过 → 客户审核", en: "Internal approve → client review" },
  actInternalNo: { zh: "内审打回", en: "Internal reject" },
  actClientOk: { zh: "客户通过 → 确认合作", en: "Client approve → confirmation" },
  actClientNo: { zh: "客户打回（轮次+1）", en: "Client reject (round +1)" },
  inquiryHint: {
    zh: "询价 4 必要素已随邮件发出：合作产品 / 交付内容 / 使用授权 / 报价请求",
    en: "Inquiry email sent with the 4 essentials: product, deliverables, usage rights, quote request",
  },
  clientRejectFlow: {
    zh: "客户打回后达人自动回流至议价，轮次 +1",
    en: "On client rejection the creator flows back to negotiation with round +1",
  },
  agentTextSuffix: {
    zh: "位达人在建联流程中 · 客户打回自动回流议价",
    en: "creators in outreach · client rejections auto-flow back to negotiation",
  },
} as const;

const stageDefs: { id: OutreachStage; label: LText; icon: typeof Search }[] = [
  { id: "inquiry", label: L.stageInquiry, icon: Search },
  { id: "negotiation", label: L.stageNegotiation, icon: Handshake },
  { id: "internal_review", label: L.stageInternal, icon: ShieldCheck },
  { id: "client_review", label: L.stageClient, icon: Building2 },
  { id: "done", label: L.stageDone, icon: Check },
];

export function StepOutreach({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const deals = usePipelineStore((s) => s.outreachDeals);
  const [stage, setStage] = useState<OutreachStage>("negotiation");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const inStage = useMemo(() => deals.filter((d) => d.stage === stage), [deals, stage]);
  const selected = inStage.find((d) => d.creatorId === selectedId) ?? inStage[0] ?? null;

  return (
    <StepShell
      agentStatus="running"
      agentText={`${deals.filter((d) => d.stage !== "done").length} ${l(L.agentTextSuffix)}`}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      {/* 二级阶段 tab */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {stageDefs.map((s) => {
          const Icon = s.icon;
          const count = deals.filter((d) => d.stage === s.id).length;
          const isActive = stage === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setStage(s.id);
                setSelectedId(null);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                isActive
                  ? "border-brand bg-soft-pink text-brand"
                  : "border-border bg-surface text-slate hover:text-ink",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {l(s.label)}
              <span
                className={cn(
                  "flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular",
                  isActive ? "bg-brand text-white" : "bg-surface-warm text-muted",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {inStage.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-border bg-surface p-10 text-center text-[13px] text-muted">
          {l(L.emptyStage)}
        </div>
      ) : (
        <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-4">
          {/* 左：该阶段达人列表 */}
          <div className="space-y-2">
            {inStage.map((d) => {
              const c = creators.find((x) => x.id === d.creatorId);
              if (!c) return null;
              const isSel = selected?.creatorId === d.creatorId;
              return (
                <button
                  key={d.creatorId}
                  type="button"
                  onClick={() => setSelectedId(d.creatorId)}
                  className={cn(
                    "w-full rounded-[12px] border bg-surface p-3 text-left transition-colors",
                    isSel ? "border-brand shadow-sm" : "border-border hover:border-slate/40",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-ink">{c.name}</div>
                      <div className="text-[11px] text-muted">{c.handle}</div>
                    </div>
                    <Badge tone={d.round > 1 ? "amber" : "gray"}>
                      {l(L.round)}
                      {d.round}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-muted">{l(L.currentQuote)}</span>
                    <span
                      className={cn(
                        "tabular font-semibold",
                        (d.currentQuote ?? 0) > d.ceiling ? "text-brand-strong" : "text-ink",
                      )}
                    >
                      {d.currentQuote ? `$${d.currentQuote.toLocaleString()}` : "—"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 右：轮次时间线 + 阶段操作 */}
          {selected ? (
            <DealDetail deal={selected} />
          ) : (
            <div className="rounded-[12px] border border-dashed border-border bg-surface p-10 text-center text-[13px] text-muted">
              {l(L.selectHint)}
            </div>
          )}
        </div>
      )}
    </StepShell>
  );
}

function DealDetail({ deal }: { deal: OutreachDeal }) {
  const l = useLoc();
  const {
    simulateQuote,
    moveToNegotiation,
    counterOffer,
    agreePrice,
    reviewInternal,
    reviewClient,
  } = usePipelineStore();
  const c = creators.find((x) => x.id === deal.creatorId);
  if (!c) return null;

  const quote = deal.currentQuote ?? c.averageQuote ?? 5000;

  return (
    <div className="space-y-3">
      {/* 达人头卡 */}
      <div className="rounded-[12px] border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center gap-2">
          <img src={c.avatar} alt="" className="h-10 w-10 rounded-full" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-ink">{c.name}</span>
              <LookalikeButton creatorId={c.id} sourceStep="outreach" />
            </div>
            <div className="text-[11px] text-muted">
              {c.handle} · {c.platform} · {(c.followers / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted">{l(L.ceiling)}</div>
            <div className="tabular text-[14px] font-bold text-ink">
              ${deal.ceiling.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 轮次时间线 */}
      <div className="rounded-[12px] border border-border bg-surface p-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-brand" />
          <span className="text-[13px] font-semibold text-ink">{l(L.timeline)}</span>
          <Badge tone={deal.round > 1 ? "amber" : "gray"} className="ml-auto">
            {l(L.round)}
            {deal.round}
          </Badge>
        </div>
        <RoundTimeline events={deal.events} ceiling={deal.ceiling} />
      </div>

      {/* 阶段操作（模拟状态流转） */}
      <div className="rounded-[12px] border border-border bg-surface p-4">
        {deal.stage === "inquiry" && (
          <>
            <p className="mb-3 text-[11px] text-slate">{l(L.inquiryHint)}</p>
            <div className="flex flex-wrap gap-2">
              {deal.currentQuote === undefined ? (
                <ActionBtn
                  icon={Bot}
                  tone="blue"
                  label={l(L.actSimQuote)}
                  onClick={() => simulateQuote(deal.creatorId, c.averageQuote ?? 5000)}
                />
              ) : (
                <ActionBtn
                  icon={Handshake}
                  tone="amber"
                  label={l(L.stageNegotiation)}
                  onClick={() => moveToNegotiation(deal.creatorId)}
                />
              )}
            </div>
          </>
        )}

        {deal.stage === "negotiation" && (
          <div className="flex flex-wrap gap-2">
            <ActionBtn
              icon={ArrowUpRight}
              tone="amber"
              label={l(L.actCounter)}
              onClick={() => counterOffer(deal.creatorId, Math.round(quote * 0.92))}
            />
            <ActionBtn
              icon={Handshake}
              tone="teal"
              label={l(L.actAgree)}
              onClick={() => agreePrice(deal.creatorId, quote)}
            />
          </div>
        )}

        {deal.stage === "internal_review" && (
          <div className="flex flex-wrap gap-2">
            <ActionBtn
              icon={Check}
              tone="teal"
              label={l(L.actInternalOk)}
              onClick={() => reviewInternal(deal.creatorId, true)}
            />
            <ActionBtn
              icon={X}
              tone="pink"
              label={l(L.actInternalNo)}
              onClick={() => reviewInternal(deal.creatorId, false)}
            />
          </div>
        )}

        {deal.stage === "client_review" && (
          <>
            <p className="mb-3 text-[11px] text-slate">{l(L.clientRejectFlow)}</p>
            <div className="flex flex-wrap gap-2">
              <ActionBtn
                icon={Check}
                tone="teal"
                label={l(L.actClientOk)}
                onClick={() => reviewClient(deal.creatorId, true)}
              />
              <ActionBtn
                icon={X}
                tone="pink"
                label={l(L.actClientNo)}
                onClick={() => reviewClient(deal.creatorId, false)}
              />
            </div>
          </>
        )}

        {deal.stage === "done" && (
          <div className="flex items-center gap-2 text-[12px] text-teal-text">
            <Check className="h-4 w-4" strokeWidth={3} />
            {l(L.stageDone)} · ${(deal.currentQuote ?? 0).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

const actionTones = {
  blue: "bg-soft-blue text-blue-text hover:bg-[#DEEBFE]",
  amber: "bg-soft-amber text-amber-text hover:bg-[#FDEBC8]",
  teal: "bg-soft-teal text-teal-text hover:bg-[#D8F0DF]",
  pink: "bg-soft-pink text-brand-strong hover:bg-[#FCDDE8]",
} as const;

function ActionBtn({
  icon: Icon,
  tone,
  label,
  onClick,
}: {
  icon: typeof Check;
  tone: keyof typeof actionTones;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors",
        actionTones[tone],
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
