"use client";

import { CampaignInfoPanel } from "@/components/campaign-drawer/info-panel";
import { CampaignPerformanceInsight } from "@/components/campaign-drawer/performance-insight";
import { CampaignPipeline } from "@/components/campaign-drawer/pipeline";
import { AIWorkflowConfig, mergeAIWorkflow } from "@/components/campaigns/ai-workflow-config";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

const L = {
  back: { zh: "返回 Campaign", en: "Back to campaigns" },
  campaignDetails: { zh: "Campaign 详情", en: "Campaign Details" },
  collaboration: { zh: "合作进度", en: "Collaboration" },
  performanceInsight: { zh: "效果洞察", en: "Performance Insight" },
  aiWorkflow: { zh: "AI 工作流", en: "AI Workflow" },
  workflowTitle: { zh: "AI 工作流配置", en: "AI Workflow Configuration" },
  workflowDescription: {
    zh: "管理 AI 在达人匹配、合作跟进与 Campaign 复盘阶段的自动执行方式。所有修改都会自动保存。",
    en: "Manage how AI automates creator matching, collaboration follow-up, and campaign reporting. Changes save automatically.",
  },
} as const;

type DetailTab = "details" | "collaboration" | "performance" | "workflow";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const l = useLoc();
  const campaign = useUIStore((state) => state.campaigns.find((item) => item.id === params.id));
  const updateCampaign = useUIStore((state) => state.updateCampaign);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  if (!campaign) return notFound();

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex h-12 flex-shrink-0 items-end border-b border-border bg-surface px-6">
        <Link
          href="/campaigns"
          aria-label={l(L.back)}
          title={l(L.back)}
          className="mb-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] text-slate transition-colors hover:bg-surface-warm hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        {(
          [
            { id: "details", label: l(L.campaignDetails) },
            { id: "collaboration", label: l(L.collaboration), count: campaign.collaborating },
            { id: "performance", label: l(L.performanceInsight) },
            { id: "workflow", label: l(L.aiWorkflow) },
          ] as { id: DetailTab; label: string; count?: number }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative h-12 px-5 text-[12.5px] font-medium transition-colors",
              activeTab === tab.id ? "text-brand" : "text-slate hover:text-ink",
            )}
          >
            <span className="inline-flex items-center gap-2">
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold tabular",
                    activeTab === tab.id ? "bg-soft-pink text-brand" : "bg-surface-warm text-muted",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
            <span
              className={cn(
                "absolute inset-x-3 bottom-0 h-[2px] rounded-full",
                activeTab === tab.id ? "bg-brand" : "bg-transparent",
              )}
            />
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === "details" && (
          <div className="h-full overflow-y-auto bg-surface p-6 lg:p-8">
            <CampaignInfoPanel campaign={campaign} standalone />
          </div>
        )}
        {activeTab === "collaboration" && <CampaignPipeline campaign={campaign} />}
        {activeTab === "performance" && (
          <div className="h-full overflow-y-auto bg-surface p-6 lg:p-8">
            <CampaignPerformanceInsight campaign={campaign} />
          </div>
        )}
        {activeTab === "workflow" && (
          <div className="h-full overflow-y-auto bg-surface p-6 lg:p-8">
            <CampaignAIWorkflow campaign={campaign} onUpdate={updateCampaign} />
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignAIWorkflow({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (id: string, patch: Partial<Campaign>) => void;
}) {
  const l = useLoc();
  const workflow = mergeAIWorkflow(campaign.aiWorkflow, l);

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <div>
        <h3 className="text-[20px] font-bold tracking-[-0.02em] text-navy">{l(L.workflowTitle)}</h3>
        <p className="mt-1 text-[11.5px] text-slate">{l(L.workflowDescription)}</p>
      </div>
      <div className="mt-5">
        <AIWorkflowConfig
          value={workflow}
          onChange={(aiWorkflow) =>
            onUpdate(campaign.id, {
              aiWorkflow,
              automation:
                aiWorkflow.autoMatchCreators ||
                aiWorkflow.autoOutreach ||
                aiWorkflow.autoCollaborationFollowUp
                  ? "full"
                  : "manual",
            })
          }
        />
      </div>
    </div>
  );
}
