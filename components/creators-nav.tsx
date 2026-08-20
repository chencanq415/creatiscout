"use client";

import { useLoc } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs = [
	{
		id: "matching",
		href: "/creators",
		label: { zh: "AI 智能匹配", en: "AI Matching" },
	},
	{
		id: "marketplace",
		href: "/creators?tab=marketplace",
		label: { zh: "达人市场", en: "Creator Marketplace" },
	},
	{
		id: "private",
		href: "/pool",
		label: { zh: "私域达人", en: "Private Creators" },
	},
] as const;

export type CreatorsNavTab = (typeof tabs)[number]["id"];

export function CreatorsNav({
	active,
	className,
}: {
	active: CreatorsNavTab;
	className?: string;
}) {
	const l = useLoc();
	return (
		<nav
			className={cn("flex h-12 items-end border-b border-border", className)}
			aria-label="Creators"
		>
			{tabs.map((tab) => (
				<Link
					key={tab.id}
					href={tab.href}
					className={cn(
						"relative flex h-12 items-center px-5 text-[12.5px] font-semibold transition-colors",
						active === tab.id ? "text-brand" : "text-slate hover:text-ink",
					)}
				>
					{l(tab.label)}
					<span
						className={cn(
							"absolute inset-x-3 bottom-0 h-[2px] rounded-full",
							active === tab.id ? "bg-brand" : "bg-transparent",
						)}
					/>
				</Link>
			))}
		</nav>
	);
}
