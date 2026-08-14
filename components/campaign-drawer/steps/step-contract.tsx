"use client";
import { Badge } from "@/components/ui/badge";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign, SignStatus } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { AlertTriangle, Check, CreditCard, FileSignature, Lock, Send } from "lucide-react";
import { LookalikeButton } from "../shared/lookalike-button";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至寄样管理", en: "Advance to sample management" },
  agreement: { zh: "合作信", en: "Collaboration Agreement" },
  nda: { zh: "NDA 保密协议", en: "NDA" },
  ndaFirst: { zh: "保密项目 · NDA 优先签", en: "Confidential project · NDA signs first" },
  noNda: { zh: "非保密项目", en: "Non-confidential" },
  payout: { zh: "收款信息", en: "Payout Info" },
  payoutOk: { zh: "收款信息完整 ✓", en: "Payout info complete ✓" },
  payoutMissing: { zh: "收款信息缺失", en: "Payout info missing" },
  simulateFix: { zh: "模拟达人补齐", en: "Simulate creator completing" },
  statusNotSent: { zh: "未发送", en: "Not sent" },
  statusSent: { zh: "已发送", en: "Sent" },
  statusCreatorSigned: { zh: "达人已签", en: "Creator signed" },
  statusCompleted: { zh: "双方已签", en: "Fully signed" },
  actSend: { zh: "发送", en: "Send" },
  actAdvance: { zh: "模拟签署推进", en: "Simulate signing" },
  allDone: {
    zh: "签署完成 · 已流入寄样管理与脚本确认",
    en: "Signing complete · flowed into sampling & script",
  },
  agentTextSuffix: {
    zh: "份合同在签署流程 · 收款信息自动完整性校验",
    en: "contracts in signing · payout info auto-validated",
  },
} as const;

const signMeta: Record<SignStatus, { label: LText; tone: "gray" | "blue" | "amber" | "teal" }> = {
  not_sent: { label: L.statusNotSent, tone: "gray" },
  sent: { label: L.statusSent, tone: "blue" },
  creator_signed: { label: L.statusCreatorSigned, tone: "amber" },
  completed: { label: L.statusCompleted, tone: "teal" },
};

export function StepContract({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const { contracts, sendDoc, advanceSign, completePayoutInfo } = usePipelineStore();

  return (
    <StepShell
      agentStatus="waiting-human"
      agentText={`${contracts.length} ${l(L.agentTextSuffix)}`}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <div className="space-y-4">
        {contracts.map((ct) => {
          const c = creators.find((x) => x.id === ct.creatorId);
          if (!c) return null;
          const done =
            ct.agreementStatus === "completed" &&
            (!ct.needNda || ct.ndaStatus === "completed") &&
            ct.payoutInfoComplete;
          return (
            <div key={ct.creatorId} className="rounded-[12px] border border-border bg-surface p-4">
              {/* 头部 */}
              <div className="flex flex-wrap items-center gap-2">
                <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
                <span className="text-[14px] font-semibold text-ink">{c.name}</span>
                <LookalikeButton creatorId={c.id} sourceStep="contract" />
                {ct.needNda ? (
                  <Badge tone="lavender">
                    <Lock className="mr-1 h-3 w-3" />
                    {l(L.ndaFirst)}
                  </Badge>
                ) : (
                  <Badge tone="gray">{l(L.noNda)}</Badge>
                )}
                <span className="tabular ml-auto text-[14px] font-bold text-ink">
                  {formatCurrency(ct.amount)}
                </span>
              </div>

              {/* 文件签署行：NDA 优先 → 合作信 */}
              <div className="mt-3 space-y-2">
                {ct.needNda && (
                  <DocRow
                    label={l(L.nda)}
                    status={ct.ndaStatus}
                    onSend={() => sendDoc(ct.creatorId, "nda")}
                    onAdvance={() => advanceSign(ct.creatorId, "nda")}
                  />
                )}
                <DocRow
                  label={l(L.agreement)}
                  status={ct.agreementStatus}
                  // NDA 优先签：NDA 未完成时合作信不可发送
                  locked={ct.needNda && ct.ndaStatus !== "completed"}
                  onSend={() => sendDoc(ct.creatorId, "agreement")}
                  onAdvance={() => advanceSign(ct.creatorId, "agreement")}
                />
              </div>

              {/* 收款信息校验 */}
              <div
                className={cn(
                  "mt-3 flex flex-wrap items-center gap-2 rounded-[8px] px-3 py-2",
                  ct.payoutInfoComplete ? "bg-[#EDF9F0]" : "bg-soft-amber/50",
                )}
              >
                <CreditCard
                  className={cn(
                    "h-4 w-4",
                    ct.payoutInfoComplete ? "text-teal-text" : "text-amber-text",
                  )}
                />
                {ct.payoutInfoComplete ? (
                  <span className="text-[12px] font-medium text-teal-text">{l(L.payoutOk)}</span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-amber-text">
                      <AlertTriangle className="h-3 w-3" />
                      {l(L.payoutMissing)}:
                    </span>
                    {(ct.payoutMissing ?? []).map((m) => (
                      <span
                        key={m.en}
                        className="rounded bg-surface px-1.5 py-px text-[11px] text-brand-strong"
                      >
                        {l(m)}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => completePayoutInfo(ct.creatorId)}
                      className="ml-auto rounded-full border border-dashed border-border bg-surface px-3 py-1 text-[11px] text-slate hover:bg-surface-warm hover:text-ink"
                    >
                      {l(L.simulateFix)}
                    </button>
                  </>
                )}
              </div>

              {done && (
                <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-[12px] font-medium text-teal-text">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  {l(L.allDone)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </StepShell>
  );
}

function DocRow({
  label,
  status,
  locked,
  onSend,
  onAdvance,
}: {
  label: string;
  status: SignStatus;
  locked?: boolean;
  onSend: () => void;
  onAdvance: () => void;
}) {
  const l = useLoc();
  const meta = signMeta[status];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[8px] border border-border bg-surface-warm/40 px-3 py-2">
      <FileSignature className="h-4 w-4 text-slate" />
      <span className="text-[12px] font-medium text-ink">{label}</span>
      <Badge tone={meta.tone}>{l(meta.label)}</Badge>
      <div className="ml-auto flex gap-1.5">
        {status === "not_sent" && (
          <button
            type="button"
            disabled={locked}
            onClick={onSend}
            className="inline-flex items-center gap-1 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-medium text-white hover:bg-[#D81D63] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3 w-3" />
            {l(L.actSend)}
          </button>
        )}
        {(status === "sent" || status === "creator_signed") && (
          <button
            type="button"
            onClick={onAdvance}
            className="rounded-full border border-dashed border-border bg-surface px-3 py-1 text-[11px] text-slate hover:bg-surface-warm hover:text-ink"
          >
            {l(L.actAdvance)}
          </button>
        )}
        {status === "completed" && <Check className="h-4 w-4 text-teal-text" strokeWidth={3} />}
      </div>
    </div>
  );
}
