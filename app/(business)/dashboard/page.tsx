"use client";

import { ArrowRight, CheckCircle2, ClipboardCheck, FileCheck2, MessageSquare, Sparkles, WalletCards } from "lucide-react";
import Link from "next/link";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";

const L = {
  title: { zh: "工作台", en: "Dashboard" },
  subtitle: { zh: "聚焦今天需要推进的达人合作与营销活动。", en: "Focus on the creator collaborations and campaigns that need your attention today." },
  period: { zh: "本周", en: "This week" },
  activeCampaigns: { zh: "进行中活动", en: "Active campaigns" },
  awaitingResponse: { zh: "待达人反馈", en: "Awaiting response" },
  draftReview: { zh: "待审核稿件", en: "Drafts to review" },
  payment: { zh: "待付款", en: "Payments due" },
  attention: { zh: "需要处理", en: "Needs attention" },
  attentionHint: { zh: "按优先级查看需要你确认或推进的合作。", en: "Review the creator relationships that need a decision or next step." },
  aiSuggestions: { zh: "AI 建议", en: "AI recommendations" },
  campaignProgress: { zh: "活动进展", en: "Campaign progress" },
  upcomingMilestones: { zh: "近期节点", en: "Upcoming milestones" },
  viewAll: { zh: "查看全部", en: "View all" },
  review: { zh: "去处理", en: "Review" },
  actionConfirm: { zh: "确认合作", en: "Confirm" },
  actionReview: { zh: "审核稿件", en: "Review draft" },
  actionPay: { zh: "添加付款记录", en: "Add payment" },
  awaiting: { zh: "待反馈", en: "Awaiting response" },
  matching: { zh: "匹配", en: "Matching" },
  outreach: { zh: "建联", en: "Outreach" },
  offer: { zh: "确认", en: "Offer" },
  draft: { zh: "稿件", en: "Draft" },
  published: { zh: "发布", en: "Published" },
} as const;

const actionItems = [
  { icon: ClipboardCheck, title: { zh: "Yoga Anna 已确认合作意向", en: "Yoga Anna is ready to confirm the collaboration" }, meta: { zh: "618 美妆联名 · 达人建联", en: "618 Beauty Collab · Outreach" }, action: L.actionConfirm, href: "/collaborations" },
  { icon: FileCheck2, title: { zh: "Nina Chen 已提交首版稿件", en: "Nina Chen submitted the first draft" }, meta: { zh: "520 礼盒种草 · 稿件待审核", en: "520 Gift Box Seeding · Draft under review" }, action: L.actionReview, href: "/collaborations" },
  { icon: WalletCards, title: { zh: "Ariana Lin 的合作款项待结算", en: "Ariana Lin has a payment record to add" }, meta: { zh: "618 美妆联名 · ¥6,800", en: "618 Beauty Collab · ¥6,800" }, action: L.actionPay, href: "/collaborations" },
] as const;

const aiSuggestions = [
  { title: { zh: "3 位达人意向明确", en: "3 creators show strong interest" }, copy: { zh: "建议确认合作细节并发送 Offer。", en: "Confirm collaboration details and send the offer." }, href: "/collaborations" },
  { title: { zh: "活动匹配数量不足", en: "One campaign needs more matches" }, copy: { zh: "夏日瑜伽服上新还差 6 位候选达人。", en: "Summer Yoga Wear Launch needs 6 more shortlisted creators." }, href: "/creators" },
] as const;

export default function DashboardPage() {
  const l = useLoc();
  const campaigns = useUIStore((state) => state.campaigns);
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active");
  const shownCampaigns = (activeCampaigns.length ? activeCampaigns : campaigns).slice(0, 3);
  const stats = [
    [l(L.activeCampaigns), String(activeCampaigns.length || 3), "teal"],
    [l(L.awaitingResponse), "12", "blue"],
    [l(L.draftReview), "3", "pink"],
    [l(L.payment), "2", "amber"],
  ] as const;

  return (
    <main className="min-h-full bg-surface px-6 py-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1380px]">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="text-[30px] font-bold tracking-[-0.035em] text-navy">{l(L.title)}</h1><p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p></div>
          <button type="button" className="h-9 rounded-control border border-border bg-surface px-3 text-[11px] font-medium text-slate hover:bg-surface-warm">{l(L.period)}</button>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, tone]) => <div key={label} className="rounded-[12px] border border-border bg-surface px-4 py-4"><div className="flex items-center justify-between"><span className="text-[11px] text-slate">{label}</span><span className={cn("h-2 w-2 rounded-full", tone === "teal" ? "bg-teal" : tone === "blue" ? "bg-blue" : tone === "pink" ? "bg-brand" : "bg-amber")} /></div><div className="mt-3 text-[27px] font-bold tracking-[-0.03em] text-navy tabular">{value}</div></div>)}
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
          <section className="rounded-[14px] border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4"><div><h2 className="text-[15px] font-semibold text-ink">{l(L.attention)}</h2><p className="mt-1 text-[10.5px] text-muted">{l(L.attentionHint)}</p></div><Link href="/collaborations" className="text-[10.5px] font-semibold text-brand hover:text-brand-hover">{l(L.viewAll)}</Link></div>
            <div className="mt-4 divide-y divide-border">
              {actionItems.map((item) => { const Icon = item.icon; return <div key={l(item.title)} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-surface-warm text-slate"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-[11.5px] font-semibold text-ink">{l(item.title)}</p><p className="mt-0.5 truncate text-[10px] text-muted">{l(item.meta)}</p></div><Link href={item.href} className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-semibold text-brand hover:text-brand-hover">{l(item.action)}<ArrowRight className="h-3.5 w-3.5" /></Link></div>; })}
            </div>
          </section>

          <section className="rounded-[14px] border border-border bg-surface p-5">
            <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-soft-pink text-brand"><Sparkles className="h-3.5 w-3.5" /></span><h2 className="text-[15px] font-semibold text-ink">{l(L.aiSuggestions)}</h2></div>
            <div className="mt-4 space-y-3">{aiSuggestions.map((suggestion) => <Link key={l(suggestion.title)} href={suggestion.href} className="block rounded-[10px] bg-surface-warm px-3.5 py-3 transition-colors hover:bg-soft-pink/50"><p className="text-[11px] font-semibold text-ink">{l(suggestion.title)}</p><p className="mt-1 text-[10px] leading-relaxed text-slate">{l(suggestion.copy)}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand">{l(L.review)}<ArrowRight className="h-3 w-3" /></span></Link>)}</div>
          </section>
        </div>

        <section className="mt-6 rounded-[14px] border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-4"><h2 className="text-[15px] font-semibold text-ink">{l(L.campaignProgress)}</h2><Link href="/campaigns" className="text-[10.5px] font-semibold text-brand hover:text-brand-hover">{l(L.viewAll)}</Link></div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">{shownCampaigns.map((campaign, index) => <Link key={campaign.id} href={`/campaigns/${campaign.id}`} className="rounded-[10px] bg-surface-warm p-3.5 transition-colors hover:bg-soft-pink/45"><p className="truncate text-[11.5px] font-semibold text-ink">{l(campaign.name)}</p><p className="mt-1 truncate text-[10px] text-muted">{l(campaign.brand)}</p><div className="mt-4 flex items-center gap-1">{[L.matching, L.outreach, L.offer, L.draft, L.published].map((step, stepIndex) => <span key={l(step)} className={cn("h-1.5 flex-1 rounded-full", stepIndex <= index + 1 ? "bg-brand" : "bg-border")} title={l(step)} />)}</div><div className="mt-2 flex justify-between text-[9.5px] text-muted"><span>{l(L.matching)} → {l(L.published)}</span><span>{[42, 58, 76][index] ?? 64}%</span></div></Link>)}</div>
        </section>

        <section className="mt-6 rounded-[14px] border border-border bg-surface p-5">
          <div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold text-ink">{l(L.upcomingMilestones)}</h2><Link href="/collaborations" className="text-[10.5px] font-semibold text-brand hover:text-brand-hover">{l(L.viewAll)}</Link></div>
          <div className="mt-4 grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">{[
            { date: { zh: "今天", en: "Today" }, text: { zh: "Yoga Anna · 等待确认合作", en: "Yoga Anna · Collaboration confirmation due" }, meta: { zh: "618 美妆联名", en: "618 Beauty Collab" } },
            { date: { zh: "8月29日", en: "Aug 29" }, text: { zh: "Nina Chen · 预计提交首版稿件", en: "Nina Chen · First draft expected" }, meta: { zh: "520 礼盒种草", en: "520 Gift Box Seeding" } },
            { date: { zh: "9月2日", en: "Sep 02" }, text: { zh: "Ariana Lin · 预计发布作品", en: "Ariana Lin · Content expected to go live" }, meta: { zh: "618 美妆联名", en: "618 Beauty Collab" } },
          ].map((event, index) => <div key={l(event.text)} className={cn("py-3 text-[10.5px] md:px-4 md:first:pl-0 md:last:pr-0", index === 0 && "pt-0 md:pt-3", index === 2 && "pb-0 md:pb-3")}><div className="flex items-center gap-2 text-muted"><span className="h-1.5 w-1.5 rounded-full bg-brand" />{l(event.date)}</div><p className="mt-2 font-medium leading-relaxed text-ink">{l(event.text)}</p><p className="mt-1 text-muted">{l(event.meta)}</p></div>)}</div>
        </section>
      </div>
    </main>
  );
}
