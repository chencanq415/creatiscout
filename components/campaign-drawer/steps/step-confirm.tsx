"use client";
import { Badge } from "@/components/ui/badge";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign, ConfirmItemKey } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Check, MailCheck, MessageCircleQuestion } from "lucide-react";
import { LookalikeButton } from "../shared/lookalike-button";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至合同签署", en: "Advance to contract signing" },
  finalQuote: { zh: "最终报价", en: "Final quote" },
  checklist: { zh: "7 项确认清单", en: "7-item confirmation checklist" },
  creatorReplied: { zh: "达人已确认", en: "Creator confirmed" },
  awaitingReply: { zh: "等达人回复「确认」", en: "Awaiting creator's confirmation reply" },
  simulateReply: { zh: "模拟达人回复确认", en: "Simulate creator confirmation" },
  allDone: {
    zh: "全部确认完成 · 已流入合同签署",
    en: "Fully confirmed · flowed into contract signing",
  },
  agentTextSuffix: {
    zh: "位达人进入确认合作 · 清单齐全 + 达人确认后自动生成合同",
    en: "creators in confirmation · contract auto-drafts once checklist + creator reply complete",
  },
} as const;

const itemLabels: Record<ConfirmItemKey, LText> = {
  overview: { zh: "项目概要", en: "Project overview" },
  compensation: { zh: "报酬及交付权益", en: "Compensation & deliverables" },
  sample_rights: { zh: "样品选择权益", en: "Sample selection rights" },
  sample_eta: { zh: "样品到货时间", en: "Sample arrival time" },
  production_time: { zh: "内容制作时间", en: "Production timeline" },
  publish_time: { zh: "发布时间", en: "Publish date" },
  payment_terms: { zh: "付款方式", en: "Payment terms" },
};

export function StepConfirm({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const { confirmations, toggleConfirmItem, simulateCreatorReply } = usePipelineStore();

  return (
    <StepShell
      agentStatus="waiting-human"
      agentText={`${confirmations.length} ${l(L.agentTextSuffix)}`}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <div className="space-y-4">
        {confirmations.map((conf) => {
          const c = creators.find((x) => x.id === conf.creatorId);
          if (!c) return null;
          const keys = Object.keys(itemLabels) as ConfirmItemKey[];
          const doneCount = keys.filter((k) => conf.items[k]).length;
          const allDone = doneCount === keys.length && conf.creatorReplied;
          return (
            <div
              key={conf.creatorId}
              className="rounded-[12px] border border-border bg-surface p-4"
            >
              {/* 头部 */}
              <div className="flex flex-wrap items-center gap-2">
                <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
                <span className="text-[14px] font-semibold text-ink">{c.name}</span>
                <LookalikeButton creatorId={c.id} sourceStep="confirm" />
                <span className="ml-auto text-[11px] text-muted">{l(L.finalQuote)}</span>
                <span className="tabular text-[14px] font-bold text-ink">
                  {formatCurrency(conf.finalQuote)}
                </span>
              </div>

              {/* 7 项清单 */}
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted">
                    {l(L.checklist)}
                  </span>
                  <span className="tabular text-[11px] font-semibold text-slate">
                    {doneCount}/{keys.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                  {keys.map((k) => {
                    const on = conf.items[k];
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleConfirmItem(conf.creatorId, k)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-left text-[12px] transition-colors",
                          on
                            ? "border-[#C8E6D0] bg-[#EDF9F0] text-teal-text"
                            : "border-border bg-surface-warm/50 text-slate hover:bg-surface-warm",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full",
                            on ? "bg-teal text-white" : "border border-border bg-surface",
                          )}
                        >
                          {on && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                        {l(itemLabels[k])}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 达人回复状态 */}
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                {conf.creatorReplied ? (
                  <Badge tone="teal">
                    <MailCheck className="mr-1 h-3 w-3" />
                    {l(L.creatorReplied)}
                  </Badge>
                ) : (
                  <>
                    <Badge tone="amber">
                      <MessageCircleQuestion className="mr-1 h-3 w-3" />
                      {l(L.awaitingReply)}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => simulateCreatorReply(conf.creatorId)}
                      className="rounded-full border border-dashed border-border bg-surface-warm/50 px-3 py-1 text-[11px] text-slate hover:bg-surface-warm hover:text-ink"
                    >
                      {l(L.simulateReply)}
                    </button>
                  </>
                )}
                {allDone && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-teal-text">
                    <Check className="h-3 w-3" strokeWidth={3} />
                    {l(L.allDone)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}
