"use client";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators as sopCreators } from "@/lib/mock/creators";
import { usePipelineStore } from "@/lib/store/pipeline-store";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Mail,
  Search,
  Share2,
  Sparkles,
  SquareCheckBig,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LookalikeButton } from "../shared/lookalike-button";
import { StepShell } from "./step-shell";

const L = {
  searchPlaceholder: { zh: "搜索任务编号 / 名称…", en: "Search submission no. / name…" },
  filterAll: { zh: "全部", en: "All" },
  filterSelected: { zh: "入选", en: "Selected" },
  filterUnselected: { zh: "未选中", en: "Not selected" },
  batchShare: { zh: "批量分享", en: "Batch share" },
  noBatches: { zh: "没有匹配的批次", en: "No matching batches" },
  colSubmissionNo: { zh: "提报编号", en: "Submission No." },
  colSubmissionName: { zh: "提报名称", en: "Submission Name" },
  colPlatform: { zh: "平台", en: "Platform" },
  colDate: { zh: "日期", en: "Date" },
  colStatus: { zh: "状态", en: "Status" },
  colInfluencers: { zh: "达人", en: "Influencers" },
  colProcess: { zh: "进度", en: "Process" },
  colActions: { zh: "操作", en: "Actions" },
  collapse: { zh: "收起", en: "Collapse" },
  expand: { zh: "展开", en: "Expand" },
  select: { zh: "选择", en: "Select" },
  approveAll: { zh: "批量确认全部", en: "Approve all" },
  approveAllTitle: { zh: "批量确认", en: "Approve all" },
  share: { zh: "分享", en: "Share" },
  sendEmail: { zh: "发送邮件", en: "Send emails" },
  visitProfile: { zh: "访问主页", en: "Visit profile" },
  copy: { zh: "复制", en: "Copy" },
  reject: { zh: "拒绝", en: "Reject" },
  preScreenApprove: { zh: "初筛通过", en: "Pass pre-screen" },
  cancel: { zh: "取消", en: "Cancel" },
  preScreened: { zh: "初筛通过", en: "Pre-screened" },
  rejected: { zh: "已拒绝", en: "Rejected" },
  details: { zh: "详情", en: "Details" },
  profile: { zh: "主页", en: "Profile" },
  email: { zh: "邮箱", en: "Email" },
  statRegion: { zh: "地区", en: "Region" },
  statPlatform: { zh: "平台", en: "Platform" },
  statFollowers: { zh: "粉丝数", en: "Followers" },
  statAvgViews: { zh: "近 10 条平均播放", en: "Avg Views (Last 10)" },
  statAvgEngagement: { zh: "近 10 条平均互动率", en: "Avg Engagement Rate (Last 10)" },
  statAvgLikes: { zh: "近 10 条平均点赞", en: "Avg Likes (Last 10)" },
  statLastPublished: { zh: "最近发布视频", en: "Last Video Published" },
  statEmail: { zh: "邮箱", en: "Email" },
  statProfileUrl: { zh: "主页链接", en: "Profile URL" },
  audienceDistribution: { zh: "受众分布", en: "Audience Distribution" },
  audAge: { zh: "年龄", en: "Age" },
  audGender: { zh: "性别", en: "Gender" },
  audLanguage: { zh: "语言", en: "Language" },
  audLocation: { zh: "地区", en: "Location" },
  statusPending: { zh: "待审核", en: "pending" },
  statusApproved: { zh: "已通过", en: "approved" },
  statusSubmitted: { zh: "已提报", en: "submitted" },
  allBatches: { zh: "全部批次", en: "all" },
} as const;

type BatchStatus = "pending" | "approved" | "submitted";
type Platform = "TikTok" | "YouTube" | "Instagram";
type Decision = "pre-screened" | "rejected" | undefined;

interface CreatorDetail {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  email: string;
  externalId: string;
  region: string;
  platform: Platform;
  followers: string;
  avgViews: string;
  avgEngagement: string;
  avgLikes: string;
  lastPublished: string;
  profileUrl: string;
  audience: {
    age: { label: string; pct: string }[];
    gender: { label: string; pct: string }[];
    language: { label: string; pct: string }[];
    location: { flag: string; label: string; pct: string }[];
  };
  decision?: Decision;
}

interface Batch {
  id: string;
  name: LText;
  platform: Platform;
  date: string;
  status: BatchStatus;
  creators: CreatorDetail[];
  processDone: number;
  processTotal: number;
  /** Mia 生成的 Lookalike 扩量批次标记 */
  lookalike?: { sourceName: string; sourceStepLabel: LText };
}

/* ---------- Mock factory ---------- */

const mockCreator = (i: number, decision?: Decision): CreatorDetail => {
  const names = [
    "Khabane lame",
    "Nara Smith",
    "Brooke Lynne",
    "Goodfornothing Beauty",
    "Sofia Diaz",
  ];
  const handles = ["@creator_one", "@creator_two", "@creator_three", "@creator_four", "@creator_five"];
  const ids = [
    "127905465618821121",
    "984302711200345012",
    "550987112004332245",
    "440112883900665512",
    "770441223890551122",
  ];
  return {
    id: `cr-${i}`,
    name: names[i % names.length],
    handle: handles[i % handles.length],
    avatar: `https://i.pravatar.cc/96?img=${[14, 47, 32, 5, 25][i % 5]}`,
    email: `team@${handles[i % handles.length].slice(1).replace(/\./g, "")}00.com`,
    externalId: ids[i % ids.length],
    region: ["United States", "United Kingdom", "Canada", "Australia", "Brazil"][i % 5],
    platform: (["TikTok", "YouTube", "Instagram", "TikTok", "Instagram"] as Platform[])[i % 5],
    followers: ["162.2M", "8.4M", "1.5M", "880K", "320K"][i % 5],
    avgViews: ["26.7M", "1.2M", "240K", "98K", "44K"][i % 5],
    avgEngagement: ["7.04%", "5.61%", "8.12%", "6.45%", "9.20%"][i % 5],
    avgLikes: ["1.5M", "320K", "45K", "18K", "9.2K"][i % 5],
    lastPublished: "2026-06-26",
    profileUrl: `https://www.tiktok.com/${handles[i % handles.length]}`,
    audience: {
      age: [
        { label: "55+", pct: "6.4%" },
        { label: "18-24", pct: "34.2%" },
        { label: "25-34", pct: "29.7%" },
        { label: "35-44", pct: "18.3%" },
        { label: "45-54", pct: "11.4%" },
      ],
      gender: [
        { label: "Male", pct: "53.6%" },
        { label: "Female", pct: "46.4%" },
      ],
      language: [
        { label: "EN", pct: "46.3%" },
        { label: "ES", pct: "19.8%" },
        { label: "FR", pct: "13.8%" },
        { label: "IT", pct: "8.7%" },
        { label: "PT", pct: "11.4%" },
      ],
      location: [
        { flag: "🇧🇷", label: "BR", pct: "12.7%" },
        { flag: "🇫🇷", label: "FR", pct: "6.2%" },
        { flag: "🇮🇹", label: "IT", pct: "9.4%" },
        { flag: "🇲🇽", label: "MX", pct: "7.8%" },
        { flag: "🇺🇸", label: "US", pct: "18.3%" },
      ],
    },
    decision,
  };
};

const initialBatches: Batch[] = [
  {
    id: "2026032487CE08",
    name: { zh: "tiktok", en: "tiktok" },
    platform: "TikTok",
    date: "3/24/2026",
    status: "pending",
    creators: Array.from({ length: 5 }, (_, i) => mockCreator(i)),
    processDone: 0,
    processTotal: 0,
  },
  {
    id: "20260318B75632",
    name: { zh: "y't", en: "y't" },
    platform: "YouTube",
    date: "3/18/2026",
    status: "approved",
    creators: Array.from({ length: 4 }, (_, i) => mockCreator(i, "pre-screened")),
    processDone: 1,
    processTotal: 1,
  },
  {
    id: "20260318908795",
    name: { zh: "世界杯", en: "World Cup" },
    platform: "Instagram",
    date: "3/18/2026",
    status: "approved",
    creators: Array.from({ length: 2 }, (_, i) => mockCreator(i, "pre-screened")),
    processDone: 1,
    processTotal: 1,
  },
  {
    id: "2026022873117F",
    name: { zh: "东南亚 50w", en: "SEA 500k" },
    platform: "TikTok",
    date: "2/28/2026",
    status: "submitted",
    creators: Array.from({ length: 3 }, (_, i) => mockCreator(i)),
    processDone: 0,
    processTotal: 1,
  },
  {
    id: "20260110B112B2",
    name: { zh: "—", en: "—" },
    platform: "TikTok",
    date: "1/10/2026",
    status: "submitted",
    creators: [mockCreator(0)],
    processDone: 0,
    processTotal: 1,
  },
];

type Filter = "all" | "selected" | "unselected";

/** Lookalike 来源步骤展示名 */
const stepLabels: Record<string, LText> = {
  matching: { zh: "达人匹配", en: "Matching" },
  outreach: { zh: "达人建联", en: "Outreach" },
  confirm: { zh: "确认合作", en: "Confirm" },
  contract: { zh: "合同签署", en: "Contract" },
  sample: { zh: "寄样管理", en: "Sampling" },
  script: { zh: "脚本确认", en: "Script" },
  video: { zh: "审核视频", en: "Video" },
  publish: { zh: "发布回传", en: "Publish" },
};

/* ---------- Component ---------- */

export function StepMatching({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const openShare = useUIStore((s) => s.openShare);
  const openMail = useUIStore((s) => s.openMail);

  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [expanded, setExpanded] = useState<Set<string>>(new Set([initialBatches[0].id]));
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string>>(new Set());

  // Mia 完成的 Lookalike 任务 → 同步为新的达人批次（幂等：按 batchId 去重）
  const lookalikeTasks = usePipelineStore((s) => s.lookalikeTasks);
  useEffect(() => {
    const done = lookalikeTasks.filter((t) => t.status === "done" && t.batchId);
    setBatches((prev) => {
      const missing = done.filter((t) => !prev.some((b) => b.id === t.batchId));
      if (missing.length === 0) return prev;
      const created = missing.map((t): Batch => {
        const src = sopCreators.find((c) => c.id === t.sourceCreatorId);
        const srcName = src?.name ?? t.sourceCreatorId;
        return {
          id: t.batchId as string,
          name: {
            zh: `【Lookalike · @${srcName}】Mia 生成`,
            en: `[Lookalike · @${srcName}] by Mia`,
          },
          platform: "TikTok",
          date: new Date(t.createdAt).toLocaleDateString("en-US"),
          status: "pending",
          creators: Array.from({ length: 4 }, (_, i) => mockCreator(i)),
          processDone: 0,
          processTotal: 0,
          lookalike: {
            sourceName: srcName,
            sourceStepLabel: stepLabels[t.sourceStep] ?? stepLabels.matching,
          },
        };
      });
      return [...created, ...prev];
    });
  }, [lookalikeTasks]);

  function toggleBatch(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }

  function toggleBatchSelect(id: string) {
    const next = new Set(selectedBatchIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBatchIds(next);
  }

  function setCreatorDecision(batchId: string, creatorId: string, decision: Decision) {
    setBatches((prev) =>
      prev.map((b) =>
        b.id !== batchId
          ? b
          : {
              ...b,
              creators: b.creators.map((c) => (c.id === creatorId ? { ...c, decision } : c)),
            },
      ),
    );
  }

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (q && !`${b.id} ${b.name.zh} ${b.name.en}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      const hasPreScreened = b.creators.some((c) => c.decision === "pre-screened");
      if (filter === "selected" && !hasPreScreened) return false;
      if (filter === "unselected" && hasPreScreened) return false;
      return true;
    });
  }, [batches, filter, q]);

  const preScreenedTotal = batches.reduce(
    (acc, b) => acc + b.creators.filter((c) => c.decision === "pre-screened").length,
    0,
  );
  const totalCreators = batches.reduce((acc, b) => acc + b.creators.length, 0);

  return (
    <StepShell
      agentStatus="done"
      agentText={l({
        zh: `Lucy 已交付 ${batches.length} 个达人提报批次，共 ${totalCreators} 位达人`,
        en: `Lucy has delivered ${batches.length} creator submission batches with ${totalCreators} creators`,
      })}
      cta={{
        label: l({
          zh: `推进 ${preScreenedTotal} 位初筛通过的达人`,
          en: `Advance ${preScreenedTotal} pre-screened creators`,
        }),
        tone: "primary",
      }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 min-w-[240px] flex-1 items-center gap-2 rounded-[8px] border border-border bg-surface px-3 focus-within:border-border-strong">
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={l(L.searchPlaceholder)}
            className="flex-1 border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
          />
        </div>
        <div className="inline-flex h-9 rounded-[8px] border border-border bg-surface p-0.5">
          <FilterChip
            label={l(L.filterAll)}
            count={batches.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterChip
            label={l(L.filterSelected)}
            count={
              batches.filter((b) => b.creators.some((c) => c.decision === "pre-screened")).length
            }
            active={filter === "selected"}
            onClick={() => setFilter("selected")}
          />
          <FilterChip
            label={l(L.filterUnselected)}
            count={
              batches.filter((b) => !b.creators.some((c) => c.decision === "pre-screened")).length
            }
            active={filter === "unselected"}
            onClick={() => setFilter("unselected")}
          />
        </div>
        <Button
          variant="outline"
          size="md"
          onClick={() =>
            openShare({
              kind: "batch",
              id: Array.from(selectedBatchIds).join(",") || "batch-all",
              label: selectedBatchIds.size
                ? l({
                    zh: `${selectedBatchIds.size} 个批次`,
                    en: `${selectedBatchIds.size} batches`,
                  })
                : l(L.allBatches),
            })
          }
        >
          <Share2 className="h-3.5 w-3.5" />
          {l(L.batchShare)}
          {selectedBatchIds.size > 0 && (
            <span className="tabular ml-1 rounded-full bg-soft-pink px-1.5 text-[10px] font-semibold text-brand">
              {selectedBatchIds.size}
            </span>
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[10px] border border-border bg-surface">
        {/* Header */}
        <div className="grid grid-cols-[40px_24px_minmax(0,1.4fr)_minmax(0,1.2fr)_120px_120px_120px_140px_120px_140px] items-center gap-3 border-b border-border bg-surface-warm px-4 py-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
          <CheckboxCell
            checked={selectedBatchIds.size > 0 && selectedBatchIds.size === filteredBatches.length}
            onClick={() => {
              if (selectedBatchIds.size === filteredBatches.length) {
                setSelectedBatchIds(new Set());
              } else {
                setSelectedBatchIds(new Set(filteredBatches.map((b) => b.id)));
              }
            }}
          />
          <span />
          <span>{l(L.colSubmissionNo)}</span>
          <span>{l(L.colSubmissionName)}</span>
          <span>{l(L.colPlatform)}</span>
          <span>{l(L.colDate)}</span>
          <span>{l(L.colStatus)}</span>
          <span>{l(L.colInfluencers)}</span>
          <span>{l(L.colProcess)}</span>
          <span className="text-right">{l(L.colActions)}</span>
        </div>

        {/* Rows */}
        <ul>
          {filteredBatches.map((b) => (
            <li key={b.id} className="border-b border-[#EDF0F5] last:border-b-0">
              <BatchRow
                batch={b}
                expanded={expanded.has(b.id)}
                selected={selectedBatchIds.has(b.id)}
                onToggle={() => toggleBatch(b.id)}
                onSelect={() => toggleBatchSelect(b.id)}
                onShare={() => openShare({ kind: "submission", id: b.id, label: l(b.name) })}
                onMail={() =>
                  openMail({
                    batchId: b.id,
                    influencerCount: b.creators.length,
                    defaultGroupName: `${b.platform.toLowerCase()}_${b.id}_${formatNow()}`,
                  })
                }
                onApproveAll={() => {
                  setBatches((prev) =>
                    prev.map((bb) =>
                      bb.id !== b.id
                        ? bb
                        : {
                            ...bb,
                            creators: bb.creators.map((c) => ({
                              ...c,
                              decision: "pre-screened",
                            })),
                          },
                    ),
                  );
                }}
              />
              {expanded.has(b.id) && (
                <div className="bg-surface-warm/40 px-4 pb-4 pt-2">
                  <div className="grid gap-3">
                    {b.creators.map((c) => (
                      <CreatorRow
                        key={c.id}
                        creator={c}
                        onSet={(d) => setCreatorDecision(b.id, c.id, d)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
          {filteredBatches.length === 0 && (
            <li className="px-4 py-10 text-center text-[12px] text-muted">{l(L.noBatches)}</li>
          )}
        </ul>
      </div>
    </StepShell>
  );
}

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ---------- Batch row ---------- */

function BatchRow({
  batch,
  expanded,
  selected,
  onToggle,
  onSelect,
  onShare,
  onMail,
  onApproveAll,
}: {
  batch: Batch;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onShare: () => void;
  onMail: () => void;
  onApproveAll: () => void;
}) {
  const l = useLoc();
  return (
    <div
      className={cn(
        "grid grid-cols-[40px_24px_minmax(0,1.4fr)_minmax(0,1.2fr)_120px_120px_120px_140px_120px_140px] items-center gap-3 px-4 py-3.5 text-[13px] transition-colors",
        expanded ? "bg-surface-warm" : "hover:bg-surface-warm/60",
      )}
    >
      <CheckboxCell checked={selected} onClick={onSelect} />
      <button
        type="button"
        onClick={onToggle}
        aria-label={expanded ? l(L.collapse) : l(L.expand)}
        className="flex h-6 w-6 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-surface hover:text-ink"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={onToggle}
        className="truncate text-left font-mono text-[13px] font-semibold text-ink hover:text-brand"
      >
        {batch.id}
      </button>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-ink">{l(batch.name)}</span>
        {batch.lookalike && (
          <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-[#DDD2F8] bg-[#F3ECFF] px-2 py-0.5 text-[10px] font-medium text-lavender-text">
            <Sparkles className="h-2.5 w-2.5" />
            {l({
              zh: `来源 · ${l(batch.lookalike.sourceStepLabel)}`,
              en: `From · ${l(batch.lookalike.sourceStepLabel)}`,
            })}
          </span>
        )}
      </span>
      <PlatformBadge platform={batch.platform} />
      <span className="tabular text-slate">{batch.date}</span>
      <StatusPill status={batch.status} />
      <span className="tabular text-slate">
        {l({
          zh: `${batch.creators.length} 位达人`,
          en: `${batch.creators.length} ${batch.creators.length > 1 ? "influencers" : "influencer"}`,
        })}
      </span>
      <ProcessCell done={batch.processDone} total={batch.processTotal} />
      <RowActions onApproveAll={onApproveAll} onShare={onShare} onMail={onMail} />
    </div>
  );
}

function CheckboxCell({ checked, onClick }: { checked?: boolean; onClick?: () => void }) {
  const l = useLoc();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={l(L.select)}
      className={cn(
        "flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border transition-colors",
        checked
          ? "border-brand bg-brand text-white"
          : "border-border-strong bg-surface hover:border-brand",
      )}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const styles: Record<Platform, string> = {
    TikTok: "bg-[#17181B] text-white",
    YouTube: "bg-[#FF0033] text-white",
    Instagram: "bg-gradient-to-r from-[#A45EFF] to-[#FF4FB5] text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[6px] px-2 py-0.5 text-[11px] font-semibold",
        styles[platform],
      )}
    >
      {platform}
    </span>
  );
}

function StatusPill({ status }: { status: BatchStatus }) {
  const l = useLoc();
  const map: Record<BatchStatus, { label: LText; tone: string }> = {
    pending: { label: L.statusPending, tone: "bg-[#FFF6D6] text-[#9A7900]" },
    approved: { label: L.statusApproved, tone: "bg-[#E1F8E7] text-[#0F8B4A]" },
    submitted: { label: L.statusSubmitted, tone: "bg-[#F3E8FF] text-[#7A3CC9]" },
  };
  const m = map[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        m.tone,
      )}
    >
      {l(m.label)}
    </span>
  );
}

function ProcessCell({ done, total }: { done: number; total: number }) {
  if (total === 0) return <span className="text-muted">—</span>;
  const pct = Math.round((done / total) * 100);
  const isDone = pct === 100;
  return (
    <span className={cn("tabular text-[12px]", isDone ? "text-teal-text" : "text-slate")}>
      {pct.toFixed(1)}% ({done}/{total})
    </span>
  );
}

function RowActions({
  onApproveAll,
  onShare,
  onMail,
}: {
  onApproveAll: () => void;
  onShare: () => void;
  onMail: () => void;
}) {
  const l = useLoc();
  const iconBtn =
    "flex h-7 w-7 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-surface hover:text-ink";
  return (
    <div className="flex items-center justify-end gap-0.5 text-slate">
      <button
        type="button"
        aria-label={l(L.approveAll)}
        title={l(L.approveAllTitle)}
        onClick={onApproveAll}
        className={iconBtn}
      >
        <SquareCheckBig className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label={l(L.share)}
        title={l(L.share)}
        onClick={onShare}
        className={iconBtn}
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label={l(L.sendEmail)}
        title={l(L.sendEmail)}
        onClick={onMail}
        className={iconBtn}
      >
        <Mail className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ---------- Creator row inside expanded batch ---------- */

function CreatorRow({
  creator,
  onSet,
}: {
  creator: CreatorDetail;
  onSet: (decision: Decision) => void;
}) {
  const l = useLoc();
  const isPreScreened = creator.decision === "pre-screened";
  const isRejected = creator.decision === "rejected";

  return (
    <div
      className={cn(
        "rounded-[10px] border bg-surface p-4 transition-colors",
        isPreScreened && "border-[#FACC15]/60 bg-[#FFFBEB]/40",
        isRejected && "border-[#FCA5A5]/60 bg-[#FEF2F2]/50",
        !isPreScreened && !isRejected && "border-border",
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <img
          src={creator.avatar}
          alt=""
          className="h-12 w-12 flex-shrink-0 rounded-[10px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[16px] font-bold text-navy">{creator.name}</span>
            <a
              href={creator.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-ink"
              aria-label={l(L.visitProfile)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${creator.email}`}
              className="inline-flex items-center gap-1 text-[12px] text-slate hover:text-ink"
            >
              <Mail className="h-3.5 w-3.5" />
              {l(L.email)}
            </a>
            <LookalikeButton creatorId={creator.id} sourceStep="matching" />
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted">
            <span>{creator.handle}</span>
            <span>·</span>
            <span className="font-mono">ID: {creator.externalId}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-[#BCD3FF] bg-[#EEF5FF] px-3 py-1 text-[12px] font-medium text-blue-text hover:bg-[#DEEBFE]"
            >
              <Eye className="h-3 w-3" /> {l(L.details)}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-ink hover:bg-surface-warm"
            >
              <ExternalLink className="h-3 w-3" /> {l(L.profile)}
            </button>
          </div>
        </div>

        {/* Decision controls — right side */}
        <DecisionControls creator={creator} onSet={onSet} />
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-6 gap-x-6 gap-y-4 text-[13px]">
        <StatField label={l(L.statRegion)} value={creator.region} />
        <StatField
          label={l(L.statPlatform)}
          value={
            <span className="inline-flex items-center gap-1">
              <PlatformDot platform={creator.platform} />
              <span className="font-semibold text-ink">{creator.platform}</span>
            </span>
          }
        />
        <StatField label={l(L.statFollowers)} value={creator.followers} bold />
        <StatField label={l(L.statAvgViews)} value={creator.avgViews} bold />
        <StatField label={l(L.statAvgEngagement)} value={creator.avgEngagement} bold />
        <StatField label={l(L.statAvgLikes)} value={creator.avgLikes} bold />
        <StatField label={l(L.statLastPublished)} value={creator.lastPublished} />
        <StatField label={l(L.statEmail)} value={creator.email} className="col-span-1" />
        <StatField
          label={l(L.statProfileUrl)}
          className="col-span-2"
          value={
            <span className="flex items-center gap-1 text-ink">
              <span className="truncate">{creator.profileUrl}</span>
              <button type="button" className="text-muted hover:text-ink" aria-label={l(L.copy)}>
                <Copy className="h-3 w-3" />
              </button>
            </span>
          }
        />
      </div>

      {/* Audience Distribution */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="text-[12px] font-medium text-muted">{l(L.audienceDistribution)}</div>
        <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3">
          <AudienceRow
            label={l(L.audAge)}
            items={creator.audience.age.map((a) => ({ label: `${a.label}: ${a.pct}` }))}
          />
          <AudienceRow
            label={l(L.audGender)}
            items={creator.audience.gender.map((g) => ({ label: `${g.label}: ${g.pct}` }))}
          />
          <AudienceRow
            label={l(L.audLanguage)}
            items={creator.audience.language.map((l2) => ({ label: `${l2.label}: ${l2.pct}` }))}
          />
          <AudienceRow
            label={l(L.audLocation)}
            items={creator.audience.location.map((l2) => ({
              label: `${l2.flag} ${l2.label}: ${l2.pct}`,
            }))}
          />
        </div>
      </div>
    </div>
  );
}

function DecisionControls({
  creator,
  onSet,
}: {
  creator: CreatorDetail;
  onSet: (decision: Decision) => void;
}) {
  const l = useLoc();
  // Pre-screened：Cancel + ✓ Pre-screened (yellow)
  if (creator.decision === "pre-screened") {
    return (
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onSet(undefined)}
          className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-slate transition-colors hover:bg-surface-warm hover:text-ink"
        >
          {l(L.cancel)}
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FACC15] bg-[#FFFBEB] px-3 py-1 text-[12px] font-semibold text-[#9A7900]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {l(L.preScreened)}
          <Eye className="h-3.5 w-3.5" />
        </span>
      </div>
    );
  }

  // Rejected：Cancel + ✗ Rejected (red)
  if (creator.decision === "rejected") {
    return (
      <div className="flex flex-shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onSet(undefined)}
          className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[12px] font-medium text-slate transition-colors hover:bg-surface-warm hover:text-ink"
        >
          {l(L.cancel)}
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-1 text-[12px] font-semibold text-[#B91C1C]">
          <X className="h-3.5 w-3.5" strokeWidth={3} />
          {l(L.rejected)}
        </span>
      </div>
    );
  }

  // Default：两个按钮都是中性灰，分别 hover 时染红 / 绿
  return (
    <div className="flex flex-shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onSet("rejected")}
        aria-label={l(L.reject)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-slate transition-colors hover:border-[#FCA5A5] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
      >
        <X className="h-4 w-4" strokeWidth={3} />
      </button>
      <button
        type="button"
        onClick={() => onSet("pre-screened")}
        aria-label={l(L.preScreenApprove)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-slate transition-colors hover:border-teal hover:bg-soft-teal hover:text-teal-text"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </button>
    </div>
  );
}

function StatField({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="text-[11px] text-muted">{label}</div>
      <div
        className={cn(
          "mt-0.5 truncate text-[13px] text-ink",
          bold && "tabular text-[15px] font-bold text-navy",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function AudienceRow({
  label,
  items,
}: {
  label: string;
  items: { label: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] font-medium text-muted">{label}:</div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span
            key={i}
            className="rounded-[6px] border border-border bg-surface px-2 py-1 text-[11.5px] text-ink"
          >
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlatformDot({ platform }: { platform: Platform }) {
  const color =
    platform === "TikTok"
      ? "bg-[#17181B]"
      : platform === "YouTube"
        ? "bg-[#FF0033]"
        : "bg-gradient-to-r from-[#A45EFF] to-[#FF4FB5]";
  return <span className={cn("inline-block h-2 w-2 rounded-full", color)} />;
}

/* ---------- Toolbar filter chip ---------- */

function FilterChip({
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
