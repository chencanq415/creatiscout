"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { useLoc } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, FileImage, Globe2, ImageIcon, MessageSquareText, Radar, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const brands: Record<string, { name: string; website: string; cover: string; logo?: string; category: { zh: string; en: string } }> = {
  shein: { name: "SHEIN", website: "shein.com", cover: "/brand-reports/shein-cover.jpg", logo: "/brand-reports/shein-logo.png", category: { zh: "时尚生活", en: "Fashion & lifestyle" } },
  nike: { name: "Nike", website: "nike.com", cover: "/brand-reports/nike-cover.jpg", logo: "/brand-reports/nike-logo.svg", category: { zh: "健康运动", en: "Health & fitness" } },
  aesop: { name: "Aesop", website: "aesop.com", cover: "/brand-reports/aesop-cover.jpg", logo: "/brand-reports/aesop-logo.png", category: { zh: "美妆护肤", en: "Beauty & skincare" } },
  oatside: { name: "Oatside", website: "oatside.com", cover: "/brand-reports/oatside-cover.jpg", logo: "/brand-reports/oatside-logo.png", category: { zh: "食品饮料", en: "Food & beverage" } },
  glossier: { name: "Glossier", website: "glossier.com", cover: "/brand-reports/glossier-cover.jpg", category: { zh: "美妆护肤", en: "Beauty & skincare" } },
  allbirds: { name: "Allbirds", website: "allbirds.com", cover: "/brand-reports/allbirds-cover.jpg", category: { zh: "时尚生活", en: "Fashion & lifestyle" } },
};

const L = {
  back: { zh: "返回 BrandRadar", en: "Back to BrandRadar" },
  overview: { zh: "总览", en: "Overview" },
  marketing: { zh: "营销策略", en: "Marketing" },
  signals: { zh: "市场动态", en: "Market signals" },
  assets: { zh: "营销资产", en: "Marketing assets" },
  report: { zh: "品牌报告", en: "Brand report" },
  updated: { zh: "已更新至今天", en: "Updated today" },
  month: { zh: "近一个月", en: "Last 30 days" },
  quarter: { zh: "近三个月", en: "Last 3 months" },
  half: { zh: "近半年", en: "Last 6 months" },
  year: { zh: "近一年", en: "Last 12 months" },
  mentions: { zh: "品牌提及", en: "Brand mentions" },
  sentiment: { zh: "正向情感", en: "Positive sentiment" },
  share: { zh: "品类声量", en: "Category share" },
  creator: { zh: "达人内容增长", en: "Creator content growth" },
} as const;

type Tab = "overview" | "marketing" | "signals" | "assets";

export default function BrandReportPage() {
  const params = useParams<{ brand: string }>();
  const router = useRouter();
  const l = useLoc();
  const brand = brands[params.brand?.toLowerCase()] ?? brands.shein;
  const [tab, setTab] = useState<Tab>("overview");
  const [period, setPeriod] = useState<"month" | "quarter" | "half" | "year">("month");
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: l(L.overview) }, { id: "marketing", label: l(L.marketing) },
    { id: "signals", label: l(L.signals) }, { id: "assets", label: l(L.assets) },
  ];
  const periods = ["month", "quarter", "half", "year"] as const;
  const periodLabels = { month: l(L.month), quarter: l(L.quarter), half: l(L.half), year: l(L.year) };

  return <main className="min-h-full bg-surface"><div className="flex h-12 items-end border-b border-border px-6 lg:px-8"><Link href="/brand-insights" className="mb-2 flex h-8 w-8 items-center justify-center rounded-[8px] text-slate hover:bg-surface-warm hover:text-ink" aria-label={l(L.back)}><ChevronLeft className="h-4 w-4" /></Link>{tabs.map((item) => <button key={item.id} type="button" onClick={() => setTab(item.id)} className={cn("relative h-12 px-5 text-[12.5px] font-medium", tab === item.id ? "text-brand" : "text-slate hover:text-ink")}>{item.label}{tab === item.id && <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand" />}</button>)}<div className="mb-2 ml-auto flex items-center gap-2"><Picker label={periodLabels[period]} options={periods.map((item) => ({ value: item, label: periodLabels[item] }))} onSelect={(value) => setPeriod(value as typeof period)} /><Picker label={brand.name} options={Object.entries(brands).map(([id, item]) => ({ value: id, label: item.name }))} onSelect={(value) => router.push(`/brand-insights/${value}`)} /></div></div>
    <div className="mx-auto w-full max-w-[1400px] px-6 py-6 lg:px-8">{tab === "overview" && <section className="relative overflow-hidden rounded-[16px] border border-border bg-white"><div className="absolute inset-y-0 right-0 w-[42%] bg-[#f2f3f5]" /><img src={brand.cover} alt="" className="absolute inset-y-0 right-0 w-[42%] object-cover opacity-75" /><div className="absolute inset-y-0 right-[38%] w-28 bg-gradient-to-r from-white via-white/90 to-transparent" /><div className="relative flex min-h-[150px] items-center p-6"><span className="mr-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-[14px] border border-border bg-white shadow-sm">{brand.logo ? <img src={brand.logo} alt={`${brand.name} logo`} className="h-full w-full object-contain p-2.5" /> : <Globe2 className="h-5 w-5 text-slate" />}</span><div><div className="flex items-center gap-2"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{l(L.report)}</p><span className="h-1 w-1 rounded-full bg-muted" /><p className="text-[10px] text-muted">{l(brand.category)}</p></div><h1 className="mt-1 text-[30px] font-bold tracking-[-0.045em] text-navy">{brand.name}</h1><div className="mt-1 flex items-center gap-2 text-[11px] text-slate"><span>{brand.website}</span><span className="h-1 w-1 rounded-full bg-muted" /><span>{l(L.updated)}</span></div></div></div></section>}
      <div className={tab === "overview" ? "mt-5" : "mt-0"}>{tab === "overview" && <Overview brand={brand.name} />}{tab === "marketing" && <Marketing />}{tab === "signals" && <Signals />}{tab === "assets" && <Assets brand={brand} />}</div>
    </div></main>;
}

function Picker({ label, options, onSelect }: { label: string; options: { value: string; label: string }[]; onSelect: (value: string) => void }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><button type="button" className="inline-flex h-8 min-w-[132px] items-center justify-between gap-4 rounded-[8px] border border-border bg-white px-3 text-[11px] font-medium text-ink hover:border-border-strong"><span className="truncate">{label}</span><ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted" /></button></DropdownMenuTrigger><DropdownMenuContent align="end">{options.map((option) => <DropdownMenuItem key={option.value} onSelect={() => onSelect(option.value)}>{option.label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>;
}

function Overview({ brand }: { brand: string }) {
  const l = useLoc();
  const metrics = [
    { icon: <MessageSquareText className="h-4 w-4" />, label: l(L.mentions), value: "128.4K", delta: "+18%", tone: "pink" },
    { icon: <TrendingUp className="h-4 w-4" />, label: l(L.sentiment), value: "76%", delta: "+5.4%", tone: "teal" },
    { icon: <Radar className="h-4 w-4" />, label: l(L.share), value: "14.2%", delta: "+2.1%", tone: "blue" },
    { icon: <UsersRound className="h-4 w-4" />, label: l(L.creator), value: "2.8K", delta: "+23%", tone: "lavender" },
  ] as const;
  return <div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</div><div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><article className="rounded-[14px] border border-border bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold text-navy">{l({ zh: "整体解读", en: "Brand & marketing readout" })}</h2><Sparkles className="h-4 w-4 text-brand" /></div><p className="mt-4 text-[13px] leading-6 text-slate">{l({ zh: `${brand} 在过去一段时间维持了稳定的内容讨论度。高表现内容集中在真实使用场景、用户体验与易被复用的短视频表达；建议将下一轮营销重心放在可验证的产品价值与中腰部达人扩散。`, en: `${brand} has maintained steady content attention recently. Strong-performing posts center on real routines, product experience, and reusable short-form formats. The next cycle should focus on proof-led value and mid-tier creator distribution.` })}</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{[l({ zh: "真实使用内容", en: "Real-use content" }), l({ zh: "高频讨论场景", en: "High-frequency contexts" }), l({ zh: "达人扩散机会", en: "Creator opportunity" })].map((item, index) => <div key={item} className="rounded-[10px] bg-page p-3"><p className="text-[10px] text-muted">{item}</p><p className="mt-1 text-[12px] font-semibold text-ink">{index === 0 ? l({ zh: "持续升温", en: "Rising" }) : index === 1 ? l({ zh: "通勤与日常", en: "Daily routines" }) : l({ zh: "中腰部优先", en: "Mid-tier first" })}</p></div>)}</div></article><article className="rounded-[14px] border border-border bg-white p-5"><h2 className="text-[15px] font-semibold text-navy">{l({ zh: "建议动作", en: "Recommended moves" })}</h2><div className="mt-4 space-y-3">{[l({ zh: "围绕高意向话题建立 3–5 个内容主题", en: "Turn high-intent topics into 3–5 content themes" }), l({ zh: "将高互动内容拆为多种渠道版本", en: "Adapt high-engagement content across channels" }), l({ zh: "邀请垂类达人提供真实使用证据", en: "Invite category creators to validate real use" })].map((item, index) => <div key={item} className="flex gap-3"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-soft-pink text-[9px] font-bold text-brand">{index + 1}</span><p className="text-[11.5px] leading-5 text-slate">{item}</p></div>)}</div></article></div></div>;
}

function Marketing() {
  const l = useLoc();
  const [lens, setLens] = useState(0);
  const lenses = [l({ zh: "渠道", en: "Channels" }), l({ zh: "内容", en: "Content" }), l({ zh: "达人", en: "Creators" }), l({ zh: "活动节奏", en: "Campaign rhythm" })];
  return <div className="grid gap-4 xl:grid-cols-[.78fr_1.22fr]"><article className="rounded-[14px] border border-border bg-white p-5"><h2 className="text-[15px] font-semibold text-navy">{l({ zh: "营销策略维度", en: "Strategy dimensions" })}</h2><div className="mt-4 space-y-1">{lenses.map((item, index) => <button key={item} type="button" onClick={() => setLens(index)} className={cn("flex w-full items-center justify-between rounded-[9px] px-3 py-3 text-left text-[12px] font-medium", lens === index ? "bg-soft-pink text-brand" : "text-slate hover:bg-page")}><span>{item}</span><ChevronRight className="h-3.5 w-3.5" /></button>)}</div></article><article className="rounded-[14px] border border-border bg-white p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{lenses[lens]}</p><h2 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-navy">{l({ zh: "营销策略解读", en: "Marketing strategy readout" })}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{[l({ zh: "主阵地保持稳定更新，短视频承担主要触达。", en: "Core channels stay consistently active, while short video drives reach." }), l({ zh: "以真实体验和场景化表达建立内容信任。", en: "Real routines and contextual storytelling build content trust." }), l({ zh: "中腰部垂类达人带来更高的互动效率。", en: "Mid-tier category creators provide stronger engagement efficiency." }), l({ zh: "营销节奏围绕上新与季节性需求形成波峰。", en: "Marketing peaks align with launches and seasonal demand." })].map((item, index) => <div key={item} className="rounded-[11px] bg-page p-4"><span className="text-[10px] font-semibold text-brand">0{index + 1}</span><p className="mt-2 text-[12px] leading-5 text-slate">{item}</p></div>)}</div></article></div>;
}

function Signals() {
  const l = useLoc();
  return <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]"><article className="rounded-[14px] border border-border bg-white p-5"><div className="flex items-center justify-between"><h2 className="text-[15px] font-semibold text-navy">{l({ zh: "正在变化的市场信号", en: "Market signals in motion" })}</h2><Globe2 className="h-4 w-4 text-brand" /></div><div className="mt-4 space-y-3">{[["#RoutineCheck", "+38%", l({ zh: "真实使用与连续记录正在上升", en: "Real use and routine diaries are rising" })], ["#ValueForMoney", "+21%", l({ zh: "性价比讨论带动品类搜索", en: "Value-led conversation drives category search" })], ["#CreatorProof", "+16%", l({ zh: "达人测评比硬广更易获得互动", en: "Creator reviews outperform direct promotion" })]].map(([topic, growth, detail]) => <div key={topic} className="flex items-center gap-4 rounded-[10px] bg-page p-3"><span className="h-2 w-2 rounded-full bg-brand" /><div className="min-w-0 flex-1"><p className="text-[12px] font-semibold text-ink">{topic}</p><p className="mt-1 text-[10.5px] text-slate">{detail}</p></div><span className="text-[11px] font-semibold text-teal-text">{growth}</span></div>)}</div></article><article className="rounded-[14px] border border-border bg-white p-5"><h2 className="text-[15px] font-semibold text-navy">{l({ zh: "竞品观察", en: "Competitor watch" })}</h2><div className="mt-4 space-y-3">{[l({ zh: "竞品 A：扩大微型达人覆盖，内容更偏向测评", en: "Competitor A: expanding micro-creator review coverage" }), l({ zh: "竞品 B：通过联名活动提高新品讨论度", en: "Competitor B: using collaborations to lift launch conversation" }), l({ zh: "品类整体：消费者对可验证信息的需求升高", en: "Category: demand for verifiable product information is rising" })].map((item) => <div key={item} className="border-l-2 border-brand/30 pl-3 text-[11.5px] leading-5 text-slate">{item}</div>)}</div></article></div>;
}

function Assets({ brand }: { brand: { name: string; cover: string } }) {
  const l = useLoc();
  return <div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[l({ zh: "代表性内容表达", en: "Signature content formats" }), l({ zh: "可复用的营销主题", en: "Reusable campaign themes" }), l({ zh: "达人合作案例", en: "Creator partnership examples" })].map((title, index) => <article key={title} className="overflow-hidden rounded-[14px] border border-border bg-white"><div className="relative h-[132px] bg-page"><img src={brand.cover} alt="" className="h-full w-full object-cover opacity-80" /><div className="absolute inset-0 bg-navy/15" /><span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2 py-1 text-[9px] font-semibold text-ink backdrop-blur">{index === 0 ? l({ zh: "内容", en: "Content" }) : index === 1 ? l({ zh: "主题", en: "Theme" }) : l({ zh: "案例", en: "Case" })}</span></div><div className="p-4"><h2 className="text-[13px] font-semibold text-navy">{title}</h2><p className="mt-2 text-[10.5px] leading-5 text-slate">{index === 0 ? l({ zh: "沉淀高互动内容的叙事方式与视觉语言。", en: "Capture high-performing narrative formats and visual language." }) : index === 1 ? l({ zh: "整理可用于下个活动的核心信息与内容角度。", en: "Organize messages and angles that can seed the next campaign." }) : l({ zh: "归档达人合作的表现、素材与学习点。", en: "Archive creator performance, assets, and learnings." })}</p><button type="button" className="mt-3 text-[10px] font-semibold text-brand">{l({ zh: "查看资产", en: "View assets" })} <ArrowUpRight className="inline h-3 w-3" /></button></div></article>)}</div><article className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-border bg-page px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-brand"><FileImage className="h-4 w-4" /></span><div><p className="text-[12px] font-semibold text-navy">{l({ zh: "营销资产库", en: "Marketing asset library" })}</p><p className="text-[10px] text-slate">{l({ zh: "集中保存内容样本、活动素材与可复用洞察。", en: "A home for content samples, campaign material, and reusable learnings." })}</p></div></div><Button variant="outline"><ImageIcon className="h-3.5 w-3.5" />{l({ zh: "浏览全部", en: "Browse all" })}</Button></article></div>;
}

function Metric({ icon, label, value, delta, tone }: { icon: React.ReactNode; label: string; value: string; delta: string; tone: "pink" | "teal" | "blue" | "lavender" }) {
  const color = tone === "pink" ? "bg-soft-pink text-brand" : tone === "teal" ? "bg-soft-teal text-teal-text" : tone === "blue" ? "bg-soft-blue text-blue-text" : "bg-soft-lavender text-lavender-text";
  return <article className="rounded-[13px] border border-border bg-white p-4"><span className={cn("flex h-8 w-8 items-center justify-center rounded-[8px]", color)}>{icon}</span><p className="mt-3 text-[10px] text-muted">{label}</p><div className="mt-1 flex items-end justify-between"><strong className="text-[23px] tracking-[-0.03em] text-navy">{value}</strong><span className="text-[10px] font-semibold text-teal-text">{delta}</span></div></article>;
}
