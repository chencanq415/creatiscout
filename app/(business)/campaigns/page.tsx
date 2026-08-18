"use client";

import { ArrowRight, CalendarRange, FileText, Gift, ImageIcon, Plus, Search, Sparkles, Users, WalletCards } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign, CampaignGoal } from "@/lib/types";
import { cn } from "@/lib/utils";

const L = {
  title: { zh: "Campaigns", en: "Campaigns" },
  subtitle: { zh: "管理 Campaign 信息，并进入每个 Campaign 查看达人合作进度。", en: "Manage campaign information and open each campaign to track creator collaborations." },
  all: { zh: "全部", en: "All" },
  searchPlaceholder: { zh: "搜索 Campaign 或品牌…", en: "Search campaign or brand…" },
  newCampaign: { zh: "新建 Campaign", en: "New Campaign" },
  noMatches: { zh: "没有匹配的 Campaign", en: "No matching campaigns" },
  goal: { zh: "目标", en: "Goal" },
  compensation: { zh: "合作激励", en: "Compensation" },
  duration: { zh: "Campaign 周期", en: "Campaign duration" },
  openCampaign: { zh: "查看 Campaign", en: "Open campaign" },
  flatFee: { zh: "固定费用", en: "Flat fee" },
  commission: { zh: "佣金", en: "Commission" },
  freeProduct: { zh: "免费产品", en: "Free product" },
  giftCard: { zh: "礼品卡", en: "Gift card" },
  emptyEyebrow: { zh: "创建你的第一个 Campaign", en: "CREATE YOUR FIRST CAMPAIGN" },
  emptyTitle: { zh: "先定义完整的 Campaign，再基于 Campaign 条件寻找达人", en: "Define the campaign first, then find creators from its requirements" },
  emptyDescription: { zh: "填写品牌、目标、周期、合作激励和达人要求。Campaign 创建完成后，数字员工会基于这些条件开始搜索和建联。", en: "Set the brand, goal, duration, compensation, and creator requirements. Your digital employee will use them to begin discovery and outreach." },
  createFirst: { zh: "创建第一个 Campaign", en: "Create your first campaign" },
  stepBasic: { zh: "Campaign 信息", en: "Campaign details" },
  stepBasicSub: { zh: "定义品牌、目标、类目与周期", en: "Define brand, goal, category, and duration" },
  stepTerms: { zh: "合作条件", en: "Collaboration terms" },
  stepTermsSub: { zh: "设置费用、佣金、产品或礼品卡", en: "Set fees, commission, products, or gift cards" },
  stepCreator: { zh: "达人要求", en: "Creator requirements" },
  stepCreatorSub: { zh: "确定地区、语言、类目与交付要求", en: "Set region, language, category, and deliverables" },
  previewHint: { zh: "当前是无 Campaign 的预览状态", en: "Previewing the no-campaign state" },
} as const;

const statusLabels: Record<Campaign["status"], { label: LText; tone: "teal" | "blue" | "amber" | "gray" }> = {
  draft: { label: { zh: "草稿", en: "Draft" }, tone: "gray" },
  active: { label: { zh: "进行中", en: "Active" }, tone: "teal" },
  paused: { label: { zh: "已暂停", en: "Paused" }, tone: "amber" },
  closed: { label: { zh: "已关闭", en: "Closed" }, tone: "blue" },
};

const goalLabels: Record<CampaignGoal, LText> = {
  brand_awareness: { zh: "品牌认知", en: "Brand awareness" },
  content_production: { zh: "内容生产", en: "Content production" },
  conversion_sales: { zh: "转化 / 销售", en: "Conversion / sales" },
  engagement: { zh: "互动增长", en: "Engagement" },
};

export default function CampaignsPage() {
  return <Suspense fallback={null}><CampaignsContent /></Suspense>;
}

function CampaignsContent() {
  const campaigns = useUIStore((state) => state.campaigns);
  const router = useRouter();
  const searchParams = useSearchParams();
  const l = useLoc();
  const [filter, setFilter] = useState<"all" | Campaign["status"]>("all");
  const [query, setQuery] = useState("");
  const visibleCampaigns = searchParams.get("empty") === "1" ? [] : campaigns;
  const filtered = visibleCampaigns.filter((campaign) => {
    const matchesStatus = filter === "all" || campaign.status === filter;
    const needle = query.toLowerCase();
    const matchesQuery = !needle || l(campaign.name).toLowerCase().includes(needle) || l(campaign.brand).toLowerCase().includes(needle);
    return matchesStatus && matchesQuery;
  });

  if (visibleCampaigns.length === 0) {
    return <CampaignEmptyState preview={searchParams.get("empty") === "1"} onCreate={() => router.push("/campaigns/new")} />;
  }

  return (
    <div className="space-y-6 p-7 lg:p-8">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.025em] text-navy">{l(L.title)}</h1>
          <p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p>
        </div>
        <Button onClick={() => router.push("/campaigns/new")}><Plus className="h-4 w-4" /> {l(L.newCampaign)}</Button>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <FilterChip label={l(L.all)} count={visibleCampaigns.length} active={filter === "all"} onClick={() => setFilter("all")} />
        {(Object.keys(statusLabels) as Campaign["status"][]).map((status) => (
          <FilterChip key={status} label={l(statusLabels[status].label)} count={visibleCampaigns.filter((campaign) => campaign.status === status).length} active={filter === status} onClick={() => setFilter(status)} />
        ))}
        <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={l(L.searchPlaceholder)} className="w-52 border-0 bg-transparent text-[13px] outline-none placeholder:text-muted" />
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((campaign) => (
            <button key={campaign.id} type="button" onClick={() => router.push(`/campaigns/${campaign.id}`)} className="group overflow-hidden rounded-[14px] border border-border bg-surface text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev">
              <div className="flex gap-4 p-5">
                <CampaignImage campaign={campaign} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">{l(campaign.brand)}</div>
                      <h2 className="mt-1 truncate text-[18px] font-bold text-navy">{l(campaign.name)}</h2>
                    </div>
                    <Badge tone={statusLabels[campaign.status].tone}>{l(statusLabels[campaign.status].label)}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-[17px] text-muted">{l(campaign.description ?? campaign.briefSummary)}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge tone="lavender">{l(goalLabels[campaign.goal])}</Badge>
                    <Badge tone="blue">{campaign.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid border-y border-border bg-surface-warm md:grid-cols-[1.35fr_1fr]">
                <div className="border-border px-5 py-3.5 md:border-r">
                  <div className="mb-2 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted"><WalletCards className="h-3.5 w-3.5" />{l(L.compensation)}</div>
                  <CompensationSummary campaign={campaign} />
                </div>
                <div className="px-5 py-3.5">
                  <div className="mb-2 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted"><CalendarRange className="h-3.5 w-3.5" />{l(L.duration)}</div>
                  <div className="tabular text-[12px] font-medium text-ink">{campaign.startAt} — {campaign.endAt}</div>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2 text-[10.5px] text-muted"><Users className="h-3.5 w-3.5" />{campaign.creatorRequirements.regions.join(" · ") || "—"}</div>
                <span className="flex items-center gap-1 text-[11.5px] font-semibold text-brand">{l(L.openCampaign)} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] border border-dashed border-border py-16 text-center text-[13px] text-muted">{l(L.noMatches)}</div>
      )}
    </div>
  );
}

function CampaignImage({ campaign }: { campaign: Campaign }) {
  if (campaign.image) return <img src={campaign.image} alt="" className="h-[88px] w-[88px] flex-shrink-0 rounded-[12px] object-cover" />;
  return <div className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#fff0f5,#eefaf9)] text-brand"><ImageIcon className="h-6 w-6" /></div>;
}

function CompensationSummary({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const compensation = campaign.compensation;
  const items: string[] = [];
  if (compensation.flatFee) items.push(`${l(L.flatFee)} · ${compensation.flatFee.currency} ${compensation.flatFee.minFee.toLocaleString()}–${compensation.flatFee.maxFee.toLocaleString()}`);
  if (compensation.commission) items.push(`${l(L.commission)} ${compensation.commission.rate}%`);
  if (compensation.freeProducts.length) items.push(`${l(L.freeProduct)} × ${compensation.freeProducts.length}`);
  if (compensation.giftCard) items.push(`${l(L.giftCard)} · ${compensation.giftCard.currency} ${compensation.giftCard.value.toLocaleString()}`);
  return <div className="flex flex-wrap gap-1.5">{items.map((item) => <span key={item} className="rounded-full bg-white px-2 py-1 text-[10.5px] font-medium text-ink shadow-card">{item}</span>)}</div>;
}

function CampaignEmptyState({ onCreate, preview }: { onCreate: () => void; preview: boolean }) {
  const l = useLoc();
  const steps = [
    { icon: FileText, title: L.stepBasic, description: L.stepBasicSub },
    { icon: Gift, title: L.stepTerms, description: L.stepTermsSub },
    { icon: Users, title: L.stepCreator, description: L.stepCreatorSub },
  ];
  return (
    <div className="flex min-h-full items-center justify-center p-7 lg:p-10">
      <div className="w-full max-w-[920px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-elev">
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#fff7fa_0%,#ffffff_52%,#f2fbfa_100%)] px-8 py-10 text-center lg:px-14 lg:py-12">
          <div className="relative">
            {preview && <div className="mb-4 inline-flex rounded-full border border-border bg-white/80 px-3 py-1 text-[10px] font-medium text-muted">{l(L.previewHint)}</div>}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand text-white shadow-cta"><Sparkles className="h-5 w-5" /></div>
            <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">{l(L.emptyEyebrow)}</div>
            <h1 className="mx-auto mt-3 max-w-[720px] text-[28px] font-bold leading-[1.2] tracking-[-0.03em] text-navy lg:text-[34px]">{l(L.emptyTitle)}</h1>
            <p className="mx-auto mt-3 max-w-[680px] text-[13px] leading-6 text-slate">{l(L.emptyDescription)}</p>
            <Button size="lg" className="mt-6" onClick={onCreate}>{l(L.createFirst)} <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="grid border-t border-border md:grid-cols-3">
          {steps.map((step, index) => { const Icon = step.icon; return <div key={step.title.en} className="flex gap-3.5 border-border px-6 py-5 md:border-r md:last:border-r-0"><div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-soft-teal text-teal-text"><Icon className="h-4 w-4" /></div><div><div className="flex items-center gap-2"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">{index + 1}</span><div className="text-[12.5px] font-semibold text-ink">{l(step.title)}</div></div><p className="mt-1.5 text-[10.5px] leading-[17px] text-muted">{l(step.description)}</p></div></div>; })}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all", active ? "bg-soft-pink text-brand-strong" : "text-slate hover:bg-surface-warm hover:text-ink")}>{label} <span className="tabular ml-1 text-muted">{count}</span></button>;
}
