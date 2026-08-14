"use client";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type {
  FeedbackCategory,
  GateStatus,
  ReviewGate,
  ReviewThread,
  ReviewVersion,
  StructuredFeedback,
} from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import { Bot, Building2, Check, Loader2, UserRound, X } from "lucide-react";
import { useState } from "react";

const L = {
  gateAi: { zh: "AI 预审", en: "AI Pre-review" },
  gateInternal: { zh: "内部审核", en: "Internal Review" },
  gateClient: { zh: "客户审核", en: "Client Review" },
  version: { zh: "版本", en: "Version" },
  submitted: { zh: "提交于", en: "Submitted" },
  approve: { zh: "通过", en: "Approve" },
  reject: { zh: "打回", en: "Reject" },
  aiFindings: { zh: "AI 预审结论", en: "AI Findings" },
  feedbackTitle: {
    zh: "结构化打回意见（将发送给达人）",
    en: "Structured feedback (sent to creator)",
  },
  feedbackSent: { zh: "打回意见已发送达人", en: "Feedback sent to creator" },
  send: { zh: "发送打回意见", en: "Send feedback" },
  cancel: { zh: "取消", en: "Cancel" },
  placeholder: { zh: "填写该类别的修改意见…", en: "Feedback for this category…" },
  statusPending: { zh: "待处理", en: "Pending" },
  statusRunning: { zh: "审核中", en: "In review" },
  statusApproved: { zh: "已通过", en: "Approved" },
  statusRejected: { zh: "已打回", en: "Rejected" },
} as const;

export const feedbackCategoryLabels: Record<FeedbackCategory, LText> = {
  structure: { zh: "内容结构", en: "Structure" },
  selling_points: { zh: "必讲卖点", en: "Selling Points" },
  must_shoot: { zh: "必拍内容", en: "Must-shoot" },
  taboo: { zh: "内容禁忌", en: "Taboos" },
  cta: { zh: "CTA", en: "CTA" },
};

const gates: { id: ReviewGate; label: LText; icon: typeof Bot }[] = [
  { id: "ai", label: L.gateAi, icon: Bot },
  { id: "internal", label: L.gateInternal, icon: UserRound },
  { id: "client", label: L.gateClient, icon: Building2 },
];

function GateChip({ status }: { status: GateStatus }) {
  const l = useLoc();
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-soft-teal px-1.5 py-px text-[10px] font-medium text-teal-text">
        <Check className="h-2.5 w-2.5" strokeWidth={3} /> {l(L.statusApproved)}
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-soft-pink px-1.5 py-px text-[10px] font-medium text-brand-strong">
        <X className="h-2.5 w-2.5" strokeWidth={3} /> {l(L.statusRejected)}
      </span>
    );
  if (status === "running")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-soft-amber px-1.5 py-px text-[10px] font-medium text-amber-text">
        <Loader2 className="h-2.5 w-2.5 animate-spin" /> {l(L.statusRunning)}
      </span>
    );
  return (
    <span className="rounded-full bg-surface-warm px-1.5 py-px text-[10px] text-muted">
      {l(L.statusPending)}
    </span>
  );
}

/** 单个版本卡：AI预审 → 内审 → 客户审 三关链 + 操作按钮 + 结构化打回表单 */
export function VersionCard({
  thread,
  version,
  isLatest,
}: {
  thread: ReviewThread;
  version: ReviewVersion;
  isLatest: boolean;
}) {
  const l = useLoc();
  const [locale] = useLocale();
  const { approveGate, rejectGate } = usePipelineStore();
  const [rejecting, setRejecting] = useState<ReviewGate | null>(null);

  // 当前可操作的关卡：running 状态的人工关（internal / client）
  const actionableGate: ReviewGate | null =
    isLatest && version.internal === "running"
      ? "internal"
      : isLatest && version.client === "running"
        ? "client"
        : null;

  return (
    <div
      className={cn(
        "rounded-[10px] border bg-surface p-4",
        isLatest ? "border-border" : "border-border/60 opacity-70",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">
          V{version.version}
        </span>
        <span className="text-[11px] text-muted">
          {l(L.submitted)} {formatRelative(version.submittedAt, locale)}
        </span>
      </div>

      {/* 三关链 */}
      <div className="mt-3 flex items-center gap-2">
        {gates.map((g, i) => {
          const Icon = g.icon;
          const status = version[g.id];
          return (
            <div key={g.id} className="flex items-center gap-2">
              {i > 0 && <span className="h-px w-4 bg-border" aria-hidden />}
              <div className="flex items-center gap-1.5 rounded-[8px] border border-border bg-surface-warm/50 px-2 py-1.5">
                <Icon className="h-3.5 w-3.5 text-slate" />
                <span className="text-[11px] font-medium text-ink">{l(g.label)}</span>
                <GateChip status={status} />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI 预审结论 */}
      {version.aiFindings && version.aiFindings.length > 0 && (
        <div className="mt-3 rounded-[8px] bg-surface-warm px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-muted">{l(L.aiFindings)}</div>
          <ul className="mt-1 space-y-0.5 text-[12px] text-ink">
            {version.aiFindings.map((f) => (
              <li key={f.en}>{l(f)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 已发送的打回意见 */}
      {version.feedback && version.feedback.length > 0 && (
        <div className="mt-3 rounded-[8px] border border-[#F4C7C3] bg-[#FEF5F4] px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-brand-strong">
            {l(L.feedbackSent)}
          </div>
          <ul className="mt-1 space-y-1 text-[12px] text-ink">
            {version.feedback.map((f) => (
              <li key={f.category} className="flex items-start gap-1.5">
                <span className="mt-px flex-shrink-0 rounded bg-soft-pink px-1.5 py-px text-[10px] font-medium text-brand-strong">
                  {l(feedbackCategoryLabels[f.category])}
                </span>
                <span className="text-slate">{l(f.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 操作区 */}
      {actionableGate && !rejecting && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => approveGate(thread.creatorId, thread.kind, actionableGate)}
            className="inline-flex items-center gap-1 rounded-full bg-olive px-3 py-1.5 text-[12px] font-medium text-[#2D3608] hover:bg-[#A4BB45]"
          >
            <Check className="h-3 w-3" strokeWidth={3} /> {l(L.approve)}
          </button>
          <button
            type="button"
            onClick={() => setRejecting(actionableGate)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px] font-medium text-amber-text hover:bg-soft-amber"
          >
            <X className="h-3 w-3" strokeWidth={3} /> {l(L.reject)}
          </button>
        </div>
      )}

      {rejecting && (
        <FeedbackForm
          onCancel={() => setRejecting(null)}
          onSend={(fb) => {
            rejectGate(thread.creatorId, thread.kind, rejecting, fb);
            setRejecting(null);
          }}
        />
      )}
    </div>
  );
}

/** 5 类别结构化打回意见表单 */
function FeedbackForm({
  onCancel,
  onSend,
}: {
  onCancel: () => void;
  onSend: (fb: StructuredFeedback[]) => void;
}) {
  const l = useLoc();
  const [texts, setTexts] = useState<Partial<Record<FeedbackCategory, string>>>({});
  const cats = Object.keys(feedbackCategoryLabels) as FeedbackCategory[];
  const filled = cats.filter((c) => (texts[c] ?? "").trim().length > 0);

  return (
    <div className="mt-3 rounded-[8px] border border-border bg-surface-warm/50 p-3">
      <div className="text-[11px] font-semibold text-ink">{l(L.feedbackTitle)}</div>
      <div className="mt-2 space-y-2">
        {cats.map((c) => (
          <div key={c} className="flex items-center gap-2">
            <span className="w-[72px] flex-shrink-0 text-[11px] font-medium text-slate">
              {l(feedbackCategoryLabels[c])}
            </span>
            <input
              value={texts[c] ?? ""}
              onChange={(e) => setTexts((t) => ({ ...t, [c]: e.target.value }))}
              placeholder={l(L.placeholder)}
              className="min-w-0 flex-1 rounded-[6px] border border-border bg-surface px-2 py-1 text-[12px] outline-none placeholder:text-muted focus:border-brand"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-1 text-[12px] text-slate hover:bg-surface-warm"
        >
          {l(L.cancel)}
        </button>
        <button
          type="button"
          disabled={filled.length === 0}
          onClick={() =>
            onSend(
              filled.map((c) => ({
                category: c,
                text: { zh: texts[c] ?? "", en: texts[c] ?? "" },
              })),
            )
          }
          className="rounded-full bg-brand-strong px-3 py-1 text-[12px] font-medium text-white hover:bg-[#D81D63] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {l(L.send)} ({filled.length})
        </button>
      </div>
    </div>
  );
}
