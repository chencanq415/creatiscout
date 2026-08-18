"use client";
import {
  Bot,
  Check,
  ChevronLeft,
  MoreHorizontal,
  Sparkles,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CampaignInfoPanel } from "@/components/campaign-drawer/info-panel";
import { CampaignPipeline } from "@/components/campaign-drawer/pipeline";
import { CampaignPerformanceInsight } from "@/components/campaign-drawer/performance-insight";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { useT, useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

const L = {
  more: { zh: "更多", en: "More" },
  campaignDetails: { zh: "Campaign 详情", en: "Campaign Details" },
  collaboration: { zh: "合作进度", en: "Collaboration" },
  performanceInsight: { zh: "效果洞察", en: "Performance Insight" },
} as const;

type DetailTab = "details" | "collaboration" | "performance";

type AutomationMode = NonNullable<Campaign["automation"]>;

const automationKeys: Record<
  AutomationMode,
  { labelKey: string; descKey: string; icon: React.ComponentType<{ className?: string }> }
> = {
  full: {
    labelKey: "automation.full",
    descKey: "automation.fullDesc",
    icon: Sparkles,
  },
  semi: {
    labelKey: "automation.semi",
    descKey: "automation.semiDesc",
    icon: Bot,
  },
  manual: {
    labelKey: "automation.manual",
    descKey: "automation.manualDesc",
    icon: UserCog,
  },
};

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const t = useT();
  const l = useLoc();
  const campaign = useUIStore((s) => s.campaigns.find((c) => c.id === params.id));
  const updateCampaign = useUIStore((s) => s.updateCampaign);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  if (!campaign) return notFound();

  const automation = campaign.automation ?? "full";
  const autoMeta = automationKeys[automation];

  return (
    <div className="flex h-[calc(100vh-60px)] min-h-0 flex-col bg-page">
      {/* Sticky header */}
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-border bg-surface px-6">
        <Link
          href="/campaigns"
          className="flex flex-shrink-0 items-center gap-1 rounded-[8px] px-2 py-1.5 text-[12px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
          Campaigns
        </Link>
        <div className="h-5 w-px flex-shrink-0 bg-border" />
        <h2 className="truncate text-[15px] font-semibold tracking-tight text-ink">
          {l(campaign.name)}
        </h2>
        <StatusBadge status={campaign.status} />
        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          {/* Automation mode indicator — defaults to Full Auto */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-teal/60" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
            <span className="text-[11.5px] font-medium text-teal-text">
              {t(autoMeta.labelKey)}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={l(L.more)}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6} className="w-[280px]">
              <div className="px-3 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
                {t("automation.label")}
              </div>
              {(Object.keys(automationKeys) as AutomationMode[]).map((m) => {
                const meta = automationKeys[m];
                const Icon = meta.icon;
                const active = automation === m;
                return (
                  <DropdownMenuItem
                    key={m}
                    onClick={() => updateCampaign(campaign.id, { automation: m })}
                    className="flex items-start gap-2.5 px-3 py-2.5"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px]",
                        active ? "bg-soft-teal text-teal-text" : "bg-surface-warm text-slate",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium text-ink">{t(meta.labelKey)}</span>
                        {active && <Check className="h-3.5 w-3.5 text-teal-text" strokeWidth={3} />}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-muted">
                        {t(meta.descKey)}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-slate">{t("automation.viewLogs")}</DropdownMenuItem>
              <DropdownMenuItem className="text-slate">{t("automation.exportReport")}</DropdownMenuItem>
              <DropdownMenuItem className="text-amber-text">{t("automation.archive")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex h-12 flex-shrink-0 items-end border-b border-border bg-surface px-6">
        {([
          { id: "details", label: l(L.campaignDetails) },
          { id: "collaboration", label: l(L.collaboration) },
          { id: "performance", label: l(L.performanceInsight) },
        ] as { id: DetailTab; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative h-12 px-5 text-[12.5px] font-medium transition-colors",
              activeTab === tab.id ? "text-brand" : "text-slate hover:text-ink",
            )}
          >
            {tab.label}
            <span className={cn("absolute inset-x-3 bottom-0 h-[2px] rounded-full", activeTab === tab.id ? "bg-brand" : "bg-transparent")} />
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === "details" && (
          <div className="h-full overflow-y-auto bg-page p-6 lg:p-8">
            <CampaignInfoPanel campaign={campaign} standalone />
          </div>
        )}
        {activeTab === "collaboration" && <CampaignPipeline campaign={campaign} />}
        {activeTab === "performance" && (
          <div className="h-full overflow-y-auto bg-page p-6 lg:p-8">
            <CampaignPerformanceInsight campaign={campaign} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Campaign["status"] }) {
  const l = useLoc();
  const map: Record<
    Campaign["status"],
    { tone: "teal" | "blue" | "amber" | "gray" | "pink"; label: { zh: string; en: string } }
  > = {
    draft: { tone: "gray", label: { zh: "草稿", en: "Draft" } },
    active: { tone: "teal", label: { zh: "进行中", en: "Active" } },
    paused: { tone: "amber", label: { zh: "已暂停", en: "Paused" } },
    closed: { tone: "blue", label: { zh: "已结束", en: "Closed" } },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{l(m.label)}</Badge>;
}
