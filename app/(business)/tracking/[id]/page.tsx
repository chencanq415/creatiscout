"use client";
import {
  ArrowUpRight,
  ChevronLeft,
  Download,
  ExternalLink,
  PlayCircle,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc, useLocale } from "@/lib/i18n/use-i18n";
import { trackings } from "@/lib/mock/trackings";
import { cn, formatRelative } from "@/lib/utils";

const L = {
  running: { zh: "运行中", en: "Running" },
  paused: { zh: "已暂停", en: "Paused" },
  updated: { zh: "更新", en: "Updated" },
  export: { zh: "导出", en: "Export" },
  bulkAddToList: { zh: "批量加入名单", en: "Bulk Add to List" },
  kpiIdentified: { zh: "已识别合作达人", en: "Identified Collab Creators" },
  kpiIdentifiedDelta: { zh: "+12 本周", en: "+12 this week" },
  kpiReach: { zh: "合作达人总曝光", en: "Total Creator Reach" },
  kpiEngagement: { zh: "平均互动率", en: "Avg Engagement Rate" },
  kpiEngagementDelta: { zh: "基准 4.1%", en: "Benchmark 4.1%" },
  kpiActive: { zh: "30 天内活跃", en: "Active in 30 Days" },
  kpiActiveDelta: { zh: "查看缺口 →", en: "View gap →" },
  geoTitle: { zh: "受众地域分布", en: "Audience Geography" },
  geoSub: { zh: "三家叠加 · 取近 90 天发布", en: "All 3 combined · posts from last 90 days" },
  geoCombined: { zh: "三家叠加", en: "Combined" },
  geoCompare: { zh: "分家对比", en: "By Competitor" },
  viewFullMap: { zh: "查看完整地图", en: "View full map" },
  overlapTitle: { zh: "达人重叠度", en: "Creator Overlap" },
  overlapSub: {
    zh: "同时与多家竞品合作的达人占比",
    en: "Share of creators working with multiple competitors",
  },
  overlapTip: {
    zh: "建议优先复用同时与 2+ 家竞品合作过的达人 — 他们更熟悉品类话术，议价空间也更稳定。",
    en: "Prioritize creators who worked with 2+ competitors — they know the category playbook and their rates are more predictable.",
  },
  topOverlapTitle: { zh: "Top 重叠达人 · ≥2 家竞品合作过", en: "Top Overlap Creators · worked with ≥2 competitors" },
  colCreator: { zh: "达人", en: "Creator" },
  colPlatformFans: { zh: "平台 · 粉丝", en: "Platform · Followers" },
  colCategories: { zh: "内容分类", en: "Content Categories" },
  colPerf: { zh: "合作竞品表现", en: "Competitor Performance" },
  colFit: { zh: "适配度", en: "Fit" },
  colActions: { zh: "操作", en: "Actions" },
  avgViews: { zh: "均播", en: "avg" },
  addToList: { zh: "加入名单", en: "Add to List" },
  collabCreatorCount: { zh: "合作达人 184 位", en: "184 collab creators" },
  leading: { zh: "领跑", en: "Leading" },
  miniAvgFollowers: { zh: "平均粉丝", en: "Avg Followers" },
  miniAvgViews: { zh: "均播", en: "Avg Views" },
  miniEngagement: { zh: "互动率", en: "Eng. Rate" },
  topCategories: { zh: "Top 内容分类", en: "Top Content Categories" },
  fitExcellent: { zh: "优秀", en: "Excellent" },
  fitGood: { zh: "良好", en: "Good" },
  fitNormal: { zh: "一般", en: "Fair" },
} as const;

// All three competitors are shown on the brand overview, similar to original 竞品总览.
const COMPETITORS = [
  { id: "candy", name: "candy.ai", color: "#C96442", followers: "212K", views: "98K", er: "5.8%" },
  { id: "ourdream", name: "ourdream.ai", color: "#7A5BB8", followers: "138K", views: "62K", er: "4.9%" },
  { id: "polybuzz", name: "polybuzz.ai", color: "#3F8780", followers: "165K", views: "74K", er: "6.4%" },
];

const countryRows: { flag: string; country: LText; parts: number[] }[] = [
  { flag: "🇺🇸", country: { zh: "美国", en: "United States" }, parts: [38, 28, 34] },
  { flag: "🇧🇷", country: { zh: "巴西", en: "Brazil" }, parts: [42, 18, 40] },
  { flag: "🇬🇧", country: { zh: "英国", en: "United Kingdom" }, parts: [30, 30, 40] },
  { flag: "🇨🇦", country: { zh: "加拿大", en: "Canada" }, parts: [28, 36, 36] },
  { flag: "🇦🇺", country: { zh: "澳大利亚", en: "Australia" }, parts: [22, 30, 48] },
  { flag: "🇩🇪", country: { zh: "德国", en: "Germany" }, parts: [34, 38, 28] },
  { flag: "🇲🇽", country: { zh: "墨西哥", en: "Mexico" }, parts: [40, 20, 40] },
  { flag: "🇫🇷", country: { zh: "法国", en: "France" }, parts: [28, 26, 46] },
];

const overlaps: { label: LText; value: number; pct: number }[] = [
  { label: { zh: "candy ∩ ourdream", en: "candy ∩ ourdream" }, value: 34, pct: 56 },
  { label: { zh: "candy ∩ polybuzz", en: "candy ∩ polybuzz" }, value: 28, pct: 46 },
  { label: { zh: "ourdream ∩ polybuzz", en: "ourdream ∩ polybuzz" }, value: 19, pct: 32 },
  { label: { zh: "三家都合作过", en: "Worked with all three" }, value: 11, pct: 18 },
];

const overlapCreators = [
  {
    id: "ov-1",
    name: "elsa",
    handle: "@elsarca",
    avatar: "https://i.pravatar.cc/64?img=44",
    platform: "Instagram",
    followers: "1.7M",
    categories: ["AI", "Entertainment"],
    perf: [
      { ce: "candy", views: "1.2M", avg: "320K", er: "7.4%" },
      { ce: "polybuzz", views: "880K", avg: "210K", er: "6.1%" },
    ],
    fit: { score: 92, label: "excellent" },
  },
  {
    id: "ov-2",
    name: "Lia (Potter's Version)",
    handle: "@liarosier4",
    avatar: "https://i.pravatar.cc/64?img=20",
    platform: "TikTok",
    followers: "251K",
    categories: ["AI", "Lifestyle"],
    perf: [
      { ce: "candy", views: "520K", avg: "120K", er: "8.2%" },
      { ce: "ourdream", views: "410K", avg: "98K", er: "6.6%" },
      { ce: "polybuzz", views: "330K", avg: "82K", er: "5.4%" },
    ],
    fit: { score: 88, label: "excellent" },
  },
  {
    id: "ov-3",
    name: "Serene",
    handle: "@radiantmaze",
    avatar: "https://i.pravatar.cc/64?img=28",
    platform: "YouTube",
    followers: "22K",
    categories: ["AI", "Tech"],
    perf: [
      { ce: "ourdream", views: "180K", avg: "44K", er: "5.8%" },
      { ce: "polybuzz", views: "140K", avg: "36K", er: "4.9%" },
    ],
    fit: { score: 74, label: "good" },
  },
  {
    id: "ov-4",
    name: "Goodlove",
    handle: "@creator_tracking",
    avatar: "https://i.pravatar.cc/64?img=12",
    platform: "Instagram",
    followers: "13K",
    categories: ["AI", "Wellness"],
    perf: [
      { ce: "candy", views: "60K", avg: "14K", er: "9.1%" },
      { ce: "ourdream", views: "42K", avg: "10K", er: "7.8%" },
    ],
    fit: { score: 65, label: "normal" },
  },
];

export default function TrackingDetailPage() {
  const params = useParams<{ id: string }>();
  const l = useLoc();
  const [locale] = useLocale();
  const target = trackings.find((t) => t.id === params.id);
  if (!target) return notFound();

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      {/* Sticky header */}
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-surface px-6">
        <Link
          href="/tracking"
          className="flex flex-shrink-0 items-center gap-1 rounded-[8px] px-2 py-1.5 text-[12px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
          Tracking
        </Link>
        <div className="h-5 w-px flex-shrink-0 bg-border" />
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] text-[12px] font-bold text-white"
          style={{ background: target.cover }}
        >
          {target.name[0].toUpperCase()}
        </div>
        <h2 className="truncate text-[15px] font-semibold tracking-tight text-ink">
          {target.name}
        </h2>
        <Badge tone={target.status === "running" ? "teal" : "amber"}>
          {target.status === "running" ? l(L.running) : l(L.paused)}
        </Badge>
        <span className="tabular text-[11px] text-muted">
          {l(L.updated)} {formatRelative(target.lastUpdatedAt, locale)}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" /> {l(L.export)}
          </Button>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> {l(L.bulkAddToList)}
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6 lg:p-7">
        <div className="mx-auto max-w-[1280px] space-y-5">
          {/* KPI row */}
          <section className="grid grid-cols-4 gap-3">
            <KpiCard label={l(L.kpiIdentified)} value="422" pct={86} delta={l(L.kpiIdentifiedDelta)} />
            <KpiCard label={l(L.kpiReach)} value="4.8M" delta="+18%" tone="teal" />
            <KpiCard
              label={l(L.kpiEngagement)}
              value="5.7%"
              delta={l(L.kpiEngagementDelta)}
              pct={72}
              tone="lavender"
            />
            <KpiCard label={l(L.kpiActive)} value="318" pct={75} delta={l(L.kpiActiveDelta)} tone="amber" />
          </section>

          {/* Competitor cards row */}
          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {COMPETITORS.map((c) => (
              <CompetitorCard key={c.id} competitor={c} />
            ))}
          </section>

          {/* Geography + overlap row */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[12px] border border-border bg-surface p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-bold text-navy">{l(L.geoTitle)}</h3>
                  <p className="mt-0.5 text-[11px] text-muted">{l(L.geoSub)}</p>
                </div>
                <div className="inline-flex rounded-[6px] border border-border bg-surface-warm p-0.5">
                  <button
                    type="button"
                    className="rounded-[5px] bg-surface px-2.5 py-1 text-[11px] font-medium text-ink shadow-card"
                  >
                    {l(L.geoCombined)}
                  </button>
                  <button
                    type="button"
                    className="rounded-[5px] px-2.5 py-1 text-[11px] font-medium text-slate hover:text-ink"
                  >
                    {l(L.geoCompare)}
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {countryRows.map((row) => (
                  <li key={row.country.en}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="flex items-center gap-1.5 text-ink">
                        <span>{row.flag}</span>
                        <span>{l(row.country)}</span>
                      </span>
                      <span className="tabular text-muted">
                        {row.parts.reduce((a, b) => a + b, 0)}%
                      </span>
                    </div>
                    <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-surface-warm">
                      {row.parts.map((p, i) => (
                        <span
                          key={i}
                          style={{ width: `${p}%`, background: COMPETITORS[i].color }}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-[11px] text-muted">
                {COMPETITORS.map((c) => (
                  <span key={c.id} className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    {c.name}
                  </span>
                ))}
                <button
                  type="button"
                  className="ml-auto inline-flex items-center gap-1 text-brand hover:underline"
                >
                  {l(L.viewFullMap)} <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="rounded-[12px] border border-border bg-surface p-5">
              <div className="mb-4">
                <h3 className="text-[14px] font-bold text-navy">{l(L.overlapTitle)}</h3>
                <p className="mt-0.5 text-[11px] text-muted">{l(L.overlapSub)}</p>
              </div>
              <ul className="space-y-3">
                {overlaps.map((o) => (
                  <li key={o.label.en}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-ink">{l(o.label)}</span>
                      <span className="tabular font-semibold text-ink">
                        {o.value}{" "}
                        <span className="text-muted">
                          {l({ zh: `位 · ${o.pct}%`, en: `creators · ${o.pct}%` })}
                        </span>
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-warm">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${o.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-start gap-2 rounded-[8px] bg-soft-pink/50 px-3 py-2.5 text-[11px] text-brand">
                <Users className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{l(L.overlapTip)}</span>
              </div>
            </div>
          </section>

          {/* Top overlap creators table */}
          <section className="rounded-[12px] border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold text-navy">
                  {l(L.topOverlapTitle)}
                </h3>
                <Badge tone="lavender">
                  {l({ zh: `${overlapCreators.length} 位`, en: `${overlapCreators.length} creators` })}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5" /> CSV
                </Button>
                <Button size="sm">
                  <Plus className="h-3.5 w-3.5" /> {l(L.bulkAddToList)}
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-[13px]">
                <thead className="bg-surface-warm text-[10.5px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-2.5 text-left font-semibold">{l(L.colCreator)}</th>
                    <th className="px-5 py-2.5 text-left font-semibold">{l(L.colPlatformFans)}</th>
                    <th className="px-5 py-2.5 text-left font-semibold">{l(L.colCategories)}</th>
                    <th className="px-5 py-2.5 text-left font-semibold">{l(L.colPerf)}</th>
                    <th className="px-5 py-2.5 text-left font-semibold">{l(L.colFit)}</th>
                    <th className="px-5 py-2.5 text-right font-semibold">{l(L.colActions)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF0F5]">
                  {overlapCreators.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-warm/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={c.avatar} alt="" className="h-8 w-8 rounded-full" />
                          <div>
                            <div className="font-semibold text-ink">{c.name}</div>
                            <div className="text-[11px] text-muted">{c.handle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-ink">{c.platform}</div>
                        <div className="tabular text-[11px] text-muted">{c.followers}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {c.categories.map((cat) => (
                            <Badge key={cat} tone="gray">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-3 text-[11px]">
                          {c.perf.map((p) => {
                            const meta = COMPETITORS.find((cc) => cc.id === p.ce);
                            return (
                              <div key={p.ce} className="space-y-0.5">
                                <div className="flex items-center gap-1 font-semibold text-ink">
                                  <span
                                    className="inline-block h-1.5 w-1.5 rounded-full"
                                    style={{ background: meta?.color ?? "#999" }}
                                  />
                                  {meta?.name}
                                </div>
                                <div className="tabular text-muted">
                                  {l({
                                    zh: `Views ${p.views} · 均播 ${p.avg} · ER ${p.er}`,
                                    en: `Views ${p.views} · Avg ${p.avg} · ER ${p.er}`,
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <FitBadge score={c.fit.score} level={c.fit.label as any} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button size="sm" variant="outline">
                          <Plus className="h-3.5 w-3.5" /> {l(L.addToList)}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  pct,
  tone = "pink",
}: {
  label: string;
  value: string;
  delta?: string;
  pct?: number;
  tone?: "pink" | "teal" | "lavender" | "amber";
}) {
  const map = {
    pink: "bg-brand",
    teal: "bg-teal",
    lavender: "bg-lavender",
    amber: "bg-amber",
  } as const;
  return (
    <div className="rounded-[12px] border border-border bg-surface p-4">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="tabular mt-1 text-[24px] font-bold text-navy">{value}</div>
      {pct !== undefined ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-warm">
          <div className={cn("h-full rounded-full", map[tone])} style={{ width: `${pct}%` }} />
        </div>
      ) : null}
      {delta && <div className="mt-1.5 text-[11px] text-slate">{delta}</div>}
    </div>
  );
}

function CompetitorCard({
  competitor,
}: {
  competitor: { id: string; name: string; color: string; followers: string; views: string; er: string };
}) {
  const l = useLoc();
  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-surface">
      <div
        className="flex items-center justify-between px-4 py-3 text-white"
        style={{ background: competitor.color }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/20 text-[14px] font-bold">
            {competitor.name[0].toUpperCase()}
          </div>
          <div>
            <div className="text-[14px] font-bold">{competitor.name}</div>
            <div className="text-[11px] text-white/80">{l(L.collabCreatorCount)}</div>
          </div>
        </div>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10.5px] font-semibold">
          {l(L.leading)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        <Mini label={l(L.miniAvgFollowers)} value={competitor.followers} />
        <Mini label={l(L.miniAvgViews)} value={competitor.views} />
        <Mini label={l(L.miniEngagement)} value={competitor.er} />
      </div>
      <div className="space-y-2 px-4 pb-3">
        <div className="text-[11px] text-muted">{l(L.topCategories)}</div>
        {[
          { key: "companion", label: { zh: "AI 陪伴", en: "AI Companion" }, pct: 64 },
          { key: "entertainment", label: { zh: "Entertainment", en: "Entertainment" }, pct: 48 },
          { key: "lifestyle", label: { zh: "Lifestyle", en: "Lifestyle" }, pct: 32 },
        ].map((c) => (
          <div key={c.key}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ink">{l(c.label)}</span>
              <span className="tabular text-muted">{c.pct}%</span>
            </div>
            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-surface-warm">
              <div
                className="h-full rounded-full"
                style={{ width: `${c.pct}%`, background: competitor.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border bg-surface-warm/40 px-4 py-2.5 text-[11px] text-muted">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-3.5 w-3.5" />
          <span>TikTok 56% · Instagram 31% · YouTube 13%</span>
        </div>
        <span>🇺🇸 🇧🇷 🇬🇧</span>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface-warm py-2 text-center">
      <div className="tabular text-[14px] font-bold text-navy">{value}</div>
      <div className="text-[10px] text-muted">{label}</div>
    </div>
  );
}

function FitBadge({ score, level }: { score: number; level: "excellent" | "good" | "normal" }) {
  const l = useLoc();
  const map = {
    excellent: "bg-soft-teal text-teal-text",
    good: "bg-soft-blue text-blue-text",
    normal: "bg-surface-warm text-slate",
  };
  const label =
    level === "excellent" ? l(L.fitExcellent) : level === "good" ? l(L.fitGood) : l(L.fitNormal);
  return (
    <div className="flex items-center gap-2">
      <span className="tabular text-[14px] font-bold text-navy">{score}</span>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
          map[level],
        )}
      >
        {label}
      </span>
    </div>
  );
}
