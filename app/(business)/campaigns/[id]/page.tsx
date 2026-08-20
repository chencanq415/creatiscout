"use client";
import { Check, ChevronLeft, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { CampaignInfoPanel } from "@/components/campaign-drawer/info-panel";
import { CampaignPipeline } from "@/components/campaign-drawer/pipeline";
import { CampaignPerformanceInsight } from "@/components/campaign-drawer/performance-insight";
import { Switch } from "@/components/ui/switch";
import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import type { Campaign } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

const L = {
  back: { zh: "返回 Campaign", en: "Back to campaigns" },
  campaignDetails: { zh: "Campaign 详情", en: "Campaign Details" },
  collaboration: { zh: "合作进度", en: "Collaboration" },
  performanceInsight: { zh: "效果洞察", en: "Performance Insight" },
  aiWorkflow: { zh: "AI 工作流", en: "AI Workflow" },
} as const;

type DetailTab = "details" | "collaboration" | "performance" | "workflow";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const l = useLoc();
  const campaign = useUIStore((s) => s.campaigns.find((c) => c.id === params.id));
  const updateCampaign = useUIStore((s) => s.updateCampaign);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  if (!campaign) return notFound();

  return (
    <div className="flex h-[calc(100vh-60px)] min-h-0 flex-col bg-page">
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
        {activeTab === "workflow" && (
          <div className="h-full overflow-y-auto bg-page p-6 lg:p-8">
            <CampaignAIWorkflow campaign={campaign} onUpdate={updateCampaign} />
          </div>
        )}
      </div>
    </div>
  );
}

type EmailTemplateKey = keyof NonNullable<Campaign["aiWorkflow"]>["emailTemplates"];

const workflowCopy = {
  title: { zh: "AI 工作流", en: "AI Workflow" },
  description: {
    zh: "控制 AI 是否自动跟进达人，并配置不同阶段使用的邮件模板。",
    en: "Control AI follow-ups and configure the email templates used at each stage.",
  },
  autoFollowUp: { zh: "AI 自动跟进", en: "AI auto follow-up" },
  autoFollowUpOn: {
    zh: "已开启。AI 会按合作阶段自动发送邮件，并在需要你确认时提醒你。",
    en: "On. AI sends emails by collaboration stage and asks for approval when needed.",
  },
  autoFollowUpOff: {
    zh: "已关闭。所有达人跟进将由你手动发起。",
    en: "Off. All creator follow-ups must be started manually.",
  },
  templateTitle: { zh: "邮件模板配置", en: "Email templates" },
  templateDescription: {
    zh: "AI 会根据达人和 Campaign 信息自动替换变量。修改内容会自动保存。",
    en: "AI replaces variables with creator and campaign data. Changes save automatically.",
  },
  outreach: { zh: "首次建联", en: "Initial outreach" },
  followUp: { zh: "合作跟进", en: "Follow-up" },
  finalReminder: { zh: "最后提醒", en: "Final reminder" },
  saved: { zh: "已自动保存", en: "Saved automatically" },
  variables: { zh: "可用变量", en: "Available variables" },
} as const;

function CampaignAIWorkflow({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (id: string, patch: Partial<Campaign>) => void;
}) {
  const l = useLoc();
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplateKey>("outreach");
  const defaults: Record<EmailTemplateKey, string> = {
    outreach: l({
      zh: "Hi {{creator_name}}，我们正在为 {{campaign_name}} 寻找合适的内容创作者。你的内容风格与品牌非常契合，想邀请你了解这次合作。",
      en: "Hi {{creator_name}}, we're looking for creators for {{campaign_name}}. Your content feels like a strong fit for the brand, and we'd love to discuss a collaboration.",
    }),
    followUp: l({
      zh: "Hi {{creator_name}}，想跟进一下之前发送的 {{campaign_name}} 合作邀请。如果你有兴趣，我可以马上把 Brief 和合作条件发给你。",
      en: "Hi {{creator_name}}, just following up on our invitation for {{campaign_name}}. If you're interested, I can send the brief and collaboration terms right away.",
    }),
    finalReminder: l({
      zh: "Hi {{creator_name}}，这是关于 {{campaign_name}} 的最后一次跟进。如果时间不合适也没关系，期待之后有机会合作。",
      en: "Hi {{creator_name}}, this is our final follow-up for {{campaign_name}}. No worries if the timing isn't right—we'd love to work together in the future.",
    }),
  };
  const workflow = campaign.aiWorkflow ?? {
    autoFollowUp: campaign.automation !== "manual",
    emailTemplates: defaults,
  };
  const templates = [
    { id: "outreach" as const, label: l(workflowCopy.outreach) },
    { id: "followUp" as const, label: l(workflowCopy.followUp) },
    { id: "finalReminder" as const, label: l(workflowCopy.finalReminder) },
  ];

  const updateWorkflow = (patch: Partial<NonNullable<Campaign["aiWorkflow"]>>) => {
    onUpdate(campaign.id, {
      aiWorkflow: {
        ...workflow,
        ...patch,
        emailTemplates: patch.emailTemplates ?? workflow.emailTemplates,
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <div>
        <h3 className="text-[20px] font-bold tracking-[-0.02em] text-navy">
          {l(workflowCopy.title)}
        </h3>
        <p className="mt-1 text-[11.5px] text-slate">{l(workflowCopy.description)}</p>
      </div>

      <section className="mt-5 rounded-[14px] border border-border bg-surface p-5 shadow-card">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-soft-teal text-teal-text">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-ink">{l(workflowCopy.autoFollowUp)}</div>
            <p className="mt-1 text-[10.5px] leading-[17px] text-muted">
              {l(
                workflow.autoFollowUp ? workflowCopy.autoFollowUpOn : workflowCopy.autoFollowUpOff,
              )}
            </p>
          </div>
          <Switch
            checked={workflow.autoFollowUp}
            onCheckedChange={(checked) => {
              updateWorkflow({ autoFollowUp: checked });
              onUpdate(campaign.id, { automation: checked ? "full" : "manual" });
            }}
            aria-label={l(workflowCopy.autoFollowUp)}
          />
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
        <div className="flex items-start gap-3 border-b border-border px-5 py-5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-soft-pink text-brand">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-[14px] font-semibold text-navy">{l(workflowCopy.templateTitle)}</h3>
            <p className="mt-1 text-[10.5px] text-muted">{l(workflowCopy.templateDescription)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[210px_1fr]">
          <div className="border-b border-border p-3 lg:border-b-0 lg:border-r">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setActiveTemplate(template.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-[9px] px-3 py-2.5 text-left text-[11.5px] font-medium transition-colors",
                  activeTemplate === template.id
                    ? "bg-soft-pink text-brand"
                    : "text-slate hover:bg-surface-warm hover:text-ink",
                )}
              >
                {template.label}
                {activeTemplate === template.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor={`template-${activeTemplate}`}
                className="text-[12px] font-semibold text-ink"
              >
                {templates.find((template) => template.id === activeTemplate)?.label}
              </label>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-teal-text">
                <Check className="h-3 w-3" />
                {l(workflowCopy.saved)}
              </span>
            </div>
            <textarea
              id={`template-${activeTemplate}`}
              value={workflow.emailTemplates[activeTemplate]}
              onChange={(event) =>
                updateWorkflow({
                  emailTemplates: {
                    ...workflow.emailTemplates,
                    [activeTemplate]: event.target.value,
                  },
                })
              }
              rows={7}
              className="mt-3 w-full resize-y rounded-[10px] border border-border bg-page px-3.5 py-3 text-[11.5px] leading-5 text-ink outline-none transition-colors focus:border-brand/40"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[9.5px] font-medium text-muted">
                {l(workflowCopy.variables)}
              </span>
              {["{{creator_name}}", "{{campaign_name}}", "{{brand_name}}"].map((variable) => (
                <code
                  key={variable}
                  className="rounded-md bg-surface-warm px-2 py-1 text-[9.5px] text-slate"
                >
                  {variable}
                </code>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
