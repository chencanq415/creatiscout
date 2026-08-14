"use client";
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  FileText,
  Inbox as InboxIcon,
  Mail as MailIcon,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useT } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

const L = {
  expand: { zh: "展开", en: "Expand" },
  collapse: { zh: "收起", en: "Collapse" },
  refresh: { zh: "刷新", en: "Refresh" },
  addTag: { zh: "新增", en: "Add" },
  templatesTitle: { zh: "邮件模板", en: "Email Templates" },
  templatesDesc: {
    zh: "在这里管理可复用的邮件模板。打开任意提报即可套用或就地编辑模板。",
    en: "Manage reusable email templates here. Open any submission to apply or edit templates inline.",
  },
  browseTemplates: { zh: "浏览模板", en: "Browse templates" },
  kpiSentWeek: { zh: "本周已发送", en: "Sent this week" },
  kpiOpenRate: { zh: "打开率", en: "Open rate" },
  kpiReplyRate: { zh: "回复率", en: "Reply rate" },
  kpiAvgReply: { zh: "平均回复时长", en: "Avg reply" },
  perCampaign: { zh: "分 campaign 明细", en: "Per-campaign breakdown" },
  sent: { zh: "已发", en: "Sent" },
  reply: { zh: "回复", en: "Reply" },
} as const;

type FolderKey = "inbox" | "drafts";
type SystemLabelKey =
  | "outreaching"
  | "collaborating"
  | "not-cooperated"
  | "cooperation-completed"
  | "cannot-collaborate"
  | "starred"
  | "unread";

const folders: { key: FolderKey; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "inbox", labelKey: "mail.inbox", icon: InboxIcon },
  { key: "drafts", labelKey: "mail.drafts", icon: FileText },
];

const systemLabels: { key: SystemLabelKey; labelKey: string; color: string }[] = [
  { key: "outreaching", labelKey: "mail.labels.outreaching", color: "bg-blue" },
  { key: "collaborating", labelKey: "mail.labels.collaborating", color: "bg-teal" },
  { key: "not-cooperated", labelKey: "mail.labels.notCooperated", color: "bg-amber" },
  { key: "cooperation-completed", labelKey: "mail.labels.cooperationCompleted", color: "bg-[#22C55E]" },
  { key: "cannot-collaborate", labelKey: "mail.labels.cannotCollaborate", color: "bg-[#E11D48]" },
  { key: "starred", labelKey: "mail.labels.starred", color: "bg-[#FACC15]" },
  { key: "unread", labelKey: "mail.labels.unread", color: "bg-brand" },
];

export default function MailPage() {
  const t = useT();
  return (
    <div className="flex h-[calc(100vh-60px)] min-h-0 flex-col bg-page">
      <Tabs defaultValue="box" className="flex h-full min-h-0 flex-col">
        {/* Top tabs */}
        <div className="flex-shrink-0 border-b border-border bg-surface px-5 py-2.5">
          <TabsList>
            <TabsTrigger value="box">
              <MailIcon className="h-3.5 w-3.5" /> {t("mail.emailBox")}
            </TabsTrigger>
            <TabsTrigger value="template">
              <FileText className="h-3.5 w-3.5" /> {t("mail.emailTemplate")}
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <BarChart3 className="h-3.5 w-3.5" /> {t("mail.emailMetrics")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="box" className="mt-0 min-h-0 flex-1">
          <EmailBox />
        </TabsContent>
        <TabsContent value="template" className="mt-0 min-h-0 flex-1">
          <TemplateView />
        </TabsContent>
        <TabsContent value="metrics" className="mt-0 min-h-0 flex-1">
          <MetricsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Email Box ---------- */

function EmailBox() {
  const t = useT();
  const l = useLoc();
  const [folder, setFolder] = useState<FolderKey>("inbox");
  const [activeLabel, setActiveLabel] = useState<SystemLabelKey | null>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  return (
    <div className="grid h-full min-h-0 grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)]">
      {/* LEFT — Folders + Labels */}
      <div
        className={cn(
          "relative flex h-full flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out",
          leftCollapsed ? "w-[44px]" : "w-[260px]",
        )}
      >
        {leftCollapsed ? (
          <button
            type="button"
            onClick={() => setLeftCollapsed(false)}
            aria-label={l(L.expand)}
            className="mx-auto mt-3 flex h-7 w-7 items-center justify-center rounded-[6px] text-muted hover:bg-surface-warm hover:text-ink"
          >
            <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
          </button>
        ) : (
          <>
            <nav className="space-y-1 p-3">
              {folders.map((f) => {
                const Icon = f.icon;
                const active = folder === f.key && !activeLabel;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setFolder(f.key);
                      setActiveLabel(null);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[13px] font-medium transition-colors",
                      active
                        ? "bg-[#EEF5FF] text-blue-text"
                        : "text-slate hover:bg-surface-warm hover:text-ink",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(f.labelKey)}
                  </button>
                );
              })}
            </nav>

            <div className="px-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                  {t("mail.systemLabels")}
                </span>
                <button
                  type="button"
                  aria-label={l(L.refresh)}
                  className="text-muted hover:text-ink"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              </div>
            </div>
            <nav className="space-y-0.5 p-3 pt-2">
              {systemLabels.map((l) => {
                const active = activeLabel === l.key;
                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setActiveLabel(l.key)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-1.5 text-left text-[13px] transition-colors",
                      active
                        ? "bg-surface-warm text-ink"
                        : "text-slate hover:bg-surface-warm hover:text-ink",
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", l.color)} />
                    <span className="flex-1 truncate">{t(l.labelKey)}</span>
                    <span className="tabular text-[11px] text-muted">0</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-2 px-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                  {t("mail.myTags")}
                </span>
                <button
                  type="button"
                  aria-label={l(L.addTag)}
                  className="text-muted hover:text-ink"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="p-3 text-[12px] italic text-muted">{t("mail.noCustomTags")}</div>
          </>
        )}

        {/* Collapse handle on the right edge */}
        {!leftCollapsed && (
          <button
            type="button"
            onClick={() => setLeftCollapsed(true)}
            aria-label={l(L.collapse)}
            className="absolute -right-2.5 top-1/2 z-10 flex h-7 w-5 -translate-y-1/2 items-center justify-center rounded-[4px] border border-border bg-surface text-muted shadow-card hover:text-ink"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* CENTER — Filters + Session list */}
      <div className="flex h-full min-h-0 flex-col border-r border-border bg-page">
        <div className="space-y-3 border-b border-border bg-surface p-4">
          <div className="grid grid-cols-3 gap-2">
            <FilterSelect label={t("mail.filters.allSubmissions")} />
            <FilterSelect label={t("mail.filters.allGroups")} />
            <FilterSelect label={t("mail.filters.allModes")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FilterSelect label={t("mail.filters.allReadStatus")} />
            <FilterSelect label={t("mail.filters.allReplyStatus")} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 flex-1 items-center gap-2 rounded-[8px] border border-border bg-surface px-3 focus-within:border-border-strong">
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
              <input
                placeholder={t("mail.filters.searchSessions")}
                className="flex-1 border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
              />
            </div>
            <span className="tabular text-[12px] text-muted">0 {t("mail.sessions")}</span>
            <button
              type="button"
              aria-label={l(L.refresh)}
              className="text-muted hover:text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border text-muted">
            <MailIcon className="h-6 w-6" />
          </div>
          <p className="mt-3 text-[13px] text-slate">{t("mail.noSessions")}</p>
        </div>
      </div>

      {/* RIGHT — Detail */}
      <div className="flex h-full min-h-0 flex-col bg-[#F7F8FA]">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border text-muted">
            <MailIcon className="h-6 w-6" />
          </div>
          <p className="mt-3 text-[13.5px] font-medium text-slate">
            {t("mail.selectSession")}
          </p>
          <p className="mt-1 text-[12px] text-muted">
            {t("mail.selectSessionHint")}
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-9 items-center justify-between gap-2 rounded-[8px] border border-border bg-surface px-3 text-[13px] text-ink hover:bg-surface-warm"
    >
      <span className="truncate text-slate">{label}</span>
      <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted" />
    </button>
  );
}

/* ---------- Template ---------- */

function TemplateView() {
  const l = useLoc();
  return (
    <div className="flex h-full items-center justify-center p-10 text-center">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-soft-pink text-brand">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-[15px] font-bold text-navy">{l(L.templatesTitle)}</h3>
        <p className="mt-1 max-w-md text-[12.5px] text-slate">{l(L.templatesDesc)}</p>
        <Button className="mt-4">
          <Sparkles className="h-3.5 w-3.5" /> {l(L.browseTemplates)}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Metrics ---------- */

const campaignBreakdown: { name: LText; sent: number; replyRate: string }[] = [
  { name: { zh: "618 美妆联名", en: "618 Beauty Collab" }, sent: 18, replyRate: "42%" },
  { name: { zh: "520 礼盒种草", en: "520 Gift Seeding" }, sent: 12, replyRate: "33%" },
  { name: { zh: "夏日瑜伽服上新", en: "Summer Yoga Launch" }, sent: 12, replyRate: "29%" },
];

function MetricsView() {
  const l = useLoc();
  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-4 gap-3">
        <Kpi label={l(L.kpiSentWeek)} value="42" delta="+12%" tone="teal" />
        <Kpi label={l(L.kpiOpenRate)} value="64%" delta="+3%" tone="teal" />
        <Kpi label={l(L.kpiReplyRate)} value="38%" delta="-2%" tone="amber" />
        <Kpi label={l(L.kpiAvgReply)} value="4h" delta="" tone="blue" />
      </div>
      <div className="rounded-[12px] border border-border bg-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber" />
          <h3 className="text-[14px] font-bold text-navy">{l(L.perCampaign)}</h3>
        </div>
        <ul className="divide-y divide-[#EDF0F5]">
          {campaignBreakdown.map((c) => (
            <li
              key={c.name.en}
              className="flex items-center justify-between py-2.5 text-[13px]"
            >
              <span className="text-ink">{l(c.name)}</span>
              <span className="tabular text-muted">
                {l(L.sent)} <span className="font-semibold text-ink">{c.sent}</span> · {l(L.reply)}{" "}
                <span className="font-semibold text-ink">{c.replyRate}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "teal" | "blue" | "amber";
}) {
  const map = {
    teal: "text-teal-text",
    blue: "text-blue-text",
    amber: "text-amber-text",
  };
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="tabular mt-1 text-[24px] font-bold text-navy">{value}</div>
      {delta && (
        <div className={cn("mt-1 text-[11px]", delta.startsWith("-") ? "text-amber-text" : map[tone])}>
          {delta}
        </div>
      )}
    </div>
  );
}
