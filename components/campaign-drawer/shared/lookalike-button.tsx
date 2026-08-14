"use client";
import { useLoc } from "@/lib/i18n/use-i18n";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { CampaignStep } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Bot, Check, Sparkles } from "lucide-react";

const L = {
  lookalike: { zh: "Lookalike", en: "Lookalike" },
  taking: { zh: "Mia 接管中…", en: "Mia taking over…" },
  done: { zh: "已生成批次", en: "Batch generated" },
} as const;

/**
 * 达人卡片上的一键扩量按钮：点击 → Mia 接管（~2s）→ 在达人匹配步生成 Lookalike 批次。
 * 所有 step 的达人卡都可复用。
 */
export function LookalikeButton({
  creatorId,
  sourceStep,
  className,
}: {
  creatorId: string;
  sourceStep: CampaignStep;
  className?: string;
}) {
  const l = useLoc();
  const { lookalikeTasks, startLookalike } = usePipelineStore();
  const task = lookalikeTasks.find((t) => t.sourceCreatorId === creatorId);

  if (task?.status === "running") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[#DDD2F8] bg-[#F3ECFF] px-2 py-0.5 text-[11px] font-medium text-lavender-text",
          className,
        )}
      >
        <Bot className="h-3 w-3 animate-pulse" />🤖 {l(L.taking)}
      </span>
    );
  }
  if (task?.status === "done") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[#C8E6D0] bg-[#EDF9F0] px-2 py-0.5 text-[11px] font-medium text-teal-text",
          className,
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
        {l(L.done)}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        startLookalike(creatorId, sourceStep);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[#DDD2F8] bg-[#F3ECFF] px-2 py-0.5 text-[11px] font-medium text-lavender-text hover:bg-[#EADFFF]",
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      {l(L.lookalike)}
    </button>
  );
}
