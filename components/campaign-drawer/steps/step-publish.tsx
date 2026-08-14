"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import type { Campaign, InvoiceFieldKey } from "@/lib/types";
import { cn, formatCurrency, formatRelative } from "@/lib/utils";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  Check,
  CircleDollarSign,
  Link2,
  Megaphone,
  ReceiptText,
  X,
} from "lucide-react";
import { LookalikeButton } from "../shared/lookalike-button";
import { StepShell } from "./step-shell";

const L = {
  cta: { zh: "推进至效果监控", en: "Advance to performance tracking" },
  tabPublish: { zh: "发布确认", en: "Publish Confirmation" },
  tabPayment: { zh: "结算付款", en: "Settlement & Payment" },
  promised: { zh: "承诺发布", en: "Promised" },
  published: { zh: "已发布", en: "Published" },
  notPublished: { zh: "未发布", en: "Not published" },
  overdue: { zh: "已逾期", en: "Overdue" },
  checkLink: { zh: "链接回传", en: "Link returned" },
  checkAdCode: { zh: "ad code", en: "ad code" },
  checkBio: { zh: "bio link 挂载", en: "Bio link added" },
  simulatePublish: { zh: "模拟达人发布", en: "Simulate publishing" },
  allChecked: { zh: "校验齐全 · 已流入结算付款", en: "All checks pass · flowed into settlement" },
  invoiceFields: { zh: "Invoice 五要素校验", en: "Invoice 5-field validation" },
  fieldPayee: { zh: "收款方名称", en: "Payee name" },
  fieldProject: { zh: "项目名称", en: "Project name" },
  fieldAmount: { zh: "金额", en: "Amount" },
  fieldPayout: { zh: "收款信息", en: "Payout details" },
  fieldTitle: { zh: "发票抬头", en: "Invoice title" },
  received: { zh: "Invoice 已收到", en: "Invoice received" },
  notReceived: { zh: "等待达人 Invoice", en: "Awaiting creator invoice" },
  simulateInvoice: { zh: "模拟收到 Invoice", en: "Simulate invoice received" },
  dueCountdown: { zh: "账期剩余", en: "Payment due in" },
  workdays: { zh: "个工作日（账期 30 工作日）", en: "business days (30-day terms)" },
  paid: { zh: "已打款", en: "Paid" },
  markPaid: { zh: "标记打款完成", en: "Mark as paid" },
  deliverablesMissing: { zh: "交付遗漏检查", en: "Deliverables check" },
  reminders: { zh: "催收 / 提醒记录", en: "Reminder log" },
  addReminder: { zh: "发送提醒", en: "Send reminder" },
  agentText: {
    zh: "发布链接 / ad code / bio link 自动校验 · Invoice 五要素齐全才进入账期",
    en: "Auto-validates link / ad code / bio link · payment terms start once all 5 invoice fields pass",
  },
} as const;

const invoiceFieldLabels: Record<InvoiceFieldKey, LText> = {
  payee: L.fieldPayee,
  project: L.fieldProject,
  amount: L.fieldAmount,
  payout_info: L.fieldPayout,
  title: L.fieldTitle,
};

export function StepPublish({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  return (
    <StepShell
      agentStatus="running"
      agentText={l(L.agentText)}
      cta={{ label: l(L.cta), tone: "olive" }}
    >
      <Tabs defaultValue="publish">
        <TabsList>
          <TabsTrigger value="publish">
            <Megaphone className="h-3.5 w-3.5" /> {l(L.tabPublish)}
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CircleDollarSign className="h-3.5 w-3.5" /> {l(L.tabPayment)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="publish">
          <PublishView />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentView />
        </TabsContent>
      </Tabs>
    </StepShell>
  );
}

/* ── ① 发布确认 ── */
function PublishView() {
  const l = useLoc();
  const [locale] = useLocale();
  const { publishRecords, markPublished, togglePublishCheck } = usePipelineStore();

  return (
    <div className="space-y-3">
      {publishRecords.map((p) => {
        const c = creators.find((x) => x.id === p.creatorId);
        if (!c) return null;
        const overdue = !p.publishedAt && new Date(p.promisedAt) < new Date();
        const allChecked = !!p.publishedAt && p.checks.link && p.checks.adCode && p.checks.bioLink;
        const checks: { key: "link" | "adCode" | "bioLink"; label: LText }[] = [
          { key: "link", label: L.checkLink },
          { key: "adCode", label: L.checkAdCode },
          { key: "bioLink", label: L.checkBio },
        ];
        return (
          <div key={p.creatorId} className="rounded-[12px] border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
              <span className="text-[14px] font-semibold text-ink">{c.name}</span>
              <LookalikeButton creatorId={c.id} sourceStep="publish" />
              {p.publishedAt ? (
                <Badge tone="teal">{l(L.published)}</Badge>
              ) : (
                <Badge tone={overdue ? "pink" : "amber"}>
                  {overdue ? l(L.overdue) : l(L.notPublished)}
                </Badge>
              )}
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted">
                <CalendarClock className="h-3 w-3" />
                {l(L.promised)} · {formatRelative(p.promisedAt, locale)}
              </span>
            </div>

            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[12px] text-blue-text hover:underline"
              >
                <Link2 className="h-3 w-3" />
                {p.link}
              </a>
            )}
            {p.adCode && (
              <div className="mt-1 font-mono text-[12px] text-slate">ad code: {p.adCode}</div>
            )}

            {/* 三项校验 */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {checks.map(({ key, label }) => {
                const on = p.checks[key];
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!p.publishedAt}
                    onClick={() => togglePublishCheck(p.creatorId, key)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      on
                        ? "border-[#C8E6D0] bg-[#EDF9F0] text-teal-text"
                        : "border-border bg-surface-warm/50 text-slate hover:bg-surface-warm",
                    )}
                  >
                    {on ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <X className="h-3 w-3" strokeWidth={3} />
                    )}
                    {l(label)}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              {!p.publishedAt && (
                <button
                  type="button"
                  onClick={() => markPublished(p.creatorId)}
                  className="rounded-full border border-dashed border-border bg-surface-warm/50 px-3 py-1 text-[11px] text-slate hover:bg-surface-warm hover:text-ink"
                >
                  {l(L.simulatePublish)}
                </button>
              )}
              {allChecked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-text">
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {l(L.allChecked)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── ② 结算付款 ── */
function PaymentView() {
  const l = useLoc();
  const [locale] = useLocale();
  const { invoices, receiveInvoice, toggleInvoiceField, markPaid, addReminder } =
    usePipelineStore();

  return (
    <div className="space-y-3">
      {invoices.map((inv) => {
        const c = creators.find((x) => x.id === inv.creatorId);
        if (!c) return null;
        const keys = Object.keys(invoiceFieldLabels) as InvoiceFieldKey[];
        const fieldsOk = keys.every((k) => inv.fields[k]);
        return (
          <div key={inv.creatorId} className="rounded-[12px] border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-2">
              <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
              <span className="text-[14px] font-semibold text-ink">{c.name}</span>
              {inv.paid ? (
                <Badge tone="teal">{l(L.paid)}</Badge>
              ) : inv.receivedAt ? (
                <Badge tone="blue">{l(L.received)}</Badge>
              ) : (
                <Badge tone="gray">{l(L.notReceived)}</Badge>
              )}
              <span className="tabular ml-auto text-[14px] font-bold text-ink">
                {formatCurrency(inv.amount)}
              </span>
            </div>

            {/* 五要素校验 */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted">
                <ReceiptText className="h-3.5 w-3.5" />
                {l(L.invoiceFields)}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {keys.map((k) => {
                  const on = inv.fields[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleInvoiceField(inv.creatorId, k)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                        on
                          ? "border-[#C8E6D0] bg-[#EDF9F0] text-teal-text"
                          : "border-[#F4C7C3] bg-[#FEF5F4] text-brand-strong",
                      )}
                    >
                      {on ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : (
                        <X className="h-3 w-3" strokeWidth={3} />
                      )}
                      {l(invoiceFieldLabels[k])}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 账期倒计时 */}
            {inv.receivedAt && !inv.paid && (
              <div className="mt-3 flex items-center gap-2 rounded-[8px] bg-soft-amber/50 px-3 py-2 text-[12px] text-amber-text">
                <CalendarClock className="h-3.5 w-3.5" />
                {l(L.dueCountdown)}
                <span className="tabular font-bold">{inv.dueInDays ?? 30}</span>
                {l(L.workdays)}
              </div>
            )}

            {/* 交付遗漏检查 */}
            {inv.deliverablesMissing && inv.deliverablesMissing.length > 0 && !inv.paid && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-[8px] bg-[#FEF5F4] px-3 py-2">
                <AlertTriangle className="h-3.5 w-3.5 text-brand-strong" />
                <span className="text-[11px] font-medium text-brand-strong">
                  {l(L.deliverablesMissing)}:
                </span>
                {inv.deliverablesMissing.map((m) => (
                  <span
                    key={m.en}
                    className="rounded bg-surface px-1.5 py-px text-[11px] text-slate"
                  >
                    {l(m)}
                  </span>
                ))}
              </div>
            )}

            {/* 催收记录 */}
            {inv.reminders.length > 0 && (
              <div className="mt-2 rounded-[8px] bg-surface-warm/50 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-muted">
                  {l(L.reminders)}
                </div>
                <ul className="mt-1 space-y-0.5 text-[11px] text-slate">
                  {inv.reminders.map((r) => (
                    <li key={r.at} className="flex items-center gap-1.5">
                      <BellRing className="h-3 w-3 text-muted" />
                      {l(r.note)} · {formatRelative(r.at, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 操作 */}
            {!inv.paid && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                {!inv.receivedAt && (
                  <button
                    type="button"
                    onClick={() => receiveInvoice(inv.creatorId)}
                    className="rounded-full border border-dashed border-border bg-surface-warm/50 px-3 py-1 text-[11px] text-slate hover:bg-surface-warm hover:text-ink"
                  >
                    {l(L.simulateInvoice)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => addReminder(inv.creatorId)}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-slate hover:bg-surface-warm"
                >
                  <BellRing className="h-3 w-3" />
                  {l(L.addReminder)}
                </button>
                <button
                  type="button"
                  disabled={!fieldsOk || !inv.receivedAt}
                  onClick={() => markPaid(inv.creatorId)}
                  className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-strong px-3 py-1 text-[11px] font-medium text-white hover:bg-[#D81D63] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                  {l(L.markPaid)}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
