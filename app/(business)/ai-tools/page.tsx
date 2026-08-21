"use client";

import { useLoc } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";
import {
	ArrowUpRight,
	Binoculars,
	FileSearch,
	Images,
	ScanFace,
	WandSparkles,
	Workflow,
} from "lucide-react";
import Link from "next/link";

const L = {
	eyebrow: { zh: "AI POWERED WORKSPACE", en: "AI POWERED WORKSPACE" },
	title: { zh: "AI Tools", en: "AI Tools" },
	subtitle: {
		zh: "集中使用洞察、内容生成和自动化工具，让 Campaign 从策略到执行更快完成。",
		en: "A single place for intelligence, content generation, and campaign automation tools.",
	},
	available: { zh: "可使用", en: "Available" },
	beta: { zh: "Beta", en: "Beta" },
	comingSoon: { zh: "即将上线", en: "Coming soon" },
	openTool: { zh: "打开工具", en: "Open tool" },
} as const;

const tools = [
	{
		title: { zh: "Competitor Tracking", en: "Competitor Tracking" },
		description: {
			zh: "追踪竞品达人策略、内容趋势与区域表现，发现可执行的 Campaign 机会。",
			en: "Track competitor creator strategies, content trends, and market performance.",
		},
		icon: Binoculars,
		href: "/tracking",
		status: "available" as const,
		accent: "from-[#e8f6f4] to-[#d8efec] text-[#16766e]",
	},
	{
		title: { zh: "Virtual Try On", en: "Virtual Try On" },
		description: {
			zh: "上传商品图和人物素材，快速生成可用于达人 Brief 的虚拟试穿视觉。",
			en: "Turn product and talent assets into virtual try-on visuals for creator briefs.",
		},
		icon: ScanFace,
		href: "/context-lab?tool=virtual-try-on",
		status: "beta" as const,
		accent: "from-[#fff0f5] to-[#f8e4ec] text-brand",
		featured: true,
	},
	{
		title: { zh: "Content Intelligence", en: "Content Intelligence" },
		description: {
			zh: "拆解达人视频的 Hook、卖点、脚本和高表现内容套路。",
			en: "Break down creator videos into hooks, selling points, scripts, and reusable patterns.",
		},
		icon: Images,
		href: "/context-lab",
		status: "available" as const,
		accent: "from-[#eef2fb] to-[#e1e8f8] text-[#415d9b]",
	},
	{
		title: { zh: "Brief Analyzer", en: "Brief Analyzer" },
		description: {
			zh: "从 PDF、文档、表格或图片中提取 Campaign 目标、预算和达人要求。",
			en: "Extract campaign goals, budget, platforms, and creator requirements from a brief.",
		},
		icon: FileSearch,
		href: "/campaigns/new?mode=brief",
		status: "available" as const,
		accent: "from-[#fff6e8] to-[#faecd2] text-[#a76518]",
	},
	{
		title: { zh: "Creator Lookalike", en: "Creator Lookalike" },
		description: {
			zh: "基于高表现达人快速扩展相似人群和下一批合作候选。",
			en: "Expand winning creator profiles into the next high-fit candidate pool.",
		},
		icon: Workflow,
		href: null,
		status: "comingSoon" as const,
		accent: "from-[#f1ecfb] to-[#e8ddf6] text-[#7650a8]",
	},
	{
		title: { zh: "AI Script Studio", en: "AI Script Studio" },
		description: {
			zh: "结合品牌卖点和内容趋势，批量生成达人脚本与创意方向。",
			en: "Generate creator scripts and creative directions from brand claims and content trends.",
		},
		icon: WandSparkles,
		href: null,
		status: "comingSoon" as const,
		accent: "from-[#edf7ee] to-[#dfefdf] text-[#397849]",
	},
];

export default function AIToolsPage() {
	const l = useLoc();
	return (
		<div className="min-h-full bg-surface px-6 py-7 lg:px-8">
			<div className="w-full">
				<header>
					<h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">
						{l(L.title)}
					</h1>
					<p className="mt-1.5 text-[13px] text-slate">{l(L.subtitle)}</p>
				</header>

				<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{tools.map((tool) => (
						<ToolCard key={tool.title.en} tool={tool} />
					))}
				</div>
			</div>
		</div>
	);
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
	const l = useLoc();
	const Icon = tool.icon;
	const body = (
		<>
			<div className="flex items-start justify-between gap-3">
				<span
					className={cn(
						"flex h-11 w-11 items-center justify-center rounded-[13px] bg-gradient-to-br",
						tool.accent,
					)}
				>
					<Icon className="h-5 w-5" />
				</span>
				<span
					className={cn(
						"rounded-full px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider",
						tool.status === "available"
							? "bg-soft-teal text-teal-text"
							: tool.status === "beta"
								? "bg-soft-pink text-brand"
								: "bg-surface-warm text-muted",
					)}
				>
					{l(L[tool.status])}
				</span>
			</div>
			<h2 className="mt-5 text-[16px] font-bold text-navy">{l(tool.title)}</h2>
			<p className="mt-2 min-h-[51px] text-[10.5px] leading-[17px] text-muted">
				{l(tool.description)}
			</p>
			<div
				className={cn(
					"mt-5 flex items-center justify-between border-t border-border pt-3.5 text-[10.5px] font-semibold",
					tool.href ? "text-brand" : "text-muted",
				)}
			>
				<span>{tool.href ? l(L.openTool) : l(L.comingSoon)}</span>
				{tool.href && (
					<ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
				)}
			</div>
		</>
	);
	const className = cn(
		"group block rounded-[16px] border bg-surface p-5 text-left shadow-card transition-all",
		"featured" in tool && tool.featured
			? "border-brand/25 ring-1 ring-brand/5"
			: "border-border",
		tool.href &&
			"hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev",
	);
	return tool.href ? (
		<Link href={tool.href} className={className}>
			{body}
		</Link>
	) : (
		<article className={className}>{body}</article>
	);
}
