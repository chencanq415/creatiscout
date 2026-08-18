"use client";

import {
  ArrowRight,
  Check,
  Coins,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { LText } from "@/lib/i18n/dict";
import { useLoc } from "@/lib/i18n/use-i18n";
import { cn } from "@/lib/utils";

const PLAN_KEY = "creatiscout.employee.plan.v2";

type PlanId = "free" | "plus" | "pro" | "enterprise";

type Plan = {
  id: PlanId;
  name: string;
  avatarPosition: string;
  highlight: LText;
  price: string;
  priceSuffix?: LText;
  badge?: LText;
  pool: LText;
  features: LText[];
};

const copy = {
  onboardingEyebrow: {
    zh: "入职第一步 · 雇佣你的数字员工",
    en: "FIRST DAY · HIRE YOUR DIGITAL EMPLOYEE",
  },
  manageEyebrow: {
    zh: "DIGITAL EMPLOYEE · 账号与能力升级",
    en: "DIGITAL EMPLOYEE · TEAM & PLAN",
  },
  onboardingTitle: {
    zh: "先选一位数字员工，再开始你的 Campaign",
    en: "Hire your digital employee before starting a campaign",
  },
  manageTitle: {
    zh: "管理你的数字员工",
    en: "Manage your digital employee",
  },
  onboardingSubtitle: {
    zh: "这不是一组软件功能，而是一位会替你工作的 KOL 运营。选好员工后，才能进入工作台。",
    en: "This is not a bundle of software features. It is a KOL operator who works for you. Hire one to enter the workspace.",
  },
  manageSubtitle: {
    zh: "根据 Campaign 规模升级员工资历，或把完整营销交付交给 Enterprise 团队。",
    en: "Upgrade as campaign volume grows, or let Enterprise manage the entire campaign for you.",
  },
  selected: { zh: "已选中", en: "Selected" },
  current: { zh: "当前员工", en: "Current employee" },
  hire: { zh: "确认雇佣并进入工作台", en: "Hire and enter workspace" },
  upgrade: { zh: "升级至", en: "Upgrade to" },
  bookDemo: { zh: "预约 Enterprise Demo", en: "Book a demo" },
  demoRequested: { zh: "已提交预约意向", en: "Demo request received" },
  saved: { zh: "员工方案已更新", en: "Employee plan updated" },
  selectionHint: { zh: "已选方案", en: "Selected plan" },
  creditTitle: { zh: "Credit 可以单独充值", en: "Credits can be topped up separately" },
  creditDescription: {
    zh: "不升级员工也可以按需增加达人搜索、批量建联和任务运行额度。",
    en: "Add creator searches, bulk outreach, and task runs without changing your employee plan.",
  },
  topUp: { zh: "查看 Credit 充值", en: "Explore credit top-ups" },
  flexible: { zh: "灵活定价", en: "Flexible" },
  perMonth: { zh: "/ 月", en: "/ month" },
  mandatory: { zh: "完成选择后才能进入产品", en: "Choose an employee to continue" },
} as const;

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    avatarPosition: "0% 0%",
    highlight: {
      zh: "自动找人，释放重复人力",
      en: "Automated discovery, less manual work",
    },
    price: "$0",
    priceSuffix: copy.perMonth,
    pool: { zh: "2,000 位达人池", en: "2,000 creator pool" },
    features: [
      { zh: "同时运行 1 个 Campaign", en: "Run 1 campaign at a time" },
      { zh: "自动寻找并筛选目标达人", en: "Find and shortlist creators automatically" },
      { zh: "自动建联、催回复与持续跟进", en: "Automate outreach, nudges, and follow-ups" },
    ],
  },
  {
    id: "plus",
    name: "Plus",
    avatarPosition: "100% 0%",
    highlight: {
      zh: "可靠执行，省力更省心",
      en: "Reliable execution, effortless and worry-free",
    },
    price: "$14.99",
    priceSuffix: copy.perMonth,
    badge: { zh: "推荐雇佣", en: "Most popular" },
    pool: { zh: "100,000 位达人池", en: "100,000 creator pool" },
    features: [
      { zh: "自动理解 Brief 并创建 Campaign", en: "Understand briefs and create campaigns" },
      { zh: "单次批量搜索、建联 500+ 位达人", en: "Search and contact 500+ creators per campaign" },
      { zh: "自动处理首轮回复并持续追进", en: "Handle first replies and keep following up" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    avatarPosition: "0% 100%",
    highlight: {
      zh: "专业洞察，不仅找人，更持续优化",
      en: "Expert insights that find and continuously optimize",
    },
    price: "$79.99",
    priceSuffix: copy.perMonth,
    pool: { zh: "1.5 亿全量达人池", en: "Full 150M creator pool" },
    features: [
      { zh: "包含 Plus 的全部搜索与建联能力", en: "Everything in Plus for search and outreach" },
      { zh: "跨市场、跨平台批量匹配达人", en: "Match creators across markets and platforms" },
      { zh: "自动生成 Campaign Insight Reports", en: "Generate campaign insight reports" },
      { zh: "用历史表现优化下一轮选人策略", en: "Optimize the next shortlist using past performance" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    avatarPosition: "100% 100%",
    highlight: {
      zh: "从精准找人到完整履约，用数据带动下一轮增长",
      en: "From precise creator matching to complete delivery, data powers every next round",
    },
    price: "Flexible",
    pool: { zh: "全量达人 + 专属数据策略", en: "Full creator pool + dedicated data strategy" },
    features: [
      { zh: "Campaign 规划、达人搜索与批量建联", en: "Campaign planning, creator search, and outreach" },
      { zh: "报价沟通、稿件审核与修改推进", en: "Negotiation, draft review, and revision management" },
      { zh: "发布凭证提交、履约进度与异常处理", en: "Publishing proof, fulfillment tracking, and issue handling" },
      { zh: "打款支付、对账与完整交付归档", en: "Payments, reconciliation, and delivery records" },
      { zh: "数据驱动决策与持续营销支持", en: "Data-led decisions and ongoing marketing support" },
    ],
  },
];

function isPlanId(value: string | null): value is PlanId {
  return value === "free" || value === "plus" || value === "pro" || value === "enterprise";
}

export function FirstVisitOnboarding() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const forcePreview = new URLSearchParams(window.location.search).get("onboarding") === "1";
    setOpen(forcePreview || !isPlanId(window.localStorage.getItem(PLAN_KEY)));
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/55 p-3 backdrop-blur-[3px]"
    >
      <div className="max-h-[96vh] w-full max-w-[1260px] overflow-y-auto rounded-[16px] border border-white/50 bg-surface shadow-floating animate-fade-in">
        <DigitalEmployeeOnboarding
          modal
          onComplete={() => {
            setOpen(false);
            router.replace("/campaigns");
          }}
        />
      </div>
    </div>
  );
}

export function DigitalEmployeeOnboarding({
  modal = false,
  onComplete,
}: {
  modal?: boolean;
  onComplete?: () => void;
}) {
  const l = useLoc();
  const [selected, setSelected] = useState<PlanId>("plus");
  const [currentPlan, setCurrentPlan] = useState<PlanId | null>(modal ? null : "free");
  const [saved, setSaved] = useState(false);
  const [demoRequested, setDemoRequested] = useState(false);
  const selectedPlan = plans.find((plan) => plan.id === selected) ?? plans[1];
  const avatarRoster = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/avatars/digital-employees-roster-female-v1.png`;

  useEffect(() => {
    if (modal) return;
    const stored = window.localStorage.getItem(PLAN_KEY);
    if (isPlanId(stored)) {
      setCurrentPlan(stored);
      setSelected(stored);
    }
  }, [modal]);

  const complete = () => {
    if (selected === "enterprise") {
      setDemoRequested(true);
      return;
    }
    window.localStorage.setItem(PLAN_KEY, selected);
    setCurrentPlan(selected);
    if (modal) {
      onComplete?.();
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  };

  const isCurrentSelection = !modal && selected !== "enterprise" && selected === currentPlan;

  return (
    <div className={cn("relative", modal ? "px-6 pb-6 pt-5 lg:px-8 lg:pb-8" : "p-7 lg:p-8")}>
      <header className="max-w-[820px]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-pink px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-brand">
          <Sparkles className="h-3 w-3" />
          {l(modal ? copy.onboardingEyebrow : copy.manageEyebrow)}
        </div>
        <h1 className="text-[27px] font-bold leading-[1.18] tracking-[-0.025em] text-navy lg:text-[33px]">
          {l(modal ? copy.onboardingTitle : copy.manageTitle)}
        </h1>
        <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-slate">
          {l(modal ? copy.onboardingSubtitle : copy.manageSubtitle)}
        </p>
      </header>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const active = selected === plan.id;
          const current = !modal && currentPlan === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setSelected(plan.id);
                setSaved(false);
              }}
              className={cn(
                "group relative flex min-h-[430px] flex-col rounded-[12px] border bg-surface p-4 text-left transition-all duration-200",
                active
                  ? plan.id === "enterprise"
                    ? "-translate-y-1 border-teal shadow-[0_12px_28px_rgba(92,197,190,0.14)] ring-1 ring-teal"
                    : "-translate-y-1 border-brand shadow-[0_12px_28px_rgba(248,47,114,0.12)] ring-1 ring-brand"
                  : "border-border hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elev",
                plan.id === "enterprise" && !active && "border-teal/40",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[21px] font-bold tracking-tight text-navy">{plan.name}</div>
                  <div className="mt-1 text-[10px] font-medium text-muted">{l(plan.pool)}</div>
                </div>
                <div className="relative flex-shrink-0">
                  <div
                    aria-hidden
                    className={cn(
                      "h-11 bg-cover bg-[length:200%_200%] ring-2 ring-border",
                      plan.id === "enterprise" ? "w-16 rounded-[10px]" : "w-11 rounded-full",
                    )}
                    style={{
                      backgroundImage: `url('${avatarRoster}')`,
                      backgroundPosition: plan.avatarPosition,
                      backgroundSize: "200% 200%",
                    }}
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-teal" />
                </div>
                <div className="absolute right-3 top-[62px]">
                {plan.badge && (
                  <span className="rounded-full bg-brand px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white">
                    {l(plan.badge)}
                  </span>
                )}
                </div>
              </div>

              <p className={cn(
                "mt-4 min-h-[42px] text-[13px] font-semibold leading-[19px]",
                plan.id === "enterprise" ? "text-teal-text" : "text-ink",
              )}>
                {l(plan.highlight)}
              </p>

              <div className="mt-3 border-b border-border pb-3">
                <div>
                  <span className="tabular text-[22px] font-bold tracking-tight text-navy">
                    {plan.id === "enterprise" ? l(copy.flexible) : plan.price}
                  </span>
                  {plan.priceSuffix && <span className="ml-1 text-[9.5px] text-muted">{l(plan.priceSuffix)}</span>}
                </div>
              </div>

              <ul className="mt-3 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature.en} className="flex gap-2 text-[10.5px] leading-[16px] text-slate">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-soft-teal text-teal-text">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span>{l(feature)}</span>
                  </li>
                ))}
              </ul>

              <div
                className={cn(
                  "mt-3 flex h-9 items-center justify-center gap-1.5 rounded-[8px] text-[11.5px] font-semibold",
                  active
                    ? plan.id === "enterprise"
                      ? "bg-teal text-white"
                      : "bg-brand text-white shadow-cta"
                    : "border border-border text-ink group-hover:bg-surface-warm",
                )}
              >
                {plan.id === "enterprise"
                  ? l(copy.bookDemo)
                  : current
                    ? l(copy.current)
                    : active
                      ? l(copy.selected)
                      : plan.name}
                {(active || current) && plan.id !== "enterprise" && <Check className="h-3.5 w-3.5" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-3 rounded-[12px] border border-border bg-surface-warm px-4 py-3.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-soft-amber text-amber-text">
            <Coins className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-ink">{l(copy.creditTitle)}</div>
            <p className="mt-0.5 text-[11px] leading-[17px] text-muted">{l(copy.creditDescription)}</p>
          </div>
          <button type="button" className="flex-shrink-0 text-[11.5px] font-semibold text-brand hover:underline">
            {l(copy.topUp)}
          </button>
        </div>

        <div className="flex min-w-[340px] items-center justify-between gap-5 rounded-[12px] border border-border bg-surface px-4 py-3 shadow-card">
          <div>
            <div className="text-[9.5px] font-semibold uppercase tracking-wider text-muted">
              {demoRequested ? l(copy.demoRequested) : saved ? l(copy.saved) : l(copy.selectionHint)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-ink">
              <span
                aria-hidden
                className={cn(
                  "h-6 bg-cover",
                  selectedPlan.id === "enterprise" ? "w-9 rounded-[6px]" : "w-6 rounded-full",
                )}
                style={{
                  backgroundImage: `url('${avatarRoster}')`,
                  backgroundPosition: selectedPlan.avatarPosition,
                  backgroundSize: "200% 200%",
                }}
              />
              {selectedPlan.name}
            </div>
          </div>
          <Button
            size="lg"
            variant={selected === "enterprise" ? "teal" : "primary"}
            onClick={complete}
            disabled={isCurrentSelection || demoRequested}
          >
            {selected === "enterprise"
              ? demoRequested
                ? l(copy.demoRequested)
                : l(copy.bookDemo)
              : modal
                ? l(copy.hire)
                : isCurrentSelection
                  ? l(copy.current)
                  : `${l(copy.upgrade)} ${selectedPlan.name}`}
            {!isCurrentSelection && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {modal && (
        <div className="mt-3 text-center text-[10.5px] font-medium text-muted">
          {l(copy.mandatory)}
        </div>
      )}
    </div>
  );
}
