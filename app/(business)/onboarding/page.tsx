"use client";

import { useLoc } from "@/lib/i18n/use-i18n";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  Check,
  FilePlus2,
  Handshake,
  MessageSquareText,
  SearchCheck,
  Smile,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const L = {
  title: { zh: "快速上手", en: "Onboarding" },
  description: {
    zh: "先雇佣数字员工，再完成 Campaign 创建、达人匹配、合作跟进与效果复盘。",
    en: "Hire your digital employee, then complete campaign setup, creator matching, collaboration follow-up, and reporting.",
  },
  progress: { zh: "设置进度", en: "Setup progress" },
  completed: { zh: "已完成", en: "Completed" },
  continue: { zh: "继续设置", en: "Continue setup" },
  step: { zh: "步骤", en: "Step" },
  aiEyebrow: { zh: "AI 快速启动", en: "AI QUICK START" },
  aiTitle: {
    zh: "觉得太复杂了？没关系，AI 帮你一键搞定",
    en: "Feels too complex? Let AI set it up for you",
  },
  aiDescription: {
    zh: "告诉 Plus 数字员工你的品牌、产品和目标，它会通过对话帮你创建 Campaign、匹配达人、自动跟进合作并生成复盘报告。",
    en: "Tell your Plus digital employee about your brand, product, and goals. It will create the campaign, match creators, follow up on collaborations, and generate a report.",
  },
  aiAction: { zh: "让 AI 帮我开始", en: "Start with AI" },
  trial: { zh: "Plus · 14 天免费试用", en: "Plus · 14-day free trial" },
  manualHint: {
    zh: "也可以按照下方 SOP，一步一步完成设置",
    en: "Or follow the SOP below and complete each step manually",
  },
} as const;

const stepCopy = [
  {
    title: { zh: "雇佣数字员工", en: "Hire a digital employee" },
    description: {
      zh: "已默认雇佣 Plus 数字员工，新用户可免费使用全部 Plus 能力 14 天。",
      en: "Plus is hired by default, with all Plus capabilities free for new users for 14 days.",
    },
    href: "/employees",
    icon: Smile,
  },
  {
    title: { zh: "创建 Campaign", en: "Create a campaign" },
    description: {
      zh: "添加品牌、目标、预算、投放平台与达人地区要求。",
      en: "Set the brand, objective, budget, platforms, and creator market requirements.",
    },
    href: "/campaigns/new?mode=manual",
    icon: FilePlus2,
  },
  {
    title: { zh: "匹配达人", en: "Match creators" },
    description: {
      zh: "让 Plus AI 根据 Campaign 条件生成达人推荐，并建立首批候选名单。",
      en: "Let Plus AI recommend creators from campaign requirements and build a shortlist.",
    },
    href: "/creators",
    icon: SearchCheck,
  },
  {
    title: { zh: "AI 自动跟进达人合作", en: "AI follows up on collaborations" },
    description: {
      zh: "由 AI 推进建联、报价、合同、内容审核、发布与付款，并在需要时提醒你确认。",
      en: "Let AI advance outreach, offers, contracts, content review, publishing, and payments, asking for approval when needed.",
    },
    href: "/collaborations",
    icon: Handshake,
  },
  {
    title: { zh: "生成复盘报告", en: "Generate a performance report" },
    description: {
      zh: "在 Insight 聚合页生成并查看 Campaign 复盘报告，用结果优化下一轮 Campaign。",
      en: "Generate and review campaign reports in Insight, then use the results to improve the next campaign.",
    },
    href: "/insights",
    icon: BarChart3,
  },
] as const;

export default function OnboardingPage() {
  const l = useLoc();
  const campaignCount = useUIStore((state) => state.campaigns.length);
  const completedSteps = new Set([0, ...(campaignCount > 0 ? [1] : [])]);
  const completedCount = completedSteps.size;
  const percentage = Math.round((completedCount / stepCopy.length) * 100);

  return (
    <div className="min-h-full bg-surface px-6 py-7 lg:px-8">
      <div className="w-full">
        <header>
          <h1 className="text-[30px] font-bold tracking-[-0.03em] text-navy">{l(L.title)}</h1>
          <p className="mt-1.5 text-[13px] text-slate">{l(L.description)}</p>
        </header>

        <section className="relative mt-6 overflow-hidden rounded-[18px] border border-brand/20 bg-[linear-gradient(115deg,#fff0f5_0%,#fff8fb_48%,#eaf8f5_100%)] px-6 py-6 shadow-card lg:px-8 lg:py-7">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[16px] bg-brand text-white shadow-cta">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-white/70 px-2.5 py-1 text-[9.5px] font-bold text-brand">
                <Sparkles className="h-3 w-3" />
                {l(L.trial)}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand">
                {l(L.aiEyebrow)}
              </div>
              <h2 className="mt-2 text-[21px] font-bold tracking-[-0.025em] text-navy lg:text-[24px]">
                {l(L.aiTitle)}
              </h2>
              <p className="mt-2 max-w-[760px] text-[11.5px] leading-5 text-slate">
                {l(L.aiDescription)}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                document.querySelector<HTMLButtonElement>("[data-chat-trigger]")?.click()
              }
              className="inline-flex h-11 flex-shrink-0 items-center justify-center gap-2 rounded-[10px] bg-brand px-5 text-[11.5px] font-semibold text-white shadow-cta transition-colors hover:bg-brand-hover"
            >
              <MessageSquareText className="h-4 w-4" />
              {l(L.aiAction)}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-[14px] border border-border bg-surface px-5 py-4 shadow-card">
          <div className="flex items-center justify-between gap-4 text-[11px]">
            <span className="font-semibold text-ink">{l(L.progress)}</span>
            <span className="tabular font-semibold text-brand">
              {completedCount} / {stepCopy.length} · {percentage}%
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-warm">
            <div
              className="h-full rounded-full bg-brand transition-[width]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </section>

        <div className="mt-6 text-[11px] font-semibold text-slate">{l(L.manualHint)}</div>

        <div className="mt-3 divide-y divide-border overflow-hidden rounded-[14px] border border-border bg-surface shadow-card">
          {stepCopy.map((step, index) => {
            const done = completedSteps.has(index);
            const Icon = step.icon;
            return (
              <Link
                key={step.title.en}
                href={step.href}
                className="group flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-surface-warm/60 sm:flex-row sm:items-center"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px]",
                    done ? "bg-soft-teal text-teal-text" : "bg-surface-warm text-slate",
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {l(L.step)} {index + 1}
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-soft-teal px-2 py-0.5 text-[8.5px] font-semibold text-teal-text">
                        <Check className="h-2.5 w-2.5" />
                        {l(L.completed)}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[14px] font-semibold text-navy">
                    {l(step.title)}
                  </span>
                  <span className="mt-1 block text-[10.5px] leading-[17px] text-muted">
                    {l(step.description)}
                  </span>
                </span>
                <span className="flex flex-shrink-0 items-center gap-1 text-[10.5px] font-semibold text-brand">
                  {done ? l(L.completed) : l(L.continue)}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
