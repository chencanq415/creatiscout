"use client";

import { Badge } from "@/components/ui/badge";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { useUIStore } from "@/lib/store/ui-store";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowUpRight, CalendarClock, ChevronDown, Handshake, Search, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type CollaborationStage = "aiMatching" | "shortlist" | "outreach" | "offer" | "confirmed" | "draft" | "publication" | "payment" | "tracking";

const L = {
  eyebrow: { zh: "CAMPAIGN × CREATOR", en: "CAMPAIGN × CREATOR" },
  title: { zh: "合作管理", en: "Collaboration" },
  subtitle: { zh: "集中查看并推进所有 Campaign 与达人的合作进度。", en: "Manage every campaign × creator relationship in one place." },
  allCampaigns: { zh: "全部 Campaign", en: "All campaigns" },
  allStages: { zh: "全部阶段", en: "All stages" },
  search: { zh: "搜索达人或 Campaign…", en: "Search creator or campaign…" },
  activeCollaborations: { zh: "进行中的合作", en: "Active collaborations" },
  dueThisWeek: { zh: "本周到期", en: "Due this week" },
  creators: { zh: "合作达人", en: "Creators" },
  campaign: { zh: "Campaign", en: "Campaign" },
  creator: { zh: "达人", en: "Creator" },
  stage: { zh: "当前阶段", en: "Current stage" },
  deliverable: { zh: "交付内容", en: "Deliverable" },
  compensation: { zh: "合作金额", en: "Compensation" },
  dueDate: { zh: "截止日期", en: "Due date" },
  updated: { zh: "最近更新", en: "Last update" },
  action: { zh: "操作", en: "Action" },
  open: { zh: "打开", en: "Open" },
  noResults: { zh: "没有符合当前条件的合作记录", en: "No collaborations match these filters" },
  aiMatching: { zh: "AI 匹配池", en: "AI Match Pool" },
  shortlist: { zh: "候选达人", en: "Shortlist" },
  outreach: { zh: "达人建联", en: "Outreach" },
  offer: { zh: "合作报价", en: "Offer" },
  confirmed: { zh: "确认合作", en: "Confirmed" },
  draft: { zh: "内容草稿", en: "Draft" },
  publication: { zh: "作品发布", en: "Publication" },
  payment: { zh: "付款", en: "Payment" },
  tracking: { zh: "效果追踪", en: "Performance Tracking" },
} as const;

const stages: CollaborationStage[] = ["aiMatching", "shortlist", "outreach", "offer", "confirmed", "draft", "publication", "payment", "tracking"];
const stageLabels = { aiMatching: L.aiMatching, shortlist: L.shortlist, outreach: L.outreach, offer: L.offer, confirmed: L.confirmed, draft: L.draft, publication: L.publication, payment: L.payment, tracking: L.tracking };
const stageTone: Record<CollaborationStage, "gray" | "blue" | "amber" | "teal" | "pink" | "lavender"> = { aiMatching: "lavender", shortlist: "gray", outreach: "blue", offer: "amber", confirmed: "teal", draft: "lavender", publication: "pink", payment: "amber", tracking: "teal" };

export default function CollaborationsPage() {
  const l = useLoc();
  const campaigns = useUIStore((state) => state.campaigns);
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState<CollaborationStage | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => creators.map((creator, index) => {
    const campaign = campaigns[index % Math.min(campaigns.length, 3)];
    const stage = stages[index % stages.length];
    return {
      id: `${campaign?.id}-${creator.id}`,
      campaign,
      creator,
      stage,
      deliverable: ["TikTok Video × 2", "Instagram Reel × 1", "RedNote Post × 2", "YouTube Integration × 1"][index % 4],
      dueDate: ["Aug 20", "Aug 23", "Aug 27", "Sep 02"][index % 4],
      updated: ["12 min", "2 hr", "Yesterday", "3 days"][index % 4],
    };
  }).filter((row) => row.campaign), [campaigns]);

  const filteredRows = rows.filter((row) => {
    const text = `${row.creator.name} ${row.creator.handle} ${l(row.campaign.name)} ${l(row.campaign.brand)}`.toLowerCase();
    return (campaignFilter === "all" || row.campaign.id === campaignFilter) && (stageFilter === "all" || row.stage === stageFilter) && (!query || text.includes(query.toLowerCase()));
  });

  return (
    <div className="min-h-full bg-surface px-6 py-7 lg:px-8">
      <div className="w-full">
        <div>
          <h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1>
          <p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <SummaryCard icon={<Handshake className="h-4 w-4" />} label={l(L.activeCollaborations)} value={String(rows.filter((row) => row.stage !== "tracking").length)} />
          <SummaryCard icon={<CalendarClock className="h-4 w-4" />} label={l(L.dueThisWeek)} value="4" />
          <SummaryCard icon={<Users className="h-4 w-4" />} label={l(L.creators)} value={String(new Set(rows.map((row) => row.creator.id)).size)} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 rounded-[13px] border border-border bg-surface p-4 shadow-card">
          <div className="relative min-w-[260px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={l(L.search)} className="h-10 w-full rounded-[9px] border border-border bg-page pl-9 pr-3 text-[12px] outline-none focus:border-brand/40" /></div>
          <Select value={campaignFilter} onChange={setCampaignFilter} label={l(L.allCampaigns)} options={campaigns.map((campaign) => ({ value: campaign.id, label: l(campaign.name) }))} />
          <Select value={stageFilter} onChange={(value) => setStageFilter(value as CollaborationStage | "all")} label={l(L.allStages)} options={stages.map((stage) => ({ value: stage, label: l(stageLabels[stage]) }))} />
        </div>

        <div className="mt-4 overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="border-b border-border bg-surface-warm/70 text-[10px] font-semibold uppercase tracking-wider text-muted"><tr><th className="px-5 py-3">{l(L.creator)}</th><th className="px-4 py-3">{l(L.campaign)}</th><th className="px-4 py-3">{l(L.stage)}</th><th className="px-4 py-3">{l(L.deliverable)}</th><th className="px-4 py-3">{l(L.compensation)}</th><th className="px-4 py-3">{l(L.dueDate)}</th><th className="px-4 py-3">{l(L.updated)}</th><th className="px-4 py-3 text-right">{l(L.action)}</th></tr></thead>
              <tbody className="divide-y divide-border">
                {filteredRows.map((row) => <tr key={row.id} className="transition-colors hover:bg-page/70"><td className="px-5 py-4"><div className="flex items-center gap-2.5"><img src={row.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><div><div className="text-[12px] font-semibold text-ink">{row.creator.name}</div><div className="text-[10px] text-muted">{row.creator.handle}</div></div></div></td><td className="px-4 py-4"><div className="text-[12px] font-medium text-ink">{l(row.campaign.name)}</div><div className="text-[10px] text-muted">{l(row.campaign.brand)}</div></td><td className="px-4 py-4"><Badge tone={stageTone[row.stage]}>{l(stageLabels[row.stage])}</Badge></td><td className="px-4 py-4 text-[11px] text-slate">{row.deliverable}</td><td className="px-4 py-4 text-[11px] font-semibold text-ink">{formatCurrency(row.creator.averageQuote ?? 0)}</td><td className="px-4 py-4 text-[11px] text-slate">{row.dueDate}</td><td className="px-4 py-4 text-[10px] text-muted">{row.updated}</td><td className="px-4 py-4 text-right"><Link href={`/campaigns/${row.campaign.id}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover">{l(L.open)}<ArrowUpRight className="h-3.5 w-3.5" /></Link></td></tr>)}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && <div className="px-6 py-16 text-center text-[12px] text-muted">{l(L.noResults)}</div>}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface p-4 shadow-card"><span className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-soft-pink text-brand">{icon}</span><div><div className="text-[20px] font-bold text-navy">{value}</div><div className="text-[10px] text-muted">{label}</div></div></div>;
}

function Select({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: { value: string; label: string }[] }) {
  return <label className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="h-10 min-w-[180px] appearance-none rounded-[9px] border border-border bg-white px-3 pr-8 text-[11px] text-ink outline-none"><option value="all">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" /></label>;
}
