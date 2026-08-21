"use client";

import { CampaignCreateDialog } from "@/components/campaign-create-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign, CampaignGoal } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
	ArrowRight,
	CalendarRange,
	FileText,
	Gift,
	Plus,
	Search,
	Sparkles,
	Users,
	WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const L = {
	title: { zh: "Campaigns", en: "Campaigns" },
	subtitle: {
		zh: "管理 Campaign 信息，并进入每个 Campaign 查看达人合作进度。",
		en: "Manage campaign information and open each campaign to track creator collaborations.",
	},
	all: { zh: "全部", en: "All" },
	searchPlaceholder: {
		zh: "搜索 Campaign 或品牌…",
		en: "Search campaign or brand…",
	},
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
	emptyEyebrow: {
		zh: "创建你的第一个 Campaign",
		en: "CREATE YOUR FIRST CAMPAIGN",
	},
	emptyTitle: {
		zh: "先定义完整的 Campaign，再基于 Campaign 条件寻找达人",
		en: "Define the campaign first, then find creators from its requirements",
	},
	emptyDescription: {
		zh: "填写品牌、目标、周期、合作激励和达人要求。Campaign 创建完成后，数字员工会基于这些条件开始搜索和建联。",
		en: "Set the brand, goal, duration, compensation, and creator requirements. Your digital employee will use them to begin discovery and outreach.",
	},
	createFirst: { zh: "创建第一个 Campaign", en: "Create your first campaign" },
	stepBasic: { zh: "Campaign 信息", en: "Campaign details" },
	stepBasicSub: {
		zh: "定义品牌、目标、类目与周期",
		en: "Define brand, goal, category, and duration",
	},
	stepTerms: { zh: "合作条件", en: "Collaboration terms" },
	stepTermsSub: {
		zh: "设置费用、佣金、产品或礼品卡",
		en: "Set fees, commission, products, or gift cards",
	},
	stepCreator: { zh: "达人要求", en: "Creator requirements" },
	stepCreatorSub: {
		zh: "确定地区、语言、类目与交付要求",
		en: "Set region, language, category, and deliverables",
	},
	previewHint: {
		zh: "当前是无 Campaign 的预览状态",
		en: "Previewing the no-campaign state",
	},
} as const;

const statusLabels: Record<
	Campaign["status"],
	{ label: LText; tone: "teal" | "blue" | "amber" | "gray" }
> = {
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
	return (
		<Suspense fallback={null}>
			<CampaignsContent />
		</Suspense>
	);
}
function CampaignsContent() {
	const campaigns = useUIStore((state) => state.campaigns);
	const searchParams = useSearchParams();
	const l = useLoc();
	const [filter, setFilter] = useState<"all" | Campaign["status"]>("all");
	const [query, setQuery] = useState("");
	const [createOpen, setCreateOpen] = useState(false);
	const visibleCampaigns = searchParams.get("empty") === "1" ? [] : campaigns;
	const filtered = visibleCampaigns.filter((campaign) => {
		const matchesStatus = filter === "all" || campaign.status === filter;
		const needle = query.toLowerCase();
		const matchesQuery =
			!needle ||
			l(campaign.name).toLowerCase().includes(needle) ||
			l(campaign.brand).toLowerCase().includes(needle);
		return matchesStatus && matchesQuery;
	});

	if (visibleCampaigns.length === 0) {
		return (
			<>
				<CampaignEmptyState
					preview={searchParams.get("empty") === "1"}
					onCreate={() => setCreateOpen(true)}
				/>
				<CampaignCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
			</>
		);
	}

	return (
		<>
			<div className="space-y-6 p-7 lg:p-8">
				<header className="flex items-end justify-between gap-6">
					<div>
						<h1 className="text-[28px] font-bold tracking-[-0.025em] text-navy">
							{l(L.title)}
						</h1>
						<p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p>
					</div>
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="h-4 w-4" /> {l(L.newCampaign)}
					</Button>
				</header>

				<div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
					<FilterChip
						label={l(L.all)}
						count={visibleCampaigns.length}
						active={filter === "all"}
						onClick={() => setFilter("all")}
					/>
					{(Object.keys(statusLabels) as Campaign["status"][]).map((status) => (
						<FilterChip
							key={status}
							label={l(statusLabels[status].label)}
							count={
								visibleCampaigns.filter(
									(campaign) => campaign.status === status,
								).length
							}
							active={filter === status}
							onClick={() => setFilter(status)}
						/>
					))}
					<div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
						<Search className="h-3.5 w-3.5 text-muted" />
						<input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder={l(L.searchPlaceholder)}
							className="w-52 border-0 bg-transparent text-[13px] outline-none placeholder:text-muted"
						/>
					</div>
				</div>

				{filtered.length ? (
					<div className="grid gap-4 xl:grid-cols-2">
						{filtered.map((campaign) => (
							<Link
								key={campaign.id}
								href={`/campaigns/${campaign.id}`}
								className="group overflow-hidden rounded-[14px] border border-border bg-surface text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev"
							>
								<div className="flex gap-4 p-5">
									<CampaignImage campaign={campaign} />
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-4">
											<div className="min-w-0">
												<div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
													{l(campaign.brand)}
												</div>
												<h2 className="mt-1 truncate text-[18px] font-bold text-navy">
													{l(campaign.name)}
												</h2>
											</div>
											<Badge tone={statusLabels[campaign.status].tone}>
												{l(statusLabels[campaign.status].label)}
											</Badge>
										</div>
										<p className="mt-2 line-clamp-2 text-[11px] leading-[17px] text-muted">
											{l(campaign.description ?? campaign.briefSummary)}
										</p>
										<div className="mt-3 flex flex-wrap gap-1.5">
											<Badge tone="lavender">
												{l(goalLabels[campaign.goal])}
											</Badge>
											<Badge tone="blue">{campaign.category}</Badge>
										</div>
									</div>
								</div>

								<div className="grid border-y border-border bg-surface-warm md:grid-cols-[1.35fr_1fr]">
									<div className="border-border px-5 py-3.5 md:border-r">
										<div className="mb-2 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted">
											<WalletCards className="h-3.5 w-3.5" />
											{l(L.compensation)}
										</div>
										<CompensationSummary campaign={campaign} />
									</div>
									<div className="px-5 py-3.5">
										<div className="mb-2 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted">
											<CalendarRange className="h-3.5 w-3.5" />
											{l(L.duration)}
										</div>
										<div className="tabular text-[12px] font-medium text-ink">
											{campaign.startAt} — {campaign.endAt}
										</div>
									</div>
								</div>

								<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
									<div className="flex min-w-0 flex-wrap items-center gap-3">
										<RegionBadges
											regions={campaign.creatorRequirements.regions}
										/>
										<PlatformLogos platforms={campaign.platforms} />
									</div>
									<span className="flex items-center gap-1 text-[11.5px] font-semibold text-brand">
										{l(L.openCampaign)}{" "}
										<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
									</span>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="rounded-[14px] border border-dashed border-border py-16 text-center text-[13px] text-muted">
						{l(L.noMatches)}
					</div>
				)}
			</div>
			<CampaignCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
		</>
	);
}

function CampaignImage({ campaign }: { campaign: Campaign }) {
	const l = useLoc();
	if (campaign.image)
		return (
			<img
				src={campaign.image}
				alt=""
				className="h-[88px] w-[88px] flex-shrink-0 rounded-[12px] object-cover"
			/>
		);
	const brand = l(campaign.brand);
	return (
		<div
			style={brandCoverStyle(brand)}
			className="flex h-[88px] w-[88px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[12px] p-2.5 text-center shadow-card"
		>
			<span className="line-clamp-3 text-[12px] font-bold leading-[15px] tracking-[-0.02em] text-white drop-shadow-sm">
				{brand}
			</span>
		</div>
	);
}

const regionMap: Record<string, string> = {
	"United States": "US",
	USA: "US",
	China: "CN",
	Canada: "CA",
	Singapore: "SG",
	"United Kingdom": "UK",
	Australia: "AU",
	Japan: "JP",
	Korea: "KR",
	Germany: "DE",
	France: "FR",
};

function RegionBadges({ regions }: { regions: string[] }) {
	if (!regions.length)
		return <span className="text-[10.5px] text-muted">—</span>;
	return (
		<span className="flex items-center gap-1.5">
			{regions.map((region) => {
				const code = regionMap[region] ?? region.slice(0, 2).toUpperCase();
				return (
					<span
						key={region}
						title={region}
						className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-white px-2 text-[10px] font-semibold text-ink shadow-card"
					>
						<CountryFlag code={code} />
						{code}
					</span>
				);
			})}
		</span>
	);
}

function CountryFlag({ code }: { code: string }) {
	const className =
		"h-[12px] w-[17px] flex-shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10";
	if (code === "US")
		return (
			<svg
				viewBox="0 0 19 12"
				className={className}
				aria-label="United States flag"
			>
				<rect width="19" height="12" fill="#fff" />
				{[0, 2, 4, 6, 8, 10].map((y) => (
					<rect key={y} y={y} width="19" height="1" fill="#d64045" />
				))}
				<rect width="8" height="6.5" fill="#29487d" />
				{[
					[1.5, 1.3],
					[4, 1.3],
					[6.5, 1.3],
					[2.7, 3.1],
					[5.3, 3.1],
					[1.5, 4.9],
					[4, 4.9],
					[6.5, 4.9],
				].map(([cx, cy]) => (
					<circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".45" fill="#fff" />
				))}
			</svg>
		);
	if (code === "CN")
		return (
			<svg viewBox="0 0 19 12" className={className} aria-label="China flag">
				<rect width="19" height="12" fill="#ee1c25" />
				<path
					d="m4 1.35.65 1.35 1.5.2-1.08 1.05.26 1.5L4 4.75l-1.33.7.26-1.5L1.85 2.9l1.5-.2L4 1.35Z"
					fill="#ffde00"
				/>
			</svg>
		);
	if (code === "CA")
		return (
			<svg viewBox="0 0 19 12" className={className} aria-label="Canada flag">
				<rect width="19" height="12" fill="#fff" />
				<rect width="4" height="12" fill="#d52b1e" />
				<rect x="15" width="4" height="12" fill="#d52b1e" />
				<path
					d="m9.5 2 .65 1.35 1.1-.55-.25 1.35 1.05.25-1.2 1.2.45.75-1.45-.2.2 2.2h-1.1l.2-2.2-1.45.2.45-.75-1.2-1.2 1.05-.25-.25-1.35 1.1.55L9.5 2Z"
					fill="#d52b1e"
				/>
			</svg>
		);
	if (code === "SG")
		return (
			<svg
				viewBox="0 0 19 12"
				className={className}
				aria-label="Singapore flag"
			>
				<rect width="19" height="6" fill="#ef3340" />
				<rect y="6" width="19" height="6" fill="#fff" />
				<circle cx="4" cy="3" r="2" fill="#fff" />
				<circle cx="4.8" cy="3" r="1.6" fill="#ef3340" />
			</svg>
		);
	if (code === "JP")
		return (
			<svg viewBox="0 0 19 12" className={className} aria-label="Japan flag">
				<rect width="19" height="12" fill="#fff" />
				<circle cx="9.5" cy="6" r="3" fill="#bc002d" />
			</svg>
		);
	if (code === "DE")
		return (
			<svg viewBox="0 0 19 12" className={className} aria-label="Germany flag">
				<rect width="19" height="4" fill="#111" />
				<rect y="4" width="19" height="4" fill="#dd0000" />
				<rect y="8" width="19" height="4" fill="#ffce00" />
			</svg>
		);
	if (code === "FR")
		return (
			<svg viewBox="0 0 19 12" className={className} aria-label="France flag">
				<rect width="6.34" height="12" fill="#0055a4" />
				<rect x="6.34" width="6.34" height="12" fill="#fff" />
				<rect x="12.68" width="6.34" height="12" fill="#ef4135" />
			</svg>
		);
	return (
		<span
			aria-hidden
			className="h-[12px] w-[17px] flex-shrink-0 rounded-[2px] bg-[linear-gradient(135deg,#4f79a8,#77b9d5)] ring-1 ring-black/10"
		/>
	);
}

function PlatformLogos({ platforms }: { platforms: string[] }) {
	if (!platforms.length)
		return <span className="text-[10.5px] text-muted">—</span>;
	return (
		<span
			className="flex items-center gap-1.5"
			aria-label={platforms.join(", ")}
		>
			{platforms.map((platform) => (
				<PlatformLogo key={platform} platform={platform} />
			))}
		</span>
	);
}

function PlatformLogo({ platform }: { platform: string }) {
	const key = platform.toLowerCase();
	if (key.includes("tiktok") || key.includes("douyin")) {
		return (
			<span
				title={platform}
				aria-label={platform}
				className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#111] shadow-card"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
					<path
						d="M14.2 4.2c.55 2.3 1.85 3.65 4.1 4.25v2.5a8.2 8.2 0 0 1-4.05-1.25v5.15a5.05 5.05 0 1 1-4.4-5V12.5a2.55 2.55 0 1 0 1.9 2.47V4.2h2.45Z"
						fill="#fff"
					/>
					<path
						d="M13.2 4.2c.15.75.4 1.4.75 1.95v9.05a4.05 4.05 0 0 1-7.4 2.3 4 4 0 0 0 7.65-1.65V9.7a8.2 8.2 0 0 0 4.05 1.25v-1.1c-2.8-.45-4.45-2.25-5.05-5.65Z"
						fill="#25F4EE"
						opacity=".7"
					/>
				</svg>
			</span>
		);
	}
	if (key.includes("instagram")) {
		return (
			<span
				title={platform}
				aria-label={platform}
				className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[linear-gradient(135deg,#6a43d5,#d62976_55%,#feda75)] shadow-card"
			>
				<svg
					viewBox="0 0 24 24"
					className="h-4 w-4"
					fill="none"
					stroke="white"
					strokeWidth="2"
					aria-hidden="true"
				>
					<rect x="4" y="4" width="16" height="16" rx="5" />
					<circle cx="12" cy="12" r="3.5" />
					<circle cx="17.3" cy="6.8" r="1" fill="white" stroke="none" />
				</svg>
			</span>
		);
	}
	if (
		key.includes("rednote") ||
		key.includes("xiaohongshu") ||
		key.includes("小红书")
	) {
		return (
			<span
				title={platform}
				aria-label={platform}
				className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#ff2442] text-[7px] font-black tracking-[-0.04em] text-white shadow-card"
			>
				RED
			</span>
		);
	}
	if (key.includes("youtube")) {
		return (
			<span
				title={platform}
				aria-label={platform}
				className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#ff0033] shadow-card"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
					<path d="M9.5 7.8 16 12l-6.5 4.2V7.8Z" fill="white" />
				</svg>
			</span>
		);
	}
	return (
		<span
			title={platform}
			aria-label={platform}
			className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-navy text-[9px] font-bold text-white shadow-card"
		>
			{platform.slice(0, 1).toUpperCase()}
		</span>
	);
}

function brandCoverStyle(brand: string) {
	const palettes = [
		["#f15b86", "#8f3fe2"],
		["#188f86", "#58c7b7"],
		["#2458a6", "#52a4d8"],
		["#a95b1d", "#ed9d48"],
		["#6637a4", "#d05a92"],
	];
	const hash = Array.from(brand).reduce(
		(sum, char) => sum + char.charCodeAt(0),
		0,
	);
	const [from, to] = palettes[hash % palettes.length];
	return { background: `linear-gradient(135deg, ${from}, ${to})` };
}

function CompensationSummary({ campaign }: { campaign: Campaign }) {
	const l = useLoc();
	const compensation = campaign.compensation;
	const items: string[] = [];
	if (compensation.flatFee)
		items.push(
			`${l(L.flatFee)} · ${compensation.flatFee.currency} ${compensation.flatFee.minFee.toLocaleString()}–${compensation.flatFee.maxFee.toLocaleString()}`,
		);
	if (compensation.commission)
		items.push(`${l(L.commission)} ${compensation.commission.rate}%`);
	if (compensation.freeProducts.length)
		items.push(`${l(L.freeProduct)} × ${compensation.freeProducts.length}`);
	if (compensation.giftCard)
		items.push(
			`${l(L.giftCard)} · ${compensation.giftCard.currency} ${compensation.giftCard.value.toLocaleString()}`,
		);
	return (
		<div className="flex flex-wrap gap-1.5">
			{items.map((item) => (
				<span
					key={item}
					className="rounded-full bg-white px-2 py-1 text-[10.5px] font-medium text-ink shadow-card"
				>
					{item}
				</span>
			))}
		</div>
	);
}

function CampaignEmptyState({
	onCreate,
	preview,
}: { onCreate: () => void; preview: boolean }) {
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
						{preview && (
							<div className="mb-4 inline-flex rounded-full border border-border bg-white/80 px-3 py-1 text-[10px] font-medium text-muted">
								{l(L.previewHint)}
							</div>
						)}
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand text-white shadow-cta">
							<Sparkles className="h-5 w-5" />
						</div>
						<div className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
							{l(L.emptyEyebrow)}
						</div>
						<h1 className="mx-auto mt-3 max-w-[720px] text-[28px] font-bold leading-[1.2] tracking-[-0.03em] text-navy lg:text-[34px]">
							{l(L.emptyTitle)}
						</h1>
						<p className="mx-auto mt-3 max-w-[680px] text-[13px] leading-6 text-slate">
							{l(L.emptyDescription)}
						</p>
						<Button size="lg" className="mt-6" onClick={onCreate}>
							{l(L.createFirst)} <ArrowRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<div className="grid border-t border-border md:grid-cols-3">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<div
								key={step.title.en}
								className="flex gap-3.5 border-border px-6 py-5 md:border-r md:last:border-r-0"
							>
								<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-soft-teal text-teal-text">
									<Icon className="h-4 w-4" />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<span className="flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[8px] font-bold text-white">
											{index + 1}
										</span>
										<div className="text-[12.5px] font-semibold text-ink">
											{l(step.title)}
										</div>
									</div>
									<p className="mt-1.5 text-[10.5px] leading-[17px] text-muted">
										{l(step.description)}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function FilterChip({
	label,
	count,
	active,
	onClick,
}: { label: string; count: number; active: boolean; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all",
				active
					? "bg-soft-pink text-brand-strong"
					: "text-slate hover:bg-surface-warm hover:text-ink",
			)}
		>
			{label} <span className="tabular ml-1 text-muted">{count}</span>
		</button>
	);
}
