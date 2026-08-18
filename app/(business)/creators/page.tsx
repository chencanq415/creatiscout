"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";
import { creators } from "@/lib/mock/creators";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign, CampaignGoal } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowLeft, ArrowRight, BookmarkPlus, CalendarDays, ChevronDown, Filter, MapPin, Search, SlidersHorizontal, Sparkles, Target, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const L = {
  eyebrow: { zh: "CREATOR DISCOVERY", en: "CREATOR DISCOVERY" },
  title: { zh: "达人", en: "Creators" },
  subtitle: { zh: "为 Campaign 匹配合适达人，或探索完整达人市场。", en: "Match creators to campaigns or explore the complete creator marketplace." },
  matchingTab: { zh: "Campaign 匹配", en: "Campaign Matching" },
  marketplaceTab: { zh: "达人市场", en: "Creator Marketplace" },
  matchingTitle: { zh: "Campaign 推荐达人", en: "Recommended creators for this campaign" },
  matchingDesc: { zh: "根据 Campaign 目标、品类、地区和交付要求生成的推荐列表。", en: "Recommendations based on campaign goals, category, region, and deliverables." },
  matchesTitle: { zh: "Campaign Matches", en: "Campaign Matches" },
  matchesDesc: { zh: "查看根据每个 Campaign 要求自动生成的达人推荐。", en: "Review creator recommendations generated from each campaign's requirements." },
  campaignRecommendations: { zh: "Campaign 推荐", en: "Campaign recommendations" },
  recommendationsDesc: { zh: "匹配结果综合 Campaign 的地区、品类、平台和粉丝要求计算。", en: "Matches are calculated from each campaign's region, category, platform, and follower requirements." },
  campaignsReady: { zh: "个 Campaign 已完成匹配", en: "campaigns ready" },
  recommendedCreators: { zh: "推荐达人", en: "Recommended creators" },
  topMatches: { zh: "Top 3 匹配", en: "Top 3 matches" },
  exploreMatches: { zh: "查看全部匹配达人", en: "Explore matched creators" },
  goal: { zh: "目标", en: "Goal" },
  market: { zh: "市场", en: "Market" },
  duration: { zh: "周期", en: "Duration" },
  active: { zh: "进行中", en: "Active" },
  match: { zh: "匹配", en: "Match" },
  estimatedRate: { zh: "预估报价", en: "Est. rate" },
  backToMatches: { zh: "返回 Campaign Matches", en: "Back to Campaign Matches" },
  marketplaceTitle: { zh: "全部达人池", en: "All creators" },
  marketplaceDesc: { zh: "跨 Campaign 搜索和探索完整达人数据库。", en: "Search and explore the full creator database across campaigns." },
  campaign: { zh: "选择 Campaign", en: "Select campaign" },
  search: { zh: "搜索达人名称、账号或平台…", en: "Search creator name, handle, or platform…" },
  filters: { zh: "筛选条件", en: "Filters" },
  region: { zh: "地区", en: "Region" },
  platform: { zh: "平台", en: "Platform" },
  followers: { zh: "粉丝量", en: "Followers" },
  all: { zh: "全部", en: "All" },
  results: { zh: "位达人符合当前条件", en: "creators match these filters" },
  fit: { zh: "匹配度", en: "Fit score" },
  engagement: { zh: "互动率", en: "Engagement" },
  avgQuote: { zh: "平均报价", en: "Avg. quote" },
  pastCollabs: { zh: "历史合作", en: "Past collabs" },
  addShortlist: { zh: "加入候选", en: "Add to shortlist" },
  shortlisted: { zh: "已加入候选", en: "Shortlisted" },
  aiMatch: { zh: "AI 匹配理由", en: "AI match reason" },
} as const;

const goalLabels: Record<CampaignGoal, { zh: string; en: string }> = {
  brand_awareness: { zh: "品牌认知", en: "Brand awareness" },
  content_production: { zh: "内容生产", en: "Content production" },
  conversion_sales: { zh: "转化 / 销售", en: "Conversion / sales" },
  engagement: { zh: "互动增长", en: "Engagement" },
};

type CreatorTab = "matching" | "marketplace";

export default function CreatorsPage() {
  return <Suspense fallback={null}><CreatorsContent /></Suspense>;
}

function CreatorsContent() {
  const l = useLoc();
  const searchParams = useSearchParams();
  const campaigns = useUIStore((state) => state.campaigns);
  const activeTab: CreatorTab = searchParams.get("tab") === "marketplace" ? "marketplace" : "matching";
  const focusedCampaignId = searchParams.get("campaign");
  const [campaignId, setCampaignId] = useState("");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const selectedCampaign = campaigns.find((campaign) => campaign.id === (campaignId || focusedCampaignId)) ?? campaigns[0];
  const showCampaignOverview = activeTab === "matching" && !focusedCampaignId;

  const filteredCreators = useMemo(() => creators.filter((creator) => {
    const matchesQuery = !query || `${creator.name} ${creator.handle} ${creator.platform}`.toLowerCase().includes(query.toLowerCase());
    const matchesPlatform = platform === "all" || creator.platform === platform;
    return matchesQuery && matchesPlatform;
  }), [platform, query]);
  const matchingCreators = useMemo(() => {
    if (!selectedCampaign) return creators;
    const offset = campaigns.findIndex((campaign) => campaign.id === selectedCampaign.id);
    return [...creators]
      .sort((a, b) => b.fitScore - a.fitScore)
      .map((creator, index, list) => list[(index + Math.max(offset, 0)) % list.length]);
  }, [campaigns, selectedCampaign]);
  const displayedCreators = activeTab === "matching" ? matchingCreators : filteredCreators;

  return (
    <div className="min-h-full bg-page px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-brand"><Sparkles className="h-3.5 w-3.5" />{l(L.eyebrow)}</div>
            <h1 className="mt-2 text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1>
            <p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p>
          </div>
        </div>

        <div className="mt-6 flex h-12 items-end border-b border-border">
          {([
            { id: "matching", label: l(L.matchingTab) },
            { id: "marketplace", label: l(L.marketplaceTab) },
          ] as { id: CreatorTab; label: string }[]).map((tab) => (
            <Link key={tab.id} href={tab.id === "matching" ? "/creators" : "/creators?tab=marketplace"} className={cn("relative flex h-12 items-center px-5 text-[12.5px] font-semibold transition-colors", activeTab === tab.id ? "text-brand" : "text-slate hover:text-ink")}>
              {tab.label}
              <span className={cn("absolute inset-x-3 bottom-0 h-[2px] rounded-full", activeTab === tab.id ? "bg-brand" : "bg-transparent")} />
            </Link>
          ))}
        </div>

        {showCampaignOverview ? (
          <CampaignMatchesOverview campaigns={campaigns} />
        ) : <>
        {activeTab === "matching" && <Link href="/creators" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand hover:text-brand-hover"><ArrowLeft className="h-3.5 w-3.5" />{l(L.backToMatches)}</Link>}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="text-[18px] font-semibold text-navy">{l(activeTab === "matching" ? L.matchingTitle : L.marketplaceTitle)}</h2><p className="mt-1 text-[11px] text-muted">{l(activeTab === "matching" ? L.matchingDesc : L.marketplaceDesc)}</p></div>
          {activeTab === "matching" && selectedCampaign && (
            <label className="min-w-[320px]">
              <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted">{l(L.campaign)}</span>
              <div className="relative"><select value={selectedCampaign.id} onChange={(event) => setCampaignId(event.target.value)} className="h-10 w-full appearance-none rounded-[9px] border border-border bg-surface px-3 pr-9 text-[12px] font-medium text-ink outline-none focus:border-brand/40">{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{l(campaign.name)} · {l(campaign.brand)}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /></div>
            </label>
          )}
        </div>

        {activeTab === "matching" && selectedCampaign && (
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-[11px] border border-brand/15 bg-soft-pink/35 px-4 py-3">
            <span className="text-[11px] font-semibold text-brand">{l(selectedCampaign.name)}</span>
            {[...selectedCampaign.creatorRequirements.regions, ...selectedCampaign.creatorRequirements.languages, ...selectedCampaign.creatorRequirements.categories, ...selectedCampaign.creatorRequirements.contentTypes].map((requirement) => <Badge key={requirement} tone="lavender">{requirement}</Badge>)}
            <span className="ml-auto text-[10px] text-muted">{selectedCampaign.creatorRequirements.minimumFollowers.toLocaleString()}+ {l(L.followers)}</span>
          </div>
        )}

        {activeTab === "marketplace" && <div className="mt-6 rounded-[13px] border border-border bg-surface p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={l(L.search)} className="h-10 w-full rounded-[9px] border border-border bg-page pl-9 pr-3 text-[12px] text-ink outline-none focus:border-brand/40" /></div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-muted"><SlidersHorizontal className="h-4 w-4" />{l(L.filters)}</div>
            <FilterSelect label={l(L.region)} options={[l(L.all), "United States", "Canada", "China"]} />
            <label className="relative"><select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label={l(L.platform)} className="h-10 appearance-none rounded-[9px] border border-border bg-white px-3 pr-8 text-[11px] text-ink outline-none"><option value="all">{l(L.platform)} · {l(L.all)}</option><option>TikTok</option><option>Instagram</option><option>RedNote</option></select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" /></label>
            <FilterSelect label={l(L.followers)} options={[l(L.all), "10K–100K", "100K–500K", "500K+"]} />
            <Button variant="outline"><Filter className="h-4 w-4" />{l(L.filters)}</Button>
          </div>
        </div>}

        <div className="mt-5 flex items-center gap-2 text-[12px] text-slate"><Users className="h-4 w-4 text-brand" /><span className="font-semibold text-ink">{displayedCreators.length}</span>{l(L.results)}</div>

        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayedCreators.map((creator) => {
            const isShortlisted = shortlisted.includes(creator.id);
            return (
              <article key={creator.id} className="rounded-[14px] border border-border bg-surface p-5 shadow-card transition-transform hover:-translate-y-0.5">
                <div className="flex items-start gap-3"><img src={creator.avatar} alt="" className="h-12 w-12 rounded-full object-cover" /><div className="min-w-0 flex-1"><div className="truncate text-[14px] font-semibold text-ink">{creator.name}</div><div className="text-[11px] text-muted">{creator.handle} · {creator.platform}</div></div><div className="rounded-[9px] bg-soft-pink px-2.5 py-1.5 text-center"><div className="text-[15px] font-bold text-brand">{creator.fitScore}</div><div className="text-[8px] font-semibold uppercase text-brand/70">{l(L.fit)}</div></div></div>
                <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-[10px] bg-page py-3 text-center"><Metric label={l(L.followers)} value={`${Math.round(creator.followers / 1000)}K`} /><Metric label={l(L.engagement)} value={`${creator.engagement}%`} /><Metric label={l(L.avgQuote)} value={formatCurrency(creator.averageQuote ?? 0)} /></div>
                <div className="mt-4 rounded-[10px] border border-border/70 p-3"><div className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-brand"><Sparkles className="h-3 w-3" />{l(L.aiMatch)}</div><p className="text-[11px] leading-relaxed text-slate">{l(creator.reason)}</p></div>
                <div className="mt-4 flex items-center justify-between"><span className="text-[10px] text-muted">{l(L.pastCollabs)} · {creator.collaborations ?? 0}</span><Button size="sm" variant={isShortlisted ? "soft" : "primary"} onClick={() => setShortlisted(isShortlisted ? shortlisted.filter((id) => id !== creator.id) : [...shortlisted, creator.id])}><BookmarkPlus className="h-3.5 w-3.5" />{l(isShortlisted ? L.shortlisted : L.addShortlist)}</Button></div>
              </article>
            );
          })}
        </div>
        </>}
      </div>
    </div>
  );
}

function CampaignMatchesOverview({ campaigns }: { campaigns: Campaign[] }) {
  const l = useLoc();
  const statusLabels = {
    draft: { zh: "草稿", en: "Draft" },
    active: { zh: "进行中", en: "Active" },
    paused: { zh: "已暂停", en: "Paused" },
    closed: { zh: "已结束", en: "Closed" },
  } as const;
  const cardColors = ["bg-[#E7EDF8]", "bg-[#E4EFE8]", "bg-[#F1E8DD]", "bg-[#E8E4F3]", "bg-[#F4E4E8]"];

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.025em] text-navy">{l(L.matchesTitle)}</h2>
          <p className="mt-1 text-[12px] text-slate">{l(L.matchesDesc)}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[9px] border border-border bg-surface px-3 py-2 text-[10px] font-semibold text-slate"><Sparkles className="h-3.5 w-3.5 text-brand" /><span className="text-ink">{campaigns.length}</span>{l(L.campaignsReady)}</div>
      </div>
      <div className="mt-7">
        <h3 className="text-[16px] font-semibold text-ink">{l(L.campaignRecommendations)}</h3>
        <p className="mt-1 text-[10.5px] text-muted">{l(L.recommendationsDesc)}</p>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {campaigns.map((campaign, campaignIndex) => {
          const recommended = [...creators]
            .sort((a, b) => b.fitScore - a.fitScore)
            .map((creator, index, list) => list[(index + campaignIndex) % list.length])
            .slice(0, 3);
          const market = campaign.creatorRequirements.regions[0] ?? "Global";
          const statusTone = campaign.status === "active" ? "teal" : campaign.status === "paused" ? "amber" : "gray";
          return (
            <article key={campaign.id} className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
              <div className="flex min-h-[132px] items-center gap-4 p-4">
                <div className={cn("flex h-[86px] w-[96px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[11px]", cardColors[campaignIndex % cardColors.length])}>
                  {campaign.image ? <img src={campaign.image} alt="" className="h-full w-full object-cover" /> : <span className="px-2 text-center text-[15px] font-bold text-navy">{l(campaign.brand)}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2"><span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-muted">{l(campaign.brand)}</span><Badge tone={statusTone}>{l(statusLabels[campaign.status])}</Badge></div>
                  <h4 className="mt-2 truncate text-[16px] font-bold text-navy">{l(campaign.name)}</h4>
                  <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-slate">{campaign.description ? l(campaign.description) : l(campaign.briefSummary)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border border-y border-border bg-page/45">
                <CampaignMeta icon={<Target className="h-3.5 w-3.5" />} label={l(L.goal)} value={l(goalLabels[campaign.goal])} />
                <CampaignMeta icon={<MapPin className="h-3.5 w-3.5" />} label={l(L.market)} value={market} />
                <CampaignMeta icon={<CalendarDays className="h-3.5 w-3.5" />} label={l(L.duration)} value={`${campaign.startAt} – ${campaign.endAt}`} />
              </div>

              <div className="px-4 pb-1 pt-4">
                <div className="flex items-center justify-between border-b border-border pb-2.5"><span className="text-[11px] font-semibold text-ink">{l(L.recommendedCreators)}</span><span className="text-[9px] text-muted">{l(L.topMatches)}</span></div>
                <div className="divide-y divide-border">
                  {recommended.map((creator, creatorIndex) => {
                    const adjustedFit = Math.min(100, creator.fitScore + Math.max(0, 7 - campaignIndex * 2 - creatorIndex));
                    return (
                      <div key={creator.id} className="grid grid-cols-[minmax(0,1fr)_58px_70px] items-center gap-3 py-3">
                        <div className="flex min-w-0 items-center gap-2.5"><img src={creator.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><div className="min-w-0"><div className="truncate text-[11px] font-semibold text-ink">{creator.name}</div><div className="truncate text-[9px] text-muted">{creator.platform} · {Math.round(creator.followers / 1000)}K · {creator.engagement}% engagement</div></div></div>
                        <div className="text-right"><div className="text-[12px] font-bold text-brand">{adjustedFit}%</div><div className="text-[8px] text-muted">{l(L.match)}</div></div>
                        <div className="text-right"><div className="text-[11px] font-semibold text-ink">{usd(creator.averageQuote ?? 0)}</div><div className="text-[8px] text-muted">{l(L.estimatedRate)}</div></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link href={`/creators?campaign=${campaign.id}`} className="flex items-center justify-between border-t border-border px-4 py-3.5 text-[10.5px] font-semibold text-brand transition-colors hover:bg-soft-pink/30"><span>{l(L.exploreMatches)}</span><ArrowRight className="h-4 w-4" /></Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CampaignMeta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-2 px-4 py-3.5"><span className="flex-shrink-0 text-muted">{icon}</span><div className="min-w-0"><div className="text-[8px] text-muted">{label}</div><div className="mt-0.5 truncate text-[9.5px] font-semibold text-ink">{value}</div></div></div>;
}

function usd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return <label className="relative"><select aria-label={label} className="h-10 appearance-none rounded-[9px] border border-border bg-white px-3 pr-8 text-[11px] text-ink outline-none">{options.map((option, index) => <option key={`${label}-${option}`} value={index ? option : "all"}>{label} · {option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" /></label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[12px] font-semibold text-ink">{value}</div><div className="mt-0.5 text-[9px] text-muted">{label}</div></div>;
}
