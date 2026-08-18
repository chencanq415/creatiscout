"use client";

import { useLoc } from "@/lib/i18n/use-i18n";
import type { Campaign } from "@/lib/types";
import { ArrowUpRight, BarChart3, Eye, Heart, MousePointerClick, Sparkles, TrendingUp, Video } from "lucide-react";

const L = {
  title: { zh: "Campaign 效果洞察", en: "Campaign Performance Insight" },
  subtitle: { zh: "汇总内容表现、受众反馈与下一轮优化建议", en: "Content performance, audience response, and recommendations for the next iteration" },
  totalReach: { zh: "总触达", en: "Total reach" },
  publishedContent: { zh: "已发布内容", en: "Published content" },
  avgEngagement: { zh: "平均互动率", en: "Avg. engagement" },
  attributedSales: { zh: "归因销售额", en: "Attributed sales" },
  vsBenchmark: { zh: "较行业基准", en: "vs. benchmark" },
  contentPerformance: { zh: "内容表现", en: "Content performance" },
  funnel: { zh: "Campaign 转化漏斗", en: "Campaign funnel" },
  impressions: { zh: "曝光", en: "Impressions" },
  engagements: { zh: "互动", en: "Engagements" },
  clicks: { zh: "点击", en: "Clicks" },
  conversions: { zh: "转化", en: "Conversions" },
  recommendations: { zh: "下一轮优化建议", en: "Recommendations for the next campaign" },
  recommendationOne: { zh: "增加中腰部达人占比，他们贡献了最高的互动效率。", en: "Increase mid-tier creator allocation; they delivered the strongest engagement efficiency." },
  recommendationTwo: { zh: "将短视频前 3 秒的产品利益点前置，预计可提升完播率。", en: "Move the key product benefit into the first three seconds to improve completion rate." },
  recommendationThree: { zh: "把预算向高转化内容主题倾斜，并复用表现最佳的达人组合。", en: "Shift budget toward high-converting themes and reuse the strongest creator mix." },
  topContent: { zh: "高表现内容", en: "Top-performing content" },
} as const;

export function CampaignPerformanceInsight({ campaign }: { campaign: Campaign }) {
  const l = useLoc();
  const seed = campaign.id.length + campaign.delivered;
  const metrics = [
    { label: l(L.totalReach), value: `${(1.8 + seed / 20).toFixed(1)}M`, change: "+18.4%", icon: Eye },
    { label: l(L.publishedContent), value: String(Math.max(campaign.delivered, 12)), change: "+6", icon: Video },
    { label: l(L.avgEngagement), value: `${(4.2 + (seed % 8) / 10).toFixed(1)}%`, change: "+1.2%", icon: Heart },
    { label: l(L.attributedSales), value: `$${Math.max(42, campaign.delivered * 11)}K`, change: "+23.7%", icon: TrendingUp },
  ];
  const funnel = [
    { label: l(L.impressions), value: "2.46M", width: 100 },
    { label: l(L.engagements), value: "118K", width: 72 },
    { label: l(L.clicks), value: "31.6K", width: 47 },
    { label: l(L.conversions), value: "2,184", width: 25 },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-5">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand"><BarChart3 className="h-4 w-4" />{l(L.title)}</div>
        <p className="mt-1 text-[12px] text-muted">{l(L.subtitle)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-[13px] border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-muted">{metric.label}</span><span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-soft-pink text-brand"><Icon className="h-4 w-4" /></span></div>
              <div className="mt-3 text-[27px] font-bold tracking-tight text-navy">{metric.value}</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-teal-text"><ArrowUpRight className="h-3 w-3" />{metric.change}<span className="font-normal text-muted">{l(L.vsBenchmark)}</span></div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[13px] border border-border bg-surface p-5 shadow-card">
          <div className="text-[13px] font-semibold text-ink">{l(L.contentPerformance)}</div>
          <div className="mt-5 flex h-[210px] items-end gap-3 border-b border-border px-2">
            {[42, 68, 54, 82, 63, 94, 76, 88, 69, 100, 84, 92].map((height, index) => (
              <div key={`${height}-${index}`} className="group flex flex-1 items-end justify-center">
                <div className="w-full max-w-8 rounded-t-[6px] bg-gradient-to-t from-brand to-[#FF9ABB] transition-opacity group-hover:opacity-80" style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between px-2 text-[10px] text-muted"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div>
        </section>

        <section className="rounded-[13px] border border-border bg-surface p-5 shadow-card">
          <div className="text-[13px] font-semibold text-ink">{l(L.funnel)}</div>
          <div className="mt-5 space-y-4">
            {funnel.map((item, index) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="text-muted">{item.label}</span><span className="font-semibold text-ink">{item.value}</span></div>
                <div className="h-7 overflow-hidden rounded-[7px] bg-surface-warm"><div className="flex h-full items-center rounded-[7px] bg-gradient-to-r from-soft-pink to-[#FFD7E4] px-2 text-[9px] font-semibold text-brand" style={{ width: `${item.width}%` }}>{index === 0 ? "100%" : `${item.width}%`}</div></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[13px] border border-border bg-surface p-5 shadow-card">
          <div className="text-[13px] font-semibold text-ink">{l(L.topContent)}</div>
          <div className="mt-4 rounded-[11px] bg-gradient-to-br from-[#FFF1F5] to-[#F2EEFF] p-5">
            <div className="flex h-24 items-center justify-center rounded-[9px] border border-white/80 bg-white/50 text-brand"><MousePointerClick className="h-7 w-7" /></div>
            <div className="mt-3 text-[12px] font-semibold text-ink">Creator tutorial · Product benefit demo</div>
            <div className="mt-1 text-[10px] text-muted">486K views · 6.8% engagement · 892 conversions</div>
          </div>
        </section>

        <section className="rounded-[13px] border border-brand/15 bg-gradient-to-br from-[#FFF8FA] to-surface p-5 shadow-card">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-ink"><Sparkles className="h-4 w-4 text-brand" />{l(L.recommendations)}</div>
          <div className="mt-4 space-y-3">
            {[L.recommendationOne, L.recommendationTwo, L.recommendationThree].map((recommendation, index) => (
              <div key={index} className="flex gap-3 rounded-[10px] border border-border/70 bg-white/80 p-3.5"><span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">{index + 1}</span><p className="text-[11px] leading-relaxed text-slate">{l(recommendation)}</p></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
