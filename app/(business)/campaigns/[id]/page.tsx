"use client";
import {
  Bot,
  Check,
  ChevronLeft,
  Eye,
  MoreHorizontal,
  Sparkles,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CampaignInfoPanel } from "@/components/campaign-drawer/info-panel";
import { CampaignPipeline } from "@/components/campaign-drawer/pipeline";
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

const L = {
  showInfo: { zh: "展示 Campaign 信息", en: "Show campaign info" },
  more: { zh: "更多", en: "More" },
} as const;

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
  const infoCollapsed = useUIStore((s) => s.campaignInfoCollapsed);
  const toggleInfo = useUIStore((s) => s.toggleCampaignInfo);
  const updateCampaign = useUIStore((s) => s.updateCampaign);
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
        {infoCollapsed && (
          <button
            type="button"
            onClick={toggleInfo}
            aria-label={l(L.showInfo)}
            title={l(L.showInfo)}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
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

      {/* Body — info column collapsible */}
      <div
        className={cn(
          "grid min-h-0 flex-1 transition-[grid-template-columns] duration-200 ease-out",
          infoCollapsed
            ? "grid-cols-[0px_minmax(0,1fr)]"
            : "grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]",
        )}
      >
        <div className={cn("overflow-hidden", infoCollapsed && "pointer-events-none")}>
          <CampaignInfoPanel campaign={campaign} />
        </div>
        <div className="min-w-0">
          <CampaignPipeline campaign={campaign} />
        </div>
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
    live: { tone: "teal", label: { zh: "进行中", en: "Live" } },
    outreach: { tone: "blue", label: { zh: "外联中", en: "Outreach" } },
    paused: { tone: "amber", label: { zh: "已暂停", en: "Paused" } },
    completed: { tone: "gray", label: { zh: "已完成", en: "Completed" } },
    risk: { tone: "pink", label: { zh: "风险", en: "At Risk" } },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{l(m.label)}</Badge>;
}
