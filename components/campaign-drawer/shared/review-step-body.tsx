"use client";
import { Badge } from "@/components/ui/badge";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { CampaignStep, ReviewThread } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import { CalendarClock, FileText, Upload } from "lucide-react";
import { LookalikeButton } from "./lookalike-button";
import { VersionCard } from "./review-chain";

const L = {
  briefTitle: { zh: "Brief 下发卡片", en: "Brief Dispatch Card" },
  briefDesc: {
    zh: "已随合同自动下发给全部达人，包含以下要点：",
    en: "Auto-dispatched to all creators with the contract, covering:",
  },
  briefPoints: { zh: "必讲卖点 ×3", en: "Must-mention selling points ×3" },
  briefDo: {
    zh: "DO：真实使用场景 / 前 3 秒冲突 hook",
    en: "DO: real usage scenes / conflict hook in first 3s",
  },
  briefDont: {
    zh: "DON'T：竞品露出 / 医疗功效表述",
    en: "DON'T: competitor exposure / medical claims",
  },
  briefHashtag: { zh: "#GlowUp618 #HoneylabPartner", en: "#GlowUp618 #HoneylabPartner" },
  briefRef: { zh: "案例参考视频 ×3", en: "Reference videos ×3" },
  deadline: { zh: "承诺交稿", en: "Deadline" },
  overdue: { zh: "已逾期", en: "Overdue" },
  waiting: { zh: "等达人交稿", en: "Awaiting submission" },
  inReview: { zh: "审核中", en: "In review" },
  changes: { zh: "已打回待修改", en: "Changes requested" },
  approvedS: { zh: "已通过", en: "Approved" },
  simulate: { zh: "模拟达人交稿", en: "Simulate submission" },
  simulateNew: { zh: "模拟新版本提交", en: "Simulate new version" },
} as const;

const statusMeta: Record<
  ReviewThread["status"],
  { label: LText; tone: "gray" | "blue" | "amber" | "teal" }
> = {
  waiting_submission: { label: L.waiting, tone: "gray" },
  in_review: { label: L.inReview, tone: "blue" },
  changes_requested: { label: L.changes, tone: "amber" },
  approved: { label: L.approvedS, tone: "teal" },
};

/** 脚本确认 / 审核视频 共用主体：Brief 卡片 + 每位达人的版本线 */
export function ReviewStepBody({
  kind,
  sourceStep,
}: {
  kind: "script" | "video";
  sourceStep: CampaignStep;
}) {
  const l = useLoc();
  const [locale] = useLocale();
  const { scriptThreads, videoThreads, submitVersion } = usePipelineStore();
  const threads = kind === "script" ? scriptThreads : videoThreads;

  return (
    <div className="space-y-4">
      {/* Brief 下发卡片（来自旧素材下发） */}
      <div className="rounded-[10px] border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand" />
          <span className="text-[13px] font-semibold text-ink">{l(L.briefTitle)}</span>
        </div>
        <p className="mt-1 text-[12px] text-slate">{l(L.briefDesc)}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[L.briefPoints, L.briefDo, L.briefDont, L.briefHashtag, L.briefRef].map((t) => (
            <span
              key={t.en}
              className="rounded-full bg-surface-warm px-2.5 py-1 text-[11px] text-slate"
            >
              {l(t)}
            </span>
          ))}
        </div>
      </div>

      {/* 每位达人的版本线 */}
      {threads.map((t) => {
        const c = creators.find((x) => x.id === t.creatorId);
        if (!c) return null;
        const overdue = t.status === "waiting_submission" && new Date(t.deadline) < new Date();
        const meta = statusMeta[t.status];
        const canSubmit = t.status === "waiting_submission" || t.status === "changes_requested";
        return (
          <div key={t.creatorId} className="rounded-[12px] border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
              <span className="text-[14px] font-semibold text-ink">{c.name}</span>
              <LookalikeButton creatorId={c.id} sourceStep={sourceStep} />
              <Badge tone={meta.tone}>{l(meta.label)}</Badge>
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1 text-[11px]",
                  overdue ? "font-medium text-brand-strong" : "text-muted",
                )}
              >
                <CalendarClock className="h-3 w-3" />
                {l(L.deadline)} · {formatRelative(t.deadline, locale)}
                {overdue && ` · ${l(L.overdue)}`}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {t.versions.map((v, i) => (
                <VersionCard
                  key={v.version}
                  thread={t}
                  version={v}
                  isLatest={i === t.versions.length - 1}
                />
              ))}
            </div>

            {canSubmit && (
              <button
                type="button"
                onClick={() => submitVersion(t.creatorId, kind)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-surface-warm/50 px-3 py-1.5 text-[12px] text-slate hover:bg-surface-warm hover:text-ink"
              >
                <Upload className="h-3 w-3" />
                {t.versions.length === 0 ? l(L.simulate) : l(L.simulateNew)} (V
                {t.versions.length + 1})
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
