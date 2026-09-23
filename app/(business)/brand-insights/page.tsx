"use client";

import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store/ui-store";
import { useLoc } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BarChart3, BellRing, Building2, Globe2, MessageSquareText, Radar, Search, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const L = {
  title: { zh: "品牌洞察", en: "BrandRadar" },
  eyebrow: { zh: "品牌、竞品与市场信号", en: "Brand, competitor & market signals" },
  hero: { zh: "看见品牌正在发生什么", en: "See what’s happening around your brand" },
  heroDesc: { zh: "从社媒讨论、竞品动作与内容趋势中，找到下一步值得行动的信号。", en: "Find the next signal worth acting on across conversations, competitors, and content trends." },
  brandPlaceholder: { zh: "搜索品牌、官网、品类或竞品", en: "Search a brand, website, category, or competitor" },
  analyze: { zh: "开始探索", en: "Explore" },
  examples: { zh: "试试：GlowLab、护肤、竞品名称", en: "Try: GlowLab, skincare, or a competitor" },
  monitoring: { zh: "已建立监听范围", en: "Monitoring scope created" },
  report: { zh: "品牌信号报告", en: "Brand signal report" },
  reportDesc: { zh: "过去 30 天公开内容、消费者讨论与竞品动态的综合观察。", en: "A 30-day view of public content, consumer conversations, and competitor activity." },
  mentions: { zh: "品牌提及", en: "Brand mentions" },
  sentiment: { zh: "正向情感", en: "Positive sentiment" },
  shareOfVoice: { zh: "品类声量份额", en: "Share of voice" },
  emergingTopics: { zh: "新兴话题", en: "Emerging topics" },
  conversation: { zh: "消费者讨论", en: "Consumer conversations" },
  competitor: { zh: "竞品动态", en: "Competitor watch" },
  creator: { zh: "达人与内容机会", en: "Creator & content opportunities" },
  alert: { zh: "设置提醒", en: "Set alert" },
  exploreTopics: { zh: "热门观察方向", en: "Explore signals" },
  social: { zh: "社媒讨论", en: "Social conversation" },
  category: { zh: "类目趋势", en: "Category movement" },
  opportunity: { zh: "合作机会", en: "Creator opportunity" },
} as const;

const signalDots = [
  { className: "left-[7%] top-[28%]", icon: "◌", label: "+38% conversations", tone: "pink" },
  { className: "right-[8%] top-[25%]", icon: "◒", label: "24 competitor moves", tone: "blue" },
] as const;

const categories = [
  { zh: "推荐", en: "Recommend" },
  { zh: "美妆护肤", en: "Beauty & skincare" },
  { zh: "时尚生活", en: "Fashion & lifestyle" },
  { zh: "食品饮料", en: "Food & beverage" },
  { zh: "健康运动", en: "Health & fitness" },
  { zh: "母婴家庭", en: "Family & parenting" },
  { zh: "消费科技", en: "Consumer tech" },
] as const;

const featuredBrands = [
  { name: "SHEIN", url: "shein.com", cover: "/brand-reports/shein-cover.jpg", logo: "/brand-reports/shein-logo.png", description: { zh: "快速上新的时尚内容持续带动年轻消费者讨论。", en: "Fast-moving fashion content continues to drive younger consumer conversation." }, tags: ["Fashion", "Gen Z", "+42% mentions"] },
  { name: "Nike", url: "nike.com", cover: "/brand-reports/nike-cover.jpg", logo: "/brand-reports/nike-logo.svg", description: { zh: "跑步与日常运动场景仍是内容合作的高热度方向。", en: "Running and everyday movement remain high-interest creator collaboration themes." }, tags: ["Sportswear", "Running", "High engagement"] },
  { name: "Aesop", url: "aesop.com", cover: "/brand-reports/aesop-cover.jpg", logo: "/brand-reports/aesop-logo.png", description: { zh: "仪式感护理与空间美学内容保持稳定的高意向互动。", en: "Ritual-led care and design-forward content continue to attract high-intent engagement." }, tags: ["Beauty", "Premium", "High intent"] },
  { name: "Oatside", url: "oatside.com", cover: "/brand-reports/oatside-cover.jpg", logo: "/brand-reports/oatside-logo.png", description: { zh: "咖啡、通勤与轻生活方式内容带来更多自然讨论。", en: "Coffee, commute, and easy-living content are driving organic conversations." }, tags: ["Food & beverage", "Lifestyle", "+24% creators"] },
  { name: "Glossier", url: "glossier.com", cover: "/brand-reports/glossier-cover.jpg", logo: "", description: { zh: "真实体验与日常妆容分享更适合社区型内容合作。", en: "Authentic routines and everyday makeup fit community-led creator programs." }, tags: ["Beauty", "Community", "Creator fit"] },
  { name: "Allbirds", url: "allbirds.com", cover: "/brand-reports/allbirds-cover.jpg", logo: "", description: { zh: "舒适、可持续和轻运动话题适合长期内容种草。", en: "Comfort, sustainability, and easy movement suit ongoing content seeding." }, tags: ["Fashion", "Sustainability", "8 creator fits"] },
] as const;

export default function BrandInsightsPage() {
  const l = useLoc();
  const productMode = useUIStore((state) => state.productMode);
  const sectionTab = useUIStore((state) => state.discoverSections.brandRadar);
  const [brand, setBrand] = useState("");
  const [ready, setReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState(0);
  const displayedBrand = brand.trim() || "GlowLab";
  const explore = () => setReady(true);

  return <main className="min-h-full bg-surface px-6 py-6 lg:px-8"><div className="mx-auto w-full max-w-[1400px]">
    {productMode === "discover" && sectionTab === "competitors" ? <CompetitorsPanel /> : !ready ? <section>
      <div className="relative min-h-[290px] overflow-hidden rounded-[18px] border border-white/90 bg-white/65 shadow-[0_14px_42px_rgba(39,48,71,0.06)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-24 -top-36 h-[330px] w-[500px] rounded-full bg-soft-pink/70 blur-3xl" /><div className="pointer-events-none absolute -right-20 bottom-[-150px] h-[360px] w-[500px] rounded-full bg-brand/10 blur-3xl" /><div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/10" />
      {signalDots.map((signal) => <div key={signal.label} className={cn("pointer-events-none absolute hidden items-center gap-2 rounded-[10px] border border-white/80 bg-white/55 px-3 py-2 backdrop-blur-md md:flex", signal.className)}><span className={cn("flex h-7 w-7 items-center justify-center rounded-[7px] text-[14px] font-semibold", signal.tone === "pink" ? "bg-soft-pink text-brand" : "bg-soft-blue text-blue-text")}>{signal.icon}</span><span className="text-[10px] font-semibold text-slate">{signal.label}</span></div>)}
      <div className="relative mx-auto flex min-h-[290px] max-w-[860px] flex-col items-center justify-center px-6 text-center"><div className="mb-2 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white/75 text-brand shadow-sm"><Radar className="h-4 w-4" /></span><span className="text-[14px] font-bold tracking-[-0.025em] text-navy">{l(L.title)}</span></div><h1 className="text-[28px] font-bold tracking-[-0.05em] text-navy sm:text-[38px]">{l({ zh: "发现品牌下一步的机会", en: "Discover your brand’s next opportunity" })}</h1><p className="mt-1.5 text-[11px] text-slate">{l({ zh: "搜索一个品牌、官网或品类，开始追踪市场正在发生的变化。", en: "Search a brand, website, or category to see what’s moving in the market." })}</p>
        <div className="mt-5 flex w-full max-w-[760px] items-center gap-2 rounded-full border border-white/95 bg-white/80 p-1.5 shadow-[0_12px_36px_rgba(32,42,67,0.08)] backdrop-blur-md"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={brand} onChange={(event) => setBrand(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") explore(); }} placeholder={l({ zh: "输入品牌名称或官网，例如 Shein、shein.com", en: "Enter a brand or website, e.g. Shein or shein.com" })} className="h-10 w-full bg-transparent pl-10 pr-2 text-[12px] text-ink outline-none placeholder:text-muted" /></div><Button onClick={explore} className="h-10 rounded-full px-5"><Sparkles className="h-3.5 w-3.5" />{l(L.analyze)}</Button></div>
      </div></div>
      <div className="mt-5 flex flex-wrap gap-2">{categories.map((category, index) => <button key={category.en} type="button" onClick={() => setActiveFilter(index)} className={cn("rounded-full px-4 py-2 text-[10.5px] font-semibold transition-colors", activeFilter === index ? "bg-brand text-white shadow-cta" : "bg-page text-slate hover:bg-soft-pink hover:text-brand")}>{l(category)}</button>)}</div>
      <BrandGrid category={activeFilter} />
    </section> : <BrandReport brand={displayedBrand} onBack={() => setReady(false)} />}
  </div></main>;
}

function LegacyCompetitorsPanel() {
  const l = useLoc();
  const competitors = featuredBrands.slice(0, 4).map((brand, index) => ({ brand, mentions: ["128K", "96K", "74K", "52K"][index], share: ["32%", "24%", "19%", "13%" ][index], growth: [18, 12, 27, 9][index], creators: [428, 316, 204, 148][index] }));
  return <section><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-[20px] font-bold tracking-[-0.025em] text-navy">{l({ zh: "竞品表现对比", en: "Competitor landscape" })}</h2><p className="mt-1 text-[11px] text-slate">{l({ zh: "对比品牌声量、增长速度、达人覆盖和近期市场动作。", en: "Compare share of voice, momentum, creator coverage, and recent market moves." })}</p></div><Button variant="outline"><Sparkles className="h-3.5 w-3.5" />{l({ zh: "生成竞品解读", en: "Generate analysis" })}</Button></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{competitors.map(({ brand, mentions, share, growth, creators }) => <article key={brand.name} className="rounded-[14px] border border-border bg-white p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[10px] border border-border bg-white">{brand.logo ? <img src={brand.logo} alt="" className="h-full w-full object-contain p-2" /> : <Building2 className="h-4 w-4 text-muted" />}</span><div><h3 className="text-[13px] font-semibold text-ink">{brand.name}</h3><p className="text-[9px] text-muted">{brand.url}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><CompareMetric label={l({ zh: "品牌提及", en: "Mentions" })} value={mentions} /><CompareMetric label={l({ zh: "声量份额", en: "Share" })} value={share} /><CompareMetric label={l({ zh: "达人覆盖", en: "Creators" })} value={String(creators)} /><CompareMetric label={l({ zh: "增长", en: "Growth" })} value={`+${growth}%`} positive /></div></article>)}</div><div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_.8fr]"><article className="rounded-[14px] border border-border bg-white p-5"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-brand" /><h3 className="text-[14px] font-semibold text-navy">{l({ zh: "市场位置", en: "Market position" })}</h3></div><div className="mt-5 space-y-4">{competitors.map(({ brand, growth }, index) => <div key={brand.name} className="grid grid-cols-[90px_1fr_44px] items-center gap-3"><span className="text-[10.5px] font-medium text-ink">{brand.name}</span><div className="h-2 overflow-hidden rounded-full bg-page"><div className={cn("h-full rounded-full", index === 0 ? "bg-brand" : index === 1 ? "bg-[#7c8fbd]" : index === 2 ? "bg-teal" : "bg-[#c6a36b]")} style={{ width: `${48 + growth * 2}%` }} /></div><span className="text-right text-[9.5px] font-semibold text-slate">+{growth}%</span></div>)}</div></article><article className="rounded-[14px] border border-border bg-white p-5"><h3 className="text-[14px] font-semibold text-navy">{l({ zh: "近期动作", en: "Recent moves" })}</h3><div className="mt-4 space-y-3">{[l({ zh: "Nike 扩大跑步社区达人合作", en: "Nike expanded running-community creator partnerships" }), l({ zh: "SHEIN 提高新品短视频发布频率", en: "SHEIN increased short-form launch frequency" }), l({ zh: "Aesop 加码门店体验内容", en: "Aesop invested in retail-experience content" })].map((item, index) => <div key={item} className="flex gap-3"><span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand" /><div><p className="text-[10.5px] leading-5 text-slate">{item}</p><span className="text-[8.5px] text-muted">{index + 1} {l({ zh: "天前", en: "days ago" })}</span></div></div>)}</div></article></div></section>;
}

function CompetitorsPanel() {
  const l = useLoc();
  return <section><div className="flex h-14 flex-wrap items-center justify-between gap-4"><h1 className="text-[30px] font-bold tracking-[-0.035em] text-navy">{l({ zh: "竞品分析", en: "Competitors" })}</h1><Button variant="outline"><Sparkles className="h-3.5 w-3.5" />{l({ zh: "生成竞品解读", en: "Generate analysis" })}</Button></div><div className="mt-5 [&>section>div:first-child]:hidden"><LegacyCompetitorsPanel /></div></section>;
}

function CompareMetric({ label, value, positive }: { label: string; value: string; positive?: boolean }) { return <div className="rounded-[9px] bg-page p-2.5"><p className="text-[8.5px] text-muted">{label}</p><p className={cn("mt-1 text-[13px] font-bold", positive ? "text-teal-text" : "text-ink")}>{value}</p></div>; }

function BrandGrid({ category: _category }: { category: number }) {
  const l = useLoc();
  return <section className="pt-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{featuredBrands.map((brand) => <Link key={brand.name} href={`/brand-insights/${brand.name.toLowerCase()}`} className="group overflow-hidden rounded-[15px] border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(26,36,58,0.06)]"><div className="relative h-[152px] overflow-hidden bg-[#f1f2f4]"><img src={brand.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /><div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" /></div><div className="relative p-4 pt-5"><span className="absolute -top-6 left-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] border-4 border-surface bg-white text-slate shadow-sm">{brand.logo ? <img src={brand.logo} alt={`${brand.name} logo`} className="h-full w-full object-contain p-2" /> : <Building2 className="h-4 w-4" />}</span><div className="flex items-start justify-between gap-3"><div><h3 className="text-[15px] font-semibold text-navy">{brand.name}</h3><p className="mt-0.5 text-[10px] text-muted">{brand.url}</p></div><ArrowUpRight className="mt-1 h-4 w-4 text-muted transition-colors group-hover:text-brand" /></div><p className="mt-3 min-h-[32px] text-[10.5px] leading-4 text-slate">{l(brand.description)}</p><div className="mt-3 flex flex-wrap gap-1.5">{brand.tags.map((tag, tagIndex) => <span key={tag} className={cn("rounded-full px-2 py-1 text-[9px] font-medium", tagIndex === 2 ? "bg-soft-pink text-brand" : "bg-page text-slate")}>{tag}</span>)}</div></div></Link>)}</div></section>;
}

function BrandReport({ brand, onBack }: { brand: string; onBack: () => void }) {
  const l = useLoc();
  return <section><header className="flex flex-wrap items-end justify-between gap-4"><div><button type="button" onClick={onBack} className="mb-3 text-[10px] font-semibold text-brand hover:text-brand-hover">← {l({ zh: "重新探索", en: "Explore another brand" })}</button><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-soft-pink text-brand"><Building2 className="h-5 w-5" /></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{l(L.monitoring)}</p><h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.04em] text-navy">{brand} · {l(L.report)}</h1></div></div><p className="mt-3 text-[11px] text-slate">{l(L.reportDesc)}</p></div><Button variant="outline"><BellRing className="h-3.5 w-3.5" />{l(L.alert)}</Button></header>
    <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric icon={<MessageSquareText className="h-4 w-4" />} label={l(L.mentions)} value="12.4K" delta="+18%" tone="pink" /><Metric icon={<TrendingUp className="h-4 w-4" />} label={l(L.sentiment)} value="78%" delta="+6%" tone="teal" /><Metric icon={<Radar className="h-4 w-4" />} label={l(L.shareOfVoice)} value="14.2%" delta="+2.1%" tone="blue" /><Metric icon={<Sparkles className="h-4 w-4" />} label={l(L.emergingTopics)} value="6" delta="+2" tone="lavender" /></div>
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_.8fr]"><article className="rounded-[14px] border border-border bg-surface p-5"><div className="flex items-center gap-2"><MessageSquareText className="h-4 w-4 text-brand" /><h2 className="text-[14px] font-semibold text-navy">{l(L.conversation)}</h2></div><div className="mt-4 space-y-3">{["#SkinBarrier", "#7DayRoutine", "#CommuterSkincare"].map((topic, index) => <div key={topic} className="flex items-center gap-3 rounded-[10px] bg-surface-warm p-3"><span className={cn("h-2 w-2 rounded-full", index === 0 ? "bg-brand" : index === 1 ? "bg-teal" : "bg-blue-500")} /><div className="min-w-0 flex-1"><p className="text-[11.5px] font-semibold text-ink">{topic}</p><p className="mt-1 text-[9.5px] text-slate">{l({ zh: "讨论集中在真实功效、连续使用记录与换季护理。", en: "Conversation centers on proof points, routine diaries, and seasonal skincare." })}</p></div><span className="text-[11px] font-bold text-teal-text">+{38 - index * 9}%</span></div>)}</div></article>
      <div className="space-y-4"><InsightCard icon={<Globe2 className="h-4 w-4" />} title={l(L.competitor)} items={[l({ zh: "竞品 A 加大 #SkinBarrier 内容投放", en: "Competitor A increased #SkinBarrier content" }), l({ zh: "竞品 B 新增微型达人测评合作", en: "Competitor B added micro-creator reviews" })]} /><InsightCard icon={<UsersRound className="h-4 w-4" />} title={l(L.creator)} items={[l({ zh: "教育型护肤达人互动率高出均值 1.8 倍", en: "Educational skincare creators outperform by 1.8×" }), l({ zh: "7 天实测内容更适合中腰部达人扩散", en: "7-day tests suit mid-tier creator seeding" })]} /></div>
    </div>
  </section>;
}

function Metric({ icon, label, value, delta, tone }: { icon: React.ReactNode; label: string; value: string; delta: string; tone: "pink" | "teal" | "blue" | "lavender" }) {
  const color = tone === "pink" ? "bg-soft-pink text-brand" : tone === "teal" ? "bg-soft-teal text-teal-text" : tone === "blue" ? "bg-soft-blue text-blue-text" : "bg-soft-lavender text-lavender-text";
  return <article className="rounded-[13px] border border-border bg-surface p-4"><span className={cn("flex h-8 w-8 items-center justify-center rounded-[8px]", color)}>{icon}</span><p className="mt-3 text-[10px] text-muted">{label}</p><div className="mt-1 flex items-end justify-between"><strong className="text-[23px] tracking-[-0.03em] text-navy">{value}</strong><span className="text-[10px] font-semibold text-teal-text">{delta}</span></div></article>;
}

function InsightCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <article className="rounded-[14px] border border-border bg-surface p-4"><div className="flex items-center gap-2 text-navy">{icon}<h2 className="text-[13px] font-semibold">{title}</h2></div><div className="mt-3 space-y-2">{items.map((item) => <div key={item} className="rounded-[8px] bg-surface-warm px-3 py-2.5 text-[10.5px] leading-4 text-slate">{item}<ArrowUpRight className="ml-1 inline h-3 w-3 text-muted" /></div>)}</div></article>;
}
