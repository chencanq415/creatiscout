"use client";
import { useLoc } from "@/lib/i18n/use-i18n";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { StepBrief } from "./steps/step-brief";
import { StepConfirm } from "./steps/step-confirm";
import { StepContract } from "./steps/step-contract";
import { StepMatching } from "./steps/step-matching";
import { StepOutreach } from "./steps/step-outreach";
import { StepPublish } from "./steps/step-publish";
import { StepSample } from "./steps/step-sample";
import { StepScript } from "./steps/step-script";
import { PipelineAdvanceContext } from "./steps/step-shell";
import { StepTracking } from "./steps/step-tracking";
import { StepVideo } from "./steps/step-video";

const L = {
  brief: { zh: "Brief 理解", en: "Brief Intake" },
  matching: { zh: "达人匹配", en: "Creator Matching" },
  outreach: { zh: "达人建联", en: "Creator Outreach" },
  confirm: { zh: "确认合作", en: "Deal Confirmation" },
  contract: { zh: "合同签署", en: "Contract Signing" },
  sample: { zh: "寄样管理", en: "Sample Management" },
  script: { zh: "脚本确认", en: "Script Alignment" },
  video: { zh: "审核视频", en: "Video Review" },
  publish: { zh: "发布回传", en: "Publish & Payment" },
  tracking: { zh: "效果监控", en: "Performance Tracking" },
} as const;

type StepDef = {
  id: string;
  label: string;
  conditional?: boolean;
};

export function CampaignPipeline({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const lookalikeUnseen = usePipelineStore((s) => s.lookalikeUnseen);
  const clearLookalikeUnseen = usePipelineStore((s) => s.clearLookalikeUnseen);

  const steps: StepDef[] = useMemo(() => {
    const base: StepDef[] = [
      { id: "brief", label: l(L.brief) },
      { id: "matching", label: l(L.matching) },
      { id: "outreach", label: l(L.outreach) },
      { id: "confirm", label: l(L.confirm) },
      { id: "contract", label: l(L.contract) },
    ];
    if (campaign.toggles.sampling) {
      base.push({ id: "sample", label: l(L.sample), conditional: true });
    }
    base.push({ id: "script", label: l(L.script) });
    base.push({ id: "video", label: l(L.video) });
    base.push({ id: "publish", label: l(L.publish) });
    base.push({ id: "tracking", label: l(L.tracking) });
    return base;
  }, [campaign.toggles.sampling, l]);

  const initialStepId = campaign.step;
  const initialIdx = steps.findIndex((s) => s.id === initialStepId);
  const [active, setActive] = useState<string>(initialIdx < 0 ? steps[0].id : initialStepId);
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

  function selectStep(id: string) {
    setActive(id);
    // 进入达人匹配即视为已查看 Lookalike 新批次
    if (id === "matching" && lookalikeUnseen > 0) clearLookalikeUnseen();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
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
          <div className="flex w-max items-stretch pb-0">
            {steps.map((s, i) => {
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isActive = active === s.id;
              const isLast = i === steps.length - 1;
              const showLookalikeBadge = s.id === "matching" && lookalikeUnseen > 0;
              return (
                <Fragment key={s.id}>
                  <button
                    ref={isActive ? activeRef : undefined}
                    type="button"
                    onClick={() => selectStep(s.id)}
                    className={cn(
                      "group relative flex flex-shrink-0 items-center gap-1.5 px-2 pb-3 pt-1.5 text-[12px] transition-colors",
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
                      {isPast ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="whitespace-nowrap font-medium">{s.label}</span>
                    {/* Lookalike 新批次红点 */}
                    {showLookalikeBadge && (
                      <span className="flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-brand-strong px-1 text-[9px] font-bold text-white">
                        {lookalikeUnseen}
                      </span>
                    )}
                    <span
                      className={cn(
                        "absolute inset-x-1.5 -bottom-px h-[2px] rounded-full transition-colors",
                        isActive ? "bg-brand" : "bg-transparent",
                      )}
                      aria-hidden
                    />
                  </button>
                  {!isLast && (
                    <div className="flex flex-shrink-0 items-center px-1" aria-hidden>
                      <span
                        className={cn(
                          "h-[2px] w-4 rounded-full transition-colors",
                          i < currentIdx ? "bg-teal/60" : "bg-border",
                        )}
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active step content */}
      <div className="flex-1 overflow-y-auto bg-page p-6">
        <PipelineAdvanceContext.Provider value={advance}>
          {active === "brief" && <StepBrief campaign={campaign} />}
          {active === "matching" && <StepMatching campaign={campaign} />}
          {active === "outreach" && <StepOutreach campaign={campaign} />}
          {active === "confirm" && <StepConfirm campaign={campaign} />}
          {active === "contract" && <StepContract campaign={campaign} />}
          {active === "sample" && <StepSample campaign={campaign} />}
          {active === "script" && <StepScript campaign={campaign} />}
          {active === "video" && <StepVideo campaign={campaign} />}
          {active === "publish" && <StepPublish campaign={campaign} />}
          {active === "tracking" && <StepTracking campaign={campaign} />}
        </PipelineAdvanceContext.Provider>
      </div>
    </div>
  );
}
