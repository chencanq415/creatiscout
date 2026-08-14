"use client";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import type { OutreachEvent, OutreachEventKind } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Handshake,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

const L = {
  round: { zh: "轮", en: "R" },
  byHuman: { zh: "人工", en: "Human" },
  overCeiling: { zh: "超天花板", en: "Over ceiling" },
} as const;

const kindMeta: Record<
  OutreachEventKind,
  {
    label: LText;
    icon: typeof Check;
    tone: "gray" | "blue" | "teal" | "amber" | "pink" | "lavender";
  }
> = {
  outreach_sent: { label: { zh: "询价已发", en: "Inquiry sent" }, icon: Send, tone: "gray" },
  quote_received: {
    label: { zh: "达人报价", en: "Creator quote" },
    icon: ArrowDownLeft,
    tone: "blue",
  },
  counter_offer: {
    label: { zh: "我方议价", en: "Counter offer" },
    icon: ArrowUpRight,
    tone: "amber",
  },
  price_agreed: { label: { zh: "价格达成", en: "Price agreed" }, icon: Handshake, tone: "teal" },
  internal_approved: {
    label: { zh: "内审通过", en: "Internal approved" },
    icon: ShieldCheck,
    tone: "teal",
  },
  internal_rejected: { label: { zh: "内审打回", en: "Internal rejected" }, icon: X, tone: "pink" },
  client_approved: { label: { zh: "客户通过", en: "Client approved" }, icon: Check, tone: "teal" },
  client_rejected: { label: { zh: "客户打回", en: "Client rejected" }, icon: X, tone: "pink" },
};

const toneClasses = {
  gray: "bg-surface-warm text-muted",
  blue: "bg-soft-blue text-blue-text",
  teal: "bg-soft-teal text-teal-text",
  amber: "bg-soft-amber text-amber-text",
  pink: "bg-soft-pink text-brand-strong",
  lavender: "bg-soft-lavender text-lavender-text",
} as const;

/** 建联轮次时间线：按轮分组展示 报价→议价→内审→客户审 事件流 */
export function RoundTimeline({ events, ceiling }: { events: OutreachEvent[]; ceiling: number }) {
  const l = useLoc();
  const [locale] = useLocale();
  const rounds = [...new Set(events.map((e) => e.round))].sort((a, b) => a - b);

  return (
    <div className="space-y-3">
      {rounds.map((r) => (
        <div key={r}>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded-full bg-surface-warm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate">
              {locale === "zh" ? `第 ${r} ${l(L.round)}` : `${l(L.round)}${r}`}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="space-y-1.5">
            {events
              .filter((e) => e.round === r)
              .map((e) => {
                const meta = kindMeta[e.kind];
                const Icon = meta.icon;
                const over = e.amount !== undefined && e.amount > ceiling;
                return (
                  <div key={e.id} className="flex items-start gap-2 text-[12px]">
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                        toneClasses[meta.tone],
                      )}
                    >
                      <Icon className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-medium text-ink">{l(meta.label)}</span>
                        {e.amount !== undefined && (
                          <span
                            className={cn(
                              "tabular font-semibold",
                              over ? "text-brand-strong" : "text-ink",
                            )}
                          >
                            ${e.amount.toLocaleString()}
                          </span>
                        )}
                        {over && (
                          <span className="rounded bg-soft-pink px-1 py-px text-[10px] font-medium text-brand-strong">
                            {l(L.overCeiling)}
                          </span>
                        )}
                        {e.byHuman && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-soft-lavender px-1 py-px text-[10px] text-lavender-text">
                            <UserRound className="h-2.5 w-2.5" /> {l(L.byHuman)}
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-muted">
                          {formatRelative(e.at, locale)}
                        </span>
                      </div>
                      {e.note && <div className="mt-0.5 text-[11px] text-slate">{l(e.note)}</div>}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
