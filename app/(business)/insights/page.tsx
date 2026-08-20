"use client";

import { Badge } from "@/components/ui/badge";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const L = {
  title: { zh: "数据洞察", en: "Insight" },
  subtitle: {
    zh: "聚合所有 Campaign 的执行与效果数据，用复盘结果优化下一轮 Campaign。",
    en: "Review execution and performance across campaigns, then turn learnings into better campaigns.",
  },
  totalCampaigns: { zh: "Campaign 总数", en: "Total campaigns" },
  activeCampaigns: { zh: "进行中", en: "Active" },
  creators: { zh: "合作达人", en: "Collaborating creators" },
  deliveries: { zh: "已交付内容", en: "Delivered content" },
  budgetUsage: { zh: "预算使用率", en: "Budget utilization" },
  spentOf: { zh: "已花费 {spent} / 总预算 {budget}", en: "{spent} spent of {budget}" },
  platformPerformance: { zh: "平台表现", en: "Platform performance" },
  platformDescription: {
    zh: "按平台汇总 Campaign、合作达人和内容交付情况。",
    en: "Campaign, creator, and delivery activity grouped by platform.",
  },
  campaigns: { zh: "Campaign", en: "Campaigns" },
  delivered: { zh: "交付", en: "Delivered" },
  spend: { zh: "花费", en: "Spend" },
  reports: { zh: "Campaign 报告", en: "Campaign reports" },
  reportsDescription: {
    zh: "横向比较每个 Campaign 的执行进度，并进入详情查看完整报告。",
    en: "Compare execution across campaigns and open any campaign for its full report.",
  },
  brand: { zh: "品牌", en: "Brand" },
  status: { zh: "状态", en: "Status" },
  platform: { zh: "平台", en: "Platform" },
  progress: { zh: "预算进度", en: "Budget progress" },
  openReport: { zh: "查看报告", en: "Open report" },
  empty: {
    zh: "创建 Campaign 后，效果数据会聚合到这里。",
    en: "Campaign insights will appear here once you create a campaign.",
  },
} as const;

const statusLabels: Record<Campaign["status"], LText> = {
  draft: { zh: "草稿", en: "Draft" },
  active: { zh: "进行中", en: "Active" },
  paused: { zh: "已暂停", en: "Paused" },
  closed: { zh: "已完成", en: "Completed" },
};

const statusTones: Record<Campaign["status"], "gray" | "teal" | "amber" | "blue"> = {
  draft: "gray",
  active: "teal",
  paused: "amber",
  closed: "blue",
};

export default function InsightsPage() {
  const l = useLoc();
  const campaigns = useUIStore((state) => state.campaigns);

  const summary = useMemo(() => {
    const budget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
    const spent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
    return {
      budget,
      spent,
      active: campaigns.filter((campaign) => campaign.status === "active").length,
      creators: campaigns.reduce((sum, campaign) => sum + campaign.collaborating, 0),
      delivered: campaigns.reduce((sum, campaign) => sum + campaign.delivered, 0),
      utilization: budget > 0 ? Math.round((spent / budget) * 100) : 0,
    };
  }, [campaigns]);

  const platforms = useMemo(() => {
    const totals = new Map<
      string,
      { campaigns: number; creators: number; delivered: number; spend: number }
    >();
    for (const campaign of campaigns) {
      const campaignPlatforms = campaign.platforms.length ? campaign.platforms : ["Other"];
      for (const platform of campaignPlatforms) {
        const current = totals.get(platform) ?? {
          campaigns: 0,
          creators: 0,
          delivered: 0,
          spend: 0,
        };
        current.campaigns += 1;
        current.creators += Math.round(campaign.collaborating / campaignPlatforms.length);
        current.delivered += Math.round(campaign.delivered / campaignPlatforms.length);
        current.spend += campaign.spent / campaignPlatforms.length;
        totals.set(platform, current);
      }
    }
    return Array.from(totals, ([name, values]) => ({ name, ...values })).sort(
      (a, b) => b.delivered - a.delivered,
    );
  }, [campaigns]);

  const maxDelivered = Math.max(1, ...platforms.map((platform) => platform.delivered));

  return (
    <div className="min-h-full bg-page px-6 py-7 lg:px-8">
      <div className="w-full">
        <h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1>
        <p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label={l(L.totalCampaigns)} value={String(campaigns.length)} />
          <Metric label={l(L.activeCampaigns)} value={String(summary.active)} />
          <Metric label={l(L.creators)} value={String(summary.creators)} />
          <Metric label={l(L.deliveries)} value={String(summary.delivered)} />
          <Metric label={l(L.budgetUsage)} value={`${summary.utilization}%`} accent />
        </div>

        <div className="mt-3 rounded-[14px] border border-border bg-surface px-5 py-4 shadow-card">
          <div className="flex items-center justify-between gap-4 text-[11px] text-muted">
            <span>{l(L.budgetUsage)}</span>
            <span>
              {l(L.spentOf)
                .replace("{spent}", formatCurrency(summary.spent))
                .replace("{budget}", formatCurrency(summary.budget))}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-page">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.min(summary.utilization, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[14px] border border-border bg-surface p-5 shadow-card">
            <h2 className="text-[15px] font-semibold text-navy">{l(L.platformPerformance)}</h2>
            <p className="mt-1 text-[11px] text-muted">{l(L.platformDescription)}</p>
            <div className="mt-5 space-y-5">
              {platforms.map((platform) => (
                <div key={platform.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[12px] font-semibold text-ink">{platform.name}</div>
                      <div className="mt-0.5 text-[10px] text-muted">
                        {platform.campaigns} {l(L.campaigns)} · {platform.creators} {l(L.creators)}{" "}
                        · {platform.delivered} {l(L.delivered)}
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold text-slate">
                      {formatCurrency(platform.spend)}
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-page">
                    <div
                      className="h-full rounded-full bg-teal"
                      style={{
                        width: `${Math.max(8, (platform.delivered / maxDelivered) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
            <div className="px-5 py-5">
              <h2 className="text-[15px] font-semibold text-navy">{l(L.reports)}</h2>
              <p className="mt-1 text-[11px] text-muted">{l(L.reportsDescription)}</p>
            </div>
            {campaigns.length === 0 ? (
              <div className="border-t border-border px-5 py-12 text-center text-[12px] text-muted">
                {l(L.empty)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="border-y border-border bg-surface-warm/70 text-[10px] font-semibold uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-3">Campaign</th>
                      <th className="px-4 py-3">{l(L.status)}</th>
                      <th className="px-4 py-3">{l(L.platform)}</th>
                      <th className="px-4 py-3">{l(L.progress)}</th>
                      <th className="px-5 py-3 text-right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {campaigns.map((campaign) => {
                      const utilization =
                        campaign.budget > 0
                          ? Math.round((campaign.spent / campaign.budget) * 100)
                          : 0;
                      return (
                        <tr key={campaign.id} className="transition-colors hover:bg-page/70">
                          <td className="px-5 py-4">
                            <div className="text-[12px] font-semibold text-ink">
                              {l(campaign.name)}
                            </div>
                            <div className="mt-0.5 text-[10px] text-muted">
                              {l(L.brand)} · {l(campaign.brand)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge tone={statusTones[campaign.status]}>
                              {l(statusLabels[campaign.status])}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-[10px] text-slate">
                            {campaign.platforms.join(" · ") || "—"}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-page">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    utilization > 100 ? "bg-amber" : "bg-brand",
                                  )}
                                  style={{ width: `${Math.min(utilization, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-slate">
                                {utilization}%
                              </span>
                            </div>
                            <div className="mt-1 text-[9px] text-muted">
                              {campaign.delivered} {l(L.delivered)} ·{" "}
                              {formatCurrency(campaign.spent)}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-hover"
                            >
                              {l(L.openReport)}
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface px-5 py-4 shadow-card">
      <div className="text-[10px] font-medium text-muted">{label}</div>
      <div
        className={cn(
          "mt-2 text-[24px] font-bold tracking-tight",
          accent ? "text-brand" : "text-navy",
        )}
      >
        {value}
      </div>
    </div>
  );
}
