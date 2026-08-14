"use client";
import { useLoc } from "@/lib/i18n/use-i18n";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign } from "@/lib/types";
import { ReviewStepBody } from "../shared/review-step-body";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至发布回传", en: "Advance to publish & payment" },
  agentTextSuffix: {
    zh: "条视频在审核流程 · AI 预审自动检测竞品露出 / 禁忌词",
    en: "videos in review · AI pre-review auto-detects competitor exposure / taboo terms",
  },
} as const;

export function StepVideo({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const threads = usePipelineStore((s) => s.videoThreads);
  const active = threads.filter((t) => t.status !== "approved").length;
  return (
    <StepShell
      agentStatus="waiting-human"
      agentText={`${active} ${l(L.agentTextSuffix)}`}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <ReviewStepBody kind="video" sourceStep="video" />
    </StepShell>
  );
}
