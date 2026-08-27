"use client";

import { Switch } from "@/components/ui/switch";
import { useLoc } from "@/lib/i18n/use-i18n";
import type { CampaignAIWorkflow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BarChart3, Handshake, Mail, Search, Sparkles } from "lucide-react";

const L = {
  matchingTitle: { zh: "自动匹配达人", en: "Creator Matching" },
  matchingDescription: {
    zh: "AI 会结合 Campaign 信息与您的补充要求，持续推荐高匹配度达人。",
    en: "Find best-fit creators using your campaign brief and custom criteria.",
  },
  matchingRequirements: { zh: "达人匹配要求", en: "Matching criteria" },
  matchingHint: {
    zh: "可以用自然语言描述匹配需求，也可以加入参考达人案例。例如：需要 Base 在 US、10 万粉以上、互动率较高且审美符合品牌调性的达人；案例参考 www.instagram.com/username",
    en: "Describe your ideal creators in plain language. Include location, audience size, engagement, aesthetic, brand fit, or reference profiles. Example: US-based creators with 100K+ followers, strong engagement, and a premium visual style. Reference: www.instagram.com/username",
  },
  matchingPlaceholder: {
    zh: "描述地区、粉丝量、互动率、内容审美、品牌调性和参考达人……",
    en: "e.g. US-based beauty creators with 100K+ followers and strong engagement…",
  },
  collaborationTitle: { zh: "自动跟进达人合作", en: "Collaboration Follow-up" },
  collaborationDescription: {
    zh: "配置 AI 在建联、议价和合作确认阶段的自动执行方式。",
    en: "Automate outreach, rate negotiation, and collaboration confirmation.",
  },
  autoOutreach: { zh: "自动建联达人", en: "Outreach" },
  outreachDescription: {
    zh: "匹配完成后，AI 将使用下方模板自动发送合作邀请。",
    en: "Send a personalized collaboration invite when a match is ready.",
  },
  outreachTemplate: { zh: "建联邮件模板", en: "Template" },
  autoNegotiation: { zh: "自动砍价", en: "Pricing Negotiation" },
  negotiationDescription: {
    zh: "AI 将基于 Campaign 预算与报价范围自动进行议价。",
    en: "Respond to creator quotes using your budget and target rate.",
  },
  negotiationTemplate: { zh: "砍价模板", en: "Template" },
  autoFollowUp: { zh: "自动跟进达人合作", en: "Collaboration Confirmation" },
  followUpDescription: {
    zh: "AI 将持续跟进意向达人，并推动对方完成合作确认。",
    en: "Keep conversations moving until the collaboration is confirmed.",
  },
  confirmationTemplate: { zh: "合作确认模板", en: "Template" },
  reportTitle: { zh: "自动生成复盘报告", en: "Campaign Analysis" },
  reportDescription: {
    zh: "Campaign 完成后自动整理达人表现、内容效果与优化建议，为下一轮 Campaign 提供依据。",
    en: "Turn campaign results into performance insights and recommendations for what to do next.",
  },
  enabled: { zh: "已开启", en: "On" },
  disabled: { zh: "已关闭", en: "Off" },
  generateTemplate: { zh: "AI 一键生成模板", en: "Generate with AI" },
} as const;

type Localize = (value: { zh: string; en: string }) => string;

export function getDefaultAIWorkflow(l: Localize): CampaignAIWorkflow {
  return {
    autoMatchCreators: true,
    creatorMatchingRequirements: "",
    autoOutreach: true,
    outreachTemplate: l({
      zh: "Hi {{creator_name}}，我们正在为 {{campaign_name}} 寻找合适的内容创作者。你的内容风格与品牌非常契合，想邀请你了解这次合作。",
      en: "Hi {{creator_name}}, we think you'd be a great fit for {{campaign_name}}. We'd love to share the details and explore a collaboration.",
    }),
    autoNegotiation: true,
    negotiationTemplate: l({
      zh: "感谢你的报价。基于本次 Campaign 的预算，我们希望将合作费用调整至 {{target_rate}}。期待与你达成合作。",
      en: "Thanks for sharing your rate. Based on the campaign budget, could you work with {{target_rate}}? We'd love to make this collaboration happen.",
    }),
    autoCollaborationFollowUp: true,
    collaborationConfirmationTemplate: l({
      zh: "Hi {{creator_name}}，想跟进确认 {{campaign_name}} 的合作安排。请查看 Brief、交付内容与时间，并回复确认。",
      en: "Hi {{creator_name}}, just checking in on {{campaign_name}}. Please review the brief, deliverables, and timeline, and let us know if everything looks good.",
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
          status={l(value.autoMatchCreators ? L.enabled : L.disabled)}
        >
          <TemplateField label={l(L.matchingRequirements)} hint={l(L.matchingHint)}>
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
              icon={<Mail className="h-4 w-4" />}
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
                      patch({
                        outreachTemplate: l({
                          zh: "Hi {{creator_name}}，我们很喜欢你的内容风格，认为你非常适合 {{campaign_name}}。想邀请你了解 Campaign 详情，并探讨本次合作。",
                          en: "Hi {{creator_name}}, we love your content and think you'd be a strong fit for {{campaign_name}}. We'd love to share the campaign details and explore a collaboration.",
                        }),
                      })
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
              icon={<Sparkles className="h-4 w-4" />}
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
                      patch({
                        negotiationTemplate: l({
                          zh: "感谢你分享报价。结合 {{campaign_name}} 的预算与合作范围，我们希望以 {{target_rate}} 推进本次合作，期待听听你的想法。",
                          en: "Thanks for sharing your rate. Based on the scope and budget for {{campaign_name}}, we'd like to propose {{target_rate}}. Let us know if that could work for you.",
                        }),
                      })
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
              icon={<Handshake className="h-4 w-4" />}
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
                      patch({
                        collaborationConfirmationTemplate: l({
                          zh: "Hi {{creator_name}}，想与你确认 {{campaign_name}} 的合作安排。请查看 Brief、交付内容和时间节点，如果没有问题，请回复确认。",
                          en: "Hi {{creator_name}}, we'd like to confirm the next steps for {{campaign_name}}. Please review the brief, deliverables, and timeline, and let us know if everything looks good.",
                        }),
                      })
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
          status={l(value.autoReport ? L.enabled : L.disabled)}
        />
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
  status,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  status: string;
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
        <div className="flex items-center gap-2.5">
          <span
            className={cn("text-[10px] font-medium", enabled ? "text-teal-text" : "text-muted")}
          >
            {status}
          </span>
          <Switch checked={enabled} onCheckedChange={onToggle} aria-label={title} />
        </div>
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

function AutomationItem({
  icon,
  title,
  description,
  checked,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-soft-teal text-teal-text">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-[12.5px] font-semibold text-ink">{title}</h4>
          <p className="mt-1 text-[10px] leading-4 text-muted">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onToggle} aria-label={title} />
      </div>
      <div className={cn("ml-11 mt-4", !checked && "pointer-events-none opacity-45")}>
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
      className="inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-brand/20 bg-soft-pink/55 px-2.5 text-[9.5px] font-semibold text-brand transition-colors hover:border-brand/35 hover:bg-soft-pink"
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
      rows={4}
      className="w-full resize-y rounded-[10px] border border-border bg-page px-3.5 py-3 text-[11.5px] leading-5 text-ink outline-none transition-colors focus:border-brand/40"
    />
  );
}
