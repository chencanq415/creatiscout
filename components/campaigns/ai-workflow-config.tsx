"use client";

import { Switch } from "@/components/ui/switch";
import { useLoc } from "@/lib/i18n/use-i18n";
import type { CampaignAIWorkflow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BarChart3, Handshake, Search, Sparkles } from "lucide-react";

const L = {
  matchingTitle: { zh: "自动匹配达人", en: "Creator Matching" },
  matchingDescription: {
    zh: "根据您的营销活动和达人要求，自动匹配合适的达人。",
    en: "Automatically match suitable creators based on your campaign and creator requirements.",
  },
  matchingRequirements: { zh: "达人要求", en: "Matching criteria" },
  matchingPlaceholder: {
    zh: "你可以用简单直白的文字描述要求，也可以提供达人主页链接，AI 会自动分析并匹配。例如：Base 在 US、10 万粉以上、互动率高且视觉风格高级的美妆达人；参考：www.instagram.com/username",
    en: "Describe your requirements in simple terms or add creator profile links for AI to analyze and match. Example: US-based beauty creators with 100K+ followers, strong engagement, and a premium visual style. Reference: www.instagram.com/username",
  },
  collaborationTitle: { zh: "自动跟进合作", en: "Collaboration Follow-up" },
  collaborationDescription: {
    zh: "配置 AI 在建联、议价和合作确认阶段的自动执行方式。",
    en: "Automate outreach, rate negotiation, and collaboration confirmation.",
  },
  autoOutreach: { zh: "自动建联", en: "Outreach" },
  outreachDescription: {
    zh: "自动建联您 Shortlist 列表中的达人。",
    en: "Automatically reach out to creators in your shortlist.",
  },
  outreachTemplate: { zh: "模板", en: "Template" },
  autoNegotiation: { zh: "自动砍价", en: "Pricing Negotiation" },
  negotiationDescription: {
    zh: "基于营销活动的预算和达人的数据表现，自动为达人报价进行砍价。",
    en: "Automatically negotiate creator quotes using your campaign budget and creator performance data.",
  },
  negotiationTemplate: { zh: "模板", en: "Template" },
  autoFollowUp: { zh: "自动跟进合作", en: "Collaboration Confirmation" },
  followUpDescription: {
    zh: "确认合作后，向达人发送合作确认并自动跟进回复，推动达人及时完成二次确认。",
    en: "Automatically send a confirmation invitation and follow up after you approve a collaboration, until the creator confirms.",
  },
  confirmationTemplate: { zh: "模板", en: "Template" },
  reportTitle: { zh: "自动生成复盘报告", en: "Campaign Analysis" },
  reportDescription: {
    zh: "营销活动完成后自动整理达人表现、内容效果与优化建议，为下一轮营销活动提供依据。",
    en: "Turn campaign results into performance insights and recommendations for what to do next.",
  },
  generateTemplate: { zh: "AI 生成", en: "Generate with AI" },
} as const;

type Localize = (value: { zh: string; en: string }) => string;

export function getDefaultAIWorkflow(l: Localize): CampaignAIWorkflow {
  return {
    autoMatchCreators: true,
    creatorMatchingRequirements: "",
    autoOutreach: true,
    outreachTemplate: l({
      zh: "主题：{{campaign_name}} 合作邀请\n\nHi {{creator_name}}，\n\n我们是 {{brand_name}} 团队，目前正在为 {{campaign_name}} 寻找内容创作者。我们很喜欢你的内容风格与受众互动表现，认为你与本次营销活动非常契合。\n\n我们希望邀请你了解本次合作的 Brief、交付内容与合作预算。如有兴趣，请回复此邮件，我们会第一时间发送完整合作信息。\n\n期待与你合作，\n{{brand_name}} 团队",
      en: "Subject: Collaboration invitation — {{campaign_name}}\n\nHi {{creator_name}},\n\nWe’re the {{brand_name}} team and are currently inviting creators for {{campaign_name}}. We love your content style and audience engagement, and believe you could be a strong fit for this campaign.\n\nWe’d be happy to share the brief, deliverables, and collaboration budget. If you’re interested, please reply to this email and we’ll send the full details.\n\nBest regards,\nThe {{brand_name}} team",
    }),
    autoNegotiation: true,
    negotiationTemplate: l({
      zh: "主题：{{campaign_name}} 合作报价确认\n\nHi {{creator_name}}，\n\n感谢你分享报价。结合本次营销活动的预算、合作范围以及你的内容表现，我们希望以 {{target_rate}} 推进本次合作。\n\n若该报价可行，请回复确认；如有任何问题，也欢迎告诉我们，我们愿意进一步沟通合作细节。\n\nBest regards,\n{{brand_name}} 团队",
      en: "Subject: Rate proposal for {{campaign_name}}\n\nHi {{creator_name}},\n\nThank you for sharing your rate. Based on this campaign’s budget, scope, and your content performance, we’d like to propose {{target_rate}} for this collaboration.\n\nPlease let us know if this works for you. We’re also happy to discuss any questions or details.\n\nBest regards,\nThe {{brand_name}} team",
    }),
    autoCollaborationFollowUp: true,
    collaborationConfirmationTemplate: l({
      zh: "主题：请确认 {{campaign_name}} 合作安排\n\nHi {{creator_name}}，\n\n很高兴确认你已入选 {{campaign_name}}。请查看已发送的合作 Brief、交付内容、发布时间和报酬安排。\n\n如确认无误，请直接回复“确认合作”；如需调整，请在回复中告知我们。我们会持续跟进，确保合作顺利开始。\n\nBest regards,\n{{brand_name}} 团队",
      en: "Subject: Please confirm your collaboration for {{campaign_name}}\n\nHi {{creator_name}},\n\nWe’re pleased to confirm that you’ve been selected for {{campaign_name}}. Please review the collaboration brief, deliverables, publishing timeline, and compensation details.\n\nIf everything looks good, please reply to confirm your participation. If you need any adjustments, let us know and we’ll be happy to help.\n\nBest regards,\nThe {{brand_name}} team",
    }),
    autoReport: true,
  };
}

export function mergeAIWorkflow(
  workflow: CampaignAIWorkflow | undefined,
  l: Localize,
): CampaignAIWorkflow {
  return { ...getDefaultAIWorkflow(l), ...(workflow ?? {}) };
}

export const aiWorkflowStepLabels = [L.matchingTitle, L.collaborationTitle, L.reportTitle] as const;

export function AIWorkflowConfig({
  value,
  onChange,
  activeStep,
  sectionIds,
}: {
  value: CampaignAIWorkflow;
  onChange: (value: CampaignAIWorkflow) => void;
  activeStep?: number;
  sectionIds?: [string, string, string];
}) {
  const l = useLoc();
  const patch = (next: Partial<CampaignAIWorkflow>) => onChange({ ...value, ...next });
  const show = (step: number) => activeStep === undefined || activeStep === step;

  return (
    <div className="space-y-5">
      {show(0) && (
        <WorkflowSection
          id={sectionIds?.[0]}
          icon={<Search className="h-4 w-4" />}
          title={l(L.matchingTitle)}
          description={l(L.matchingDescription)}
          enabled={value.autoMatchCreators}
          onToggle={(autoMatchCreators) => patch({ autoMatchCreators })}
        >
          <TemplateField label={l(L.matchingRequirements)}>
            <textarea
              value={value.creatorMatchingRequirements}
              onChange={(event) => patch({ creatorMatchingRequirements: event.target.value })}
              rows={6}
              placeholder={l(L.matchingPlaceholder)}
              className="w-full resize-y rounded-[10px] border border-border bg-page px-3.5 py-3 text-[11.5px] leading-5 text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand/40"
            />
          </TemplateField>
        </WorkflowSection>
      )}

      {show(1) && (
        <section
          id={sectionIds?.[1]}
          className="scroll-mt-20 overflow-hidden rounded-[16px] border border-border bg-surface shadow-card"
        >
          <SectionHeader
            icon={<Handshake className="h-4 w-4" />}
            title={l(L.collaborationTitle)}
            description={l(L.collaborationDescription)}
          />
          <div className="divide-y divide-border px-5">
            <AutomationItem
              title={l(L.autoOutreach)}
              description={l(L.outreachDescription)}
              checked={value.autoOutreach}
              onToggle={(autoOutreach) => patch({ autoOutreach })}
            >
              <TemplateField
                label={l(L.outreachTemplate)}
                action={
                  <GenerateTemplateButton
                    label={l(L.generateTemplate)}
                    onClick={() =>
                      patch({ outreachTemplate: getDefaultAIWorkflow(l).outreachTemplate })
                    }
                  />
                }
              >
                <WorkflowTextarea
                  value={value.outreachTemplate}
                  onChange={(outreachTemplate) => patch({ outreachTemplate })}
                />
              </TemplateField>
            </AutomationItem>
            <AutomationItem
              title={l(L.autoNegotiation)}
              description={l(L.negotiationDescription)}
              checked={value.autoNegotiation}
              onToggle={(autoNegotiation) => patch({ autoNegotiation })}
            >
              <TemplateField
                label={l(L.negotiationTemplate)}
                action={
                  <GenerateTemplateButton
                    label={l(L.generateTemplate)}
                    onClick={() =>
                      patch({ negotiationTemplate: getDefaultAIWorkflow(l).negotiationTemplate })
                    }
                  />
                }
              >
                <WorkflowTextarea
                  value={value.negotiationTemplate}
                  onChange={(negotiationTemplate) => patch({ negotiationTemplate })}
                />
              </TemplateField>
            </AutomationItem>
            <AutomationItem
              title={l(L.autoFollowUp)}
              description={l(L.followUpDescription)}
              checked={value.autoCollaborationFollowUp}
              onToggle={(autoCollaborationFollowUp) => patch({ autoCollaborationFollowUp })}
            >
              <TemplateField
                label={l(L.confirmationTemplate)}
                action={
                  <GenerateTemplateButton
                    label={l(L.generateTemplate)}
                    onClick={() =>
                      patch({ collaborationConfirmationTemplate: getDefaultAIWorkflow(l).collaborationConfirmationTemplate })
                    }
                  />
                }
              >
                <WorkflowTextarea
                  value={value.collaborationConfirmationTemplate}
                  onChange={(collaborationConfirmationTemplate) =>
                    patch({ collaborationConfirmationTemplate })
                  }
                />
              </TemplateField>
            </AutomationItem>
          </div>
        </section>
      )}

      {show(2) && (
        <WorkflowSection
          id={sectionIds?.[2]}
          icon={<BarChart3 className="h-4 w-4" />}
          title={l(L.reportTitle)}
          description={l(L.reportDescription)}
          enabled={value.autoReport}
          onToggle={(autoReport) => patch({ autoReport })}
        ><AnalysisPreview /></WorkflowSection>
      )}
    </div>
  );
}

function WorkflowSection({
  id,
  icon,
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 overflow-hidden rounded-[16px] border border-border bg-surface shadow-card"
    >
      <div className="flex items-start gap-4 border-b border-border px-5 py-5">
        <SectionIcon>{icon}</SectionIcon>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-semibold text-navy">{title}</h3>
          <p className="mt-1 text-[10.5px] leading-[17px] text-muted">{description}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} aria-label={title} />
      </div>
      {children && (
        <div className={cn("p-5", !enabled && "pointer-events-none opacity-45")}>{children}</div>
      )}
    </section>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-border px-5 py-5">
      <SectionIcon>{icon}</SectionIcon>
      <div>
        <h3 className="text-[14px] font-semibold text-navy">{title}</h3>
        <p className="mt-1 text-[10.5px] leading-[17px] text-muted">{description}</p>
      </div>
    </div>
  );
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-soft-pink text-brand">
      {children}
    </span>
  );
}

function AnalysisPreview() {
  const l = useLoc();
  return <div className="flex items-center gap-4 rounded-[10px] border border-dashed border-border-strong bg-surface-warm/55 p-4"><div className="flex h-16 w-24 shrink-0 items-end gap-1 rounded-[8px] bg-white p-3 shadow-card"><span className="h-4 flex-1 rounded-sm bg-brand/25" /><span className="h-7 flex-1 rounded-sm bg-brand/45" /><span className="h-10 flex-1 rounded-sm bg-brand" /><span className="h-6 flex-1 rounded-sm bg-brand/35" /></div><div><p className="text-[11px] font-semibold text-ink">{l({ zh: "营销活动完成后生成分析报告", en: "Analysis will be generated when the campaign is complete" })}</p><p className="mt-1 text-[9.5px] leading-4 text-muted">{l({ zh: "报告将汇总达人表现、内容效果与下一轮优化建议。", en: "It will summarize creator performance, content results, and recommendations for the next campaign." })}</p></div></div>;
}

function AutomationItem({
  title,
  description,
  checked,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-[12.5px] font-semibold text-ink">{title}</h4>
          <p className="mt-1 text-[10px] leading-4 text-muted">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onToggle} aria-label={title} />
      </div>
      <div className={cn("mt-4", !checked && "pointer-events-none opacity-45")}>
        {children}
      </div>
    </div>
  );
}

function GenerateTemplateButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-[5px] px-1.5 py-1 text-[9.5px] font-medium text-brand transition-colors hover:bg-soft-pink"
    >
      <Sparkles className="h-3 w-3" />
      {label}
    </button>
  );
}

function TemplateField({
  label,
  hint,
  action,
  children,
}: { label: string; hint?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="block">
      <div className="mb-1.5 flex min-h-7 items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-ink">{label}</span>
        {action}
      </div>
      {children}
      {hint && (
        <span className="mt-2 block max-w-[820px] text-[9.5px] leading-4 text-muted">{hint}</span>
      )}
    </div>
  );
}

function WorkflowTextarea({
  value,
  onChange,
}: { value: string; onChange: (value: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={Math.max(9, value.split("\n").length + 1)}
      className="w-full resize-y rounded-[10px] border border-border bg-page px-3.5 py-3 text-[11.5px] leading-5 text-ink outline-none transition-colors focus:border-brand/40"
    />
  );
}
