"use client";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale, useT } from "@/lib/i18n/use-i18n";
import { approvals } from "@/lib/mock/approvals";
import { useUIStore } from "@/lib/store/ui-store";
import { cn, formatRelative } from "@/lib/utils";

const L = {
  viewOutput: { zh: "查看产物", en: "View output" },
  approve: { zh: "通过", en: "Approve" },
  ask: { zh: "Ask", en: "Ask" },
  atCapacity: { zh: "满载", en: "At capacity" },
  capacityWarning: {
    zh: "Noah 本周承接已 96%，建议拆分外联或调整任务量。",
    en: "Noah is at 96% capacity this week — consider splitting outreach or rebalancing tasks.",
  },
  viewAllArrow: { zh: "全部 →", en: "All →" },
} as const;

export default function DashboardPage() {
  const { openChat, campaigns } = useUIStore();
  const router = useRouter();
  const t = useT();
  const [queueTab, setQueueTab] = useState<"agent" | "human">("agent");

  return (
    <div className="space-y-5 p-6 lg:p-7">
      {/* Hero */}
      <section>
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-soft-pink">
              <Bot className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h1 className="text-[26px] font-bold leading-tight tracking-tight text-navy">
                {t("dashboard.heroTitle")}
              </h1>
              <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-slate">
                {t("dashboard.heroSub")}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <KpiCard
              icon={<Users className="h-3.5 w-3.5 text-brand" />}
              iconBg="bg-soft-pink"
              label={t("dashboard.kpiScanned")}
              value="428"
              sub={t("dashboard.kpiToday")}
            />
            <KpiCard
              icon={<CheckCircle2 className="h-3.5 w-3.5 text-blue-text" />}
              iconBg="bg-soft-blue"
              label={t("dashboard.kpiMatched")}
              value="18"
              sub={t("dashboard.kpiToday")}
            />
            <KpiCard
              icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-text" />}
              iconBg="bg-soft-amber"
              label={t("dashboard.kpiApprovals")}
              value="4"
              sub={t("dashboard.kpiPending")}
            />
          </div>
        </div>
      </section>

      {/* Command bar */}
      <button
        type="button"
        onClick={() => openChat()}
        className="group flex w-full items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-3 text-left transition-colors hover:bg-surface-warm"
      >
        <Sparkles className="h-4 w-4 text-brand" />
        <span className="flex-1 text-[13px] text-muted">{t("dashboard.askPlaceholder")}</span>
        <span className="rounded border border-border bg-surface-warm px-1.5 py-0.5 font-mono text-[11px] text-muted">
          ⌘K
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-brand text-white">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </button>

      {/* Queue with tabs: Agent tasks / Human review */}
      <section className="rounded-[12px] border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex rounded-[8px] bg-surface-warm p-1">
            <QueueTabButton
              active={queueTab === "agent"}
              onClick={() => setQueueTab("agent")}
              label={t("dashboard.queueAgent")}
              count={agentTasks.length}
            />
            <QueueTabButton
              active={queueTab === "human"}
              onClick={() => setQueueTab("human")}
              label={t("dashboard.queueHuman")}
              count={approvals.length}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[12px] text-slate transition-colors hover:text-ink"
          >
            {t("dashboard.viewAll")} <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {queueTab === "agent" ? (
          <AgentTaskList router={router} />
        ) : (
          <HumanReviewList router={router} campaigns={campaigns} openChat={openChat} />
        )}
      </section>

      {/* Bottom row — 真正业务有用的两块 */}
      <div className="grid grid-cols-[1fr_1fr] gap-4">
        <CapacityCard />
        <RoiCard />
      </div>
    </div>
  );
}

/* ---------- Sub components ---------- */

function KpiCard({
  icon,
  iconBg,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex min-w-[140px] items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="tabular text-[22px] font-bold leading-none text-navy">{value}</div>
        <div className="mt-1 text-[11px] text-slate">
          {label} <span className="text-muted">· {sub}</span>
        </div>
      </div>
    </div>
  );
}

function QueueTabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-[12.5px] font-medium transition-all",
        active ? "bg-surface text-ink shadow-card" : "text-slate hover:text-ink",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "tabular rounded-full px-1.5 py-px text-[10px] font-semibold",
          active ? "bg-soft-pink text-brand" : "bg-surface text-slate",
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ----- Agent tasks (数字员工在跑的活儿) ----- */

const agentTasks = [
  {
    id: "at-1",
    icon: Users,
    title: { zh: "扫描美区美妆 micro creators", en: "Scanning US beauty micro creators" },
    sub: {
      zh: "搜索池 1,240 → 初筛 86 → 待 AI 评估",
      en: "Search pool 1,240 → shortlisted 86 → awaiting AI scoring",
    },
    progress: 62,
    employee: "Lucy",
    eta: { zh: "约 8 分钟", en: "~8 min" },
    tone: "pink" as const,
  },
  {
    id: "at-2",
    icon: Mail,
    title: { zh: "起草 12 封个性化外联邮件", en: "Drafting 12 personalized outreach emails" },
    sub: { zh: "Variant A / B 测试，等你审核", en: "Variant A/B test — awaiting your review" },
    progress: 100,
    employee: "Lucy",
    eta: { zh: "已完成 · 待审核", en: "Done · pending review" },
    tone: "teal" as const,
  },
  {
    id: "at-3",
    icon: FileText,
    title: { zh: "整理 7 份达人提报资料", en: "Compiling 7 creator submission decks" },
    sub: {
      zh: "从对话记录抽取数据 + 案例 + 报价区间",
      en: "Extracting stats, case studies, and quote ranges from conversations",
    },
    progress: 41,
    employee: "Lucy",
    eta: { zh: "约 14 分钟", en: "~14 min" },
    tone: "blue" as const,
  },
  {
    id: "at-4",
    icon: Timer,
    title: { zh: "跟进 3 位 48h 未回复达人", en: "Following up with 3 creators silent for 48h" },
    sub: {
      zh: "按客户语言 + 历史风格生成跟进话术",
      en: "Generating follow-ups in the client's language and past tone",
    },
    progress: 88,
    employee: "Lucy",
    eta: { zh: "约 2 分钟", en: "~2 min" },
    tone: "lavender" as const,
  },
];

function AgentTaskList({ router }: { router: any }) {
  const l = useLoc();
  const toneToBg = {
    pink: "bg-soft-pink text-brand",
    teal: "bg-soft-teal text-teal-text",
    blue: "bg-soft-blue text-blue-text",
    lavender: "bg-soft-lavender text-lavender-text",
  } as const;
  const toneToBar = {
    pink: "bg-brand",
    teal: "bg-teal",
    blue: "bg-blue",
    lavender: "bg-lavender",
  } as const;

  return (
    <ul className="divide-y divide-[#EDF0F5]">
      {agentTasks.map((t) => {
        const Icon = t.icon;
        return (
          <li key={t.id} className="flex items-center gap-4 py-3.5">
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                toneToBg[t.tone],
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[13.5px] font-semibold text-ink">{l(t.title)}</span>
                <Badge tone="lavender">{t.employee}</Badge>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-slate">{l(t.sub)}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 max-w-[180px] flex-1 overflow-hidden rounded-full bg-surface-warm">
                  <div
                    className={cn("h-full rounded-full", toneToBar[t.tone])}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
                <span className="tabular text-[11px] text-muted">{t.progress}%</span>
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-end gap-1">
              <span className="text-[11px] text-muted">{l(t.eta)}</span>
              <Button size="sm" variant="outline">
                {l(L.viewOutput)}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ----- Human review (需要人拍板的) ----- */

function HumanReviewList({
  router,
  campaigns,
  openChat,
}: {
  router: any;
  campaigns: any[];
  openChat: (employeeId?: string, campaign?: { id: string; name: string }) => void;
}) {
  const l = useLoc();
  const [locale] = useLocale();
  return (
    <ul className="divide-y divide-[#EDF0F5]">
      {approvals.map((a) => {
        const campaign = campaigns.find((c) => c.id === a.campaignId);
        const ownerId = campaign?.ownerId;
        return (
          <li key={a.id} className="flex items-center gap-4 py-3.5">
            <div
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                iconBgByKind(a.kind),
              )}
            >
              <ApprovalIcon kind={a.kind} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[13.5px] font-semibold text-ink">{l(a.title)}</span>
                <Badge tone={approvalToneByKind(a.kind)}>{l(approvalLabelByKind(a.kind))}</Badge>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-slate">{l(a.reason)}</p>
            </div>
            <span className="tabular flex-shrink-0 text-[11px] text-muted">
              {formatRelative(a.ts, locale)}
            </span>
            <div className="flex flex-shrink-0 gap-1.5">
              <Button size="sm" onClick={() => router.push(`/campaigns/${a.campaignId}`)}>
                {l(L.approve)}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  openChat(
                    ownerId,
                    campaign ? { id: campaign.id, name: l(campaign.name) } : undefined,
                  )
                }
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {l(L.ask)}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ----- 下方两块业务有用的指标 ----- */

function CapacityCard() {
  const t = useT();
  const l = useLoc();
  // 「员工产能」：每周可执行任务数 vs 实际承接，能直观看到是否要扩员
  const data: {
    name: string;
    role: LText;
    capacity: number;
    used: number;
    color: string;
  }[] = [
    { name: "Lucy", role: { zh: "内容运营专员", en: "Content Ops Specialist" }, capacity: 40, used: 34, color: "brand" },
    { name: "Mia", role: { zh: "达人匹配专员", en: "Creator Matching Specialist" }, capacity: 32, used: 22, color: "blue" },
    { name: "Noah", role: { zh: "外联谈判专员", en: "Outreach & Negotiation Specialist" }, capacity: 28, used: 27, color: "amber" },
  ];

  return (
    <section className="rounded-[12px] border border-border bg-surface p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold tracking-tight text-navy">{t("dashboard.capacity")}</h3>
          <p className="mt-0.5 text-[11px] text-muted">{t("dashboard.capacitySub")}</p>
        </div>
        <ShieldAlert className="h-4 w-4 text-amber-text" />
      </div>
      <ul className="space-y-3">
        {data.map((d) => {
          const pct = Math.round((d.used / d.capacity) * 100);
          const isHigh = pct >= 90;
          const barColor =
            d.color === "brand"
              ? "bg-brand"
              : d.color === "blue"
                ? "bg-blue"
                : "bg-amber";
          return (
            <li key={d.name}>
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{d.name}</span>
                  <span className="text-muted">· {l(d.role)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular text-ink">
                    <span className="font-semibold">{d.used}</span>
                    <span className="text-muted"> / {d.capacity}</span>
                  </span>
                  {isHigh && <Badge tone="amber">{l(L.atCapacity)}</Badge>}
                </div>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-warm">
                <div
                  className={cn("h-full rounded-full", barColor)}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex items-center gap-2 rounded-[8px] bg-soft-amber/50 px-3 py-2 text-[11px] text-amber-text">
        <AlertTriangle className="h-3 w-3" />
        <span>{l(L.capacityWarning)}</span>
      </div>
    </section>
  );
}

function RoiCard() {
  const t = useT();
  const l = useLoc();
  // 「Campaign ROI 排行」：进行中 campaign 的实时投产比 + 预测达成
  const items: {
    name: LText;
    spent: number;
    gmv: number;
    roi: number;
    status: "up" | "steady" | "down";
    delta: string;
  }[] = [
    { name: { zh: "618 美妆联名", en: "618 Beauty Collab" }, spent: 32400, gmv: 91800, roi: 2.83, status: "up", delta: "+0.3" },
    { name: { zh: "夏日瑜伽服上新", en: "Summer Yoga Launch" }, spent: 22000, gmv: 48400, roi: 2.20, status: "steady", delta: "+0.1" },
    { name: { zh: "520 礼盒种草", en: "520 Gift Seeding" }, spent: 8200, gmv: 11400, roi: 1.39, status: "down", delta: "-0.4" },
  ];
  return (
    <section className="rounded-[12px] border border-border bg-surface p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold tracking-tight text-navy">{t("dashboard.roi")}</h3>
          <p className="mt-0.5 text-[11px] text-muted">{t("dashboard.roiSub")}</p>
        </div>
        <button type="button" className="text-[11px] text-brand hover:underline">
          {l(L.viewAllArrow)}
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((it) => {
          const tone =
            it.status === "up" ? "teal" : it.status === "steady" ? "blue" : "amber";
          return (
            <li
              key={it.name.en}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-surface-warm"
            >
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-ink">{l(it.name)}</div>
                <div className="tabular mt-0.5 text-[11px] text-muted">
                  {l({
                    zh: `花费 $${it.spent.toLocaleString()} · GMV $${it.gmv.toLocaleString()}`,
                    en: `Spend $${it.spent.toLocaleString()} · GMV $${it.gmv.toLocaleString()}`,
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="tabular text-[18px] font-bold text-navy">{it.roi.toFixed(2)}x</div>
                <div className="text-[10px] text-muted">ROI</div>
              </div>
              <Badge tone={tone}>
                <span className="tabular">{it.delta}</span>
              </Badge>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ----- helpers ----- */

function ApprovalIcon({ kind }: { kind: string }) {
  if (kind === "matching") return <Users className="h-4 w-4 text-brand" />;
  if (kind === "outreach") return <Mail className="h-4 w-4 text-teal-text" />;
  if (kind === "video") return <FileText className="h-4 w-4 text-blue-text" />;
  if (kind === "quote") return <AlertTriangle className="h-4 w-4 text-amber-text" />;
  return <Clock className="h-4 w-4 text-slate" />;
}

function iconBgByKind(kind: string) {
  return (
    ({
      matching: "bg-soft-pink",
      outreach: "bg-soft-teal",
      video: "bg-soft-blue",
      quote: "bg-soft-amber",
      contract: "bg-soft-lavender",
    } as Record<string, string>)[kind] ?? "bg-surface-warm"
  );
}

function approvalLabelByKind(kind: string): LText {
  return (
    ({
      matching: { zh: "匹配", en: "Matching" },
      outreach: { zh: "外联", en: "Outreach" },
      video: { zh: "审核", en: "Review" },
      quote: { zh: "报价", en: "Quote" },
      contract: { zh: "合同", en: "Contract" },
    } as Record<string, LText>)[kind] ?? { zh: "操作", en: "Action" }
  );
}

function approvalToneByKind(kind: string): "pink" | "teal" | "blue" | "amber" | "lavender" {
  return (
    ({
      matching: "pink",
      outreach: "teal",
      video: "blue",
      quote: "amber",
      contract: "lavender",
    } as const)[kind] ?? "blue"
  );
}
