"use client";

import { Button } from "@/components/ui/button";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Eye,
  Flame,
  Images,
  Lightbulb,
  PackageSearch,
  PenLine,
  Play,
  Radar,
  Sparkles,
  Tags,
  Telescope,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const L = {
  title: { zh: "Creative", en: "Creative" },
  subtitle: {
    zh: "从营销节点与趋势信号中发现机会，用 AI 生成策划、文案和内容，并沉淀可复用的品牌创意。",
    en: "Turn marketing moments and trend signals into plans, copy, content, and reusable brand ideas with AI.",
  },
  calendar: { zh: "营销日历", en: "Marketing Calendar" },
  calendarDesc: {
    zh: "查看关键营销节点，提前安排策划、达人建联与内容发布。",
    en: "Plan strategy, creator outreach, and publishing around key marketing moments.",
  },
  generateCampaign: { zh: "生成 Campaign", en: "Generate campaign" },
  previousMonth: { zh: "上一个月", en: "Previous month" },
  nextMonth: { zh: "下一个月", en: "Next month" },
  trendRadar: { zh: "趋势雷达", en: "Trend Radar" },
  trendRadarDesc: {
    zh: "聚合内容、话题与商品信号，快速判断下一轮值得测试的创意方向。",
    en: "Combine content, topic, and product signals to find the next creative direction worth testing.",
  },
  sevenDays: { zh: "近 7 日", en: "Last 7 days" },
  thirtyDays: { zh: "近 30 日", en: "Last 30 days" },
  contentTrend: { zh: "内容趋势", en: "Content trends" },
  topicTrend: { zh: "话题趋势", en: "Topic trends" },
  productTrend: { zh: "商品趋势", en: "Product trends" },
  creativeStudio: { zh: "AI 创意工坊", en: "AI Creative Studio" },
  creativeStudioDesc: {
    zh: "把趋势洞察转化为可执行的 Campaign 策划、品牌文案和达人内容。",
    en: "Turn trend insights into campaign plans, brand copy, and creator-ready content.",
  },
  startCreating: { zh: "开始创作", en: "Start creating" },
  openStudio: { zh: "打开工坊", en: "Open studio" },
  inspiration: { zh: "灵感与沉淀", en: "Inspiration & Learnings" },
  inspirationDesc: {
    zh: "收藏外部灵感，并把历史高表现内容沉淀为团队可复用的方法。",
    en: "Save outside inspiration and turn past winners into reusable team knowledge.",
  },
  viewAll: { zh: "查看全部", en: "View all" },
} as const;

const calendarMonths = [
  { id: "aug", year: 2026, month: 7, label: { zh: "2026 年 8 月", en: "August 2026" } },
  { id: "sep", year: 2026, month: 8, label: { zh: "2026 年 9 月", en: "September 2026" } },
  { id: "oct", year: 2026, month: 9, label: { zh: "2026 年 10 月", en: "October 2026" } },
] as const;

const calendarEvents = {
  aug: [
    {
      start: 17,
      end: 31,
      title: { zh: "返校季内容高峰", en: "Back-to-school peak" },
      tone: "pink",
    },
    {
      start: 20,
      end: 30,
      title: { zh: "夏季清仓促销", en: "Summer clearance" },
      tone: "blue",
    },
    {
      start: 24,
      end: 31,
      title: { zh: "秋季新品预热窗口", en: "Autumn launch window" },
      tone: "green",
    },
  ],
  sep: [
    {
      start: 7,
      end: 7,
      title: { zh: "Labor Day 营销节点", en: "Labor Day moment" },
      tone: "pink",
    },
    {
      start: 10,
      end: 30,
      title: { zh: "时装月内容窗口", en: "Fashion Month content" },
      tone: "blue",
    },
    {
      start: 14,
      end: 30,
      title: { zh: "Holiday 达人种草启动", en: "Holiday creator seeding" },
      tone: "green",
    },
  ],
  oct: [
    {
      start: 1,
      end: 7,
      title: { zh: "黄金周营销窗口", en: "Golden Week moment" },
      tone: "pink",
    },
    {
      start: 5,
      end: 31,
      title: { zh: "Black Friday 筹备", en: "Black Friday prep" },
      tone: "blue",
    },
    {
      start: 19,
      end: 31,
      title: { zh: "万圣节内容热潮", en: "Halloween content peak" },
      tone: "green",
    },
  ],
} as const;

const contentTrends = [
  {
    handle: "@glowwithmia",
    format: { zh: "GRWM · 真实测评", en: "GRWM · Real review" },
    caption: { zh: "连续 7 天记录皮肤屏障变化", en: "Tracking my skin barrier for 7 days" },
    views: "1.2M",
    signal: 38,
    gradient: "from-[#f6d9cf] via-[#f4e8df] to-[#d5bbad]",
  },
  {
    handle: "@dailybyzoe",
    format: { zh: "前后对比 · 教程", en: "Before & after · Tutorial" },
    caption: { zh: "通勤妆从早八撑到晚八", en: "Desk-to-dinner makeup test" },
    views: "864K",
    signal: 31,
    gradient: "from-[#d4dcec] via-[#edf0f7] to-[#c5ccda]",
  },
] as const;

const topicTrends = [
  { hashtag: "#SkinBarrier", zh: "屏障修护", posts: "84.2K", signal: 54 },
  { hashtag: "#DeskToDinner", zh: "通勤变装", posts: "51.6K", signal: 36 },
  { hashtag: "#AffordableLuxury", zh: "低成本精致感", posts: "38.9K", signal: 29 },
] as const;

const productTrends = [
  {
    name: { zh: "旅行装精华套组", en: "Travel serum set" },
    category: { zh: "护肤", en: "Skincare" },
    signal: 42,
    shape: "bottle",
  },
  {
    name: { zh: "多用途腮红膏", en: "Multi-use balm" },
    category: { zh: "彩妆", en: "Makeup" },
    signal: 33,
    shape: "jar",
  },
  {
    name: { zh: "可替换香氛喷雾", en: "Refillable mist" },
    category: { zh: "香氛", en: "Fragrance" },
    signal: 21,
    shape: "tube",
  },
] as const;

const studios = [
  {
    title: { zh: "AI 做策划案", en: "AI Campaign Planner" },
    description: {
      zh: "输入品牌、产品和目标，生成 Campaign Big Idea、传播阶段与达人内容方向。",
      en: "Generate a big idea, rollout phases, and creator directions from your brand and goals.",
    },
    icon: Lightbulb,
    accent: "from-[#fff0f5] to-[#ffe2eb] text-brand",
    action: "chat" as const,
  },
  {
    title: { zh: "AI 做文案", en: "AI Copywriter" },
    description: {
      zh: "生成品牌主张、广告文案、社媒 Caption、达人 Brief 与多语言改写。",
      en: "Create brand claims, ad copy, captions, creator briefs, and localized variants.",
    },
    icon: PenLine,
    accent: "from-[#eef2fb] to-[#e1e8f8] text-[#415d9b]",
    action: "chat" as const,
  },
  {
    title: { zh: "AI 做内容", en: "AI Content Studio" },
    description: {
      zh: "从趋势和商品卖点生成短视频脚本、分镜、视觉方向和内容改编。",
      en: "Turn trends and product claims into scripts, storyboards, visual directions, and adaptations.",
    },
    icon: Images,
    accent: "from-[#e8f6f4] to-[#d8efec] text-[#16766e]",
    action: "link" as const,
    href: "/context-lab",
  },
] as const;

const inspirationCards = [
  {
    title: { zh: "创意灵感库", en: "Creative Library" },
    description: {
      zh: "收藏案例、视觉参考和达人内容",
      en: "Save campaigns, visuals, and creator content",
    },
    icon: Telescope,
    meta: { zh: "128 个灵感", en: "128 inspirations" },
  },
  {
    title: { zh: "竞品创意动态", en: "Competitor Creative Signals" },
    description: {
      zh: "查看竞品最近测试的主题与内容形式",
      en: "See themes and formats competitors are testing",
    },
    icon: Radar,
    meta: { zh: "本周 16 条新动态", en: "16 new this week" },
    href: "/tracking",
  },
  {
    title: { zh: "高表现内容规律", en: "Winning Content Patterns" },
    description: {
      zh: "从历史 Campaign 提炼 Hook 与脚本结构",
      en: "Learn hooks and structures from past campaigns",
    },
    icon: BarChart3,
    meta: { zh: "已沉淀 24 条规律", en: "24 patterns saved" },
    href: "/insights",
  },
] as const;

const weekdays = [
  { zh: "周一", en: "MON" },
  { zh: "周二", en: "TUE" },
  { zh: "周三", en: "WED" },
  { zh: "周四", en: "THU" },
  { zh: "周五", en: "FRI" },
  { zh: "周六", en: "SAT" },
  { zh: "周日", en: "SUN" },
] as const;

const eventTone = {
  pink: "border-[#ffd2df] bg-[#fff0f5] text-[#b31f50]",
  blue: "border-[#d9e2f5] bg-[#eef2fb] text-[#415d9b]",
  green: "border-[#cbe9e4] bg-[#e8f6f4] text-[#16766e]",
} as const;

function StudioPreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="relative h-40 overflow-hidden rounded-[12px] bg-gradient-to-br from-[#fff4f7] to-[#f5edf8] p-4">
        <div className="absolute left-5 top-5 rounded-[8px] border border-[#f5cddd] bg-white px-3 py-2 shadow-sm">
          <span className="text-[8px] font-semibold text-brand">BIG IDEA</span>
          <p className="mt-0.5 text-[10px] font-bold text-navy">Everyday Glow</p>
        </div>
        <div className="absolute left-[49%] top-[49%] h-px w-16 -translate-x-1/2 rotate-[22deg] bg-[#e7b9ca]" />
        <div className="absolute left-[49%] top-[49%] h-px w-16 -translate-x-1/2 -rotate-[22deg] bg-[#e7b9ca]" />
        <div className="absolute bottom-5 left-5 rounded-[8px] border border-white bg-white/85 px-3 py-2 shadow-sm">
          <p className="text-[8px] text-muted">AWARENESS</p>
          <p className="mt-0.5 text-[9px] font-semibold text-ink">Creator seeding</p>
        </div>
        <div className="absolute bottom-5 right-5 rounded-[8px] border border-white bg-white/85 px-3 py-2 shadow-sm">
          <p className="text-[8px] text-muted">CONVERSION</p>
          <p className="mt-0.5 text-[9px] font-semibold text-ink">Launch offer</p>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="h-40 overflow-hidden rounded-[12px] bg-gradient-to-br from-[#eef2fb] to-[#e7ebf6] p-4">
        <div className="h-full rounded-[10px] border border-white/80 bg-white/90 p-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff8caa]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#f2c66d]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#69c7b9]" />
            </div>
            <span className="rounded-full bg-soft-lavender px-2 py-0.5 text-[7px] font-semibold text-lavender-text">
              3 VARIANTS
            </span>
          </div>
          <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.12em] text-muted">
            Social caption
          </p>
          <p className="mt-2 text-[10px] font-semibold leading-[16px] text-navy">
            Your morning glow,
            <br />
            made effortless.
          </p>
          <div className="mt-3 flex gap-1.5">
            <span className="rounded-full bg-[#eef2fb] px-2 py-1 text-[7px] text-[#415d9b]">
              Shorter
            </span>
            <span className="rounded-full bg-[#eef2fb] px-2 py-1 text-[7px] text-[#415d9b]">
              Playful
            </span>
            <span className="rounded-full bg-[#eef2fb] px-2 py-1 text-[7px] text-[#415d9b]">
              Translate
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-40 overflow-hidden rounded-[12px] bg-gradient-to-br from-[#e8f6f4] to-[#dcebea] p-3">
      <div className="mx-auto h-full w-[76px] overflow-hidden rounded-[12px] border-[3px] border-white bg-gradient-to-b from-[#d9bca8] to-[#846653] shadow-md">
        <div className="relative flex h-full items-center justify-center">
          <span className="absolute left-2 top-2 rounded-full bg-white/85 px-1.5 py-0.5 text-[6px] font-bold text-navy">
            9:16
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#16766e] shadow-sm">
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          </span>
          <div className="absolute bottom-2 left-2 right-2 space-y-1">
            <div className="h-1.5 rounded-full bg-white/90" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/65" />
          </div>
        </div>
      </div>
      <div className="absolute left-5 top-5 rounded-[7px] bg-white/80 px-2 py-1.5 shadow-sm">
        <Clapperboard className="h-3 w-3 text-[#16766e]" />
      </div>
      <div className="absolute bottom-5 right-5 rounded-[7px] bg-white/80 px-2 py-1.5 shadow-sm">
        <Images className="h-3 w-3 text-[#16766e]" />
      </div>
    </div>
  );
}

export default function CreativePage() {
  const l = useLoc();
  const openChat = useUIStore((state) => state.openChat);
  const [monthIndex, setMonthIndex] = useState(0);
  const [trendRange, setTrendRange] = useState<"7d" | "30d">("7d");
  const month = calendarMonths[monthIndex];
  const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
  const firstDayOffset = (new Date(month.year, month.month, 1).getDay() + 6) % 7;
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  return (
    <div className="min-h-full bg-page px-6 py-5 lg:px-8">
      <div className="w-full">
        <header>
          <h1 className="text-[26px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1>
          <p className="mt-1 text-[11.5px] text-slate">{l(L.subtitle)}</p>
        </header>

        <section className="mt-4 overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-soft-pink text-brand">
                <CalendarDays className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-[14px] font-semibold text-navy">{l(L.calendar)}</h2>
                <p className="mt-0.5 text-[9.5px] text-muted">{l(L.calendarDesc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={l(L.previousMonth)}
                onClick={() => setMonthIndex((current) => Math.max(0, current - 1))}
                disabled={monthIndex === 0}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border text-slate disabled:opacity-35"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[72px] text-center text-[11.5px] font-semibold text-ink">
                {l(month.label)}
              </span>
              <button
                type="button"
                aria-label={l(L.nextMonth)}
                onClick={() =>
                  setMonthIndex((current) => Math.min(calendarMonths.length - 1, current + 1))
                }
                disabled={monthIndex === calendarMonths.length - 1}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border text-slate disabled:opacity-35"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-7 border-b border-border bg-surface-warm/55">
                {weekdays.map((weekday, index) => (
                  <div
                    key={weekday.en}
                    className={cn(
                      "px-2 py-2 text-center text-[8px] font-bold tracking-[0.1em] text-muted",
                      index >= 5 && "text-brand/70",
                    )}
                  >
                    {l(weekday)}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 bg-border">
                {calendarCells.map((day, index) => {
                  const dayEvents = day
                    ? calendarEvents[month.id].filter(
                        (event) => day >= event.start && day <= event.end,
                      )
                    : [];
                  return (
                    <div
                      key={`${month.id}-${index}`}
                      className={cn(
                        "min-h-[58px] border-b border-r border-border bg-surface p-1",
                        !day && "bg-surface-warm/35",
                        index % 7 >= 5 && day && "bg-[#fffafb]",
                      )}
                    >
                      {day && (
                        <>
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[8px] font-semibold text-slate">{day}</span>
                            {day === 20 && month.id === "aug" && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                            )}
                          </div>
                          <div className="mt-0.5 space-y-px">
                            {dayEvents.map((event) => (
                              <button
                                key={event.title.en}
                                type="button"
                                title={`${l(event.title)} · ${l(L.generateCampaign)}`}
                                onClick={() => openChat("lucy")}
                                className={cn(
                                  "block w-full truncate border px-1 py-0 text-left text-[7px] font-semibold leading-[11px] transition-opacity hover:opacity-80",
                                  eventTone[event.tone],
                                  day === event.start
                                    ? "rounded-l-[5px]"
                                    : "rounded-l-none border-l-0",
                                  day === event.end ? "rounded-r-[5px]" : "rounded-r-none",
                                )}
                              >
                                {day === event.start || index % 7 === 0 ? l(event.title) : "·"}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3 px-4 py-1.5">
                {calendarEvents[month.id].map((event) => (
                  <div
                    key={event.title.en}
                    className="flex items-center gap-1.5 text-[8px] text-muted"
                  >
                    <span className={cn("h-2 w-2 rounded-full border", eventTone[event.tone])} />
                    <span>{l(event.title)}</span>
                    <span className="text-muted/70">
                      {event.start}–{event.end}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.02em] text-navy">
                {l(L.trendRadar)}
              </h2>
              <p className="mt-1 text-[10.5px] text-muted">{l(L.trendRadarDesc)}</p>
            </div>
            <div className="flex rounded-[9px] border border-border bg-surface p-1">
              {(["7d", "30d"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTrendRange(range)}
                  className={cn(
                    "rounded-[7px] px-3 py-1.5 text-[9.5px] font-semibold transition-colors",
                    trendRange === range ? "bg-soft-pink text-brand" : "text-muted hover:text-ink",
                  )}
                >
                  {l(range === "7d" ? L.sevenDays : L.thirtyDays)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[15px] border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-soft-pink text-brand">
                  <Clapperboard className="h-4 w-4" />
                </span>
                <h3 className="text-[13.5px] font-semibold text-navy">{l(L.contentTrend)}</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {contentTrends.map((post) => (
                  <div
                    key={post.handle}
                    className="overflow-hidden rounded-[11px] border border-border bg-white"
                  >
                    <div className={cn("relative h-[112px] bg-gradient-to-br", post.gradient)}>
                      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                        <span className="rounded-full bg-black/35 px-2 py-1 text-[7px] font-semibold text-white">
                          TikTok
                        </span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-navy">
                          <Play className="ml-0.5 h-2.5 w-2.5 fill-current" />
                        </span>
                      </div>
                      <div className="absolute inset-x-3 bottom-3 rounded-[7px] bg-black/35 px-2 py-1.5 text-[7.5px] font-medium leading-3 text-white">
                        {l(post.caption)}
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-[8.5px] font-semibold text-ink">{post.handle}</p>
                      <p className="mt-0.5 truncate text-[7.5px] text-muted">{l(post.format)}</p>
                      <div className="mt-2 flex items-center justify-between text-[7.5px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-2.5 w-2.5" />
                          {post.views}
                        </span>
                        <span className="font-semibold text-teal-text">
                          +{trendRange === "7d" ? post.signal : Math.round(post.signal * 1.7)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[15px] border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-soft-lavender text-lavender-text">
                  <Tags className="h-4 w-4" />
                </span>
                <h3 className="text-[13.5px] font-semibold text-navy">{l(L.topicTrend)}</h3>
              </div>
              <div className="mt-4 space-y-2.5">
                {topicTrends.map((topic, index) => {
                  const signal =
                    trendRange === "7d" ? topic.signal : Math.round(topic.signal * 1.7);
                  return (
                    <div
                      key={topic.hashtag}
                      className="rounded-[11px] border border-border bg-gradient-to-r from-[#faf8ff] to-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-bold text-[#6f4fb7]">
                            {topic.hashtag}
                          </p>
                          <p className="mt-0.5 text-[8px] text-muted">
                            {l({ zh: topic.zh, en: `${topic.posts} posts` })}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-soft-teal px-2 py-1 text-[8px] font-bold text-teal-text">
                          <TrendingUp className="h-2.5 w-2.5" />+{signal}%
                        </span>
                      </div>
                      <div className="mt-3 flex h-5 items-end gap-1">
                        {[35, 48, 42, 64, 58, 79, 92].map((height, barIndex) => (
                          <span
                            key={`${topic.hashtag}-${barIndex}`}
                            className="flex-1 rounded-t-[2px] bg-[#d9ccf3]"
                            style={{ height: `${Math.max(20, height - index * 6)}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-[15px] border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-soft-teal text-teal-text">
                  <PackageSearch className="h-4 w-4" />
                </span>
                <h3 className="text-[13.5px] font-semibold text-navy">{l(L.productTrend)}</h3>
              </div>
              <div className="mt-4 space-y-2.5">
                {productTrends.map((product) => (
                  <div
                    key={product.name.en}
                    className="flex items-center gap-3 rounded-[11px] border border-border p-2.5"
                  >
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-[#f7f1eb] to-[#eee2d7]">
                      {product.shape === "bottle" && (
                        <div className="relative h-10 w-5 rounded-b-[6px] rounded-t-[3px] bg-gradient-to-r from-[#dcae91] to-[#b88061] shadow-sm before:absolute before:-top-2 before:left-1/2 before:h-2 before:w-3 before:-translate-x-1/2 before:rounded-t-[2px] before:bg-[#8f6954]" />
                      )}
                      {product.shape === "jar" && (
                        <div className="relative h-6 w-9 rounded-b-[7px] bg-gradient-to-r from-[#e7a7ad] to-[#bd747d] shadow-sm before:absolute before:-top-1.5 before:left-0 before:h-2 before:w-9 before:rounded-[3px] before:bg-[#8f6469]" />
                      )}
                      {product.shape === "tube" && (
                        <div className="relative h-11 w-5 rounded-b-[3px] rounded-t-[8px] bg-gradient-to-r from-[#c5d8d3] to-[#7ba99f] shadow-sm after:absolute after:-bottom-1.5 after:left-0 after:h-2 after:w-5 after:rounded-[2px] after:bg-[#4b7b72]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[7.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                        {l(product.category)}
                      </span>
                      <p className="mt-1 truncate text-[10px] font-semibold text-ink">
                        {l(product.name)}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[8.5px] font-bold text-teal-text">
                        <TrendingUp className="h-2.5 w-2.5" />+
                        {trendRange === "7d" ? product.signal : Math.round(product.signal * 1.7)}%
                      </span>
                    </div>
                    <Bookmark className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="mt-7">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.02em] text-navy">
              {l(L.creativeStudio)}
            </h2>
            <p className="mt-1 text-[10.5px] text-muted">{l(L.creativeStudioDesc)}</p>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {studios.map((studio, index) => {
              const content = (
                <>
                  <StudioPreview index={index} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[15px] font-bold text-navy">{l(studio.title)}</h3>
                        <p className="mt-2 min-h-[48px] text-[10px] leading-[17px] text-muted">
                          {l(studio.description)}
                        </p>
                      </div>
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-soft-pink text-brand transition-transform group-hover:translate-x-0.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <span className="mt-3 inline-flex rounded-full border border-border px-2.5 py-1 text-[8.5px] font-semibold text-brand">
                      {l(studio.action === "chat" ? L.startCreating : L.openStudio)}
                    </span>
                  </div>
                </>
              );
              return studio.action === "chat" ? (
                <button
                  key={studio.title.en}
                  type="button"
                  onClick={() => openChat("lucy")}
                  className="group overflow-hidden rounded-[15px] border border-border bg-surface p-2 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev"
                >
                  {content}
                </button>
              ) : (
                <Link
                  key={studio.title.en}
                  href={studio.href}
                  className="group overflow-hidden rounded-[15px] border border-border bg-surface p-2 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-7 pb-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-bold tracking-[-0.02em] text-navy">
                {l(L.inspiration)}
              </h2>
              <p className="mt-1 text-[10.5px] text-muted">{l(L.inspirationDesc)}</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/context-lab">{l(L.viewAll)}</Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {inspirationCards.map((card) => {
              const Icon = card.icon;
              const content = (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface-warm text-slate">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[12px] font-semibold text-ink">{l(card.title)}</h3>
                    <p className="mt-1 text-[9.5px] leading-4 text-muted">{l(card.description)}</p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-brand">
                      <Flame className="h-3 w-3" />
                      {l(card.meta)}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                </>
              );
              return "href" in card && card.href ? (
                <Link
                  key={card.title.en}
                  href={card.href}
                  className="flex items-start gap-3 rounded-[13px] border border-border bg-surface p-4 shadow-card transition-colors hover:border-border-strong"
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={card.title.en}
                  type="button"
                  onClick={() => openChat("lucy")}
                  className="flex items-start gap-3 rounded-[13px] border border-border bg-surface p-4 text-left shadow-card transition-colors hover:border-border-strong"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
