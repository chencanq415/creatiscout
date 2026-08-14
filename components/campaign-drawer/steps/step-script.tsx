"use client";
import { useLoc } from "@/lib/i18n/use-i18n";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign } from "@/lib/types";
import { ReviewStepBody } from "../shared/review-step-body";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至审核视频", en: "Advance to video review" },
  agentTextSuffix: {
    zh: "份脚本在确认流程 · AI 预审自动执行 · 打回意见结构化发送达人",
    en: "scripts in alignment · AI pre-review runs automatically · structured feedback sent to creators",
  },
} as const;

export function StepScript({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const threads = usePipelineStore((s) => s.scriptThreads);
  const active = threads.filter((t) => t.status !== "approved").length;
  return (
    <StepShell
      agentStatus="waiting-human"
      agentText={`${active} ${l(L.agentTextSuffix)}`}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <ReviewStepBody kind="script" sourceStep="script" />
    </StepShell>
  );
}
