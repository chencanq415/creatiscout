"use client";

import { useLoc } from "@/lib/i18n/use-i18n";
import { useCampaignCollaborationScope } from "@/components/campaign-drawer/collaboration-scope";
import { creators } from "@/lib/mock/creators";
import { useUIStore } from "@/lib/store/ui-store";
import { cn, formatCurrency } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type CollaborationStage = "aiMatching" | "shortlist" | "outreach" | "confirmed" | "draft" | "publication" | "payment" | "tracking";
type CollaborationSubStatus =
  | "readyToContact"
  | "outreachAwaitingResponse"
  | "outreachAwaitingConfirmation"
  | "outreachDeclined"
  | "offerAccepted"
  | "offerDeclined"
  | "offerAwaitingConfirmation"
  | "draftAwaitingSubmission"
  | "draftUnderReview"
  | "draftApproved"
  | "draftRejected"
  | "proofAwaitingSubmission"
  | "proofUnderReview"
  | "proofApproved"
  | "proofRejected"
  | "paymentPending"
  | "paymentCompleted";

const L = {
  eyebrow: { zh: "CAMPAIGN × CREATOR", en: "CAMPAIGN × CREATOR" },
  title: { zh: "合作管理", en: "Collaboration" },
  subtitle: { zh: "集中查看并推进所有营销活动与达人的合作进度。", en: "Manage every campaign × creator relationship in one place." },
  allCampaigns: { zh: "全部营销活动", en: "All campaigns" },
  allStages: { zh: "全部阶段", en: "All stages" },
  search: { zh: "搜索达人或营销活动…", en: "Search creator or campaign…" },
  campaign: { zh: "营销活动", en: "Campaign" },
  creator: { zh: "达人", en: "Creator" },
  stage: { zh: "当前阶段", en: "Current stage" },
  deliverable: { zh: "交付内容", en: "Deliverable" },
  compensation: { zh: "合作金额", en: "Compensation" },
  dueDate: { zh: "截止日期", en: "Due date" },
  updated: { zh: "最近更新", en: "Last update" },
  action: { zh: "操作", en: "Action" },
  open: { zh: "打开", en: "Open" },
  status: { zh: "当前状态", en: "Current status" },
  addToShortlist: { zh: "加入候选列表", en: "Add to shortlist" },
  contactNow: { zh: "达人建联", en: "Outreach" },
  notFit: { zh: "不感兴趣", en: "Dislike" },
  cancelShortlist: { zh: "移除", en: "Remove" },
  details: { zh: "查看详情", en: "View details" },
  matching: { zh: "匹配情况", en: "Matching" },
  score: { zh: "匹配分", en: "Score" },
  reason: { zh: "匹配原因", en: "Reason" },
  recentPosts: { zh: "近期作品", en: "Recent posts" },
  averageEngagement30Days: { zh: "平均互动率（近 30 天）", en: "Avg. engagement (last 30 days)" },
  averageViews30Days: { zh: "平均播放量（近 30 天）", en: "Avg. views (last 30 days)" },
  estimatedPublishDate: { zh: "预计发布时间", en: "Est. publish date" },
  proofSubmittedAt: { zh: "凭证提交时间", en: "Proof submission time" },
  contentLink: { zh: "作品链接", en: "Content link" },
  contentPerformance: { zh: "作品数据", en: "Content performance" },
  impressions: { zh: "曝光", en: "Impressions" },
  likes: { zh: "点赞", en: "Likes" },
  comments: { zh: "评论", en: "Comments" },
  engagementRate: { zh: "互动率", en: "Engagement rate" },
  collaborationIntent: { zh: "达人合作意向", en: "Collaboration intent" },
  aiAnalysis: { zh: "AI 分析", en: "AI analysis" },
  allStatuses: { zh: "全部状态", en: "All statuses" },
  confirm: { zh: "确认", en: "Confirm" },
  reject: { zh: "拒绝", en: "Reject" },
  editOffer: { zh: "编辑 Offer", en: "Edit offer" },
  submitDraft: { zh: "提交草稿", en: "Submit draft" },
  approveDraft: { zh: "审核通过", en: "Approve draft" },
  rejectDraft: { zh: "审核不通过", en: "Reject draft" },
  editDraft: { zh: "编辑稿件", en: "Edit draft" },
  submitProof: { zh: "提交发布凭证", en: "Submit proof" },
  approveProof: { zh: "审核通过", en: "Approve proof" },
  rejectProof: { zh: "审核不通过", en: "Reject proof" },
  editProof: { zh: "编辑凭证", en: "Edit proof" },
  addPaymentRecord: { zh: "添加付款记录", en: "Add payment record" },
  account: { zh: "账号信息", en: "Account" },
  platform: { zh: "平台", en: "Platform" },
  performance: { zh: "表现与信用", en: "Performance" },
  followers: { zh: "粉丝数", en: "Followers" },
  engagement: { zh: "互动率", en: "Engagement" },
  salesPotential: { zh: "带货能力", en: "Sales potential" },
  deliveryRate: { zh: "准时履约率", en: "On-time delivery" },
  collaborationCredit: { zh: "履约信用", en: "Collaboration credit" },
  excellent: { zh: "优秀", en: "Excellent" },
  high: { zh: "高", en: "High" },
  noResults: { zh: "没有符合当前条件的合作记录", en: "No collaborations match these filters" },
  aiMatching: { zh: "智能匹配", en: "Matching" },
  shortlist: { zh: "候选达人", en: "Shortlist" },
  outreach: { zh: "达人建联", en: "Outreach" },
  offer: { zh: "议价中", en: "Negotiation" },
  confirmed: { zh: "确认合作", en: "Offer" },
  draft: { zh: "稿件创作", en: "Draft" },
  publication: { zh: "作品发布", en: "Publication" },
  payment: { zh: "款项结算", en: "Payment" },
  tracking: { zh: "效果追踪", en: "Tracking" },
} as const;

const stages: CollaborationStage[] = ["aiMatching", "shortlist", "outreach", "confirmed", "draft", "publication", "payment", "tracking"];
const stageLabels = { aiMatching: L.aiMatching, shortlist: L.shortlist, outreach: L.outreach, confirmed: L.confirmed, draft: L.draft, publication: L.publication, payment: L.payment, tracking: L.tracking };
const stageVolumes: Record<CollaborationStage, number> = { aiMatching: 32, shortlist: 6, outreach: 7, confirmed: 5, draft: 3, publication: 2, payment: 2, tracking: 7 };
const stageSubStatuses: Partial<Record<CollaborationStage, CollaborationSubStatus[]>> = {
  outreach: ["readyToContact", "outreachAwaitingResponse", "outreachAwaitingConfirmation", "outreachDeclined"],
  confirmed: ["offerAccepted", "offerDeclined", "offerAwaitingConfirmation"],
  draft: ["draftAwaitingSubmission", "draftUnderReview", "draftApproved", "draftRejected"],
  publication: ["proofAwaitingSubmission", "proofUnderReview", "proofApproved", "proofRejected"],
  payment: ["paymentPending", "paymentCompleted"],
};
const subStatusLabels: Record<CollaborationSubStatus, { zh: string; en: string }> = {
  readyToContact: { zh: "待建联", en: "Ready to contact" },
  outreachAwaitingResponse: { zh: "待反馈", en: "Awaiting response" },
  outreachAwaitingConfirmation: { zh: "待确认", en: "Awaiting confirmation" },
  outreachDeclined: { zh: "已拒绝", en: "Declined" },
  offerAccepted: { zh: "已接受", en: "Accepted" },
  offerDeclined: { zh: "已拒绝", en: "Declined" },
  offerAwaitingConfirmation: { zh: "待确认", en: "Pending" },
  draftAwaitingSubmission: { zh: "稿件待提交", en: "Draft to submit" },
  draftUnderReview: { zh: "稿件待审核", en: "Draft under review" },
  draftApproved: { zh: "稿件审核通过", en: "Draft approved" },
  draftRejected: { zh: "稿件驳回", en: "Draft rejected" },
  proofAwaitingSubmission: { zh: "待提交", en: "Ready to submit" },
  proofUnderReview: { zh: "凭证待审核", en: "Proof pending review" },
  proofApproved: { zh: "凭证审核通过", en: "Proof approved" },
  proofRejected: { zh: "凭证审核不通过", en: "Proof rejected" },
  paymentPending: { zh: "待付款", en: "Pending payment" },
  paymentCompleted: { zh: "已付款", en: "Paid" },
};
const subStatusTone: Record<CollaborationSubStatus, "gray" | "blue" | "amber" | "teal" | "pink" | "lavender"> = {
  readyToContact: "gray", outreachAwaitingResponse: "blue", outreachAwaitingConfirmation: "amber", outreachDeclined: "pink",
  offerAccepted: "teal", offerDeclined: "pink", offerAwaitingConfirmation: "amber",
  draftAwaitingSubmission: "gray", draftUnderReview: "amber", draftApproved: "teal", draftRejected: "pink",
  proofAwaitingSubmission: "gray", proofUnderReview: "amber", proofApproved: "teal", proofRejected: "pink",
  paymentPending: "amber", paymentCompleted: "teal",
};

type CollaborationRow = {
  id: string;
  campaign: NonNullable<ReturnType<typeof useUIStore.getState>["campaigns"][number]>;
  creator: (typeof creators)[number];
  stage: CollaborationStage;
  subStatus: CollaborationSubStatus | undefined;
  deliverable: string;
  dueDate: string;
  updated: string;
};

export default function CollaborationsPage() {
  const { campaignId, embedded } = useCampaignCollaborationScope();
  const l = useLoc();
  const campaigns = useUIStore((state) => state.campaigns);
  const [campaignFilter, setCampaignFilter] = useState(campaignId ?? "all");
  const [stageFilter, setStageFilter] = useState<CollaborationStage>("outreach");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [rowOverrides, setRowOverrides] = useState<Record<string, Partial<CollaborationRow>>>({});
  const [removedRowIds, setRemovedRowIds] = useState<string[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  const baseRows = useMemo(() => stages.flatMap((stage, stageIndex) => Array.from({ length: stageVolumes[stage] }, (_, index) => {
    const creator = creators[(index + stageIndex) % creators.length];
    const campaign = campaigns[(index + stageIndex) % Math.max(campaigns.length, 1)];
    const statuses = stageSubStatuses[stage];
    return { id: `${stage}-${index}-${creator.id}`, campaign, creator, stage, subStatus: statuses?.[index % statuses.length], deliverable: ["TikTok Video × 2", "Instagram Reel × 1", "RedNote Post × 2", "YouTube Integration × 1"][index % 4], dueDate: ["Aug 20", "Aug 23", "Aug 27", "Sep 02"][index % 4], updated: ["12 min", "2 hr", "Yesterday", "3 days"][index % 4] };
  })).filter((row): row is CollaborationRow => Boolean(row.campaign)), [campaigns]);
  const rows = baseRows.filter((row) => !removedRowIds.includes(row.id)).map((row) => ({ ...row, ...rowOverrides[row.id] }));
  const stageCounts = stages.reduce((counts, stage) => ({ ...counts, [stage]: rows.filter((row) => row.stage === stage).length }), {} as Record<CollaborationStage, number>);
  const hasSubStatuses = Boolean(stageSubStatuses[stageFilter]?.length);
  const isDiscoveryStage = stageFilter === "aiMatching" || stageFilter === "shortlist";
  const isOutreachStage = stageFilter === "outreach";
  const isPublicationStage = stageFilter === "publication";
  const isTrackingStage = stageFilter === "tracking";
  const usesEstimatedPublishDate = stageFilter === "confirmed" || stageFilter === "draft" || isPublicationStage;
  const canFilterByStatus = !isDiscoveryStage && stageFilter !== "tracking" && Boolean(stageSubStatuses[stageFilter]?.length);
  const selectedCreator = creators.find((creator) => creator.id === selectedCreatorId) ?? null;

  const moveRow = (row: CollaborationRow, stage: CollaborationStage) => {
    setRowOverrides((current) => ({ ...current, [row.id]: { stage, subStatus: stageSubStatuses[stage]?.[0], updated: "Just now" } }));
    setStageFilter(stage);
    setStatusFilter("all");
  };
  const removeRow = (row: CollaborationRow) => setRemovedRowIds((current) => [...current, row.id]);
  const updateSubStatus = (row: CollaborationRow, subStatus: CollaborationSubStatus) => setRowOverrides((current) => ({ ...current, [row.id]: { subStatus, updated: "Just now" } }));
  const filteredRows = rows.filter((row) => {
    const text = `${row.creator.name} ${row.creator.handle} ${l(row.campaign.name)} ${l(row.campaign.brand)}`.toLowerCase();
    return (campaignFilter === "all" || row.campaign.id === campaignFilter) && row.stage === stageFilter && (!canFilterByStatus || statusFilter === "all" || row.subStatus === statusFilter) && (!query || text.includes(query.toLowerCase()));
  });

  return (
    <div className={cn("min-h-full bg-surface", embedded ? "px-6 py-5 lg:px-8" : "px-6 py-5 lg:px-8")}>
      <div className="w-full">
        {!embedded && <div><h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1><p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p></div>}

        <nav className={embedded ? "" : "mt-5"} aria-label="Collaboration progress">
          <div className="flex w-full min-w-0 items-center py-1">
            {stages.map((stage, index) => {
              const active = stageFilter === stage;
              return <button key={stage} onClick={() => { setStageFilter(stage); setStatusFilter("all"); }} style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)" }} className={cn("relative flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 px-2 text-[10.5px] font-semibold transition-colors", index > 0 && "-ml-2.5", active ? "z-10 bg-brand text-white" : "bg-page text-slate hover:bg-soft-pink/60 hover:text-ink")}>
                <span className="whitespace-nowrap">{l(stageLabels[stage])}</span>
                <span className={cn("rounded-full px-1.5 py-0.5 text-[8px]", active ? "bg-white/20 text-white" : "bg-white text-muted")}>{stageCounts[stage]}</span>
              </button>;
            })}
          </div>
        </nav>

        <div className="mt-5 flex flex-wrap gap-2 rounded-[13px] border border-border bg-surface p-4">
          <div className="relative min-w-[260px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={l(L.search)} className="h-10 w-full rounded-[9px] border border-border bg-page pl-9 pr-3 text-[12px] outline-none focus:border-brand/40" /></div>
          {!campaignId && <Select value={campaignFilter} onChange={setCampaignFilter} label={l(L.allCampaigns)} options={campaigns.map((campaign) => ({ value: campaign.id, label: l(campaign.name) }))} />}
          {canFilterByStatus && <Select value={statusFilter} onChange={setStatusFilter} label={l(L.allStatuses)} options={(stageSubStatuses[stageFilter] ?? []).map((status) => ({ value: status, label: l(subStatusLabels[status]) }))} />}
          <div className="flex h-10 items-center rounded-[9px] bg-soft-pink px-3 text-[11px] font-semibold text-brand">{l(stageLabels[stageFilter])} · {filteredRows.length}</div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[14px] border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className={cn("w-full text-left", isDiscoveryStage ? "min-w-[1420px]" : isOutreachStage ? "min-w-[1250px]" : isTrackingStage ? "min-w-[1280px]" : "min-w-[1050px]")}>
              <thead className="border-b border-border bg-surface-warm/70 text-[10px] font-semibold uppercase tracking-wider text-muted"><tr>{isDiscoveryStage ? <><th className="px-5 py-3">{l(L.creator)}</th><th className="px-4 py-3">{l(L.campaign)}</th><th className="px-4 py-3">{l(L.matching)}</th><th className="px-4 py-3">{l(L.recentPosts)}</th><th className="px-4 py-3">{l(L.averageEngagement30Days)}</th><th className="px-4 py-3">{l(L.averageViews30Days)}</th><th className="sticky right-0 z-20 border-l border-border bg-surface-warm px-4 py-3 text-right">{l(L.action)}</th></> : isOutreachStage ? <><th className="px-5 py-3">{l(L.creator)}</th><th className="px-4 py-3">{l(L.campaign)}</th><th className="px-4 py-3">{l(L.status)}</th><th className="px-4 py-3">{l(L.collaborationIntent)}</th><th className="px-4 py-3">{l(L.deliverable)}</th><th className="px-4 py-3">{l(L.compensation)}</th><th className="px-4 py-3">{l(L.estimatedPublishDate)}</th><th className="px-4 py-3">{l(L.updated)}</th><th className="sticky right-0 z-20 border-l border-border bg-surface-warm px-4 py-3 text-right">{l(L.action)}</th></> : isTrackingStage ? <><th className="px-5 py-3">{l(L.creator)}</th><th className="px-4 py-3">{l(L.campaign)}</th><th className="px-4 py-3">{l(L.contentLink)}</th><th className="px-4 py-3">{l(L.impressions)}</th><th className="px-4 py-3">{l(L.likes)}</th><th className="px-4 py-3">{l(L.comments)}</th><th className="px-4 py-3">{l(L.engagementRate)}</th><th className="sticky right-0 z-20 border-l border-border bg-surface-warm px-4 py-3 text-right">{l(L.action)}</th></> : <><th className="px-5 py-3">{l(L.creator)}</th><th className="px-4 py-3">{l(L.campaign)}</th>{hasSubStatuses && <th className="px-4 py-3">{l(L.status)}</th>}<th className="px-4 py-3">{l(L.deliverable)}</th><th className="px-4 py-3">{l(L.compensation)}</th><th className="px-4 py-3">{l(usesEstimatedPublishDate ? L.estimatedPublishDate : L.dueDate)}</th>{isPublicationStage && <th className="px-4 py-3">{l(L.proofSubmittedAt)}</th>}<th className="px-4 py-3">{l(L.updated)}</th><th className="sticky right-0 z-20 border-l border-border bg-surface-warm px-4 py-3 text-right">{l(L.action)}</th></>}</tr></thead>
              <tbody className="divide-y divide-border">
                {filteredRows.map((row) => isDiscoveryStage ? <MatchingRow key={row.id} row={row} locale={l} onMove={moveRow} onRemove={removeRow} onViewCreator={setSelectedCreatorId} /> : isOutreachStage ? <OutreachRow key={row.id} row={row} locale={l} onMove={moveRow} onRemove={removeRow} onViewCreator={setSelectedCreatorId} onStatusChange={updateSubStatus} /> : isTrackingStage ? <TrackingRow key={row.id} row={row} locale={l} onMove={moveRow} onRemove={removeRow} onViewCreator={setSelectedCreatorId} onStatusChange={updateSubStatus} /> : <tr key={row.id} className="transition-colors hover:bg-page/70"><td className="px-5 py-4"><div className="flex items-center gap-2.5"><img src={row.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><div><div className="text-[12px] font-semibold text-ink">{row.creator.name}</div><div className="text-[10px] text-muted">{row.creator.handle}</div></div></div></td><td className="px-4 py-4"><div className="text-[12px] font-medium text-ink">{l(row.campaign.name)}</div><div className="text-[10px] text-muted">{l(row.campaign.brand)}</div></td>{hasSubStatuses && <td className="px-4 py-4"><StatusActions row={row} locale={l} /></td>}<td className="px-4 py-4 text-[11px] text-slate">{row.deliverable}</td><td className="px-4 py-4 text-[11px] font-semibold text-ink">{formatCurrency(row.creator.averageQuote ?? 0)}</td><td className="px-4 py-4 text-[11px] text-slate">{row.dueDate}</td>{isPublicationStage && <td className="px-4 py-4 text-[11px] text-slate">{row.updated === "12 min" ? "Aug 18 · 10:32" : row.updated === "2 hr" ? "Aug 19 · 14:20" : "Aug 20 · 09:45"}</td>}<td className="px-4 py-4 text-[10px] text-muted">{row.updated}</td><td className="sticky right-0 z-10 border-l border-border bg-surface px-4 py-4 text-right"><InlineRowActions row={row} locale={l} onMove={moveRow} onRemove={removeRow} onViewCreator={setSelectedCreatorId} onStatusChange={updateSubStatus} /></td></tr>)}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && <div className="px-6 py-16 text-center text-[12px] text-muted">{l(L.noResults)}</div>}
        </div>
        {selectedCreator && <CreatorDetailDrawer key={selectedCreator.id} creator={selectedCreator} locale={l} onClose={() => setSelectedCreatorId(null)} />}
      </div>
    </div>
  );
}

function MatchingRow({ row, locale: l, onMove, onRemove, onViewCreator }: { row: CollaborationRow; locale: (value: { zh: string; en: string }) => string; onMove: (row: CollaborationRow, stage: CollaborationStage) => void; onRemove: (row: CollaborationRow) => void; onViewCreator: (creatorId: string) => void }) {
  const medianViews = Math.round(row.creator.followers * (0.18 + (row.creator.engagement / 100)));
  const postLabels = row.creator.platform === "YouTube" ? ["Video", "Short", "Video"] : row.creator.platform === "Instagram" ? ["Reel", "Post", "Story"] : ["Video", "Post", "Video"];
  return <tr className="transition-colors hover:bg-page/70">
    <td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><img src={row.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><div><div className="text-[12px] font-semibold text-ink">{row.creator.name}</div><div className="text-[10px] text-muted">{row.creator.handle}</div></div></div></td>
    <td className="px-4 py-3.5"><div className="text-[12px] font-medium text-ink">{l(row.campaign.name)}</div><div className="text-[10px] text-muted">{l(row.campaign.brand)}</div></td>
    <td className="px-4 py-3.5"><div className="max-w-[230px]"><div className="text-[11px] font-semibold text-ink">{l(L.score)} · {row.creator.fitScore}%</div><p className="mt-1 text-[10px] leading-4 text-muted">{l(row.creator.reason)}</p></div></td>
    <td className="px-4 py-3.5"><div className="flex items-center gap-1.5">{postLabels.map((label, index) => <div key={`${label}-${index}`} className="relative h-12 w-12 overflow-hidden rounded-md bg-surface-warm"><img src={row.creator.avatar} alt="" className="h-full w-full object-cover opacity-90" style={{ objectPosition: `${35 + index * 22}% center` }} /><span className="absolute inset-x-0 bottom-0 bg-navy/60 py-0.5 text-center text-[7px] font-medium text-white">{label}</span></div>)}</div></td>
    <td className="px-4 py-3.5 text-[12px] font-semibold text-ink">{row.creator.engagement}%</td>
    <td className="px-4 py-3.5 text-[12px] font-semibold text-ink">{formatCompactMetric(medianViews)}</td>
    <td className="sticky right-0 z-10 border-l border-border bg-surface px-4 py-3.5 text-right"><InlineRowActions row={row} locale={l} onMove={onMove} onRemove={onRemove} onViewCreator={onViewCreator} /></td>
  </tr>;
}

function OutreachRow({ row, locale: l, onMove, onRemove, onViewCreator, onStatusChange }: { row: CollaborationRow; locale: (value: { zh: string; en: string }) => string; onMove: (row: CollaborationRow, stage: CollaborationStage) => void; onRemove: (row: CollaborationRow) => void; onViewCreator: (creatorId: string) => void; onStatusChange: (row: CollaborationRow, status: CollaborationSubStatus) => void }) {
  const hasFeedback = row.subStatus === "outreachAwaitingConfirmation";
  const estimatedPublishDate = row.id.includes("outreach-6-") ? "Sep 16" : "Sep 08";
  const intentLevel = row.subStatus === "outreachDeclined" ? 1 : row.subStatus === "outreachAwaitingConfirmation" ? 3 : row.subStatus === "outreachAwaitingResponse" ? 2 : 0;
  const intentTone = row.subStatus === "outreachDeclined" ? "bg-soft-pink" : row.subStatus === "outreachAwaitingConfirmation" ? "bg-soft-teal" : "bg-[#e7edf9]";
  return <tr className="transition-colors hover:bg-page/70">
    <td className="px-5 py-4"><div className="flex items-center gap-2.5"><img src={row.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><div><div className="text-[12px] font-semibold text-ink">{row.creator.name}</div><div className="text-[10px] text-muted">{row.creator.handle}</div></div></div></td>
    <td className="px-4 py-4"><div className="text-[12px] font-medium text-ink">{l(row.campaign.name)}</div><div className="text-[10px] text-muted">{l(row.campaign.brand)}</div></td>
    <td className="px-4 py-4"><StatusActions row={row} locale={l} /></td>
    <td className="px-4 py-4"><div className="flex w-[86px] items-center gap-1.5" aria-label={`${l(L.collaborationIntent)}: ${intentLevel}/3`}>{[1, 2, 3].map((level) => <span key={level} className={cn("h-1.5 flex-1 rounded-full", level <= intentLevel ? intentTone : "bg-page")} />)}</div></td>
    <td className="px-4 py-4 text-[11px] text-slate">{hasFeedback ? row.deliverable : "—"}</td>
    <td className="px-4 py-4 text-[11px] font-semibold text-ink">{hasFeedback ? formatCurrency(row.creator.averageQuote ?? 0) : "—"}</td>
    <td className="px-4 py-4 text-[11px] text-slate">{hasFeedback ? estimatedPublishDate : "—"}</td>
    <td className="px-4 py-4 text-[10px] text-muted">{row.updated}</td>
    <td className="sticky right-0 z-10 border-l border-border bg-surface px-4 py-4 text-right"><OutreachActions row={row} locale={l} onMove={onMove} onRemove={onRemove} onViewCreator={onViewCreator} onStatusChange={onStatusChange} /></td>
  </tr>;
}

function TrackingRow({ row, locale: l, onMove, onRemove, onViewCreator, onStatusChange }: { row: CollaborationRow; locale: (value: { zh: string; en: string }) => string; onMove: (row: CollaborationRow, stage: CollaborationStage) => void; onRemove: (row: CollaborationRow) => void; onViewCreator: (creatorId: string) => void; onStatusChange: (row: CollaborationRow, status: CollaborationSubStatus) => void }) {
  const impressions = Math.round(row.creator.followers * 0.96);
  const likes = Math.round(impressions * 0.052);
  const comments = Math.round(impressions * 0.002);
  const compact = (value: number) => value >= 1000 ? `${Math.round(value / 1000)}K` : String(value);
  return <tr className="transition-colors hover:bg-page/70">
    <td className="px-5 py-4"><div className="flex items-center gap-2.5"><img src={row.creator.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><div><div className="text-[12px] font-semibold text-ink">{row.creator.name}</div><div className="text-[10px] text-muted">{row.creator.handle}</div></div></div></td>
    <td className="px-4 py-4"><div className="text-[12px] font-medium text-ink">{l(row.campaign.name)}</div><div className="text-[10px] text-muted">{l(row.campaign.brand)}</div></td>
    <td className="px-4 py-4"><a href={`https://example.com/${row.creator.handle.slice(1)}/content`} target="_blank" rel="noreferrer" className="text-[11px] font-medium text-brand hover:underline">{row.creator.platform.toLowerCase()}.com/{row.creator.handle.slice(1)}</a></td>
    <td className="px-4 py-4 text-[12px] font-semibold text-ink">{compact(impressions)}</td>
    <td className="px-4 py-4 text-[12px] font-semibold text-ink">{compact(likes)}</td>
    <td className="px-4 py-4 text-[12px] font-semibold text-ink">{compact(comments)}</td>
    <td className="px-4 py-4 text-[12px] font-semibold text-ink">{row.creator.engagement}%</td>
    <td className="sticky right-0 z-10 border-l border-border bg-surface px-4 py-4 text-right"><InlineRowActions row={row} locale={l} onMove={onMove} onRemove={onRemove} onViewCreator={onViewCreator} onStatusChange={onStatusChange} /></td>
  </tr>;
}

function OutreachActions({ row, locale: l, onMove, onRemove, onViewCreator, onStatusChange }: { row: CollaborationRow; locale: (value: { zh: string; en: string }) => string; onMove: (row: CollaborationRow, stage: CollaborationStage) => void; onRemove: (row: CollaborationRow) => void; onViewCreator: (creatorId: string) => void; onStatusChange: (row: CollaborationRow, status: CollaborationSubStatus) => void }) {
  const actionClassName = "inline-flex h-7 items-center justify-center rounded-[7px] border border-border bg-white px-2 text-[10px] font-medium text-slate transition hover:border-border-strong hover:text-ink";
  const detail = <Link href={`/collaborations/detail?record=${encodeURIComponent(row.id)}`} className={actionClassName}>{l(L.details)}</Link>;
  if (row.subStatus === "readyToContact") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange(row, "outreachAwaitingResponse")} className={actionClassName}>{l(L.contactNow)}</button>{detail}</div>;
  if (row.subStatus === "outreachAwaitingConfirmation") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onMove(row, "confirmed")} className={actionClassName}>{l(L.confirm)}</button><button type="button" onClick={() => onStatusChange(row, "outreachDeclined")} className={actionClassName}>{l(L.reject)}</button>{detail}</div>;
  return <div className="flex justify-end">{detail}</div>;
}

function CreatorDetailDrawer({ creator, locale: l, onClose }: { creator: (typeof creators)[number]; locale: (value: { zh: string; en: string }) => string; onClose: () => void }) {
  const platforms = Array.from(new Set([creator.platform, "Instagram", "TikTok", "YouTube"]));
  const [platform, setPlatform] = useState(creator.platform);
  const views = Math.round(creator.followers * (0.18 + creator.engagement / 100));
  const compact = (value: number) => value >= 1000 ? `${Math.round(value / 1000)}K` : String(value);
  const workTypes = platform === "Instagram" ? ["Reel", "Post", "Story"] : platform === "YouTube" ? ["Video", "Short", "Live"] : ["Video", "Post", "Video"];
  return <><button type="button" aria-label="Close creator details" onClick={onClose} className="fixed inset-0 z-40 cursor-default bg-navy/10" /><aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col border-l border-border bg-surface">
    <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4"><div className="text-[15px] font-semibold text-ink">{l(L.account)}</div><button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate hover:bg-page hover:text-ink"><X className="h-4 w-4" /></button></header>
    <div className="flex-1 overflow-y-auto px-6 py-6"><section><div className="flex items-center gap-3.5"><img src={creator.avatar} alt="" className="h-14 w-14 rounded-full object-cover" /><div><div className="text-[17px] font-bold text-navy">{creator.name}</div><div className="mt-0.5 text-[11px] text-muted">{creator.handle}</div><div className="mt-1.5 text-[10px] text-slate">United States</div></div></div></section>
      <section className="mt-7 border-t border-border pt-6"><h2 className="text-[13px] font-semibold text-ink">{l(L.platform)}</h2><div className="mt-3 flex flex-wrap gap-1.5">{platforms.map((item) => <button key={item} type="button" onClick={() => setPlatform(item)} className={cn("rounded-[7px] border px-3 py-1.5 text-[10px] font-medium transition", platform === item ? "border-brand/25 bg-soft-pink text-brand" : "border-border bg-white text-slate hover:text-ink")}>{item}</button>)}</div><div className="mt-4 grid grid-cols-3 gap-2">{[[l(L.followers), compact(platform === creator.platform ? creator.followers : Math.round(creator.followers * 0.42))], [l(L.engagement), `${platform === creator.platform ? creator.engagement : Math.max(2.6, creator.engagement - 2.1).toFixed(1)}%`], [l(L.averageViews30Days), compact(platform === creator.platform ? views : Math.round(views * 0.45))]].map(([label, value]) => <div key={label} className="rounded-[9px] bg-page px-3 py-3"><div className="text-[9px] leading-3 text-muted">{label}</div><div className="mt-1.5 text-[14px] font-semibold text-ink">{value}</div></div>)}</div><div className="mt-5"><div className="text-[11px] font-semibold text-ink">{l(L.recentPosts)}</div><div className="mt-2.5 grid grid-cols-3 gap-2">{workTypes.map((type, index) => <div key={`${type}-${index}`} className="relative aspect-[.82] overflow-hidden rounded-[8px] bg-page"><img src={creator.avatar} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${30 + index * 24}% center` }} /><span className="absolute inset-x-0 bottom-0 bg-navy/65 py-1 text-center text-[9px] font-medium text-white">{type}</span></div>)}</div></div></section>
      <section className="mt-7 border-t border-border pt-6"><h2 className="text-[13px] font-semibold text-ink">{l(L.performance)}</h2><div className="mt-3 divide-y divide-border rounded-[10px] border border-border bg-white"><DrawerMetric label={l(L.salesPotential)} value={l(L.high)} /><DrawerMetric label={l(L.deliveryRate)} value={`${94 + (creator.collaborations ?? 0)}%`} /><DrawerMetric label={l(L.collaborationCredit)} value={l(L.excellent)} /></div></section>
    </div>
  </aside></>;
}

function DrawerMetric({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between px-4 py-3"><span className="text-[11px] text-slate">{label}</span><strong className="text-[12px] text-ink">{value}</strong></div>;
}

function StatusActions({ row, locale: l }: { row: CollaborationRow; locale: (value: { zh: string; en: string }) => string }) {
  if (!row.subStatus) return <span className="text-[11px] text-muted">—</span>;
  const tone = subStatusTone[row.subStatus];
  const toneClass = tone === "teal" ? "border-teal-100 bg-soft-teal text-teal-text" : tone === "pink" ? "border-brand/15 bg-soft-pink text-brand" : tone === "amber" ? "border-amber-100 bg-amber-50 text-amber-700" : tone === "blue" ? "border-blue-100 bg-blue-50 text-blue-700" : "border-border bg-page text-slate";
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium", toneClass)}>{l(subStatusLabels[row.subStatus])}</span>;
}

function formatCompactMetric(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

function InlineRowActions({ row, locale: l, onMove, onRemove, onViewCreator, onStatusChange }: { row: CollaborationRow; locale: (value: { zh: string; en: string }) => string; onMove: (row: CollaborationRow, stage: CollaborationStage) => void; onRemove: (row: CollaborationRow) => void; onViewCreator?: (creatorId: string) => void; onStatusChange?: (row: CollaborationRow, status: CollaborationSubStatus) => void }) {
  const actionClassName = "inline-flex h-7 items-center justify-center rounded-[7px] border border-border bg-white px-2 text-[10px] font-medium text-slate transition hover:border-border-strong hover:text-ink";
  const detail = row.stage === "aiMatching" || row.stage === "shortlist" ? <button type="button" onClick={() => onViewCreator?.(row.creator.id)} className={actionClassName}>{l(L.details)}</button> : <Link href={`/collaborations/detail?record=${encodeURIComponent(row.id)}`} className={actionClassName}>{l(L.details)}</Link>;
  if (row.stage === "aiMatching") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onMove(row, "shortlist")} className={actionClassName}>{l(L.addToShortlist)}</button><button type="button" onClick={() => onMove(row, "outreach")} className={actionClassName}>{l(L.contactNow)}</button><button type="button" onClick={() => onRemove(row)} className={actionClassName}>{l(L.notFit)}</button>{detail}</div>;
  if (row.stage === "shortlist") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onMove(row, "outreach")} className={actionClassName}>{l(L.contactNow)}</button><button type="button" onClick={() => onRemove(row)} className={actionClassName}>{l(L.cancelShortlist)}</button>{detail}</div>;
  if (row.stage === "confirmed" && row.subStatus !== "offerAccepted") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "offerAwaitingConfirmation")} className={actionClassName}>{l(L.editOffer)}</button>{detail}</div>;
  if (row.stage === "draft" && row.subStatus === "draftAwaitingSubmission") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "draftUnderReview")} className={actionClassName}>{l(L.submitDraft)}</button>{detail}</div>;
  if (row.stage === "draft" && row.subStatus === "draftUnderReview") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "draftApproved")} className={actionClassName}>{l(L.approveDraft)}</button><button type="button" onClick={() => onStatusChange?.(row, "draftRejected")} className={actionClassName}>{l(L.rejectDraft)}</button>{detail}</div>;
  if (row.stage === "draft" && row.subStatus === "draftRejected") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "draftUnderReview")} className={actionClassName}>{l(L.editDraft)}</button>{detail}</div>;
  if (row.stage === "publication" && row.subStatus === "proofAwaitingSubmission") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "proofUnderReview")} className={actionClassName}>{l(L.submitProof)}</button>{detail}</div>;
  if (row.stage === "publication" && row.subStatus === "proofUnderReview") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "proofApproved")} className={actionClassName}>{l(L.approveProof)}</button><button type="button" onClick={() => onStatusChange?.(row, "proofRejected")} className={actionClassName}>{l(L.rejectProof)}</button>{detail}</div>;
  if (row.stage === "publication" && row.subStatus === "proofRejected") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "proofUnderReview")} className={actionClassName}>{l(L.editProof)}</button>{detail}</div>;
  if (row.stage === "payment" && row.subStatus === "paymentPending") return <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><button type="button" onClick={() => onStatusChange?.(row, "paymentCompleted")} className={actionClassName}>{l(L.addPaymentRecord)}</button>{detail}</div>;
  return <div className="flex justify-end">{detail}</div>;
}

function Select({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: { value: string; label: string }[] }) {
  return <label className="relative"><select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="h-10 min-w-[180px] appearance-none rounded-[9px] border border-border bg-white px-3 pr-8 text-[11px] text-ink outline-none"><option value="all">{label}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" /></label>;
}
