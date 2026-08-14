"use client";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { trackings, type TrackingTarget } from "@/lib/mock/trackings";
import { cn, formatRelative } from "@/lib/utils";

const L = {
  pageTitle: { zh: "Tracking 竞品追踪", en: "Competitor Tracking" },
  pageSub: {
    zh: "监测竞品 campaign、达人合作和素材策略，把市场信号变成下一次提报机会。",
    en: "Monitor competitor campaigns, creator collabs, and asset strategies — turn market signals into your next pitch opportunity.",
  },
  searchPlaceholder: { zh: "搜索竞品名 / 领域…", en: "Search competitor / category…" },
  running: { zh: "运行中", en: "Running" },
  paused: { zh: "已暂停", en: "Paused" },
  addTracking: { zh: "添加追踪", en: "Add Tracking" },
  emptyRunning: { zh: "没有运行中的追踪", en: "No running trackings" },
  emptyPaused: { zh: "没有已暂停的追踪", en: "No paused trackings" },
  statCreators: { zh: "达人", en: "Creators" },
  statAvgViews: { zh: "均播", en: "Avg Views" },
  statEngagement: { zh: "互动率", en: "Eng. Rate" },
  newUpdates: { zh: "条新动态", en: "new updates" },
  updated: { zh: "更新", en: "Updated" },
} as const;

const monitoredLabels: Record<TrackingTarget["monitored"][number], LText> = {
  campaign: { zh: "campaign", en: "campaign" },
  creators: { zh: "达人", en: "creators" },
  assets: { zh: "素材", en: "assets" },
};

export default function TrackingPage() {
  const l = useLoc();
  const [list, setList] = useState<TrackingTarget[]>(trackings);
  const [tab, setTab] = useState<"running" | "paused">("running");
  const [q, setQ] = useState("");

  const filtered = list.filter(
    (t) =>
      t.status === tab &&
      (q
        ? `${t.name} ${t.domain} ${l(t.category)}`.toLowerCase().includes(q.toLowerCase())
        : true),
  );

  function toggleStatus(id: string) {
    setList((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "running" ? "paused" : "running" } : t,
      ),
    );
  }

  return (
    <div className="space-y-5 p-6 lg:p-7">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-navy">{l(L.pageTitle)}</h1>
        <p className="mt-1 text-[13px] text-slate">{l(L.pageSub)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 min-w-[260px] flex-1 items-center gap-2 rounded-[8px] border border-border bg-surface px-3 focus-within:border-border-strong">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={l(L.searchPlaceholder)}
            className="flex-1 border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
          />
        </div>
        <div className="inline-flex h-9 rounded-[8px] border border-border bg-surface p-0.5">
          <TabChip
            label={l(L.running)}
            count={list.filter((t) => t.status === "running").length}
            active={tab === "running"}
            onClick={() => setTab("running")}
          />
          <TabChip
            label={l(L.paused)}
            count={list.filter((t) => t.status === "paused").length}
            active={tab === "paused"}
            onClick={() => setTab("paused")}
          />
        </div>
        <Button>
          <Plus className="h-3.5 w-3.5" /> {l(L.addTracking)}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <TrackingCard key={t.id} target={t} onToggle={() => toggleStatus(t.id)} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-[10px] border border-dashed border-border bg-surface py-12 text-center text-[12px] text-muted">
            {tab === "running" ? l(L.emptyRunning) : l(L.emptyPaused)}
          </div>
        )}
      </div>
    </div>
  );
}

function TabChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-[6px] px-3 text-[12.5px] font-medium transition-colors",
        active ? "bg-soft-pink text-brand shadow-card" : "text-slate hover:text-ink",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "tabular rounded-full px-1.5 text-[10px] font-semibold",
          active ? "bg-surface text-brand" : "bg-surface-warm text-slate",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function TrackingCard({
  target,
  onToggle,
}: {
  target: TrackingTarget;
  onToggle: () => void;
}) {
  const l = useLoc();
  const [locale] = useLocale();
  const isRunning = target.status === "running";
  return (
    <div className="group rounded-[12px] border border-border bg-surface transition-all hover:border-border-strong hover:shadow-card">
      <Link href={`/tracking/${target.id}`} className="block">
        <div
          className="h-20 rounded-t-[12px]"
          style={{ background: target.cover }}
          aria-hidden
        />
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold text-navy">{target.name}</div>
              <div className="mt-0.5 text-[11px] text-muted">
                {target.domain} · {l(target.category)}
              </div>
            </div>
            <Badge tone={isRunning ? "teal" : "amber"}>
              {isRunning ? l(L.running) : l(L.paused)}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <Stat label={l(L.statCreators)} value={target.creatorCount.toString()} />
            <Stat label={l(L.statAvgViews)} value={target.avgViews} />
            <Stat label={l(L.statEngagement)} value={target.engagement} />
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {target.monitored.map((m) => (
              <Badge key={m} tone="lavender">
                {l(monitoredLabels[m])}
              </Badge>
            ))}
            <span className="ml-auto text-[10.5px] text-muted">
              {l(L.updated)} {formatRelative(target.lastUpdatedAt, locale)}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className="tabular font-semibold text-ink">{target.updates}</span>
          <span>{l(L.newUpdates)}</span>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate">
          <span>{isRunning ? l(L.running) : l(L.paused)}</span>
          <Switch checked={isRunning} onCheckedChange={onToggle} />
        </label>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface-warm py-2">
      <div className="tabular text-[14px] font-bold text-navy">{value}</div>
      <div className="text-[10px] text-muted">{label}</div>
    </div>
  );
}
