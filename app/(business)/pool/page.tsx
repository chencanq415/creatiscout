"use client";
import { DedupLibrary } from "@/components/pool/dedup-library";
import { PrivatePoolView } from "@/components/pool/private-pool-view";
import { CreatorsNav } from "@/components/creators-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoc } from "@/lib/i18n/use-i18n";
import { ShieldCheck, Users } from "lucide-react";

const L = {
	title: { zh: "达人管理", en: "Creators" },
	description: {
		zh: "管理私域达人资产、客户名单与排重结果。",
		en: "Manage private creator assets, client lists, and deduplication results.",
	},
	tabPool: { zh: "私域达人", en: "Private Creators" },
	tabDedup: { zh: "客户排重达人库", en: "Client Dedup Library" },
} as const;

export default function PoolPage() {
	const l = useLoc();

	return (
		<div className="space-y-5 p-7 lg:p-8">
			<div>
				<h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">
					{l(L.title)}
				</h1>
				<p className="mt-1.5 text-[13px] text-slate">{l(L.description)}</p>
				<CreatorsNav active="private" className="mt-4" />
			</div>
			<Tabs defaultValue="pool">
				<TabsList>
					<TabsTrigger value="pool">
						<Users className="mr-1 h-3.5 w-3.5" /> {l(L.tabPool)}
					</TabsTrigger>
					<TabsTrigger value="dedup">
						<ShieldCheck className="mr-1 h-3.5 w-3.5" /> {l(L.tabDedup)}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pool">
					<PrivatePoolView />
				</TabsContent>
				<TabsContent value="dedup">
					<DedupLibrary />
				</TabsContent>
			</Tabs>
		</div>
	);
}
