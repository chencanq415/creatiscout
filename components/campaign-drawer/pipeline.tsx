"use client";
import { useLoc } from "@/lib/i18n/use-i18n";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { StepConfirm } from "./steps/step-confirm";
import { StepContract } from "./steps/step-contract";
import { StepMatching } from "./steps/step-matching";
import { StepOutreach } from "./steps/step-outreach";
import { StepPublish } from "./steps/step-publish";
import { StepScript } from "./steps/step-script";
import { PipelineAdvanceContext } from "./steps/step-shell";
import { StepTracking } from "./steps/step-tracking";

const L = {
  collaboration: { zh: "协作进度", en: "Collaboration" },
  collaborationDesc: { zh: "Campaign × 达人完整执行流程", en: "Campaign × creator delivery workflow" },
  aiMatching: { zh: "AI 匹配池", en: "AI Match Pool" },
  shortlist: { zh: "候选达人", en: "Shortlist" },
  outreach: { zh: "达人建联", en: "Outreach" },
  offer: { zh: "合作报价", en: "Offer" },
  confirmed: { zh: "确认合作", en: "Confirmed" },
  draft: { zh: "内容草稿", en: "Draft" },
  publication: { zh: "作品发布", en: "Publication" },
  payment: { zh: "付款", en: "Payment" },
  tracking: { zh: "效果追踪", en: "Performance Tracking" },
} as const;

type CollaborationStage =
  | "aiMatching"
  | "shortlist"
  | "outreach"
  | "offer"
  | "confirmed"
  | "draft"
  | "publication"
  | "payment"
  | "tracking";

type StepDef = {
  id: CollaborationStage;
  label: string;
  count: number;
};

export function CampaignPipeline({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const lookalikeUnseen = usePipelineStore((s) => s.lookalikeUnseen);
  const clearLookalikeUnseen = usePipelineStore((s) => s.clearLookalikeUnseen);
  const outreachDeals = usePipelineStore((s) => s.outreachDeals);
  const confirmations = usePipelineStore((s) => s.confirmations);
  const contracts = usePipelineStore((s) => s.contracts);
  const scriptThreads = usePipelineStore((s) => s.scriptThreads);
  const videoThreads = usePipelineStore((s) => s.videoThreads);
  const publishRecords = usePipelineStore((s) => s.publishRecords);
  const invoices = usePipelineStore((s) => s.invoices);

  const steps: StepDef[] = useMemo(() => {
    const draftCreators = new Set([
      ...scriptThreads.map((thread) => thread.creatorId),
      ...videoThreads.map((thread) => thread.creatorId),
    ]).size;
    const outreachCount = outreachDeals.filter((deal) => deal.stage === "inquiry").length;
    const offerCount = outreachDeals.filter((deal) =>
      ["negotiation", "internal_review", "client_review"].includes(deal.stage),
    ).length;
    const publicationCount = publishRecords.filter((record) => !record.publishedAt).length;
    const paymentCount = invoices.filter((invoice) => !invoice.paid).length;

    return [
      { id: "aiMatching", label: l(L.aiMatching), count: campaign.proposed },
      { id: "shortlist", label: l(L.shortlist), count: Math.max(Math.round(campaign.proposed * 0.25) - outreachDeals.length, 0) },
      { id: "outreach", label: l(L.outreach), count: outreachCount },
      { id: "offer", label: l(L.offer), count: offerCount },
      { id: "confirmed", label: l(L.confirmed), count: Math.max(confirmations.length, contracts.length) },
      { id: "draft", label: l(L.draft), count: draftCreators },
      { id: "publication", label: l(L.publication), count: publicationCount },
      { id: "payment", label: l(L.payment), count: paymentCount },
      { id: "tracking", label: l(L.tracking), count: Math.max(campaign.delivered, invoices.filter((invoice) => invoice.paid).length) },
    ];
  }, [campaign.delivered, campaign.proposed, confirmations, contracts, invoices, l, outreachDeals, publishRecords, scriptThreads, videoThreads]);

  const initialStepId: CollaborationStage = mapCampaignStep(campaign.step);
  const initialIdx = steps.findIndex((s) => s.id === initialStepId);
  const [active, setActive] = useState<CollaborationStage>(initialIdx < 0 ? steps[0].id : initialStepId);
  const [currentIdx, setCurrentIdx] = useState(initialIdx < 0 ? 0 : initialIdx);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-center the stepper whenever the active step changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  function advance() {
    const idxOfActive = steps.findIndex((s) => s.id === active);
    if (idxOfActive < 0) return;
    // Mark the active step as completed: ensure currentIdx > idxOfActive
    const nextCurrentIdx = Math.max(currentIdx, idxOfActive + 1);
    setCurrentIdx(Math.min(nextCurrentIdx, steps.length - 1));
    const nextStep = steps[Math.min(idxOfActive + 1, steps.length - 1)];
    if (nextStep) setActive(nextStep.id);
  }

  function selectStep(id: CollaborationStage) {
    setActive(id);
    if (id === "aiMatching" && lookalikeUnseen > 0) clearLookalikeUnseen();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-shrink-0 border-b border-border bg-surface px-6 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
          {l(L.collaboration)}
        </div>
        <div className="mt-0.5 text-[11px] text-muted">{l(L.collaborationDesc)}</div>
      </div>
      {/* Step pipeline — horizontally scrollable on narrow widths, fade-out mask on edges */}
      <div className="flex-shrink-0 border-b border-border bg-surface">
        <div
          className="overflow-x-auto px-6 pt-4"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
            scrollbarWidth: "thin",
          }}
        >
          <div className="flex w-max items-stretch gap-1 pb-0">
            {steps.map((s, i) => {
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isActive = active === s.id;
              return (
                  <button
                    key={s.id}
                    ref={isActive ? activeRef : undefined}
                    type="button"
                    onClick={() => selectStep(s.id)}
                    className={cn(
                      "group relative flex min-w-[108px] flex-shrink-0 items-center gap-2 rounded-t-[9px] px-3 pb-3 pt-3 text-[12px] transition-colors",
                      isActive
                        ? "text-brand"
                        : isCurrent
                          ? "text-ink"
                          : isPast
                            ? "text-teal-text"
                            : "text-muted hover:text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular",
                        isPast && "bg-soft-teal text-teal-text",
                        isCurrent && !isActive && "bg-soft-pink text-brand",
                        isActive && "bg-brand text-white",
                        !isPast && !isCurrent && !isActive && "bg-surface-warm text-muted",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="whitespace-nowrap font-medium">{s.label}</span>
                    <span className={cn(
                      "absolute right-1.5 top-0 flex h-[17px] min-w-[17px] -translate-y-1/3 items-center justify-center rounded-full px-1 text-[9px] font-bold shadow-sm",
                      isActive ? "bg-brand-strong text-white" : "bg-surface-warm text-slate",
                    )}>{s.count}</span>
                    <span
                      className={cn(
                        "absolute inset-x-1.5 -bottom-px h-[2px] rounded-full transition-colors",
                        isActive ? "bg-brand" : "bg-transparent",
                      )}
                      aria-hidden
                    />
                  </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active step content */}
      <div className="flex-1 overflow-y-auto bg-surface p-6">
        <PipelineAdvanceContext.Provider value={advance}>
          {active === "aiMatching" && <StepMatching campaign={campaign} />}
          {active === "shortlist" && <StepMatching campaign={campaign} mode="shortlist" />}
          {active === "outreach" && <StepOutreach campaign={campaign} />}
          {active === "offer" && <StepConfirm campaign={campaign} />}
          {active === "confirmed" && <StepContract campaign={campaign} />}
          {active === "draft" && <StepScript campaign={campaign} />}
          {active === "publication" && <StepPublish campaign={campaign} />}
          {active === "payment" && <StepPublish campaign={campaign} />}
          {active === "tracking" && <StepTracking campaign={campaign} />}
        </PipelineAdvanceContext.Provider>
      </div>
    </div>
  );
}

function mapCampaignStep(step: Campaign["step"]): CollaborationStage {
  if (step === "brief" || step === "matching") return "aiMatching";
  if (step === "outreach") return "outreach";
  if (step === "confirm") return "offer";
  if (step === "contract" || step === "sample") return "confirmed";
  if (step === "script" || step === "video") return "draft";
  if (step === "publish") return "publication";
  return "tracking";
}
